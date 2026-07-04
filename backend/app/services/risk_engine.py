from __future__ import annotations

from typing import List

from backend.app.models.risk import CompanyRiskSnapshot, Recommendation, RiskSignal


class RiskEngine:
    def __init__(self) -> None:
        self.weights = {
            "financial_health": 0.25,
            "liquidity": 0.15,
            "debt": 0.15,
            "profitability": 0.10,
            "market_news": 0.10,
            "operational_incidents": 0.10,
            "leadership_risk": 0.05,
            "legal_risk": 0.05,
            "regulatory_risk": 0.03,
            "cyber_risk": 0.02,
        }

    def score_company(self, company: dict) -> CompanyRiskSnapshot:
        base_score = self._compute_score(company)
        risk_level = self._risk_level(base_score)
        trend = self._trend(base_score)
        drivers = self._drivers(company)
        signals = self._build_signals(company)
        recommendations = self._build_recommendations(company)
        return CompanyRiskSnapshot(
            company_id=company["company_id"],
            company_name=company["company_name"],
            risk_score=base_score,
            risk_level=risk_level,
            trend=trend,
            drivers=drivers,
            signals=signals,
            last_updated=company.get("last_updated", "2026-06-29"),
        )

    def _compute_score(self, company: dict) -> int:
        metrics = company.get("metrics", {})
        signals = company.get("signals", [])

        score = 0
        score += int(metrics.get("debt_to_equity", 0) / 2)
        score += int(metrics.get("current_ratio", 1) * 8)
        score += int(metrics.get("net_margin", 0) * -1)
        score += len([s for s in signals if s.get("severity") == "high"]) * 15
        score += len([s for s in signals if s.get("severity") == "medium"]) * 8
        score += len([s for s in signals if s.get("severity") == "low"]) * 4

        if company.get("industry") == "Energy":
            score += 5
        if company.get("country") == "US":
            score += 2

        return min(100, max(0, score))

    def _risk_level(self, score: int) -> str:
        if score >= 75:
            return "critical"
        if score >= 50:
            return "high"
        if score >= 25:
            return "medium"
        return "low"

    def _trend(self, score: int) -> str:
        if score >= 75:
            return "increasing"
        if score >= 40:
            return "stable"
        return "improving"

    def _drivers(self, company: dict) -> List[str]:
        drivers = []
        metrics = company.get("metrics", {})
        if metrics.get("debt_to_equity", 0) > 1.5:
            drivers.append("High leverage")
        if metrics.get("current_ratio", 1) < 1.0:
            drivers.append("Liquidity pressure")
        if metrics.get("net_margin", 0) < 0.02:
            drivers.append("Margin compression")
        for signal in company.get("signals", []):
            drivers.append(signal.get("category", "market"))
        return list(dict.fromkeys(drivers))

    def _build_signals(self, company: dict) -> List[RiskSignal]:
        signals = []
        for signal in company.get("signals", []):
            signals.append(
                RiskSignal(
                    category=signal.get("category", "market"),
                    severity=signal.get("severity", "medium"),
                    confidence=signal.get("confidence", 0.7),
                    summary=signal.get("summary", "Potential risk event"),
                    evidence=signal.get("evidence", "No evidence provided"),
                    impact=signal.get("impact", "Monitor closely"),
                    recommended_action=signal.get("recommended_action", "Review exposure"),
                    source=signal.get("source", "internal"),
                    company_id=company["company_id"],
                )
            )
        return signals

    def _build_recommendations(self, company: dict) -> List[Recommendation]:
        return [
            Recommendation(
                company_id=company["company_id"],
                title="Increase monitoring cadence",
                rationale="The company shows elevated distress signals and merits closer review.",
                priority="high" if self._risk_level(self._compute_score(company)) in {"high", "critical"} else "medium",
                due_in_days=7,
            )
        ]
