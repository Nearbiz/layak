# CLAUDE.md — Layak project context

## What this project is
LAYAK is a 24-hour hackathon demo for TNG Digital FINHACK 2026. We are building a demo of a neutral income-credentials standard for Malaysia's QR economy. The demo has 6 scenes and 6 API endpoints — everything else is out of scope.

**Hero persona:** Kumar Selvarajan (`worker_kumar_001`), barber, Brickfields KL, Layak Score 720.

## Team + ownership
| Person | Module |
|--------|--------|
| Naz | `migrations/`, `backend/api/db.go`, `backend/api/main.go`, `.github/workflows/ci.yml`, deploy |
| Fikhry | `frontend/src/pages/` — all three React pages |
| Aein | `backend/score/`, `seed/workers.json`, `seed/transactions.json` |
| Fiz | `backend/api/cmd/seed/`, DB query logic in `backend/api/handlers.go` |
| Haziq | Pitch deck, demo script — no code |

## Key files
- `docs/PRD.md` — build scope, demo script, API contracts (§6), score formula (§5)
- `docs/SOURCE_OF_TRUTH.md` — pitch narrative, Q&A prep, locked phrases
- `docs/team/STATUS.md` — team-wide status board

## Stack
- **API:** Go 1.22 + Gin — `backend/api/`
- **Score service:** Python 3.12 + FastAPI — `backend/score/`
- **Frontend:** React 18 + Vite + TypeScript — `frontend/`
- **DB:** PostgreSQL 16 locally (OceanBase for production)
- **CI:** GitHub Actions — `.github/workflows/ci.yml`

## Running locally
```bash
make db-up    # start Postgres
make migrate  # apply 5 SQL migrations
make api      # Go API on :8080
make score    # FastAPI on :8001
make frontend # Vite on :5173
```

## Go module
Module path: `layak/api` — all Go source in `backend/api/` is `package main`.

## DB schema
5 tables: `workers`, `transactions`, `layak_scores`, `credentials`, `bnpl_quotes`
See `migrations/` for full DDL. Use `make migrate` to apply.

## Score formula (PRD §5)
```
raw = 0.30*consistency + 0.20*tenure + 0.20*diversity + 0.20*volume + 0.10*recency
score = 300 + round(raw * 550)
```
Kumar's target demo score is **720** (not 821 from the worked example — Aein calibrates seed data to hit 720).

## The 6 API endpoints (only these 6 — no more)
1. `GET /api/workers/:id`
2. `GET /api/market/:trade/:zone`
3. `POST /api/score/compute` (proxies to FastAPI)
4. `POST /api/bnpl/quote`
5. `POST /api/credentials/issue`
6. `GET /api/credentials/pull/:workerId`

## CI rules
- `main` must stay green. Never merge with failing CI.
- Go: `go build ./...` + `go vet ./...`
- Python: `pytest test_score.py`
- Frontend: `npm run build`
- Migrations: applied against a Postgres service container in CI

## Out of scope (do not build)
Real auth, revocation UI, multi-lender bidding, i18n, mobile responsive, real TNG SDK, admin panels.
See PRD §1.3 for full list.
