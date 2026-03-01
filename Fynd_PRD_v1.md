# جدارة · Fynd.tn
## Product Requirements Document — v1.0
### Hackathon Edition | February 28 – March 1, 2026

---

## 0. The Name

Fynd.tn ·  Arabic for *merit, worthiness, competence.*

The product's entire purpose is to prove that a student deserves the opportunity they're
pursuing — and then make it undeniable. The name is the mission.

It is short, professional, memorable across Arabic/French/English, and as of this writing,
untaken as a product name globally.

---

## 1. The One-Sentence Definition

**Fynd.tn is the AI agent that takes your CV and a target job, tells you exactly where you
stand, builds the plan to close the gap, and executes it with you until you're ready to
apply — automatically.**

---

## 2. The Problem

### 2.1 The Core Pain

The Tunisian hiring market is a black box. Students send applications into silence.
They receive no feedback, no benchmark, no explanation of why they failed.
The feedback loop is entirely broken.

Meanwhile:
- **~40%** youth unemployment — one of the highest in the MENA region (World Bank 2024)
- **306,000** students enrolled across 286 institutions
- **70,000** new graduates per year competing for insufficient openings
- University graduates face the **highest unemployment rate of any education level**

The Reddit data is visceral:
> *"600 applications, 1 interview, then ghosted."*
> *"I applied to 1,300 jobs abroad. 4 interviews. All rejected."*
> *"There is no job searching in Tunisia. Only m3aref."*

### 2.2 The M3aref Counter-Argument (Pre-Empted)

> "Doesn't nepotism dominate hiring in Tunisia?"

**Answer**: *"Yes — and that's exactly why students without connections need a sharper
competitive edge. Fynd.tn gives them what nepotism gives connected students: insider
knowledge about what it actually takes to get hired."*

### 2.3 The Five Gaps Fynd.tn Closes

| # | Gap | Current Reality |
|---|-----|-----------------|
| 1 | **Feedback Vacuum** | Auto-rejections with zero explanation |
| 2 | **Market Intelligence** | Job postings don't reflect what companies actually want |
| 3 | **Actionable Specificity** | "Build your network" is not a plan |
| 4 | **Emotional Honesty** | All tools encourage, none calibrate |
| 5 | **Continuity** | Career support in Tunisia is event-based, not on-demand |

---

## 3. The Solution

### 3.1 Product Overview

Fynd.tn is a two-tier AI agent platform. The user inputs their CV and job preferences.
The agent analyzes, matches, plans, tracks, and ultimately executes — from raw CV to
application-ready candidate.

The agent does not just advise. It acts. And it updates the CV automatically when the
student grows.

### 3.2 The Two Tiers

---

#### FREE TIER — "Scan & Apply"

**Purpose**: Maximum reach for students who need immediate applications.
Useful for high-compatibility matches. Token-limited.

**Flow**:

```
INPUT
  → CV (Paste text or Upload PDF) + Job Title + Level + Remote/Onsite preference

STEP 1 — ATS SCORE
  → Agent scores CV against ATS criteria (0–100)
  → Shows: keyword match rate, section completeness, formatting issues
  → Proposes specific corrections
  → User chooses: Accept corrections → generate updated CV | Skip → use original

STEP 2 — COMPATIBILITY CHECK
  → Updated (or original) CV matched against job database via FAISS RAG
  → Each job receives a compatibility score

STEP 3 — ROUTING BY SCORE

  ┌─────────────────────────────────────────────────────────────────┐
  │  85%–99% → AUTO-APPLY                                           │
  │  Agent generates personalized application email                 │
  │  "Ready to send to [Company]. Review and confirm."             │
  │  One click → email generated with CV attached                  │
  ├─────────────────────────────────────────────────────────────────┤
  │  50%–84% → INFORMED DECISION                                    │
  │  Agent shows: strengths matched / gaps identified               │
  │  User chooses: Apply anyway | Skip this one                    │
  │  If apply → generates application email (lower confidence note) │
  ├─────────────────────────────────────────────────────────────────┤
  │  Below 50% → HONEST REDIRECT                                    │
  │  "You are not competitive for this role today."                 │
  │  Shows 3 closest matching roles instead                         │
  │  Suggests upgrading to Premium for a gap-closing plan           │
  │  If user declines → lets them apply anyway with clear warning:  │
  │  "Your estimated response rate is below 5%."                   │
  └─────────────────────────────────────────────────────────────────┘

TOKEN SYSTEM
  → Free trial: 500 tokens (covers ~3–5 full analyses)
  → When tokens depleted: basic apply mode only
    (generates email from CV without compatibility check,
     uses lightweight LLM, zero RAG cost)
```

---

#### PREMIUM TIER — "Build & Become"

**Purpose**: Strategic gap-closing with a daily execution plan.
For students who are not yet competitive and need to become so.

**Flow**:

```
INPUT
  → CV (Paste text or Upload PDF) + full context conversation
  → "What are you good at that isn't on your CV?"
  → "What's your deadline? (job posting closing date)"
  → "What's your non-negotiable constraint? (city, salary, remote)"

STEP 1 — DEEP ATS ANALYSIS
  → Full ATS scoring (same as Free Tier but deeper)
  → Checks for: missing sections, weak verbs, unquantified achievements,
    keyword gaps vs. target role, formatting incompatibilities
  → Agent asks: "Before I finalize your profile, did you forget to mention
    any project, certification, or side experience?"
  → User adds any missing context
  → Agent finalizes enriched profile

STEP 2 — STRATEGIC JOB MATCHING
  → Runs compatibility against full job database
  → Shows ranked results: match score + salary range + location
  → User selects preferred targets (can pick multiple)
  → For each selected job:
    → Structural gap: CV sections missing or weak
    → Specific gap: skills/experience missing for THIS job description

STEP 3 — GAP PRIORITIZATION (Agent Self-Critique Loop)
  → Agent generates initial gap list
  → Agent loops and critiques its own output:
    "Is this gap truly blocking, or just nice-to-have?"
    "What is the fastest path to close this gap?"
    "What is the ROI of closing this gap — does it unlock multiple roles?"
    "What does this cost in time and money? Is it realistic?"
  → Agent outputs PRIORITIZED gap list with for each item:
    → Blocking level: Critical / Important / Optional
    → Fastest path: Certification X (2 weeks) / Project Y / Course Z
    → Market reality: "FastAPI appears in 73% of backend job postings"
    → Cost: Free / Paid (estimated)
    → Unlocks: "Closing this gap raises your Vermeg score from 61% to 78%"

STEP 4 — DAILY TASK PLAN WITH DEADLINE AWARENESS
  → Agent calculates: days until job posting closes
  → Generates day-by-day task schedule:
    "Day 1–3: Complete FastAPI basics (freeCodeCamp, 3h total)"
    "Day 4: Push a minimal API project to GitHub"
    "Day 5: Update CV skills section — done automatically"
    "Day 6–7: Apply to Vermeg. Compatibility will be 78%."
  → Tasks have: priority, estimated time, resource link, XP value
  → Checklist UI: student marks tasks complete

STEP 5 — CV AUTO-UPDATE (The Core Innovation)
  → When student checks "Completed FastAPI certification":
    → CV skills section automatically updates
    → Compatibility score recalculates live
    → Agent shows: "Your Vermeg match just moved from 61% → 78%. 
       You are now competitive. Ready to apply?"
  → CV at any moment reflects current real skills, not initial snapshot

STEP 6 — APPLICATION TRIGGER
  → When student reaches target compatibility (configurable: default 85%):
    → Agent proposes: "You're ready. Apply now?"
    → Or if auto-apply is enabled: generates email automatically
  → Application email is personalized:
    → References specific job requirements
    → Highlights the exact skills the company cares about
    → Written in appropriate language (French for Tunisian companies)

STEP 7 — APPLICATION TRACKER (New)
  → "📋 Tracker" tab logs the sent application
  → Records Company, Job Title, Application Date, and Status (Applied, Interview, etc.)
  → Student can update tracking statuses inline.

GAMIFICATION LAYER (Both Tiers)
  → XP system on all actions:
    ATS correction accepted:        +30 XP
    Task completed:                 +50–200 XP (by difficulty)
    Compatibility score improved:   +100 XP
    Application sent:               +150 XP
    Interview scheduled:            +500 XP
  → Levels: Seedling → Explorer → Contender → Candidate → Hired
  → Progress bar visible on dashboard
  → Each level unlock shows market reality message:
    "Level 3 — Contender: You now match 34% of your target roles.
     The average Tunisian graduate matches 12%. Keep going."
```

---

## 4. The ATS Simulation — Technical Specification

### 4.1 Why It's Defensible

Major commercial products (Jobscan, ResumeWorded, Enhancv, Targeted Resume) all use
the same publicly documented ATS scoring methodology. You are not faking a black box —
you are implementing the known, public scoring rubric that the industry runs on.

### 4.2 Scoring Rubric (5 Components → 0–100 Score)

```python
def compute_ats_score(cv_text: str, job_description: str) -> dict:
    """
    Returns overall score (0-100) and component breakdown.
    
    Component weights:
      keyword_match:      40 points  (the dominant signal)
      keyword_placement:  20 points  (where in CV keywords appear)
      section_completeness: 20 points (standard sections present)
      experience_validation: 10 points (skills backed by experience text)
      formatting_compliance: 10 points (no tables/images/complex layouts)
    """
```

**Component 1 — Keyword Match Rate (40 pts)**
```
- Extract keywords from job description via LLM
  (prompt: "List the 20 most important technical and soft skills 
   from this job posting as a JSON array")
- Check each keyword against CV text (exact + synonym)
- Score = (matched_keywords / total_keywords) * 40
- Threshold references:
    >75% keywords matched → "Strong ATS pass"
    60–75%               → "Likely pass with optimization"  
    45–60%               → "At risk — improve keyword coverage"
    <45%                 → "High rejection probability"
```

**Component 2 — Keyword Placement (20 pts)**
```
High-value zones (score higher if keyword appears here):
  - Professional Summary / Objective:  3 pts per keyword (max 9)
  - Skills section:                    2 pts per keyword (max 6)  
  - First bullet of any role:          2 pts per keyword (max 6)
  - Body of experience:                1 pt per keyword (max 4)
  - Nowhere / only in education:       0 pts
```

**Component 3 — Section Completeness (20 pts)**
```
Required sections (4 pts each):
  □ Professional Summary or Objective
  □ Work Experience (or Projects if student)
  □ Education
  □ Skills
  □ Contact Information

Detection: LLM classifies whether each section is present
```

**Component 4 — Experience Validation (10 pts)**
```
For each skill listed in Skills section:
  → Check if it appears with context in Experience/Projects
  → Example: "Python" in Skills + "Built a classification model using Python" 
     in Projects = validated
  → "Python" in Skills only = unvalidated (ATS flags this in modern systems)
  
Score = (validated_skills / total_skills) * 10
```

**Component 5 — Formatting Compliance (10 pts)**
```
Checks (2 pts each):
  □ No special characters or symbols in section headers
  □ Dates in standard format (MM/YYYY or Month YYYY)
  □ No apparent table structure (pipe characters, aligned spacing)
  □ Job titles present for each experience entry
  □ Bullet points used (not paragraph walls)
```

### 4.3 ATS Score → User Message Mapping

| Score | Label | Message to User |
|-------|-------|-----------------|
| 85–100 | ✅ ATS-Ready | "Your CV will pass most ATS filters. Strong position." |
| 70–84 | 🟡 Optimizable | "Good base. 3 specific improvements will significantly boost your score." |
| 50–69 | ⚠️ At Risk | "High probability of automatic rejection. These changes are critical." |
| Below 50 | 🔴 Failing | "Your CV is likely being rejected before human review. Rebuild needed." |

---

## 5. Technical Architecture

### 5.1 LangGraph Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Fynd.tn AGENT                                  │
│                                                                      │
│  Node 1          Node 2          Node 3          Node 4             │
│  INTAKE    ───▶  ATS SCORE ───▶  MARKET    ───▶  ROUTING            │
│                                  QUERY            LOGIC              │
│  CV parse        5-component     FAISS RAG        Score-based        │
│  Follow-up       scoring         over jobs        branching          │
│  questions       LLM keyword     CSV              85/50/below        │
│  (Premium)       extraction                                          │
│                       │                               │              │
│                       ▼                               ▼              │
│                  Node 2b                    ┌─────────┴──────────┐  │
│                  CV CORRECTION              │                    │  │
│                  LLM rewrites               ▼                    ▼  │
│                  weak sections        Node 5a              Node 5b  │
│                                       AUTO-APPLY           GAP      │
│                                       Email gen            ANALYSIS │
│                                                            +        │
│                                                       Node 5c       │
│                                                       TASK PLAN     │
│                                                       (Premium)     │
│                                                            │        │
│                                                            ▼        │
│                                                       Node 6        │
│                                                       CV AUTO-      │
│                                                       UPDATE        │
│                                                       (on task      │
│                                                        complete)    │
└─────────────────────────────────────────────────────────────────────┘

STREAMING: Every node fires with a visible label in the UI
CONDITIONAL EDGE: Route after Node 4 based on compatibility score
```

### 5.2 AgentState

```python
class AgentState(TypedDict):
    # Input
    cv_text: str
    job_preferences: dict       # title, level, remote, city
    tier: str                   # "free" | "premium"
    additional_context: str     # Premium: follow-up answers
    
    # ATS Analysis
    ats_score: int              # 0–100
    ats_breakdown: dict         # Component scores
    ats_corrections: list       # Suggested improvements
    cv_updated: bool            # Did user accept corrections?
    cv_final: str               # Final CV text (corrected or original)
    
    # Market Match
    job_matches: list           # Scored jobs from FAISS
    selected_jobs: list         # Premium: user-selected targets
    
    # Gap Analysis (Premium)
    gap_report: dict            # Prioritized gaps with ROI
    
    # Execution
    task_plan: list             # Daily tasks with deadlines
    completed_tasks: list       # Checked tasks
    xp_total: int               # Gamification score
    
    # Output
    application_email: str      # Generated application text
    routing_decision: str       # "auto_apply" | "informed" | "redirect"
    
    # Control
    loop_count: int             # Prevent infinite agent loops
    token_count: int            # Free tier usage tracking
```

### 5.3 Conditional Routing

```python
def route_by_compatibility(state: AgentState) -> str:
    if not state["job_matches"]:
        return "no_matches"
    
    best_score = state["job_matches"][0]["match_score"]
    tier = state["tier"]
    
    if best_score >= 85:
        return "auto_apply"
    elif best_score >= 50:
        return "informed_decision"
    elif tier == "premium":
        return "gap_analysis"
    else:
        return "honest_redirect"

graph.add_conditional_edges(
    "routing",
    route_by_compatibility,
    {
        "auto_apply":         "generate_email",
        "informed_decision":  "show_gaps_decide",
        "gap_analysis":       "premium_gap_node",
        "honest_redirect":    "suggest_alternatives",
        "no_matches":         "broaden_search",
    }
)
```

### 5.4 Technology Stack

| Component | Tool | Why |
|-----------|------|-----|
| Agent Framework | LangGraph | Conditional routing, streaming, state management |
| LLM | Groq llama-3.3-70b-versatile | Free, fastest, critical for live demo |
| ATS Keyword Extraction | Groq LLM | Extract job description keywords as JSON |
| Embeddings | sentence-transformers all-MiniLM-L6-v2 | Local, already working |
| Vector Search | FAISS IndexFlatL2 | In-memory, zero infrastructure |
| Job Database | tunisia_jobs.csv (80 rows) | Demo-safe, realistic |
| Email Generation | Groq LLM | Personalized application emails in French/English |
| UI | Next.js 14 \+ Tailwind CSS | Fastest path to working demo |
| Environment | python-dotenv | Professional secret management |

### 5.5 Project Structure

```
Fynd.tn/
├── .env                          # API keys
├── backend/main.py                  # Streamlit entry point
├── requirements.txt
├── data/
│   └── tunisia_jobs.csv
├── src/
│   ├── agents/
│   │   └── graph.py              # Full LangGraph pipeline
│   ├── core/
│   │   └── clients.py            # LLM initialization
│   ├── ats/
│   │   └── scorer.py             # ATS scoring engine (5 components)
│   ├── search/
│   │   ├── engine.py             # FAISS RAG
│   │   └── mapping.py            # Folium map (secondary feature)
│   ├── email/
│   │   └── generator.py          # Application email generation
│   └── gamification/
│       └── xp.py                 # XP calculation + level logic
└── scripts/
    └── verify_env.py
```

---

## 6. UI/UX Specification

### 6.1 Screen Flow

```
LANDING
  ├── Tier Selection Card: Free | Premium
  └── CV Input + Preferences Form
        ↓
AGENT THINKING (Streaming)
  ├── Node badges firing live
  └── "Reading your CV... Scoring ATS... Searching market..."
        ↓
ATS REPORT SCREEN
  ├── Circular score gauge (0–100)
  ├── Component breakdown bars
  ├── Correction suggestions with Accept/Skip toggles
  └── [Generate Updated CV] button
        ↓
MATCH RESULTS SCREEN
  ├── Job cards ranked by compatibility %
  ├── Color coded: Green (85%+) | Orange (50-84%) | Red (<50%)
  ├── [Auto-Apply] on green cards
  ├── [View Gaps / Decide] on orange cards
  └── [See Alternatives] on red cards
        ↓
[PREMIUM ONLY] GAP ANALYSIS SCREEN
  ├── Prioritized gap list with blocking level badges
  ├── Each gap: fastest path + cost + "unlocks X more roles"
  └── [Build My Plan] button
        ↓
[PREMIUM ONLY] DAILY TASK DASHBOARD
  ├── Countdown: "Job closes in X days"
  ├── Today's tasks checklist
  ├── XP progress bar + level
  ├── Live compatibility score (updates on task completion)
  └── [I'm Ready — Apply Now] button (appears at 85%+)
        ↓
APPLICATION SCREEN
  ├── Generated email preview
  ├── [Copy Email] / [Download CV]
  └── Confirmation: "Application prepared for [Company]"
```

### 6.2 The Demo Climax Moment

This is the single scene the jury must see:

1. Student checks "Completed FastAPI certification" in task list
2. Compatibility score animates: **61% → 78%**
3. Agent message appears: *"You are now competitive for Vermeg Junior Developer.
   Ready to apply?"*
4. Green [Apply Now] button appears

This moment proves the entire product thesis: Fynd.tn doesn't just advise,
it evolves with you and executes when you're ready.

---

## 7. Demo Script (3 Minutes)

### Setup (before presenting)
Pre-load this profile:
> *Yassine Chaari, 4th year Software Engineering student, INSAT Tunis.
> Skills: Python, SQL, Git, HTML, CSS. No internship yet. Target: Junior
> Backend Developer. City: Tunis.*

ATS score will be ~55. Compatibility with top job will be ~62%. This is the
sweet spot — Premium flow triggers, gap plan generates, and you can show the
CV update moment.

### Minute 1 — The Problem
*(Show the three Reddit quotes on one slide. Silence for 3 seconds.)*

*"38% of Tunisian university graduates are unemployed. They keep applying.
They keep getting silence. Not because they lack talent — because nobody
tells them what's wrong. Fynd.tn tells them."*

### Minute 2 — The Live Demo
*(Open the app. Paste the pre-loaded CV. Click Analyze.)*

Let the nodes stream visibly. Don't narrate every step. When the ATS score
appears at 55, say:

*"This student would be auto-rejected by most companies. Here's exactly why —
and here's exactly what to fix."*

Show the gap plan. Check off one task. Watch the score jump.

*"The moment you grow, Fynd.tn knows."*

### Minute 3 — Business Model + Partners
*(Show one slide: the two tiers, TAM, partner integration)*

*"Free tier: scan and apply — handles the volume problem.
Premium tier: build and become — handles the strategy problem.*

*306,000 students across 286 institutions. Phase 2: universities pay per
student as a career service. Phase 3: integration with JobInterview's
AI avatars for full interview preparation — powered by SIROCCO's
infrastructure, scaled through Secret's ecosystem.*

*Fynd.tn — جدارة — Merit. We don't find you a job.
We make you the person who deserves one."*

---

## 8. Judging Criteria Alignment

| Criterion | Fynd.tn's Answer |
|-----------|-----------------|
| **Innovation** | ATS simulation + CV auto-update loop + agent self-critique on gap prioritization. No competitor combines these three. |
| **Impact** | 40% youth unemployment. 306,000 students. Acute, documented pain with verbatim Reddit evidence. |
| **Scalability** | Free tier drives volume. Premium drives revenue. Universities are B2B channel. CSV → live API swappable without architecture change. |
| **Pitch** | Reddit quotes open. Live demo with visible node streaming. CV update moment is the climax. Three partners integrated in closing. |
| **Execution** | Working LangGraph pipeline. FAISS RAG. ATS scoring engine. Gamification. Email generator. All functional and demo-safe. |
| **AI Architecture Workflow** | Conditional routing (4 paths), streaming state, RAG, LLM tool use, self-critique loop. Fully defensible technically. |
| **Problem Fit** | "Navigate path from education to professional world, personalized actionable guidance toward employability." Fynd.tn is this definition, verbatim. |

---

## 9. MVP Scope — What You Build Tomorrow

### Build completely (demo path)
- [ ] ATS scoring engine (5 components, Python + Groq)
- [ ] CV correction suggestions (LLM, Accept/Skip UI)
- [ ] FAISS compatibility matching (already working)
- [ ] Compatibility routing (85/50/below thresholds)
- [ ] Application email generation (Groq LLM, French)
- [ ] Gap analysis with prioritization (Groq + self-critique)
- [ ] Daily task checklist with XP
- [ ] CV auto-update on task completion (live score recalculation)
- [ ] Streaming node display in UI

### Build minimally (show exists, don't over-engineer)
- [ ] Token counter (display a number, decrement on each analysis)
- [ ] Tier switching (one button in sidebar, changes visible flow)
- [ ] Gamification levels (text labels, no complex logic needed)

### Do NOT build tomorrow
- Actual email sending (generate text only, user sends manually)
- User accounts / authentication
- PDF CV parsing (text paste only)
- Mobile responsiveness
- Arabic language UI
- Live job API
- Salary/relocation calculator
- Company reviews

---

## 10. Risk Register

| Risk | P | Mitigation |
|------|---|------------|
| ATS score feels arbitrary | High | Show the 5-component breakdown — every point is traceable |
| Groq timeout during demo | Med | Cache one full run result 1hr before pitch |
| "This is just Jobscan" objection | Med | "Jobscan optimizes for a static job posting. Fynd.tn builds a plan, updates your CV as you grow, and applies for you when you're ready. It's the gap between a score and an outcome." |
| Self-critique loop produces bad output | Med | Cap at 1 loop. If output degrades, use first pass. |
| Teammate unfamiliar with stack | High | Assign: UI polish, slide design, pitch delivery. No agent code. |
| Problem statement diverges from PRD | Low | ATS + gap analysis + task plan covers any employability framing. Architecture is universal. |

---

## 11. Post-Hackathon Roadmap (Pitch Only — Don't Build Now)

**Phase 1 — Student Direct (Month 1–3)**
Launch free tier publicly. Target INSAT, ESPRIT, ENIT communities.
Measure: daily active users, applications generated, premium conversions.

**Phase 2 — University B2B (Month 3–6)**
University career centers pay per enrolled student.
TAM: 286 institutions × avg 1,000 active job-seekers × 15 TND/month = ~4.3M TND/year.

**Phase 3 — Partner Integration (Month 6–12)**
JobInterview / SIROCCO: interview preparation node connects to their avatar system.
Student completes Fynd.tn's 90-day plan → automatically enters JobInterview prep flow.
Secret: cost-effective infrastructure for scaling.

---

*Fynd.tn — جدارة — Merit.*
*Built for the student who deserves a fair shot and is ready to prove it.*
