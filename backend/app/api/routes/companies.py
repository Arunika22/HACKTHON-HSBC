from fastapi import APIRouter

from backend.app.services.risk_engine import RiskEngine

router = APIRouter(tags=["companies"])
engine = RiskEngine()

sample_companies = [
    {
        "company_id": "cmp-001",
        "company_name": "Northstar Manufacturing",
        "industry": "Manufacturing",
        "country": "US",
        "metrics": {"debt_to_equity": 2.1, "current_ratio": 0.8, "net_margin": 0.01},
        "signals": [
            {"category": "financial", "severity": "high", "confidence": 0.89, "summary": "Leverage rising and margin compression", "evidence": "Debt/Equity above 2x and consecutive quarterly losses", "impact": "Higher default probability", "recommended_action": "Request updated financials and tighten limits", "source": "internal"},
            {"category": "leadership", "severity": "medium", "confidence": 0.74, "summary": "Executive turnover", "evidence": "CFO resigned unexpectedly", "impact": "Execution risk", "recommended_action": "Review governance controls", "source": "news"},
        ],
        "last_updated": "2026-06-29",
    },
    {
        "company_id": "cmp-002",
        "company_name": "Blue Harbor Logistics",
        "industry": "Logistics",
        "country": "US",
        "metrics": {"debt_to_equity": 0.9, "current_ratio": 1.4, "net_margin": 0.05},
        "signals": [
            {"category": "regulatory", "severity": "medium", "confidence": 0.68, "summary": "Regulatory review", "evidence": "Environmental compliance investigation", "impact": "Potential fines", "recommended_action": "Monitor legal developments", "source": "regulator"},
        ],
        "last_updated": "2026-06-29",
    },
]


@router.get("/companies")
def list_companies() -> list[dict]:
    return [engine.score_company(company).model_dump() for company in sample_companies]


@router.get("/companies/{company_id}")
def get_company(company_id: str) -> dict:
    company = next((item for item in sample_companies if item["company_id"] == company_id), None)
    if company is None:
        return {"detail": "Company not found"}
    return engine.score_company(company).model_dump()
