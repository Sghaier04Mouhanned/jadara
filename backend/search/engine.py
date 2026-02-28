import numpy as np
import pandas as pd
import os

_cache = {}


def load_index(csv_path="backend/data/tunisia_jobs.csv"):
    """Load and cache FAISS index + sentence-transformer model."""
    if "index" not in _cache:
        from sentence_transformers import SentenceTransformer
        import faiss

        # Try multiple paths for flexibility
        if not os.path.exists(csv_path):
            alt = os.path.join(os.path.dirname(__file__), "..", "data", "tunisia_jobs.csv")
            if os.path.exists(alt):
                csv_path = alt
            else:
                raise FileNotFoundError(f"Data file not found at {csv_path}")

        df = pd.read_csv(csv_path).fillna("")
        if "job_id" not in df.columns:
            df["job_id"] = [str(i) for i in range(len(df))]
        model = SentenceTransformer("all-MiniLM-L6-v2")
        texts = (
            df["required_skills"].astype(str)
            + " "
            + df["title"].astype(str)
            + " "
            + df["sector"].astype(str)
        ).tolist()
        emb = model.encode(texts, show_progress_bar=False).astype("float32")
        idx = faiss.IndexFlatL2(emb.shape[1])
        idx.add(emb)
        _cache.update({"model": model, "index": idx, "df": df})


def search_jobs(query: str, k: int = 15) -> pd.DataFrame:
    """Perform semantic search over the job database using FAISS."""
    load_index()
    qv = _cache["model"].encode([query]).astype("float32")
    _, ids = _cache["index"].search(qv, k=k)
    return _cache["df"].iloc[ids[0]]


# ── Skill expansion for better gap analysis ──────────────────────────────────

SKILL_IMPLIES = {
    "machine learning": ["python", "numpy", "pandas", "scikit-learn", "statistics"],
    "deep learning": ["pytorch", "tensorflow", "python", "keras"],
    "data science": ["python", "sql", "statistics", "excel"],
    "gis": ["qgis", "arcgis", "spatial analysis"],
    "remote sensing": ["envi", "snap", "google earth engine"],
    "web development": ["html5", "css3", "javascript"],
    "backend development": ["sql", "apis", "server"],
    "devops": ["linux", "bash", "docker", "ci/cd"],
    "django": ["python", "rest apis", "orm"],
    "react": ["javascript", "html5", "css3"],
    "fastapi": ["python", "rest apis", "pydantic"],
    "spring boot": ["java", "rest apis", "maven", "orm"],
}


def expand_skills(skills: list) -> set:
    """Expand explicit skills with implied skills from SKILL_IMPLIES."""
    expanded = set()
    for s in skills:
        if isinstance(s, dict):
            val = s.get("name", s.get("skill", ""))
            if val: expanded.add(str(val).lower())
        elif isinstance(s, str) and s.strip():
            expanded.add(s.strip().lower())
        else:
            expanded.add(str(s).lower())
    
    for skill in list(expanded):
        for implied in SKILL_IMPLIES.get(skill, []):
            expanded.add(implied)
    return expanded


def score_match(student_skills: set, required_skills_str: str) -> float:
    """Compute match score between student skills and job requirements."""
    required = {
        s.strip().lower() for s in required_skills_str.split(";") if s.strip()
    }
    if not required:
        return 0.0
    return round(len(student_skills & required) / len(required) * 100, 1)
