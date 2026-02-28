import os
import httpx
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


async def trigger_application_email(
    cv_text: str,
    job: dict,
    student_name: str,
    student_email: str,
) -> dict:
    """
    Triggers n8n workflow to send application email.
    For demo: company_email = student_email so the jury sees it arrive.

    Payload matches the CORRECTED n8n workflow (student→company direction).
    """
    payload = {
        "cv": cv_text,
        "job_description": (
            f"Role: {job.get('title')}\n"
            f"Company: {job.get('company')}\n"
            f"Required skills: {job.get('required_skills', '')}\n"
            f"Location: {job.get('city')}"
        ),
        "candidate_name": student_name,
        "candidate_email": student_email,
        "company_email": student_email,  # demo: student receives copy
        "job_title": job.get("title", ""),
        "company_name": job.get("company", ""),
    }

    webhook_url = os.getenv(
        "N8N_WEBHOOK_URL", "http://localhost:5678/webhook/cv-job-email"
    )

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(webhook_url, json=payload)
        return {"success": response.status_code == 200, "status_code": response.status_code}
    except httpx.TimeoutException:
        return {"success": False, "error": "n8n timeout — is n8n running?"}
    except Exception as e:
        return {"success": False, "error": str(e)}
