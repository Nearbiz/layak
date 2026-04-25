# Fiz — Data Ingestion

**Role:** Ingest Aein's seed JSON files into Postgres, wire up Go handler logic to query real data.

---

## Module Ownership

| Module | Description |
|--------|-------------|
| `backend/api/cmd/seed/main.go` | Seed ingestion script (reads seed JSON → inserts to DB) |
| `backend/api/db.go` | SQL queries powering all 6 API handlers |
| Go handler logic | Replace mock JSON stubs with real DB queries (coordinate with Naz) |

**Dependency:** Needs `seed/workers.json` and `seed/transactions.json` from Aein before ingestion can start.

---

## Task Tracker

| Task | Status | Hour | Notes |
|------|--------|------|-------|
| Understand DB schema (5 tables in `migrations/`) | ⬜ Todo | H0–H1 | Read migrations/ directory |
| Review seed JSON format with Aein | ⬜ Todo | H1–H2 | Agree on schema before Aein generates |
| Write seed ingestion script (`cmd/seed/main.go`) | ⬜ Todo | H2–H4 | Reads JSON → bulk INSERT into workers + transactions |
| Run seed: `make seed` produces 50 workers in DB | ⬜ Todo | H4 | Requires Aein's JSON + Naz's DB up |
| Verify Kumar is in DB and has 6mo of transactions | ⬜ Todo | H4 | `psql` query to confirm |
| Wire `GET /api/workers/:id` to real DB query | ⬜ Todo | H4–H6 | Replace mock JSON in handler |
| Wire `GET /api/market/:trade/:zone` to real query | ⬜ Todo | H6–H9 | Aggregate query on transactions table |
| Wire `POST /api/score/compute` proxy to FastAPI | ⬜ Todo | H6–H9 | Coordinate with Aein's score service |
| Wire `POST /api/bnpl/quote` to asset catalog + DB | ⬜ Todo | H9–H12 | |
| H6 checkpoint: Kumar's data queryable end-to-end | ⬜ Todo | H6 | Confirm with Naz |
| All 6 endpoints return real data | ⬜ Todo | H12–H15 | |

---

## Seed ingestion plan

```go
// cmd/seed/main.go
// Reads seed/workers.json and seed/transactions.json
// Bulk-inserts into workers and transactions tables
// Usage: go run ./cmd/seed/main.go

package main

import (
    "database/sql"
    "encoding/json"
    "log"
    "os"
    _ "github.com/lib/pq"
)

func main() {
    db := mustConnect()
    defer db.Close()

    ingestWorkers(db, "../../seed/workers.json")
    ingestTransactions(db, "../../seed/transactions.json")
    log.Println("Seed complete.")
}
```

---

## Key queries to implement (in `db.go`)

### GetWorker (joins layak_scores)
```sql
SELECT w.worker_id, w.full_name, w.trade, w.zone, w.joined_at,
       s.score, s.tier, s.drivers
FROM workers w
LEFT JOIN layak_scores s ON s.worker_id = w.worker_id
WHERE w.worker_id = $1
```

### GetMarket (aggregate on transactions)
```sql
SELECT
    COUNT(DISTINCT t.worker_id) AS n_workers,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY monthly_avg) AS avg_monthly_myr,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY monthly_avg) AS p25_monthly_myr,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY monthly_avg) AS p75_monthly_myr
FROM (
    SELECT worker_id,
           SUM(amount_myr) / 6.0 AS monthly_avg
    FROM transactions
    WHERE occurred_at >= NOW() - INTERVAL '6 months'
    GROUP BY worker_id
) sub
JOIN workers w ON w.worker_id = sub.worker_id
WHERE w.trade = $1 AND w.zone = $2
```

---

## Status Updates

### H0–H1
- Reviewed DB schema in `migrations/`
- Waiting for Aein to finalize seed JSON format (coordinate at H1)
- Will start ingestion script as soon as format agreed
