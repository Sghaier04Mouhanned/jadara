import os
import httpx
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))


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
        "N8N_WEBHOOK_URL", "https://aminekacem.app.n8n.cloud/webhook/cv-job-email"
    ).strip()

    print(f"[n8n] Attempting to trigger: {webhook_url}")
    print(f"[n8n] Payload structure: {list(payload.keys())}")

    try:
        # Use verify=False to rule out local SSL/DNS issues on Windows
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(webhook_url, json=payload)
        
        print(f"[n8n] HTTP Response: {response.status_code}")
        if response.status_code == 200:
            return {"success": True, "status_code": 200}
        else:
            error_msg = f"n8n error {response.status_code}: {response.text[:200]}"
            print(f"[n8n] Error: {error_msg}")
            return {"success": False, "error": error_msg}
    except httpx.ConnectError as e:
        print(f"[n8n] Connection Error: {e}")
        return {"success": False, "error": f"Connection failed: {str(e)}"}
    except Exception as e:
        print(f"[n8n] Unexpected Exception: {type(e).__name__}: {e}")
        return {"success": False, "error": str(e)}
