from fastapi import APIRouter

router = APIRouter(tags=["alerts"])


@router.get("/alerts")
def list_alerts() -> list[dict]:
    return [
        {
            "id": "alt-001",
            "company_id": "cmp-001",
            "title": "High risk score increase",
            "severity": "high",
            "summary": "Recent leverage and margin deterioration triggered an alert.",
        }
    ]
