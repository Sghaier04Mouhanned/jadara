# Ekbes — Complete Tech Stack & End-to-End Build Guide
### For LLM-assisted development | Every step executable

---

## PART 1 — TOOL CLASSIFICATION

### 🔨 USE FOR CODE (Your Product)

| Tool | Role | How |
|------|------|-----|
| **v0.app** | Generate polished React/Tailwind components from text | Describe each screen → copy generated code → paste into your project |
| **ReactBits.dev** | Pre-built animated React components | Browse → copy the animated card, progress bar, badge components you need |
| **Anime.js** | JavaScript animation library | Score gauge animation, compatibility % counter, XP bar fill effect |
| **Streamlit** | Python UI framework (if staying Python) | Primary dashboard framework — fastest path to demo |

### 🎨 USE FOR PRESENTATION (Your Pitch)

| Tool | Role | How |
|------|------|-----|
| **HeyGen** | Generate an AI avatar video presenting Ekbes | Record a 30-second "product intro" narrated by a professional avatar — play at pitch start |
| **Google Flow** (labs.google/fx/fr/tools/flow) | AI video generation from script | Create a cinematic product walkthrough video as backup demo |
| **EzGIF** | Convert screen recording to GIF | Record your demo → convert to GIF → embed in slides so it runs without clicking |
| **Freepik** | Stock illustrations and icons | Download Tunisian/student illustrations for slides — avoid generic shutterstock look |
| **Mobbin** | UI inspiration reference | Browse mobile app screens for design direction before building |
| **Google Labs** (labs.google/fx/fr) | Experimental AI tools | NotebookLM for pitch script generation, Whisk for visual assets |

### ❌ NOT RELEVANT FOR THIS PROJECT

| Tool | Why Skip |
|------|----------|
| **ChatlyAI** | Chatbot builder for non-developers. You're building a real agent with LangGraph — this is redundant and weaker. |

---

## PART 2 — COMPLETE TECH STACK

### Decision: Streamlit vs React

```
STREAMLIT                          REACT + FastAPI
─────────────────────────────      ─────────────────────────────
✅ Already working on your machine  ✅ Unlimited design freedom
✅ 0 setup time                     ✅ Anime.js + ReactBits work natively
✅ LangGraph streaming built-in     ✅ Looks like a real product
✅ Maps, dataframes, tabs native    ❌ 3-4 hours frontend setup
❌ CSS ceiling — looks dev-tool-ish ❌ FastAPI backend wiring needed
❌ Animations very limited          ❌ Streaming needs websockets

VERDICT: Use Streamlit for the agent logic.
Use v0.app to generate a SINGLE polished HTML landing/results page
that embeds in Streamlit via st.components.v1.html().
Best of both worlds. 2 hours extra work. Worth it.
```

### Full Stack Table

```
LAYER               TOOL                    PURPOSE
─────────────────────────────────────────────────────────────────
Agent Framework     LangGraph 0.2+          Pipeline orchestration
LLM                 Groq llama-3.3-70b      CV parsing, ATS keywords,
                                            gap analysis, email gen
Embeddings          sentence-transformers   Semantic job matching
                    all-MiniLM-L6-v2
Vector Search       FAISS cpu               Job compatibility scoring
Job Database        tunisia_jobs.csv        RAG knowledge base
ATS Engine          Custom Python           5-component scorer
UI Framework        Streamlit               Primary interface
Custom UI           v0.app → HTML/CSS/JS    Results cards, score gauge
Animations          Anime.js (via CDN)      Score counter, XP bar
Components          ReactBits (copy paste)  Animated badges, cards
Maps                Folium + streamlit-     Opportunity map
                    folium                  (secondary feature)
Environment         python-dotenv           API key management
Email Gen           Groq LLM                Application email in French
Gamification        Custom Python           XP + level calculation
```

### Requirements.txt (Final)

```
# Core agent
langgraph>=0.2.0
langchain>=0.2.0
langchain-groq
langchain-community
python-dotenv

# RAG
sentence-transformers
faiss-cpu
numpy
pandas

# UI
streamlit>=1.35.0
streamlit-folium
folium

# Utils
rich
```

---

## PART 3 — PROJECT STRUCTURE

```
Ekbes/
│
├── .env                          # GROQ_API_KEY=your_key_here
├── dashboard.py                  # Entry point → streamlit run dashboard.py
├── requirements.txt
│
├── data/
│   └── tunisia_jobs.csv          # 80-row job database
│
├── src/
│   │
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── graph.py              # LangGraph full pipeline
│   │   └── state.py              # AgentState TypedDict
│   │
│   ├── ats/
│   │   ├── __init__.py
│   │   └── scorer.py             # 5-component ATS scoring engine
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   └── clients.py            # Groq client initialization
│   │
│   ├── search/
│   │   ├── __init__.py
│   │   ├── engine.py             # FAISS search
│   │   └── mapping.py            # Folium map
│   │
│   ├── email/
│   │   ├── __init__.py
│   │   └── generator.py          # Application email generation
│   │
│   └── gamification/
│       ├── __init__.py
│       └── xp.py                 # XP + level system
│
├── ui/
│   ├── components.py             # Reusable Streamlit HTML components
│   ├── styles.css                # Custom CSS loaded by dashboard
│   └── score_gauge.html          # Anime.js ATS gauge (embedded)
│
└── scripts/
    └── verify_env.py             # Pre-run health check
```

---

## PART 4 — END-TO-END BUILD STEPS

*Every step is a discrete, completable unit. Check each off as done.*

---

### PHASE 0 — SETUP (30 minutes)

**Step 0.1 — Verify environment**
```bash
cd Ekbes
pip install -r requirements.txt
python scripts/verify_env.py
```
Expected output: all green checkmarks. Fix anything red before proceeding.

**Step 0.2 — Verify Groq works**
```python
# test_groq.py
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
load_dotenv()
llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"))
print(llm.invoke("Say: Ekbes is ready").content)
```
Must print a response. If not, check your .env file.

**Step 0.3 — Verify FAISS works**
```python
# test_faiss.py
import pandas as pd
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
df = pd.read_csv("data/tunisia_jobs.csv")
model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(df["required_skills"].tolist()).astype("float32")
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(embeddings)
qv = model.encode(["Python machine learning"]).astype("float32")
_, idx = index.search(qv, k=3)
print(df.iloc[idx[0]][["title", "company"]])
```
Must print 3 job rows. If not, check tunisia_jobs.csv path.

---

### PHASE 1 — ATS SCORING ENGINE (1.5 hours)

**Step 1.1 — Build scorer.py**

Create `src/ats/scorer.py` with this exact implementation:

```python
import os, json, re
from langchain_groq import ChatGroq
from dotenv import load_dotenv
load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile",
               api_key=os.getenv("GROQ_API_KEY"), temperature=0)

STANDARD_SECTIONS = ["summary", "objective", "experience", "education",
                     "skills", "projects", "contact"]

def extract_keywords_from_jd(job_description: str) -> list:
    prompt = f"""Extract the 20 most important technical and soft skills 
from this job description. Return ONLY a JSON array of strings.
Job Description: {job_description}"""
    response = llm.invoke(prompt)
    try:
        raw = response.content.strip().strip("```json").strip("```").strip()
        return json.loads(raw)
    except:
        return []

def score_keyword_match(cv_text: str, keywords: list) -> dict:
    cv_lower = cv_text.lower()
    matched = [k for k in keywords if k.lower() in cv_lower]
    rate = len(matched) / len(keywords) if keywords else 0
    return {
        "score": round(rate * 40),
        "matched": matched,
        "missing": [k for k in keywords if k not in matched],
        "rate": round(rate * 100, 1)
    }

def score_keyword_placement(cv_text: str, keywords: list) -> dict:
    lines = cv_text.split('\n')
    first_third = '\n'.join(lines[:max(1, len(lines)//3)]).lower()
    score = 0
    for kw in keywords[:5]:  # check top 5 keywords placement
        if kw.lower() in first_third:
            score += 4  # max 20 pts for 5 keywords
    return {"score": min(score, 20)}

def score_section_completeness(cv_text: str) -> dict:
    cv_lower = cv_text.lower()
    found = []
    missing = []
    required = ["experience", "education", "skills", "contact"]
    optional = ["summary", "objective", "projects"]
    for s in required:
        if s in cv_lower:
            found.append(s)
        else:
            missing.append(s)
    for s in optional:
        if s in cv_lower:
            found.append(s)
    score = (len([s for s in required if s in found]) / len(required)) * 20
    return {"score": round(score), "found": found, "missing": missing}

def score_experience_validation(cv_text: str) -> dict:
    prompt = f"""In this CV, identify skills listed in a skills section.
Then check if each skill is also mentioned with context in experience or projects.
Return JSON: {{"validated": ["skill1"], "unvalidated": ["skill2"], "score": 0-10}}
CV: {cv_text[:2000]}"""
    response = llm.invoke(prompt)
    try:
        raw = response.content.strip().strip("```json").strip("```").strip()
        return json.loads(raw)
    except:
        return {"validated": [], "unvalidated": [], "score": 5}

def score_formatting(cv_text: str) -> dict:
    checks = {
        "has_bullet_points": bool(re.search(r'[•\-\*]', cv_text)),
        "no_excessive_caps": cv_text.upper() != cv_text,
        "has_dates": bool(re.search(r'\b(20\d{2}|19\d{2})\b', cv_text)),
        "reasonable_length": 200 < len(cv_text.split()) < 1000,
        "no_table_artifacts": '|' not in cv_text
    }
    score = sum(2 for v in checks.values() if v)
    return {"score": score, "checks": checks}

def compute_full_ats_score(cv_text: str, job_description: str = "") -> dict:
    keywords = extract_keywords_from_jd(job_description) if job_description else []
    
    kw_match    = score_keyword_match(cv_text, keywords)
    kw_place    = score_keyword_placement(cv_text, keywords)
    sections    = score_section_completeness(cv_text)
    experience  = score_experience_validation(cv_text)
    formatting  = score_formatting(cv_text)
    
    total = (kw_match["score"] + kw_place["score"] + 
             sections["score"] + experience["score"] + formatting["score"])
    
    if total >= 85:   label = "ATS-Ready"
    elif total >= 70: label = "Optimizable"
    elif total >= 50: label = "At Risk"
    else:             label = "Failing"
    
    return {
        "total": min(total, 100),
        "label": label,
        "breakdown": {
            "keyword_match":    kw_match,
            "keyword_placement": kw_place,
            "sections":         sections,
            "experience":       experience,
            "formatting":       formatting
        },
        "keywords_extracted": keywords
    }
```

**Step 1.2 — Test the scorer**
```python
# test_ats.py
from src.ats.scorer import compute_full_ats_score
cv = """
John Doe | john@email.com
EDUCATION: BSc Computer Science, ESPRIT 2024
SKILLS: Python, SQL, Git
EXPERIENCE: Intern at Startup (2023) - Built dashboards
"""
jd = "Looking for Python developer with SQL, Docker, REST APIs experience"
result = compute_full_ats_score(cv, jd)
print(f"ATS Score: {result['total']}/100 — {result['label']}")
print(f"Missing keywords: {result['breakdown']['keyword_match']['missing']}")
```

---

### PHASE 2 — LANGGRAPH PIPELINE (2 hours)

**Step 2.1 — Create state.py**

```python
# src/agents/state.py
from typing import TypedDict

class AgentState(TypedDict):
    cv_text: str
    job_preferences: dict
    tier: str                    # "free" | "premium"
    additional_context: str
    ats_result: dict
    ats_corrections: list
    cv_final: str
    job_matches: list
    routing_decision: str        # "auto_apply"|"informed"|"gap"|"redirect"
    gap_report: dict
    task_plan: list
    completed_tasks: list
    xp_total: int
    application_email: str
    loop_count: int
```

**Step 2.2 — Build graph.py node by node**

```python
# src/agents/graph.py
import warnings, json, os
warnings.filterwarnings("ignore")

from langgraph.graph import StateGraph, END
from src.agents.state import AgentState
from src.core.clients import get_groq_client
from src.ats.scorer import compute_full_ats_score
from src.search.engine import get_search_results

llm = get_groq_client()

# ── NODE 1: INTAKE ─────────────────────────────────────────────────
def intake_node(state: AgentState) -> AgentState:
    print("--- Node 1: Intake ---")
    prompt = f"""Extract a student profile from this CV.
Return ONLY valid JSON with keys:
- name (string)
- skills (list of strings)  
- field (string)
- experience_years (number)
- education (string)

CV: {state['cv_text']}
Additional context: {state.get('additional_context', '')}"""
    
    response = llm.invoke(prompt)
    try:
        raw = response.content.strip().strip("```json").strip("```").strip()
        profile = json.loads(raw)
    except:
        profile = {"name": "Student", "skills": [], 
                   "field": "General", "experience_years": 0, 
                   "education": "University"}
    return {"student_profile": profile}

# ── NODE 2: ATS SCORING ────────────────────────────────────────────
def ats_node(state: AgentState) -> AgentState:
    print("--- Node 2: ATS Scoring ---")
    target_role = state.get("job_preferences", {}).get("title", "")
    ats_result = compute_full_ats_score(
        state["cv_text"],
        job_description=target_role
    )
    
    # Generate corrections via LLM
    prompt = f"""This CV scored {ats_result['total']}/100 on ATS.
Missing keywords: {ats_result['breakdown']['keyword_match']['missing'][:5]}
Missing sections: {ats_result['breakdown']['sections']['missing']}

Generate 3 specific, actionable corrections.
Return ONLY a JSON array of strings.
Each correction must be under 15 words."""
    
    response = llm.invoke(prompt)
    try:
        raw = response.content.strip().strip("```json").strip("```").strip()
        corrections = json.loads(raw)
    except:
        corrections = ["Add a professional summary section",
                       "Include specific technical keywords from job postings",
                       "Quantify your project results with numbers"]
    
    return {"ats_result": ats_result, "ats_corrections": corrections,
            "cv_final": state["cv_text"]}

# ── NODE 3: MARKET QUERY ───────────────────────────────────────────
def market_query_node(state: AgentState) -> AgentState:
    print("--- Node 3: Market Query ---")
    skills = state.get("student_profile", {}).get("skills", [])
    target = state.get("job_preferences", {}).get("title", "")
    query = f"{' '.join(skills)} {target}"
    
    try:
        results = get_search_results(query, k=15)
        city = state.get("job_preferences", {}).get("city", "Any")
        if city and city != "Any":
            city_results = results[results["city"].str.lower() == city.lower()]
            if len(city_results) >= 3:
                results = city_results
        
        # Score compatibility
        student_skills = set(s.lower() for s in skills)
        scored_jobs = []
        for _, row in results.head(8).iterrows():
            job = row.to_dict()
            required = set(s.strip().lower() 
                          for s in str(job.get("required_skills","")).split(";"))
            score = len(student_skills & required) / len(required) * 100 if required else 0
            scored_jobs.append({**job, "match_score": round(score, 1)})
        
        scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)
    except Exception as e:
        print(f"Market query error: {e}")
        scored_jobs = []
    
    return {"job_matches": scored_jobs}

# ── NODE 4: ROUTING ────────────────────────────────────────────────
def routing_node(state: AgentState) -> AgentState:
    print("--- Node 4: Routing ---")
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

# ── NODE 5A: EMAIL GENERATION ──────────────────────────────────────
def email_node(state: AgentState) -> AgentState:
    print("--- Node 5a: Email Generation ---")
    top_job = state["job_matches"][0]
    profile = state.get("student_profile", {})
    
    prompt = f"""Write a professional job application email in French.
Candidate: {profile.get('name', 'Student')} — {profile.get('field')}
Target role: {top_job['title']} at {top_job['company']} in {top_job['city']}
Their strongest matching skills: {', '.join(profile.get('skills', [])[:5])}

Requirements:
- Professional French, formal but warm
- 3 short paragraphs maximum
- Mention the specific role and company
- End with availability for interview
- Subject line on first line as "Objet: ..."
- Max 150 words total"""
    
    response = llm.invoke(prompt)
    return {"application_email": response.content}

# ── NODE 5B: GAP ANALYSIS ──────────────────────────────────────────
def gap_analysis_node(state: AgentState) -> AgentState:
    print("--- Node 5b: Gap Analysis ---")
    student_skills = set(s.lower() for s in 
                        state.get("student_profile", {}).get("skills", []))
    
    skill_freq = {}
    for job in state["job_matches"]:
        for skill in str(job.get("required_skills","")).split(";"):
            s = skill.strip().lower()
            if s: skill_freq[s] = skill_freq.get(s, 0) + 1
    
    missing = sorted(
        {s: f for s, f in skill_freq.items() if s not in student_skills},
        key=lambda x: skill_freq[x], reverse=True
    )[:6]
    
    # Agent self-critique: prioritize gaps by ROI
    prompt = f"""You are a career advisor. Prioritize these skill gaps for a 
Tunisian student targeting {state.get('job_preferences',{}).get('title','')}.

Gaps to analyze: {missing}
Student current skills: {list(student_skills)[:8]}
Top matching companies: {[j['company'] for j in state['job_matches'][:3]]}

For each gap return a JSON array of objects with:
- skill: string
- blocking_level: "Critical" | "Important" | "Optional"  
- fastest_path: string (specific course/project, under 10 words)
- time_weeks: number
- cost: "Free" | "Paid"
- unlocks: string (which companies/roles this opens)
- market_reality: string (% of job postings requiring it, under 10 words)

Return ONLY the JSON array."""
    
    response = llm.invoke(prompt)
    try:
        raw = response.content.strip().strip("```json").strip("```").strip()
        prioritized_gaps = json.loads(raw)
    except:
        prioritized_gaps = [{"skill": s, "blocking_level": "Important",
                            "fastest_path": "Online course", "time_weeks": 2,
                            "cost": "Free", "unlocks": "Multiple roles",
                            "market_reality": "High demand"} for s in missing[:3]]
    
    return {"gap_report": {"prioritized_gaps": prioritized_gaps,
                          "missing_skills": missing}}

# ── NODE 5C: TASK PLAN GENERATION ─────────────────────────────────
def task_plan_node(state: AgentState) -> AgentState:
    print("--- Node 5c: Task Plan ---")
    gaps = state.get("gap_report", {}).get("prioritized_gaps", [])[:3]
    deadline_days = state.get("job_preferences", {}).get("deadline_days", 30)
    
    tasks = []
    xp_map = {"Critical": 150, "Important": 100, "Optional": 50}
    
    for i, gap in enumerate(gaps):
        tasks.append({
            "id": i + 1,
            "title": f"Complete: {gap['skill']}",
            "description": gap["fastest_path"],
            "day": (i + 1) * max(1, deadline_days // (len(gaps) + 1)),
            "xp": xp_map.get(gap["blocking_level"], 75),
            "blocking_level": gap["blocking_level"],
            "cost": gap.get("cost", "Free"),
            "completed": False,
            "skill_added": gap["skill"]
        })
    
    # Add application task at end
    tasks.append({
        "id": len(tasks) + 1,
        "title": "Apply to top matching companies",
        "description": f"Target: {[j['company'] for j in state['job_matches'][:2]]}",
        "day": deadline_days,
        "xp": 200,
        "blocking_level": "Critical",
        "cost": "Free",
        "completed": False,
        "skill_added": None
    })
    
    return {"task_plan": tasks, "xp_total": 0}

# ── BUILD GRAPH ────────────────────────────────────────────────────
def build_graph():
    graph = StateGraph(AgentState)
    
    graph.add_node("intake",      intake_node)
    graph.add_node("ats",         ats_node)
    graph.add_node("market",      market_query_node)
    graph.add_node("routing",     routing_node)
    graph.add_node("email",       email_node)
    graph.add_node("gap_analysis",gap_analysis_node)
    graph.add_node("task_plan",   task_plan_node)
    
    graph.set_entry_point("intake")
    graph.add_edge("intake", "ats")
    graph.add_edge("ats", "market")
    graph.add_edge("market", "routing")
    
    def route_decision(state):
        return state.get("routing_decision", "redirect")
    
    graph.add_conditional_edges("routing", route_decision, {
        "auto_apply":  "email",
        "informed":    "email",
        "gap":         "gap_analysis",
        "redirect":    "gap_analysis",
    })
    
    graph.add_edge("email", END)
    graph.add_edge("gap_analysis", "task_plan")
    graph.add_edge("task_plan", END)
    
    return graph.compile()

app = build_graph()
```

---

### PHASE 3 — FRONTEND & UI (2 hours)

**Step 3.1 — Use v0.app to generate the score gauge**

Go to v0.app and paste this prompt:
```
Create a circular ATS score gauge component. Dark background (#0e1117).
The circle fills with a gradient from red to orange to green based on a 
score 0-100. Large number in center. Label below. No React, pure HTML/CSS/JS.
Use Anime.js from CDN to animate the fill on load. Export as single HTML file.
```

Save the output as `ui/score_gauge.html`

**Step 3.2 — Use ReactBits.dev for components**

Go to reactbits.dev and copy these components:
- Animated number counter (for score reveal)
- Progress bar with gradient fill (for XP bar)
- Badge/chip component (for skill tags)

Adapt them to Streamlit via `st.components.v1.html()`

**Step 3.3 — Build dashboard.py**

```python
# dashboard.py
import warnings
warnings.filterwarnings("ignore")

import streamlit as st
import pandas as pd
import json
import os
from streamlit_folium import st_folium
from src.agents.graph import app as agent_app
from src.search.mapping import create_job_map

st.set_page_config(
    page_title="Ekbes | جدارة",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ── Load score gauge HTML ──────────────────────────────────────────
with open("ui/score_gauge.html", "r") as f:
    GAUGE_HTML = f.read()

# ── CSS ───────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.stApp { background-color: #080B14; color: #E8E8E8; font-family: 'DM Sans', sans-serif; }
.stSidebar { background-color: #0D1117; border-right: 1px solid #1E2533; }

.main-title {
    font-family: 'Syne', sans-serif;
    font-size: 3.2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #4ECDC4 0%, #44CF6C 50%, #FFE66D 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -2px;
    line-height: 1;
}

.arabic-subtitle {
    font-size: 1.1rem;
    color: #6B7A8D;
    letter-spacing: 4px;
    margin-top: -8px;
}

.tier-card {
    background: #0D1117;
    border: 1px solid #1E2533;
    border-radius: 16px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s;
}
.tier-card:hover { border-color: #4ECDC4; transform: translateY(-2px); }
.tier-card.premium { border-color: #FFE66D; }

.score-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.5px;
}
.badge-critical { background: rgba(248,81,73,0.15); color: #F85149; border: 1px solid #F85149; }
.badge-important { background: rgba(255,166,0,0.15); color: #FFA500; border: 1px solid #FFA500; }
.badge-optional { background: rgba(78,205,196,0.15); color: #4ECDC4; border: 1px solid #4ECDC4; }

.match-card {
    background: #0D1117;
    border-radius: 12px;
    padding: 16px 20px;
    margin: 8px 0;
    border-left: 4px solid;
}
.match-high { border-color: #44CF6C; }
.match-mid  { border-color: #FFA500; }
.match-low  { border-color: #F85149; }

.node-badge {
    display: inline-block;
    background: #0D1117;
    border: 1px solid #1E2533;
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 0.78rem;
    color: #4ECDC4;
    margin: 3px;
    font-family: 'DM Sans', monospace;
}

.xp-bar-container {
    background: #1E2533;
    border-radius: 10px;
    height: 8px;
    overflow: hidden;
    margin: 8px 0;
}
.xp-bar-fill {
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(90deg, #4ECDC4, #44CF6C);
    transition: width 0.8s ease;
}

div[data-testid="stMetricValue"] { 
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    color: #4ECDC4;
}
</style>
""", unsafe_allow_html=True)

# ── Session State ─────────────────────────────────────────────────
for key, default in [
    ("view", "home"), ("agent_result", None),
    ("tier", "free"), ("completed_tasks", set()),
    ("xp_total", 0), ("cv_final", "")
]:
    if key not in st.session_state:
        st.session_state[key] = default

# ── Sidebar ───────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🎯 Ekbes")
    st.markdown("<div style='color:#6B7A8D;font-size:0.85rem'>جدارة · Merit</div>",
                unsafe_allow_html=True)
    st.divider()
    
    tier = st.radio("Select Tier", ["🆓 Free — Scan & Apply", "⭐ Premium — Build & Become"],
                    key="tier_radio")
    st.session_state.tier = "free" if "Free" in tier else "premium"
    
    st.divider()
    cv_input = st.text_area("Your CV:", height=180,
        placeholder="Paste your CV text here...\nYassine Chaari, INSAT Tunis\nSkills: Python, SQL, Git...")
    
    col1, col2 = st.columns(2)
    with col1:
        job_title = st.text_input("Target Role", placeholder="Junior Dev")
    with col2:
        city = st.selectbox("City", ["Any","Tunis","Sfax","Sousse","Monastir","Bizerte"])
    
    level = st.selectbox("Level", ["Entry Level", "Mid Level", "Senior"])
    
    if st.button("🚀 Analyze My Profile", use_container_width=True, type="primary"):
        if cv_input.strip():
            st.session_state.view = "analyzing"
            st.session_state.saved_cv = cv_input
            st.session_state.saved_prefs = {
                "title": job_title, "city": city, "level": level, "deadline_days": 21
            }
            st.session_state.agent_result = None
            st.rerun()

# ── HEADER ────────────────────────────────────────────────────────
st.markdown('<div class="main-title">Ekbes</div>', unsafe_allow_html=True)
st.markdown('<div class="arabic-subtitle">جدارة · Your AI Career Agent</div>',
            unsafe_allow_html=True)
st.markdown("<br>", unsafe_allow_html=True)

# ── VIEW: ANALYZING ───────────────────────────────────────────────
if st.session_state.view == "analyzing":
    
    node_labels = {
        "intake":       "📋 Reading your profile",
        "ats":          "🔍 Scoring your CV against ATS",
        "market":       "🌍 Searching Tunisian job market",
        "routing":      "⚡ Determining your strategy",
        "email":        "✉️ Generating application email",
        "gap_analysis": "📊 Analyzing skill gaps",
        "task_plan":    "📅 Building your action plan",
    }
    
    st.markdown("### 🤖 Agent Reasoning")
    progress_bar = st.progress(0)
    status_box = st.empty()
    nodes_done = []
    
    with st.spinner(""):
        stream_input = {
            "cv_text": st.session_state.saved_cv,
            "job_preferences": st.session_state.saved_prefs,
            "tier": st.session_state.tier,
            "additional_context": "",
            "loop_count": 0, "xp_total": 0,
            "completed_tasks": [], "routing_decision": "",
            "gap_report": {}, "task_plan": [], "application_email": "",
            "ats_result": {}, "ats_corrections": [], "cv_final": "",
            "job_matches": []
        }
        
        for i, chunk in enumerate(agent_app.stream(stream_input)):
            node_name = list(chunk.keys())[0]
            label = node_labels.get(node_name, node_name)
            nodes_done.append(label)
            progress_bar.progress(min((i+1)/len(node_labels), 1.0))
            badges = "".join(f'<span class="node-badge">✓ {n}</span>'
                           for n in nodes_done)
            status_box.markdown(badges, unsafe_allow_html=True)
        
        st.session_state.agent_result = agent_app.invoke(stream_input)
        st.session_state.view = "results"
        st.rerun()

# ── VIEW: RESULTS ─────────────────────────────────────────────────
elif st.session_state.view == "results" and st.session_state.agent_result:
    r = st.session_state.agent_result
    ats = r.get("ats_result", {})
    jobs = r.get("job_matches", [])
    gap = r.get("gap_report", {})
    tasks = r.get("task_plan", [])
    email = r.get("application_email", "")
    routing = r.get("routing_decision", "")
    
    # Metrics row
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("ATS Score", f"{ats.get('total', 0)}/100")
    c2.metric("ATS Status", ats.get("label", "—"))
    c3.metric("Jobs Matched", len(jobs))
    c4.metric("Top Match", f"{jobs[0]['match_score']}%" if jobs else "0%")
    
    st.divider()
    
    # Tabs
    tabs = ["🔍 ATS Report", "💼 Job Matches", "📊 Gap Analysis",
            "📅 Action Plan", "✉️ Application"]
    tab1, tab2, tab3, tab4, tab5 = st.tabs(tabs)
    
    # TAB 1: ATS
    with tab1:
        col_gauge, col_corrections = st.columns([1, 2])
        with col_gauge:
            gauge_html = GAUGE_HTML.replace("__SCORE__", str(ats.get("total", 0)))
            st.components.v1.html(gauge_html, height=300)
        with col_corrections:
            st.markdown(f"### {ats.get('label', 'Analyzing...')}")
            for correction in r.get("ats_corrections", []):
                st.markdown(f"⚡ {correction}")
            bd = ats.get("breakdown", {})
            if bd:
                st.markdown("**Component Scores:**")
                components = {
                    "Keyword Match": bd.get("keyword_match",{}).get("score",0),
                    "Keyword Placement": bd.get("keyword_placement",{}).get("score",0),
                    "Section Completeness": bd.get("sections",{}).get("score",0),
                    "Experience Validation": bd.get("experience",{}).get("score",0),
                    "Formatting": bd.get("formatting",{}).get("score",0),
                }
                for name, score in components.items():
                    st.markdown(f"`{name}`: {score} pts")
    
    # TAB 2: Jobs
    with tab2:
        for job in jobs[:6]:
            score = job["match_score"]
            cls = "match-high" if score >= 85 else "match-mid" if score >= 50 else "match-low"
            st.markdown(f"""
<div class="match-card {cls}">
  <strong>{job['title']}</strong> — {job['company']} · {job['city']}<br>
  <small>💰 {job['salary_range_tnd']} TND/month · Match: <strong>{score}%</strong></small>
</div>""", unsafe_allow_html=True)
        
        if jobs:
            map_jobs = [j for j in jobs if j.get("lat") and j.get("lon")]
            if map_jobs:
                from src.search.mapping import create_job_map
                st_folium(create_job_map(map_jobs), width="100%", height=400,
                         key="results_map")
    
    # TAB 3: Gap Analysis
    with tab3:
        gaps = gap.get("prioritized_gaps", [])
        if gaps:
            for g in gaps:
                badge_cls = {
                    "Critical": "badge-critical",
                    "Important": "badge-important",
                    "Optional": "badge-optional"
                }.get(g.get("blocking_level",""), "badge-optional")
                
                st.markdown(f"""
<div style="background:#0D1117;border:1px solid #1E2533;border-radius:12px;
            padding:16px;margin:8px 0;">
  <span class="score-badge {badge_cls}">{g.get('blocking_level')}</span>
  <strong style="margin-left:10px;font-size:1.1rem">{g.get('skill','')}</strong><br>
  <small style="color:#6B7A8D">
    📚 {g.get('fastest_path','')} · 
    ⏱ {g.get('time_weeks','')} weeks · 
    💰 {g.get('cost','')} · 
    🔓 {g.get('unlocks','')}
  </small><br>
  <small style="color:#4ECDC4">📊 {g.get('market_reality','')}</small>
</div>""", unsafe_allow_html=True)
        else:
            st.info("No significant gaps found for your target role.")
    
    # TAB 4: Action Plan
    with tab4:
        if tasks:
            xp_total = st.session_state.xp_total
            level_thresholds = [(200,"🌱 Seedling"),(500,"🔍 Explorer"),
                               (1000,"⚡ Contender"),(2000,"🎯 Candidate"),(9999,"🏆 Hired")]
            current_level = next(l for t,l in level_thresholds if xp_total < t)
            next_threshold = next(t for t,l in level_thresholds if xp_total < t)
            
            col_xp, col_level = st.columns(2)
            col_xp.metric("Total XP", f"{xp_total} XP")
            col_level.metric("Level", current_level)
            
            xp_pct = min(int((xp_total / next_threshold) * 100), 100)
            st.markdown(f"""
<div class="xp-bar-container">
  <div class="xp-bar-fill" style="width:{xp_pct}%"></div>
</div>
<small style="color:#6B7A8D">{xp_total} / {next_threshold} XP to next level</small>
""", unsafe_allow_html=True)
            
            st.divider()
            
            completed = st.session_state.completed_tasks
            for task in tasks:
                tid = task["id"]
                done = tid in completed
                col_check, col_info = st.columns([1, 8])
                with col_check:
                    if st.checkbox("", value=done, key=f"task_{tid}"):
                        if tid not in completed:
                            completed.add(tid)
                            st.session_state.xp_total += task["xp"]
                            st.session_state.completed_tasks = completed
                            st.toast(f"✅ +{task['xp']} XP! {task['title']} complete!")
                            st.rerun()
                with col_info:
                    status = "~~" if done else ""
                    st.markdown(
                        f"**{status}{task['title']}{status}** — "
                        f"Day {task['day']} · +{task['xp']} XP · "
                        f"_{task['description']}_"
                    )
    
    # TAB 5: Application Email
    with tab5:
        if email:
            st.markdown("### Generated Application Email")
            st.markdown(f"""
<div style="background:#0D1117;border:1px solid #1E2533;border-radius:12px;
            padding:24px;white-space:pre-wrap;font-family:'DM Sans',sans-serif;
            line-height:1.7;color:#C9D1D9;">
{email}
</div>""", unsafe_allow_html=True)
            st.download_button("📥 Copy Email", email, 
                             file_name="application_email.txt")
        else:
            st.info("Upgrade to Premium or improve compatibility to unlock email generation.")

# ── VIEW: HOME ────────────────────────────────────────────────────
else:
    df = pd.read_csv("data/tunisia_jobs.csv")
    c1, c2, c3 = st.columns(3)
    c1.metric("Students in Tunisia", "306,000")
    c2.metric("Youth Unemployment", "~40%")
    c3.metric("Jobs Indexed", len(df))
    
    st.markdown("""
<div style="background:#0D1117;border:1px solid #1E2533;border-radius:16px;
            padding:32px;margin:24px 0;text-align:center;">
  <p style="font-size:1.1rem;color:#6B7A8D;max-width:600px;margin:0 auto;line-height:1.8">
    <em>"600 applications. 1 interview. Then ghosted."</em><br>
    <small>— r/Tunisia, 2024</small>
  </p>
  <p style="color:#4ECDC4;margin-top:16px;font-size:1rem">
    Ekbes tells you exactly why. And exactly what to do next.
  </p>
</div>""", unsafe_allow_html=True)
    
    st.markdown("### 👈 Paste your CV in the sidebar to begin.")
```

---

### PHASE 4 — DEMO HARDENING (45 minutes)

**Step 4.1 — Create cached demo run**
```python
# scripts/cache_demo.py
# Run this 1 hour before pitch to cache a perfect result
import json
from src.agents.graph import app

DEMO_CV = """
Yassine Chaari — yassine@email.com
4th year Software Engineering student, INSAT Tunis
EDUCATION: BSc Software Engineering, INSAT, expected 2026
SKILLS: Python, SQL, Git, HTML, CSS, JavaScript basics
PROJECTS: Student grade calculator web app (HTML/CSS/JS)
"""

result = app.invoke({
    "cv_text": DEMO_CV,
    "job_preferences": {"title": "Junior Backend Developer", 
                        "city": "Tunis", "level": "Entry Level",
                        "deadline_days": 21},
    "tier": "premium",
    "additional_context": "",
    "loop_count": 0, "xp_total": 0, "completed_tasks": [],
    "routing_decision": "", "gap_report": {}, "task_plan": [],
    "application_email": "", "ats_result": {}, "ats_corrections": [],
    "cv_final": "", "job_matches": []
})

with open("scripts/demo_cache.json", "w") as f:
    json.dump(result, f, indent=2, default=str)

print("Demo cached. ATS Score:", result["ats_result"]["total"])
print("Top match:", result["job_matches"][0]["company"] if result["job_matches"] else "None")
print("Gaps:", [g["skill"] for g in result["gap_report"].get("prioritized_gaps",[])])
```

**Step 4.2 — Run the full demo path**
```
1. streamlit run dashboard.py
2. Select Premium tier
3. Paste the DEMO_CV from step 4.1
4. Set: Junior Backend Developer | Tunis | Entry Level
5. Click Analyze
6. Verify all 5 tabs render correctly
7. Check off one task — verify XP increments
8. Record the screen (30 seconds)
```

**Step 4.3 — Create GIF for slides**
```
1. Open EzGIF.com
2. Upload your 30-second screen recording
3. Convert to GIF at 15fps
4. Crop to show only the score gauge + job matches + task check
5. Export as demo.gif → use in pitch slides
```

---

### PHASE 5 — PRESENTATION ASSETS (30 minutes)

**HeyGen** (heygen.com):
- Create a 20-second intro video: professional avatar says the opening line
- Script: *"38% of Tunisian graduates are unemployed. Not because they lack talent. Because nobody tells them what's wrong. Ekbes does."*
- Download as MP4 → embed in pitch slides as autoplay

**Freepik** (freepik.com):
- Search: "student career tunisia arabic" → download 2-3 illustrations
- Search: "data analytics dashboard" → background for tech slide
- All free with attribution

**Google Labs / NotebookLM**:
- Upload this PRD → generate a spoken podcast summary
- Use as team briefing audio to onboard any teammate in 10 minutes

---

## PART 5 — FINAL CHECKLIST

```
BEFORE SLEEPING:
  □ requirements.txt installed — all green
  □ Groq API key working
  □ FAISS returns results from tunisia_jobs.csv
  □ ATS scorer returns a score (any score)

BEFORE BUILDING TOMORROW:
  □ Read problem statement
  □ Verify it matches this PRD (it will)
  □ Open dashboard.py — confirm it runs

DEMO PATH (harden this — nothing else matters):
  □ CV input → agent runs → ATS tab shows score + corrections
  □ Job Matches tab shows color-coded cards
  □ Gap Analysis tab shows prioritized gaps with badges
  □ Action Plan tab shows tasks + XP increments when checked
  □ Application tab shows generated email in French

PITCH ASSETS:
  □ HeyGen intro video (20 seconds)
  □ EzGIF demo GIF (30 seconds)
  □ 3 Reddit quotes on one slide
  □ Market stats slide (306k / 40% / 286 institutions)
  □ Two-tier business model slide
  □ Three partners integrated in closing sentence

RUN ORDER TOMORROW:
  python scripts/verify_env.py       → all green
  python scripts/cache_demo.py       → cache result
  streamlit run dashboard.py         → demo ready
```

---

*Ekbes — جدارة — Merit.*
*Built for the student who deserves a fair shot and is ready to prove it.*
