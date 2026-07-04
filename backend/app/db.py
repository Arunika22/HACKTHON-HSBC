from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    DateTime,
    Numeric,
    Float,
)
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine
import os
from datetime import datetime

DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///./dev.db')

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith('sqlite') else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Company(Base):
    __tablename__ = 'companies'
    company_id = Column(String(64), primary_key=True)
    company_name = Column(String(255), nullable=False)
    industry = Column(String(128))
    country = Column(String(64))
    sector = Column(String(128))
    created_at = Column(DateTime, default=datetime.utcnow)


class FinancialSnapshot(Base):
    __tablename__ = 'financial_snapshots'
    snapshot_id = Column(Integer, primary_key=True)
    company_id = Column(String(64))
    as_of_date = Column(Date)
    revenue = Column(Numeric(14, 2))
    net_income = Column(Numeric(14, 2))
    debt_to_equity = Column(Numeric(8, 2))
    current_ratio = Column(Numeric(8, 2))
    net_margin = Column(Numeric(8, 2))


class RawDocument(Base):
    __tablename__ = 'raw_documents'
    id = Column(Integer, primary_key=True)
    source = Column(String(128))
    url = Column(String(1024))
    title = Column(String(1024))
    fetched_at = Column(DateTime, default=datetime.utcnow)
    content = Column(Text)


class RiskSignal(Base):
    __tablename__ = 'risk_signals'
    signal_id = Column(Integer, primary_key=True)
    company_id = Column(String(64))
    category = Column(String(64))
    severity = Column(String(32))
    confidence = Column(Float)
    summary = Column(Text)
    evidence = Column(Text)
    impact = Column(Text)
    recommended_action = Column(Text)
    source = Column(String(64))
    created_at = Column(DateTime, default=datetime.utcnow)


class RiskScore(Base):
    __tablename__ = 'risk_scores'
    score_id = Column(Integer, primary_key=True)
    company_id = Column(String(64))
    as_of_date = Column(Date)
    risk_score = Column(Integer)
    risk_level = Column(String(32))
    trend = Column(String(32))
    explanation = Column(Text)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
