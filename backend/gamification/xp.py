LEVELS = [
    (200, "🌱 Seedling", "You're just starting. First steps matter most."),
    (500, "🔍 Explorer", "You're building. Keep the momentum."),
    (1000, "⚡ Contender", "You're competitive. The market can see you now."),
    (2000, "🎯 Candidate", "You're ready. Now it's a numbers game."),
    (9999, "🏆 Hired", "You've done everything right."),
]

XP_VALUES = {
    "task_complete_critical": 150,
    "task_complete_important": 100,
    "task_complete_optional": 50,
    "application_sent": 200,
    "interview_scheduled": 500,
}


def get_level(xp: int) -> dict:
    """Determine player level from accumulated XP."""
    for threshold, name, message in LEVELS:
        if xp < threshold:
            prev = 0
            for t, _, _ in LEVELS:
                if t < threshold:
                    prev = t
            return {
                "name": name,
                "message": message,
                "current_xp": xp,
                "threshold": threshold,
                "prev_threshold": prev,
                "progress_pct": round(
                    (xp - prev) / max(threshold - prev, 1) * 100
                ),
            }
    return {
        "name": "🏆 Hired",
        "message": "You've done it.",
        "current_xp": xp,
        "threshold": 9999,
        "prev_threshold": 2000,
        "progress_pct": 100,
    }
