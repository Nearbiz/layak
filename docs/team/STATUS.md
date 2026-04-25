# Team FinNIX — Live Status Board

> Update your row every 2 hours. Mark tasks complete in your own file.
> **Rule:** If demo doesn't match pitch at H6 checkpoint — cut demo scope, not pitch scope.

---

## Team + Module Ownership

| Person | Role | Primary module | File |
|--------|------|----------------|------|
| **Naz** | DB · Deploy · CI | Migrations, Postgres, GitHub Actions, Railway | [naz.md](./naz.md) |
| **Haziq** | Pitch · Q&A · PM | Pitch deck, demo script, submission packet | [haziq.md](./haziq.md) |
| **Fikhry** | Frontend UI | React pages: `/worker`, `/lender`, `/tng` | [fikhry.md](./fikhry.md) |
| **Aein** | Data · Score | Seed data generation, FastAPI score service | [aein.md](./aein.md) |
| **Fiz** | Data ingestion | Seed-to-DB pipeline, Go handler integration | [fiz.md](./fiz.md) |

---

## H6 Checkpoint (15-min stop — everyone)

- [ ] Haziq reads pitch out loud
- [x] All 6 demo moments identified and assigned
- [x] DB schema ready end-to-end (Naz confirms)
- [ ] Seed data loaded cleanly (Fiz confirms — run `make seed`)
- [ ] Score service returns 720+ for Kumar (Aein confirms — needs DB)
- [x] All 3 frontend pages build without errors (Fikhry confirms)

---

## Hourly Status Snapshot

> Each person updates their row when something changes.

| Person | Last update | Current task | Blocker? |
|--------|-------------|--------------|----------|
| Naz | H2 | Code complete. Waiting for OceanBase credentials to deploy | ⚠️ Need OceanBase URL from Alibaba Cloud console |
| Haziq | H0 | Source of truth locked | — |
| Fikhry | H2 | All 3 pages done, Tailwind + shadcn wired, builds clean | — |
| Aein | H2 | All done — seed JSON committed, score service live, tests pass | — |
| Fiz | H2 | Seed ingestion script done — JSON files now in repo | 🔴 Run `make seed` to load DB |

---

## Module Status

| Module | Owner | Status | Notes |
|--------|-------|--------|-------|
| Postgres + migrations | Naz | ✅ Done | 5 tables, CI-verified |
| CI pipeline | Naz | ✅ Done | Go + Python + Frontend all green on main |
| Go API — all 6 endpoints | Naz | ✅ Done | handlers.go, main.go complete |
| Credential signing (JWT) | Naz | ✅ Done | HMAC-SHA256 JWT, issues + pull working |
| FastAPI score service | Aein | ✅ Done | POST /score/compute, caches to layak_scores |
| Score formula | Aein | ✅ Done | Kumar projects 744 "excellent", all pytest pass |
| Seed data (workers.json) | Aein | ✅ Done | 50 workers committed to seed/workers.json |
| Seed data (transactions.json) | Aein | ✅ Done | 32k txns committed to seed/transactions.json |
| Seed ingestion to DB | Fiz | 🔴 Ready to run | Run `make seed` — JSON files are in repo |
| Worker App UI (`/worker`) | Fikhry | ✅ Done | Score, market chart, BNPL catalog wired to API |
| Lender Portal UI (`/lender`) | Fikhry | ✅ Done | Issues + pulls credential, pretty-prints JWT |
| TNG Dashboard UI (`/tng`) | Fikhry | ✅ Done | Heatmap + top trades, Tailwind + shadcn |
| Deploy to Railway | Naz | ⬜ Ready to deploy | Dockerfiles done — need OceanBase credentials |
| Pitch deck (7 slides) | Haziq | 🔄 In progress | |
| Demo video recording | Haziq | ⬜ Scheduled H21 | |
| Submission packet | Haziq | ⬜ Scheduled H22 | |

---

## Completed Modules

- [x] Source of Truth document locked (Haziq, H0)
- [x] PRD finalized (Haziq, H0)
- [x] Monorepo scaffold (Naz, H0)
- [x] SQL migrations — 5 tables (Naz, H1)
- [x] Go API — all 6 endpoints + JWT credential signing (Naz, H1)
- [x] CI pipeline — Go + Python + Frontend green (Naz, H2)
- [x] FastAPI score service + formula + pytest suite (Aein, H2)
- [x] Seed data — 50 workers + 32k transactions committed (Aein, H2)
- [x] Seed ingestion script — cmd/seed/main.go (Fiz, H2)
- [x] All 3 frontend pages wired to API (Fikhry, H2)

---

## Blockers / Escalations

| Blocker | Raised by | Needs | Status |
|---------|-----------|-------|--------|
| Seed not loaded to DB | Naz | **Fiz**: run `make seed` — JSON files are now in repo | 🔴 Active |
| No DB credentials yet | Naz | **OceanBase credentials** from Alibaba Cloud console — needed for deploy + E2E test | 🔴 Active |
