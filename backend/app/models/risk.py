from typing import List, Optional
from pydantic import BaseModel, Field


class RiskSignal(BaseModel):
    category: str = Field(..., description="Risk category")
    severity: str = Field(..., description="Severity label")
    confidence: float = Field(..., ge=0.0, le=1.0)
    summary: str
    evidence: str
    impact: str
    recommended_action: str
    source: str
    company_id: str


class CompanyRiskSnapshot(BaseModel):
    company_id: str
    company_name: str
    risk_score: int
    risk_level: str
    trend: str
    drivers: List[str]
    signals: List[RiskSignal]
    last_updated: str


class Recommendation(BaseModel):
    company_id: str
    title: str
    rationale: str
    priority: str
    due_in_days: int
