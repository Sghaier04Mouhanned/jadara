import json
import asyncio
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from backend.agents.graph import get_pipeline
from backend.search.engine import expand_skills, score_match
from backend.email_.n8n import trigger_application_email
from backend.gamification.xp import get_level
from backend.core.clients import get_llm

app = FastAPI(title="Jadara API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── REQUEST MODELS ─────────────────────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    cv_text: str
    job_preferences: dict
    tier: str = "free"
    additional_context: str = ""
    student_email: str = ""


class TaskCompleteRequest(BaseModel):
    task_id: int
    skill_added: Optional[str] = None
    xp_value: int
    current_cv: str
    job_matches: list
    student_skills: list


class EmailSendRequest(BaseModel):
    cv_text: str
    job: dict
    student_name: str
    student_email: str


# ── NODE LABELS FOR SSE EVENTS ─────────────────────────────────────────────────
NODE_LABELS = {
    "intake": "📋 Reading your profile",
    "optimize_cv": "✨ Optimizing your CV for ATS",
    "ats": "🔍 Scoring your CV against ATS",
    "market": "🌍 Searching Tunisian job market",
    "routing": "⚡ Determining your strategy",
    "email": "✉️ Generating application email",
    "gap_analysis": "📊 Analyzing skill gaps",
    "task_plan": "📅 Building your action plan",
}


# ── ENDPOINTS ──────────────────────────────────────────────────────────────────
@app.post("/api/analyze")
async def analyze(req: AnalyzeRequest):
    async def generate():
        input_state = {
            "cv_text": req.cv_text,
            "job_preferences": req.job_preferences,
            "tier": req.tier,
            "additional_context": req.additional_context,
            "student_profile": {},
            "ats_result": {},
            "ats_corrections": [],
            "cv_final": req.cv_text,
            "job_matches": [],
            "routing_decision": "",
            "gap_report": {},
            "task_plan": [],
            "completed_tasks": [],
            "xp_total": 0,
            "application_email": "",
            "loop_count": 0,
        }

        total_nodes = len(NODE_LABELS)
        completed = 0
        final_state = input_state.copy()

        try:
            for chunk in get_pipeline().stream(input_state):
                node = list(chunk.keys())[0]
                completed += 1
                final_state.update(chunk[node])

                # Emit node_complete event
                event = {
                    "type": "node_complete",
                    "node": node,
                    "label": NODE_LABELS.get(node, node),
                    "progress": round(completed / total_nodes * 100),
                    "data": {
                        k: v
                        for k, v in chunk[node].items()
                        if k
                        in (
                            "ats_result",
                            "job_matches",
                            "routing_decision",
                            "ats_corrections",
                            "cv_optimized",
                        )
                    },
                }
                yield f"data: {json.dumps(event, default=str)}\n\n"
                await asyncio.sleep(0.05)

            # Serialize final state safely
            def safe(obj):
                if hasattr(obj, "isoformat"):
                    return obj.isoformat()
                if hasattr(obj, "__dict__"):
                    return str(obj)
                return str(obj)

            yield f"data: {json.dumps({'type': 'complete', 'result': final_state}, default=safe)}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.post("/api/task/complete")
async def complete_task(req: TaskCompleteRequest):
    llm = get_llm()

    # Professionally integrate new skill into Optimized CV
    updated_cv_optimized = req.current_cv
    if req.skill_added:
        integration_prompt = f"""You are a professional Resume Editor. 
Integrate the following NEW SKILL/ACHIEVEMENT into the existing CV text in a natural, high-impact way.
Do NOT just add it at the bottom. Find the right section (Experience or Skills) and rewrite that part.

NEW SKILL: {req.skill_added}

CURRENT CV:
{req.current_cv}

Return ONLY the full updated CV text. No markdown formatting."""
        try:
            integration_resp = get_llm().invoke(integration_prompt)
            updated_cv_optimized = integration_resp.content.strip()
        except:
            # Fallback if LLM fails
            updated_cv_optimized = req.current_cv + f"\n[Skill added: {req.skill_added}]"

    # Extract updated skills
    try:
        prompt = f"""List ALL skills from this CV as a JSON array of strings.
Return ONLY the JSON array, no markdown.
CV: {updated_cv_optimized[:2000]}"""
        raw = llm.invoke(prompt).content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        updated_skills = json.loads(raw)
    except Exception:
        updated_skills = req.student_skills + (
            [req.skill_added] if req.skill_added else []
        )

    expanded = expand_skills(updated_skills)

    new_scores = []
    apply_ready_jobs = []
    for job in req.job_matches:
        new_score = score_match(expanded, str(job.get("required_skills", "")))
        entry = {
            "job_id": job.get("job_id", ""),
            "company": job.get("company", ""),
            "title": job.get("title", ""),
            "old_score": job.get("match_score", 0),
            "new_score": new_score,
            "delta": round(new_score - job.get("match_score", 0), 1),
        }
        new_scores.append(entry)
        if new_score >= 85:
            apply_ready_jobs.append({**job, "match_score": new_score})

    level_info = get_level(req.xp_value)

    return {
        "updated_cv": updated_cv_optimized,
        "updated_skills": updated_skills,
        "new_scores": new_scores,
        "apply_ready": len(apply_ready_jobs) > 0,
        "apply_ready_jobs": apply_ready_jobs,
        "xp_earned": req.xp_value,
        "level_info": level_info,
    }


class EmailGenerateRequest(BaseModel):
    cv_text: str
    job: dict
    student_name: str


@app.post("/api/email/generate")
async def generate_email_endpoint(req: EmailGenerateRequest):
    """Generate an application email without sending it."""
    llm = get_llm()
    prompt = f"""Écris un email de candidature professionnel en français.
Candidat: {req.student_name}
Poste: {req.job.get('title', '')} chez {req.job.get('company', '')} à {req.job.get('city', '')}
Compétences requises: {req.job.get('required_skills', '')}

Format: Objet sur la première ligne, puis 3 paragraphes courts (max 150 mots total).
Ton: Professionnel, direct, confiant.

CV du candidat:
{req.cv_text[:2000]}"""
    try:
        response = llm.invoke(prompt)
        return {"application_email": response.content}
    except Exception as e:
        return {"application_email": f"Error generating email: {str(e)}"}


@app.post("/api/email/send")
async def send_email(req: EmailSendRequest):
    print(f"[backend] Received /api/email/send for {req.student_email}")
    try:
        result = await trigger_application_email(
            cv_text=req.cv_text,
            job=req.job,
            student_name=req.student_name,
            student_email=req.student_email,
        )
        print(f"[backend] n8n trigger result: {result}")
        return result
    except Exception as e:
        print(f"[backend] Error in send_email: {e}")
        return {"success": False, "error": str(e)}


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Jadara API"}
