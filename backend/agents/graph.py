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
Return ONLY valid JSON (no markdown):
{{"name":"","skills":[],"field":"","experience_years":0,"education":""}}
CV: {state['cv_text']}
Extra context: {state.get('additional_context', '')}"""
    try:
        raw = _get_llm().invoke(prompt).content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        profile = json.loads(raw)
    except Exception:
        profile = {
            "name": "Student",
            "skills": [],
            "field": "General",
            "experience_years": 0,
            "education": "University",
        }
    return {"student_profile": profile}


# ── NODE 2: ATS SCORING ───────────────────────────────────────────────────────
def ats(state: AgentState) -> dict:
    target = state.get("job_preferences", {}).get("title", "")
    result = compute_ats_score(state["cv_text"], target)

    prompt = f"""This CV scored {result['total']}/100 on ATS.
Missing keywords: {result['breakdown'].get('keyword_match', {{}}).get('missing', [])[:5]}
Missing sections: {result['breakdown'].get('sections', {{}}).get('missing', [])}
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
        "cv_final": state["cv_text"],
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
    for _, row in results.head(8).iterrows():
        job = row.to_dict()
        job["match_score"] = score_match(
            expanded, str(job.get("required_skills", ""))
        )
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


def route_fn(state: AgentState) -> str:
    d = state.get("routing_decision", "redirect")
    return "email" if d in ("auto_apply", "informed") else "gap_analysis"


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
def build_graph():
    g = StateGraph(AgentState)
    g.add_node("intake", intake)
    g.add_node("ats", ats)
    g.add_node("market", market)
    g.add_node("routing", routing)
    g.add_node("email", email)
    g.add_node("gap_analysis", gap_analysis)
    g.add_node("task_plan", task_plan)

    g.set_entry_point("intake")
    g.add_edge("intake", "ats")
    g.add_edge("ats", "market")
    g.add_edge("market", "routing")
    g.add_conditional_edges(
        "routing",
        route_fn,
        {"email": "email", "gap_analysis": "gap_analysis"},
    )
    g.add_edge("email", END)
    g.add_edge("gap_analysis", "task_plan")
    g.add_edge("task_plan", END)
    return g.compile()


_pipeline = None

def get_pipeline():
    global _pipeline
    if _pipeline is None:
        _pipeline = build_graph()
    return _pipeline
