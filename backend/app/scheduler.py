from apscheduler.schedulers.background import BackgroundScheduler
from backend.app.db import SessionLocal
from backend.app.ingestion.news_adapter import harvest_rss
from backend.app.ingestion.extractor import extract_and_persist

scheduler = BackgroundScheduler()


def run_harvest():
    db = SessionLocal()
    try:
        docs = harvest_rss(db)
        for raw in docs:
            extract_and_persist(db, raw)
    finally:
        db.close()


def start_scheduler():
    # run every 10 minutes
    scheduler.add_job(run_harvest, 'interval', minutes=10, id='harvest_job', replace_existing=True)
    scheduler.start()


def shutdown_scheduler():
    scheduler.shutdown()
