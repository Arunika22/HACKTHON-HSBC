# Architecture Overview

## Component layers
- Ingestion: collects financial and news data
- Processing: normalizes, enriches, and extracts signals
- Risk Engine: computes explainable scores and alerts
- Presentation: API and dashboard for executives

## Runtime flow
1. Collect company metadata and financial snapshots
2. Ingest news and public documents
3. Run NLP and LLM-based extraction
4. Aggregate signals into risk events
5. Score companies and produce recommendations
6. Serve results through REST APIs and the dashboard

## Scaling considerations
- Use Celery for background ingestion jobs
- Use Redis for caching and distributed task state
- Use PostgreSQL for transactional storage
- Use a model abstraction layer so Gemini, Bedrock, or OpenAI can be swapped
