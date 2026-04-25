import os
from datetime import datetime, timezone
from typing import Optional

import psycopg2
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from score import ScoreInput, compute_score

app = FastAPI(title="Layak Score Service", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

DATABASE_URL = os.getenv("DATABASE_URL", "postgres://layak:layak@localhost:5432/layak")


def get_db():
    return psycopg2.connect(DATABASE_URL)


class ComputeRequest(BaseModel):
    worker_id: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/score/compute")
def compute(req: ComputeRequest):
    conn = get_db()
    try:
        cur = conn.cursor()

        # Check worker exists
        cur.execute("SELECT joined_at FROM workers WHERE worker_id = %s", (req.worker_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="worker not found")
        joined_at = row[0]

        # Monthly earnings (last 6 months)
        cur.execute("""
            SELECT DATE_TRUNC('month', occurred_at) AS month, SUM(amount_myr) AS total
            FROM transactions
            WHERE worker_id = %s
              AND occurred_at >= NOW() - INTERVAL '6 months'
            GROUP BY 1 ORDER BY 1
        """, (req.worker_id,))
        monthly_rows = cur.fetchall()
        monthly_earnings = [float(r[1]) for r in monthly_rows]
        if not monthly_earnings:
            monthly_earnings = [0.0]

        earnings_6mo_avg = sum(monthly_earnings) / len(monthly_earnings)

        # Unique counterparties (last 6 months)
        cur.execute("""
            SELECT COUNT(DISTINCT counterparty_id)
            FROM transactions
            WHERE worker_id = %s
              AND occurred_at >= NOW() - INTERVAL '6 months'
        """, (req.worker_id,))
        unique_counterparties = cur.fetchone()[0] or 0

        # Transactions last 30 days
        cur.execute("""
            SELECT COUNT(*) FROM transactions
            WHERE worker_id = %s AND occurred_at >= NOW() - INTERVAL '30 days'
        """, (req.worker_id,))
        txns_last_30d = cur.fetchone()[0] or 0

        # Tenure in months
        now = datetime.now(timezone.utc)
        if joined_at.tzinfo is None:
            joined_at = joined_at.replace(tzinfo=timezone.utc)
        tenure_months = max(1, int((now - joined_at).days / 30))

        inp = ScoreInput(
            monthly_earnings=monthly_earnings,
            tenure_months=tenure_months,
            unique_counterparties=unique_counterparties,
            earnings_6mo_avg=earnings_6mo_avg,
            txns_last_30d=txns_last_30d,
        )
        result = compute_score(inp)

        # Cache result to layak_scores
        drivers_json = {
            k: {"value": v.value, "weight": v.weight, "contribution": v.contribution}
            for k, v in result.drivers.items()
        }
        import json
        cur.execute("""
            INSERT INTO layak_scores (worker_id, score, tier, drivers, computed_at)
            VALUES (%s, %s, %s, %s, NOW())
            ON CONFLICT (worker_id)
            DO UPDATE SET score=EXCLUDED.score, tier=EXCLUDED.tier,
                          drivers=EXCLUDED.drivers, computed_at=EXCLUDED.computed_at
        """, (req.worker_id, result.score, result.tier, json.dumps(drivers_json)))
        conn.commit()

        return {
            "score": result.score,
            "tier": result.tier,
            "drivers": drivers_json,
            "computed_at": datetime.now(timezone.utc).isoformat(),
        }
    finally:
        conn.close()
