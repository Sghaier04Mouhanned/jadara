from typing import TypedDict, Optional

class AgentState(TypedDict):
    cv_text: str
    job_preferences: dict
    tier: str                     # "free" | "premium"
    additional_context: str
    student_profile: dict
    ats_result: dict
    ats_corrections: list
    cv_final: str
    job_matches: list
    routing_decision: str         # "auto_apply"|"informed"|"gap"|"redirect"
    gap_report: dict
    task_plan: list
    completed_tasks: list
    xp_total: int
    application_email: str
    loop_count: int
