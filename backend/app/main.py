from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.companies import router as companies_router
from backend.app.api.routes.alerts import router as alerts_router
from backend.app.api.routes.ingest import router as ingest_router
from backend.app.scheduler import start_scheduler
from backend.app.db import init_db

app = FastAPI(
    title="Early Warning System API",
    version="0.1.0",
    description="Enterprise-ready early warning system for wholesale credit monitoring",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(companies_router, prefix="/api/v1")
app.include_router(alerts_router, prefix="/api/v1")
app.include_router(ingest_router, prefix="/api/v1")


@app.on_event("startup")
def on_startup():
    # ensure DB exists and start periodic ingestion
    init_db()
    try:
        start_scheduler()
    except Exception:
        pass


@app.get("/")
def root() -> dict:
    return {"message": "Early Warning System API is running", "status": "ok"}
