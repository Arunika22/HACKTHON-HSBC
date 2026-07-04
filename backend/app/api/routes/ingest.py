from fastapi import APIRouter, Depends
from backend.app.db import init_db, SessionLocal, RawDocument
from backend.app.ingestion.news_adapter import harvest_rss
from backend.app.ingestion.extractor import extract_and_persist

router = APIRouter(tags=['ingest'])


@router.post('/ingest/news')
def ingest_news():
    db = SessionLocal()
    try:
        docs = harvest_rss(db)
        signals = []
        for raw in docs:
            s = extract_and_persist(db, raw)
            if s:
                signals.append(s)
        return {'harvested': len(docs), 'signals': len(signals)}
    finally:
        db.close()


@router.post('/ingest/init_db')
def init_database():
    init_db()
    return {'status': 'ok'}
