import yfinance as yf
from datetime import datetime
from backend.app.db import FinancialSnapshot


def fetch_ticker_financials(session, ticker: str, company_id: str = None):
    # uses yfinance as a free demo source for listed companies
    t = yf.Ticker(ticker)
    info = t.info
    # safe access
    try:
        bs = t.quarterly_balance_sheet
    except Exception:
        bs = None

    snapshot = FinancialSnapshot(
        company_id=company_id or ticker,
        as_of_date=datetime.utcnow().date(),
        revenue=info.get('totalRevenue'),
        net_income=info.get('netIncomeToCommon'),
        debt_to_equity=info.get('debtToEquity'),
        current_ratio=None,
        net_margin=None,
    )
    session.add(snapshot)
    session.commit()
    return snapshot
