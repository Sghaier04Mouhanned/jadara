import json
import asyncio
import os
import io
import PyPDF2
from datetime import datetime
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

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


# ── IN-MEMORY APPLICATION TRACKER ─────────────────────────────────────────────
application_tracker: list[dict] = []


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


class TrackerAddRequest(BaseModel):
    job_title: str
    company: str
    status: str = "Applied"
    notes: str = ""


# ── NODE LABELS FOR SSE EVENTS ─────────────────────────────────────────────────
NODE_LABELS = {
    "intake": "📋 Reading your profile",
    "optimize_cv": "✨ Optimizing your CV for ATS",
    "ats": "🔍 Scoring your CV against ATS",
    "market": "🌍 Searching Tunisian job market",
    "routing": "⚡ Determining your strategy",
    "gap_analysis": "📊 Analyzing skill gaps",
    "task_plan": "📅 Building your action plan",
    "email": "✉️ Generating application email",
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
            "cv_optimized": "",
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
                            "gap_report",
                            "task_plan",
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
    # We explicitly PRESERVE all existing skills and just append the new one,
    # because relying on the LLM to cleanly extract all old skills might drop some
    # and cause the match score to downgrade.
    updated_skills = list(req.student_skills)
    if req.skill_added and req.skill_added not in updated_skills:
        updated_skills.append(req.skill_added)

    expanded = expand_skills(updated_skills)

    new_scores = []
    apply_ready_jobs = []
    for job in req.job_matches:
        old_score = job.get("match_score", 0)
        new_score = score_match(expanded, str(job.get("required_skills", "")))
        
        # Guard against any weird score drops (score should only go up or stay same)
        if new_score < old_score:
            new_score = old_score

        entry = {
            "job_id": job.get("job_id", ""),
            "company": job.get("company", ""),
            "title": job.get("title", ""),
            "old_score": old_score,
            "new_score": new_score,
            "delta": round(new_score - old_score, 1),
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

    # Always log the tracker entry, regardless of n8n success
    tracker_entry = {
        "id": len(application_tracker) + 1,
        "job_title": req.job.get("title", "Unknown"),
        "company": req.job.get("company", "Unknown"),
        "status": "Applied",
        "date_applied": datetime.now().isoformat(),
        "follow_up_date": "",
        "notes": f"Email sent to {req.student_email}",
    }

    try:
        result = await trigger_application_email(
            cv_text=req.cv_text,
            job=req.job,
            student_name=req.student_name,
            student_email=req.student_email,
        )
        print(f"[backend] n8n trigger result: {result}")
        if result.get("success"):
            tracker_entry["notes"] = f"Email sent successfully to {req.student_email}"
        else:
            tracker_entry["status"] = "Applied (email failed)"
            tracker_entry["notes"] = f"n8n error: {result.get('error', 'unknown')}"
    except Exception as e:
        print(f"[backend] Error in send_email: {e}")
        result = {"success": False, "error": str(e)}
        tracker_entry["status"] = "Applied (email failed)"
        tracker_entry["notes"] = f"Send error: {str(e)}"

    # Log regardless of n8n outcome
    application_tracker.append(tracker_entry)
    print(f"[backend] Tracker entry logged: {tracker_entry['job_title']} at {tracker_entry['company']}")

    return {**result, "tracker_entry": tracker_entry}


# ── TRACKER ENDPOINTS ──────────────────────────────────────────────────────────
@app.get("/api/tracker")
def get_tracker():
    return {"entries": application_tracker}


@app.post("/api/tracker/add")
def add_tracker_entry(req: TrackerAddRequest):
    entry = {
        "id": len(application_tracker) + 1,
        "job_title": req.job_title,
        "company": req.company,
        "status": req.status,
        "date_applied": datetime.now().isoformat(),
        "follow_up_date": "",
        "notes": req.notes,
    }
    application_tracker.append(entry)
    return {"entry": entry}


@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Extract text from an uploaded PDF file."""
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "File must be a PDF"}
    
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        
        extracted_text = []
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                extracted_text.append(text)
                
        full_text = "\n".join(extracted_text)
        return {"text": full_text.strip()}
    except Exception as e:
        return {"error": f"Failed to parse PDF: {str(e)}"}


@app.patch("/api/tracker/{entry_id}")
def update_tracker_entry(entry_id: int, status: str = "", notes: str = "", follow_up_date: str = ""):
    for entry in application_tracker:
        if entry["id"] == entry_id:
            if status:
                entry["status"] = status
            if notes:
                entry["notes"] = notes
            if follow_up_date:
                entry["follow_up_date"] = follow_up_date
            return {"entry": entry}
    return {"error": "Entry not found"}


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Jadara API"}
