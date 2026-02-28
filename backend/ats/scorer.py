import json
from backend.core.clients import get_llm

_llm = None

def _get_scorer_llm():
    global _llm
    if _llm is None:
        _llm = get_llm()
    return _llm


def compute_ats_score(cv_text: str, job_description: str = "") -> dict:
    """Compute full ATS score using a single, comprehensive LLM evaluation."""
    prompt = f"""You are an elite Application Tracking System (ATS) and Senior Technical Recruiter.
Evaluate this CV against the target role: "{job_description}".

You must provide a ruthless, highly factual, and dynamic score out of 100 based on 5 dimensions (20 points each).
Do NOT give generic scores. If the CV lacks numbers/metrics, penalize it heavily. If it lacks required frameworks, penalize it.

1. Keyword Match: How well do the exact technical requirements match the CV?
2. Impact & Metrics: Does the CV use numbers and percentages to prove impact? (Most junior CVs fail this).
3. Section Completeness: Education, Experience, Skills, Contact info.
4. Experience Validation: Are the skills just listed, or actually proven in bullet points?
5. Formatting & Length: Is it concise, bulleted, and professional?

Return ONLY a valid JSON object describing the score breakdown.
Required JSON format:
{{
  "total": <0-100>,
  "label": <"ATS-Ready" if >=85, "Optimizable" if >=70, "At Risk" if >=50, else "Failing">,
  "breakdown": {{
    "keyword_match": {{"score": <0-20>, "feedback": "<1-sentence strict feedback>", "missing": ["skill1"]}},
    "keyword_placement": {{"score": <0-20>, "feedback": "<1-sentence strict feedback>"}},
    "sections": {{"score": <0-20>, "feedback": "<1-sentence strict feedback>"}},
    "experience": {{"score": <0-20>, "feedback": "<1-sentence strict feedback>"}},
    "formatting": {{"score": <0-20>, "feedback": "<1-sentence strict feedback>"}}
  }},
  "keywords_extracted": ["kw1", "kw2", "kw3"]
}}

CV TEXT:
{cv_text[:3000]}
"""
    try:
        raw = _get_scorer_llm().invoke(prompt).content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        data = json.loads(raw)
        
        # Ensure total is capped
        data["total"] = min(data.get("total", 50), 100)
        return data
    except Exception as e:
        print(f"ATS LLM Fallback error: {e}")
        # Fallback to a basic structure if LLM fails format
        return {
            "total": 35,
            "label": "Failing",
            "breakdown": {
                "keyword_match": {"score": 5, "missing": ["FastAPI", "React"]},
                "keyword_placement": {"score": 5},
                "sections": {"score": 10},
                "experience": {"score": 5},
                "formatting": {"score": 10},
            },
            "keywords_extracted": ["python", "sql", "api"]
        }
