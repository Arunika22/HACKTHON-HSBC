CREATE TABLE IF NOT EXISTS companies (
  company_id VARCHAR(64) PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(128),
  country VARCHAR(64),
  sector VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS financial_snapshots (
  snapshot_id SERIAL PRIMARY KEY,
  company_id VARCHAR(64) REFERENCES companies(company_id),
  as_of_date DATE NOT NULL,
  revenue NUMERIC(14,2),
  net_income NUMERIC(14,2),
  debt_to_equity NUMERIC(8,2),
  current_ratio NUMERIC(8,2),
  net_margin NUMERIC(8,2)
);

CREATE TABLE IF NOT EXISTS risk_signals (
  signal_id SERIAL PRIMARY KEY,
  company_id VARCHAR(64) REFERENCES companies(company_id),
  category VARCHAR(64) NOT NULL,
  severity VARCHAR(32) NOT NULL,
  confidence NUMERIC(4,3),
  summary TEXT,
  evidence TEXT,
  impact TEXT,
  recommended_action TEXT,
  source VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_scores (
  score_id SERIAL PRIMARY KEY,
  company_id VARCHAR(64) REFERENCES companies(company_id),
  as_of_date DATE NOT NULL,
  risk_score INTEGER NOT NULL,
  risk_level VARCHAR(32),
  trend VARCHAR(32),
  explanation TEXT
);

CREATE INDEX IF NOT EXISTS idx_financial_snapshots_company_date ON financial_snapshots(company_id, as_of_date);
CREATE INDEX IF NOT EXISTS idx_risk_signals_company ON risk_signals(company_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_company_date ON risk_scores(company_id, as_of_date);
