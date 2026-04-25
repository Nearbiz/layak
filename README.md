# LAYAK

> The neutral income-credentials standard for Malaysia's QR economy.
> TNG Digital FINHACK 2026 · Team FinNIX · Financial Inclusion Track

---

## Quick start (local)

```bash
# 1. Prerequisites: Docker Desktop, Go 1.22, Node 20, Python 3.12

# 2. Clone and configure
cp .env.example .env

# 3. Start Postgres
make db-up

# 4. Run migrations
make migrate

# 5. Start all three services (3 terminals)
make api        # Go API      → http://localhost:8080
make score      # FastAPI     → http://localhost:8001
make frontend   # Vite dev    → http://localhost:5173
```

Or run everything via Docker:
```bash
docker compose up --build
```

### Demo URLs
| View | URL |
|------|-----|
| Worker (Kumar) | http://localhost:5173/worker/worker_kumar_001 |
| Lender Portal | http://localhost:5173/lender |
| TNG Dashboard | http://localhost:5173/tng |

---

## Architecture

```
React (Vite) ──► Go API :8080 ──► PostgreSQL :5432
                      │
                      └──► FastAPI score :8001
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full diagram and stack decisions.

---

## Repository layout

```
layak/
├── backend/api/        Go API — 6 endpoints
├── backend/score/      FastAPI score service
├── frontend/           React + Vite + TypeScript
├── migrations/         5 SQL migration files
├── seed/               Seed data (Aein generates, Fiz ingests)
├── docs/               PRD, architecture, API contracts, team files
└── .github/workflows/  CI pipeline
```

---

## Team

| Person | Role | Module |
|--------|------|--------|
| **Naz** | DB · Deploy · CI | Migrations, Go infra, GitHub Actions |
| **Haziq** | Pitch · Q&A | Pitch deck, demo script, submission |
| **Fikhry** | Frontend | React pages: Worker, Lender, TNG |
| **Aein** | Data · Score | Seed data, FastAPI score formula |
| **Fiz** | Data ingestion | Seed-to-DB pipeline, Go queries |

See [docs/team/STATUS.md](docs/team/STATUS.md) for live task tracking.

---

## CI

GitHub Actions runs on every push to `main` and `develop`:
- **migrate** — applies all 5 SQL migrations against a Postgres service container
- **go-api** — `go build ./...` + `go vet ./...`
- **score-service** — `pytest test_score.py`
- **frontend** — `npm run build`

---

## Deploy URL

> TBD — Naz deploys at H18–H20 (Fly.io or Railway)

---

## Docs

- [PRD](docs/PRD.md) — full build scope, demo script, API contracts
- [Source of Truth](docs/SOURCE_OF_TRUTH.md) — pitch narrative, Q&A prep, locked phrases
- [Architecture](docs/ARCHITECTURE.md) — stack decisions, service topology
- [Team Status](docs/team/STATUS.md) — live task board
