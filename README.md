# Early Warning System for Wholesale Credit Risk Assessment

This workspace contains an initial production-style scaffold for an AI-powered early warning system designed for wholesale credit risk monitoring.

## Included in this first module
- FastAPI backend with health, company, and alert endpoints
- Explainable risk scoring engine
- Sample company risk data for demo and testing
- Executive dashboard frontend shell
- Database schema, prompt template, deployment files, and tests

## Architecture summary
- Backend: FastAPI, Pydantic, Python
- Frontend: React + Vite
- Data: PostgreSQL schema included
- ML and LLM: modular prompt and scoring services ready for extension

## Next module
The next step will add real ingestion adapters for news and financial data, plus LLM-based event extraction and persistence.
