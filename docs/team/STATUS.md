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
- [ ] DB is queryable end-to-end (Naz confirms)
- [ ] Seed data loaded cleanly (Fiz confirms)
- [ ] Score service returns data for Kumar (Aein confirms)
- [ ] At least 3 frontend pages render without errors (Fikhry confirms)

---

## Hourly Status Snapshot

> Each person updates their row when something changes.

| Person | Last update | Current task | Blocker? |
|--------|-------------|--------------|----------|
| Naz | H0 | Monorepo scaffold + migrations | — |
| Haziq | H0 | Source of truth locked | — |
| Fikhry | H0 | Waiting for API stubs | — |
| Aein | H0 | Planning seed data structure | — |
| Fiz | H0 | Waiting for DB + seed spec | — |

---

## Module Status

| Module | Owner | Status | Notes |
|--------|-------|--------|-------|
| Postgres + migrations | Naz | ✅ Done | 5 tables applied locally |
| CI pipeline | Naz | 🔄 In progress | |
| Go API skeleton | Naz/Fiz | 🔄 In progress | |
| Seed data (workers.json) | Aein | ⬜ Not started | |
| Seed data (transactions.json) | Aein | ⬜ Not started | |
| Seed ingestion to DB | Fiz | ⬜ Waiting for seed files | |
| FastAPI score service | Aein | ⬜ Not started | |
| Score formula implementation | Aein | ⬜ Not started | |
| Worker App UI (`/worker`) | Fikhry | ⬜ Waiting for API stubs | |
| Lender Portal UI (`/lender`) | Fikhry | ⬜ Waiting for API stubs | |
| TNG Dashboard UI (`/tng`) | Fikhry | ⬜ Waiting for API stubs | |
| Credential signing (JWT) | Naz | ⬜ Not started | |
| Deploy to Fly.io | Naz | ⬜ Scheduled H18–H20 | |
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

---

## Blockers / Escalations

> Add here immediately. Tag the person who can unblock.

| Blocker | Raised by | Needs | Status |
|---------|-----------|-------|--------|
| — | — | — | — |
