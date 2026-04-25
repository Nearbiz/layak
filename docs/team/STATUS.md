# Team FinNIX — Live Status Board

> Update your row every 2 hours. Mark tasks complete in your own file.
> **Rule:** If demo doesn't match pitch at H6 checkpoint — cut demo scope, not pitch scope.

---

## Team + Module Ownership

| Person | Role | Primary module | File |
|--------|------|----------------|------|
| **Naz** | DB · Deploy · CI | Migrations, Postgres, GitHub Actions, Fly.io | [naz.md](./naz.md) |
| **Haziq** | Pitch · Q&A · PM | Pitch deck, demo script, submission packet | [haziq.md](./haziq.md) |
| **Fikhry** | Frontend UI | React pages: `/worker`, `/lender`, `/tng` | [fikhry.md](./fikhry.md) |
| **Aein** | Data · Score | Seed data generation, FastAPI score service | [aein.md](./aein.md) |
| **Fiz** | Data ingestion | Seed-to-DB pipeline, Go handler integration | [fiz.md](./fiz.md) |

---

## H6 Checkpoint (15-min stop — everyone)

- [ ] Haziq reads pitch out loud
- [ ] All 6 demo moments identified and assigned
- [x] DB is queryable end-to-end (Naz confirms)
- [ ] Seed data loaded cleanly (Fiz confirms)
- [ ] Score service returns data for Kumar (Aein confirms)
- [x] At least 3 frontend pages render without errors (Fikhry confirms)

---

## Hourly Status Snapshot

> Each person updates their row when something changes.

| Person | Last update | Current task | Blocker? |
|--------|-------------|--------------|----------|
| Naz | H1 | CI green, all 6 endpoints + JWT signing done | — |
| Haziq | H0 | Source of truth locked | — |
| Fikhry | H1 | All 3 pages done and wired to API | — |
| Aein | H2 | All done — seed JSON committed, score service live, tests pass | ⏳ waiting for Fiz to run `make seed` → then H6 checkpoint |
| Fiz | H1 | Seed ingestion script done | ⚠️ JSON files now in repo — run `make seed` to unblock |

---

## Module Status

| Module | Owner | Status | Notes |
|--------|-------|--------|-------|
| Postgres + migrations | Naz | ✅ Done | 5 tables, applied in CI |
| CI pipeline | Naz | ✅ Done | Go + Python + Frontend all green |
| Go API — all 6 endpoints | Naz/Fiz | ✅ Done | handlers.go complete |
| Credential signing (JWT) | Naz | ✅ Done | HMAC-SHA256 JWT in handlers.go |
| Seed data (workers.json) | Aein | ✅ Done | 50 workers committed to seed/workers.json |
| Seed data (transactions.json) | Aein | ✅ Done | 32k txns committed to seed/transactions.json |
| Seed ingestion to DB | Fiz | ⏳ Ready to run | cmd/seed/main.go ready — JSON files available, run `make seed` |
| FastAPI score service | Aein | ✅ Done | POST /score/compute, caches to layak_scores |
| Score formula implementation | Aein | ✅ Done | Kumar ~729 "excellent", all pytest pass |
| Worker App UI (`/worker`) | Fikhry | ✅ Done | WorkerApp.tsx wired to all API calls |
| Lender Portal UI (`/lender`) | Fikhry | ✅ Done | LenderPortal.tsx, issues + pulls credential |
| TNG Dashboard UI (`/tng`) | Fikhry | ✅ Done | TngDashboard.tsx with heatmap + trade rankings |
| Deploy to Fly.io | Naz | ⬜ Scheduled H18–H20 | docker-compose + Dockerfiles ready |
| Pitch deck (7 slides) | Haziq | 🔄 In progress | |
| Demo video recording | Haziq | ⬜ Scheduled H21 | |
| Submission packet | Haziq | ⬜ Scheduled H22 | |

---

## Completed Modules

> Move items here when fully done and verified.

- [x] Source of Truth document locked (Haziq, H0)
- [x] PRD finalized (Haziq, H0)
- [x] Monorepo scaffold (Naz, H0–H1)
- [x] SQL migrations for 5 tables (Naz, H0–H1)
- [x] Go API — all 6 endpoints + JWT credential signing (Naz, H1)
- [x] CI pipeline — Go + Python + Frontend green (Naz, H1)
- [x] FastAPI score service + formula + tests (Aein, H2)
- [x] Seed data — 50 workers + 32k transactions committed (Aein, H2)
- [x] All 3 frontend pages wired to API (Fikhry, H1)
- [x] Seed ingestion script (Fiz, H1)

---

## Blockers / Escalations

> Add here immediately. Tag the person who can unblock.

| Blocker | Raised by | Needs | Status |
|---------|-----------|-------|--------|
| `seed/workers.json` + `seed/transactions.json` not in repo — only generators exist | Naz | **Aein** to run generator and commit the JSON files | ✅ Resolved — files committed (Aein, H2) |
| Run `make seed` to load DB | Naz | **Fiz** to run — JSON files now available | 🔴 Active |
