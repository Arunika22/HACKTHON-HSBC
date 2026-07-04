from backend.app.services.risk_engine import RiskEngine


def test_risk_score_is_explainable_and_bound():
    engine = RiskEngine()
    company = {
        "company_id": "cmp-001",
        "company_name": "Northstar Manufacturing",
        "industry": "Manufacturing",
        "country": "US",
        "metrics": {"debt_to_equity": 2.1, "current_ratio": 0.8, "net_margin": 0.01},
        "signals": [
            {"category": "financial", "severity": "high", "confidence": 0.89, "summary": "Leverage rising", "evidence": "test", "impact": "test", "recommended_action": "test", "source": "internal"}
        ],
        "last_updated": "2026-06-29",
    }

    result = engine.score_company(company)

    assert 0 <= result.risk_score <= 100
    assert result.risk_level in {"low", "medium", "high", "critical"}
    assert result.trend in {"increasing", "stable", "improving"}
    assert len(result.drivers) >= 1
