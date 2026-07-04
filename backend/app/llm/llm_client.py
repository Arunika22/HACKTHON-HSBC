import os
import re

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')


class LLMClient:
    def __init__(self):
        self.provider = 'openai' if OPENAI_API_KEY else 'mock'
        if self.provider == 'openai':
            try:
                import openai
                openai.api_key = OPENAI_API_KEY
                self.openai = openai
            except Exception:
                self.provider = 'mock'

    def extract_risk_event(self, article_text: str) -> dict:
        """
        If OpenAI key is configured, call OpenAI Completion (simple). Otherwise use a rule-based fallback to demonstrate extraction.
        """
        if self.provider == 'openai':
            try:
                prompt = f"Extract risk info as JSON: {article_text[:2500]}"
                resp = self.openai.ChatCompletion.create(
                    model='gpt-4o-mini',
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=300,
                )
                txt = resp.choices[0].message.content
                # naive: extract JSON from response
                m = re.search(r"\{.*\}", txt, re.S)
                if m:
                    import json
                    return json.loads(m.group(0))
            except Exception:
                pass
        # Mock rule-based extraction
        text = article_text.lower()
        severity = 'low'
        confidence = 0.5
        if any(k in text for k in ['bankrupt', 'bankruptcy', 'insolv', 'default']):
            severity = 'critical'
            confidence = 0.9
        elif any(k in text for k in ['investigation', 'regulator', 'fine', 'probe', 'compliance']):
            severity = 'high'
            confidence = 0.8
        elif any(k in text for k in ['resign', 'appointed', 'turnover', 'ceo', 'cfo']):
            severity = 'medium'
            confidence = 0.7

        # company heuristics: attempt to find a capitalized name (very naive)
        company = None
        m = re.search(r"([A-Z][a-z]+\s(?:Corporation|Inc|Ltd|LLC|Manufacturing|Logistics|Energy|Pharmaceuticals|Pharma|Group))", article_text)
        if m:
            company = m.group(1)

        return {
            'summary': article_text[:300],
            'company': company,
            'geography': None,
            'risk_category': 'financial' if severity in ('critical', 'high') else 'operational',
            'severity': severity,
            'confidence_score': confidence,
            'business_impact': 'Unknown',
            'recommended_action': 'Investigate and request further documents',
            'evidence': article_text[:800],
        }
