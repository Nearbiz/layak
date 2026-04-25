# Aein — Data · Score Service

**Role:** Generate the seed dataset (workers.json + transactions.json) and build the FastAPI score service.

> The demo dataset is the secret weapon. If the dataset is good, every screen looks real.

---

## Module Ownership

| Module | Description |
|--------|-------------|
| `seed/workers.json` | 50 workers across trades + zones (YOU generate this) |
| `seed/transactions.json` | 6-month transaction history, 8–25 txns/week per worker (YOU generate this) |
| `backend/score/score.py` | Pure score computation logic (5 signals, weighted) |
| `backend/score/main.py` | FastAPI app — `POST /score/compute` endpoint |
| `backend/score/test_score.py` | Pytest tests — must pass in CI |

---

## Task Tracker

| Task | Status | Hour | Notes |
|------|--------|------|-------|
| Understand seed spec (PRD §4.2) | ✅ Done | H0 | |
| Design workers.json schema | ⬜ Todo | H1 | Match `workers` table columns exactly |
| Generate 50 workers (30 barbers, 12 kuih, 8 mechanics) | ⬜ Todo | H1–H2 | Kumar + Siti as heroes |
| Generate 6-month transactions per worker | ⬜ Todo | H1–H2 | Realistic clustering required |
| Validate: Kumar's 6mo earnings produce score ≈720 | ⬜ Todo | H2 | Critical — demo shows 720 |
| Implement `score.py` — 5 signals + weighted formula | ⬜ Todo | H2–H4 | PRD §5 is the spec |
| Implement `main.py` — FastAPI `POST /score/compute` | ⬜ Todo | H4–H6 | Returns full driver breakdown |
| Write `test_score.py` — Kumar's worked example test | ⬜ Todo | H4–H6 | Must pass in CI |
| H6 checkpoint: score service returns 720 for Kumar | ⬜ Todo | H6 | Naz confirms DB + score work E2E |
| Score service caches result to `layak_scores` table | ⬜ Todo | H6–H12 | DB write after compute |
| `GET /api/market/:trade/:zone` data is realistic | ⬜ Todo | H6–H12 | Depends on seed quality |

---

## Seed data spec (PRD §4.2)

### workers.json format
```json
[
  {
    "worker_id": "worker_kumar_001",
    "full_name": "Kumar Selvarajan",
    "trade": "barber_services",
    "zone": "brickfields_kl",
    "tng_account_ref": "tng_kumar_001",
    "joined_at": "2024-10-01T00:00:00Z",
    "status": "active"
  }
]
```

### transactions.json format
```json
[
  {
    "txn_id": "txn_kumar_001_0001",
    "worker_id": "worker_kumar_001",
    "amount_myr": 25.00,
    "counterparty_id": "cust_0042",
    "channel": "tng_qr",
    "occurred_at": "2025-10-03T09:15:00Z"
  }
]
```

### Distribution requirements
| Trade | Count | Zones |
|-------|-------|-------|
| barber_services | 30 | brickfields_kl, chow_kit_kl, setapak_kl |
| kuih_seller | 12 | cheras_kl, ampang_kl, wangsa_maju_kl |
| mobile_mechanic | 8 | kepong_kl, setapak_kl, cheras_kl |

### Kumar's target numbers
Kumar's seed data must produce **score ≈ 720** (not 821 from the worked example — the 720 is the demo target).

Use these approximate values:
- Monthly earnings: ~[3800, 3950, 4100, 4050, 3900, 4200] (slightly lower variance than worked example)
- ~55 unique counterparties over 6 months
- ~22 transactions last 30 days
- Tenure: 18 months (joined_at ~18 months ago)

---

## Score formula (PRD §5)

```python
import math

def compute_score(monthly_earnings, tenure_months, unique_counterparties,
                  earnings_6mo_avg, txns_last_30d):
    mean = sum(monthly_earnings) / len(monthly_earnings)
    std = (sum((x - mean)**2 for x in monthly_earnings) / len(monthly_earnings)) ** 0.5

    consistency = max(0, 1 - (std / mean)) if mean > 0 else 0
    tenure      = math.log(tenure_months + 1) / math.log(24)
    diversity   = min(1.0, unique_counterparties / 30)
    volume      = min(1.0, earnings_6mo_avg / 30000)
    recency     = min(1.0, txns_last_30d / 28)

    raw = (0.30 * consistency + 0.20 * tenure + 0.20 * diversity
           + 0.20 * volume + 0.10 * recency)

    score = 300 + round(raw * 550)

    if score >= 740:   tier = "excellent"
    elif score >= 670: tier = "good"
    elif score >= 580: tier = "fair"
    else:              tier = "building"

    return score, tier
```

---

## Status Updates

### H0
- Seed spec understood from PRD §4.2
- Score formula understood from PRD §5
- Starting workers.json design — will match `workers` table columns exactly
- Need Naz to confirm DB is up before Fiz can ingest
