from backend.app.llm.llm_client import LLMClient
from backend.app.db import RiskSignal, RawDocument
from datetime import datetime

llm = LLMClient()


def extract_and_persist(session, raw_doc: RawDocument):
    # Call the LLM to extract a structured risk event from a raw article
    result = llm.extract_risk_event(raw_doc.title + '\n\n' + (raw_doc.content or ''))
    # Persist as RiskSignal
    if not result:
        return None
    signal = RiskSignal(
        company_id=result.get('company') or None,
        category=result.get('risk_category') or 'market',
        severity=result.get('severity') or 'medium',
        confidence=float(result.get('confidence_score') or 0.5),
        summary=result.get('summary') or '',
        evidence=result.get('evidence') or '',
        impact=result.get('business_impact') or '',
        recommended_action=result.get('recommended_action') or '',
        source='llm-extractor',
    )
    session.add(signal)
    session.commit()
    return signal
