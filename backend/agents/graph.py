import json
from langgraph.graph import StateGraph, END
from backend.agents.state import AgentState
from backend.core.clients import get_llm
from backend.ats.scorer import compute_ats_score
from backend.search.engine import search_jobs, expand_skills, score_match

_llm = None

def _get_llm():
    global _llm
    if _llm is None:
        _llm = get_llm()
    return _llm


# ── NODE 1: INTAKE ─────────────────────────────────────────────────────────────
def intake(state: AgentState) -> dict:
    prompt = f"""Extract a student profile from this CV.
Return ONLY valid JSON with keys:
- name (string)
- skills (list of strings)
- field (string)
- experience_summary (string, 1-sentence)
- education (string)

CV: {state['cv_text']}
Additional context: {state.get('additional_context', '')}"""

    try:
        response = _get_llm().invoke(prompt)
        raw = response.content.strip().replace("```json", "").replace("```", "").strip()
        profile = json.loads(raw)
    except:
        profile = {"name": "Candidate", "skills": [], "field": "General", "experience_summary": "", "education": ""}
    return {"student_profile": profile}


# ── NODE 1B: OPTIMIZE CV ──────────────────────────────────────────────────────
def optimize_cv(state: AgentState) -> dict:
    profile = state.get("student_profile", {})
    prompt = f"""You are a professional Resume Writer and ATS Expert.
Rewrite the following raw CV into a high-impact, professional, and ATS-optimized version.

CV RAW TEXT:
{state['cv_text']}

PARSED PROFILE:
{json.dumps(profile)}

INSTRUCTIONS:
1. Use strong action verbs (e.g., 'Engineered', 'Orchestrated', 'Developed').
2. Quantify achievements where possible.
3. Organize into: Professional Summary, Core Skills, Experience, Education.
4. Ensure it is clean for parsing.
5. NO markdown formatting like bold/italics. Just plain text with clear headings.

Return ONLY the optimized CV text."""

    response = _get_llm().invoke(prompt)
    return {"cv_optimized": response.content.strip()}


# ── NODE 2: ATS SCORING ───────────────────────────────────────────────────────
def ats(state: AgentState) -> dict:
    target = state.get("job_preferences", {}).get("title", "")
    # Base scoring on optimized version if available
    cv_to_score = state.get("cv_optimized") or state["cv_text"]
    result = compute_ats_score(cv_to_score, target)

    prompt = f"""This CV scored {result['total']}/100 on ATS.
Missing keywords: {result['breakdown'].get('keyword_match', {}).get('missing', [])[:5]}
Missing sections: {result['breakdown'].get('sections', {}).get('missing', [])}
Return ONLY a JSON array of exactly 3 correction strings, each under 12 words.
No markdown."""
    try:
        raw = _get_llm().invoke(prompt).content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        corrections = json.loads(raw)
    except Exception:
        corrections = [
            "Add a professional summary section at the top",
            "Include specific technical keywords from target job postings",
            "Quantify project results with measurable outcomes",
        ]
    return {
        "ats_result": result,
        "ats_corrections": corrections,
        "cv_final": cv_to_score, # Use the scored CV as final
    }


# ── NODE 3: MARKET QUERY ──────────────────────────────────────────────────────
def market(state: AgentState) -> dict:
    profile = state.get("student_profile", {})
    raw_skills = profile.get("skills", [])
    skills = [s if isinstance(s, str) else str(s.get("name", s)) for s in raw_skills if s]
    target = state.get("job_preferences", {}).get("title", "")
    city = state.get("job_preferences", {}).get("city", "Any")

    query = f"{' '.join(skills[:8])} {target}"
    results = search_jobs(query, k=15)

    if city and city != "Any":
        city_filter = results[results["city"].str.lower() == city.lower()]
        if len(city_filter) >= 3:
            results = city_filter

    expanded = expand_skills(skills)
    scored = []
    reasoning_map = {}
    
    top_candidates = results.head(5).to_dict("records")
    
    # ── Nuanced Reasoning Loop ──
    # Ask LLM to evaluate alignment with explicit title-similarity and semantic matching
    job_list_json = json.dumps([
        {'id': i, 'title': j['title'], 'required': j['required_skills'], 'sector': j.get('sector', '')}
        for i, j in enumerate(top_candidates)
    ])
    response_format_hint = '{"0": {"resonance_score": N, "alignment_reason": "..."}, ...}'
    reasoning_prompt = f"""You are a precise career alignment evaluator. Evaluate the TRUE alignment between this student and each job.

STUDENT PROFILE:
- Skills: {skills}
- Field/Domain: {profile.get('field', 'General')}
- Experience: {profile.get('experience_summary', 'N/A')}
- Target Role: {target}

JOB LIST:
{job_list_json}

CRITICAL SCORING RULES:
- If the student's field/skills are semantically IDENTICAL to the job title (e.g., 'GIS Analysis' background applying to 'GIS Analyst', or 'Data Science' student applying to 'Data Scientist'), the score MUST be 85-100.
- If skills overlap significantly (>70% of required skills matched), score 70-90.
- If there is partial overlap with transferable skills, score 40-69.
- If there is minimal relevance, score below 40.
- Do NOT give a low score just because the exact keyword doesn't match. Use SEMANTIC understanding.
- Consider: Does the student's domain experience directly prepare them for this role?

For each job ID, return:
1. resonance_score: (0-100) based on true technical AND domain alignment.
2. alignment_reason: (1 concise sentence explaining the match quality)

Return ONLY a valid JSON object in this format: {response_format_hint}"""

    try:
        reasoning_resp = _get_llm().invoke(reasoning_prompt)
        reasoning_data = json.loads(reasoning_resp.content.strip().replace("```json", "").replace("```", "").strip())
    except:
        reasoning_data = {}

    for i, row in enumerate(top_candidates):
        job = row
        jid = str(i)
        
        # Use LLM score if available, otherwise fallback to keyword math
        llm_info = reasoning_data.get(jid) or {}
        llm_score = llm_info.get("resonance_score")
        
        job["match_score"] = float(llm_score) if llm_score is not None else score_match(
            expanded, str(job.get("required_skills", ""))
        )
        job["alignment_reasoning"] = llm_info.get("alignment_reason", "Keyword match based on profile skills.")
        
        scored.append(job)

    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return {"job_matches": scored}


# ── NODE 4: ROUTING ────────────────────────────────────────────────────────────
def routing(state: AgentState) -> dict:
    jobs = state.get("job_matches", [])
    if not jobs:
        return {"routing_decision": "redirect"}
    best = jobs[0]["match_score"]
    tier = state.get("tier", "free")
    if best >= 85:
        decision = "auto_apply"
    elif best >= 50:
        decision = "informed"
    elif tier == "premium":
        decision = "gap"
    else:
        decision = "redirect"
    return {"routing_decision": decision}


def post_task_plan_route(state: AgentState) -> str:
    """After task_plan, go to email if auto_apply/informed, else END."""
    d = state.get("routing_decision", "redirect")
    return "email" if d in ("auto_apply", "informed") else "__end__"


# ── NODE 5A: EMAIL GENERATION ─────────────────────────────────────────────────
def email(state: AgentState) -> dict:
    job = state["job_matches"][0] if state.get("job_matches") else {}
    profile = state.get("student_profile", {})
    prompt = f"""Écris un email de candidature professionnel en français.
Candidat: {profile.get('name', 'Candidat')}, étudiant en {profile.get('field', '')}
Poste: {job.get('title', '')} chez {job.get('company', '')} à {job.get('city', '')}
Compétences clés: {', '.join(profile.get('skills', [])[:5])}

Format: Objet sur la première ligne, puis 3 paragraphes courts (max 150 mots total).
Ton: Professionnel, direct, confiant."""
    response = _get_llm().invoke(prompt)
    return {"application_email": response.content}


# ── NODE 5B: GAP ANALYSIS ────────────────────────────────────────────────────
def gap_analysis(state: AgentState) -> dict:
    profile = state.get("student_profile", {})
    raw_skills = profile.get("skills", [])
    skills = [s if isinstance(s, str) else str(s.get("name", s)) for s in raw_skills if s]
    expanded = expand_skills(skills)

    # Count missing skills across all jobs
    freq = {}
    for job in state.get("job_matches", []):
        for s in str(job.get("required_skills", "")).split(";"):
            s = s.strip().lower()
            if s and s not in expanded:
                freq[s] = freq.get(s, 0) + 1

    top_missing = sorted(freq, key=freq.get, reverse=True)[:6]
    target = state.get("job_preferences", {}).get("title", "the target role")
    companies = [j["company"] for j in state.get("job_matches", [])[:3]]

    prompt = f"""You are a Tunisian career advisor. Prioritize these skill gaps
for a student targeting "{target}" at companies like {companies}.

Skills to analyze: {top_missing}
Student has: {list(expanded)[:10]}

Return ONLY a valid JSON array (no markdown). Each object:
{{
  "skill": "",
  "blocking_level": "Critical|Important|Optional",
  "fastest_path": "",
  "time_weeks": 0,
  "cost": "Free|Paid",
  "unlocks": "",
  "market_reality": ""
}}"""

    try:
        raw = _get_llm().invoke(prompt).content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        gaps = json.loads(raw)
    except Exception:
        gaps = [
            {
                "skill": s,
                "blocking_level": "Important",
                "fastest_path": "Online course on YouTube/Coursera",
                "time_weeks": 2,
                "cost": "Free",
                "unlocks": "Multiple junior roles",
                "market_reality": "High demand in Tunisia",
            }
            for s in top_missing[:3]
        ]

    return {"gap_report": {"prioritized_gaps": gaps, "missing_skills": top_missing}}


# ── NODE 5C: TASK PLAN ────────────────────────────────────────────────────────
def task_plan(state: AgentState) -> dict:
    gaps = state.get("gap_report", {}).get("prioritized_gaps", [])[:4]
    deadline = state.get("job_preferences", {}).get("deadline_days", 21)
    xp_map = {"Critical": 150, "Important": 100, "Optional": 50}
    tasks = []

    for i, g in enumerate(gaps):
        tasks.append(
            {
                "id": i + 1,
                "title": f"Learn: {g['skill'].title()}",
                "description": g["fastest_path"],
                "day": round((i + 1) * deadline / (len(gaps) + 1)),
                "xp": xp_map.get(g["blocking_level"], 75),
                "blocking_level": g["blocking_level"],
                "cost": g.get("cost", "Free"),
                "completed": False,
                "skill_added": g["skill"],
            }
        )

    tasks.append(
        {
            "id": len(tasks) + 1,
            "title": "Apply to top matching companies",
            "description": f"Target: {[j['company'] for j in state.get('job_matches', [])[:2]]}",
            "day": deadline,
            "xp": 200,
            "blocking_level": "Critical",
            "cost": "Free",
            "completed": False,
            "skill_added": None,
        }
    )

    return {"task_plan": tasks, "xp_total": 0, "completed_tasks": []}


# ── BUILD GRAPH ───────────────────────────────────────────────────────────────
_pipeline = None

def get_pipeline():
    global _pipeline
    if _pipeline is not None:
        return _pipeline

    workflow = StateGraph(AgentState)

    workflow.add_node("intake", intake)
    workflow.add_node("optimize_cv", optimize_cv)
    workflow.add_node("ats", ats)
    workflow.add_node("market", market)
    workflow.add_node("routing", routing)
    workflow.add_node("email", email)
    workflow.add_node("gap_analysis", gap_analysis)
    workflow.add_node("task_plan", task_plan)

    # Linear flow: intake → optimize_cv → ats → market → routing
    workflow.set_entry_point("intake")
    workflow.add_edge("intake", "optimize_cv")
    workflow.add_edge("optimize_cv", "ats")
    workflow.add_edge("ats", "market")
    workflow.add_edge("market", "routing")

    # ALWAYS run gap_analysis + task_plan regardless of routing decision
    workflow.add_edge("routing", "gap_analysis")
    workflow.add_edge("gap_analysis", "task_plan")

    # After task_plan: generate email if auto_apply/informed, else END
    workflow.add_conditional_edges(
        "task_plan",
        post_task_plan_route,
        {"email": "email", "__end__": END},
    )
    workflow.add_edge("email", END)

    _pipeline = workflow.compile()
    return _pipeline
