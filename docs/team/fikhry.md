# Fikhry — Frontend UI

**Role:** All three React pages, demo narration during the pitch, component polish for the 4-minute demo flow.

---

## Module Ownership

| Module | Description |
|--------|-------------|
| `frontend/src/pages/WorkerApp.tsx` | `/worker/:id` — Kumar's dashboard (Score + Market + BNPL) |
| `frontend/src/pages/LenderPortal.tsx` | `/lender` — AEON Credit credential pull UI |
| `frontend/src/pages/TngDashboard.tsx` | `/tng` — TNG analytics (heatmap + metrics) |
| `frontend/src/components/` | `ScoreCard`, `MarketPositionCard`, `BnplCatalog`, `QuoteModal` |
| `frontend/` | Build config, routing, overall shell |

**Tech:** React 18 + Vite + TypeScript + shadcn/ui + Recharts (bar charts)

---

## Task Tracker

| Task | Status | Hour | Notes |
|------|--------|------|-------|
| Frontend skeleton compiles (`npm run build` green) | ✅ Done | H0–H1 | Naz scaffolded |
| React Router wired — 3 routes working | ⬜ Todo | H1–H2 | |
| `ScoreCard` component — score number + tier badge | ⬜ Todo | H2–H4 | |
| `ScoreCard` — 3 driver chips below score | ⬜ Todo | H2–H4 | |
| `MarketPositionCard` — Recharts bar chart (3 bars) | ⬜ Todo | H4–H6 | |
| Worker App shell layout | ⬜ Todo | H2–H4 | |
| BNPL catalog grid (4–6 SKU cards) | ⬜ Todo | H6–H9 | |
| `QuoteModal` — price, tenor, monthly, lift, Approve button | ⬜ Todo | H6–H9 | Real call to `/api/bnpl/quote` |
| Lender Portal page — input + Pull button | ⬜ Todo | H9–H12 | |
| Lender Portal — JSON display + badges (issuer, sig, TTL) | ⬜ Todo | H9–H12 | Real call to `/api/credentials/pull/:workerId` |
| TNG Dashboard — KL heatmap (colored grid, static) | ⬜ Todo | H12–H15 | |
| TNG Dashboard — top 5 trades panel + 4 metric tiles | ⬜ Todo | H12–H15 | |
| Polish pass — typography, spacing, colors | ⬜ Todo | H18–H20 | |
| Test all 3 pages on deployed URL | ⬜ Todo | H20 | |

---

## API endpoints used by frontend

| Page | Endpoint | When |
|------|----------|------|
| WorkerApp | `GET /api/workers/:id` | On load |
| WorkerApp | `GET /api/market/:trade/:zone` | On load |
| WorkerApp | `POST /api/bnpl/quote` | On catalog item tap |
| LenderPortal | `POST /api/credentials/issue` | Auto-issue on page load (hardcoded Kumar + AEON) |
| LenderPortal | `GET /api/credentials/pull/:workerId` | On Pull button click |
| TngDashboard | Static data | No API calls needed for demo |

---

## Component specs

### `ScoreCard`
```
┌──────────────────────────────────────────┐
│  Layak Score                             │
│                                          │
│         [ 720 ]                          │
│      ✦ EXCELLENT ✦                       │
│                                          │
│  ⬤ Consistency  ⬤ Tenure  ⬤ Diversity  │
│     0.91            0.85        0.78     │
└──────────────────────────────────────────┘
```

### `MarketPositionCard`
- Bar chart (Recharts `BarChart`)
- 3 bars: Kumar (RM4,200) | Avg (RM4,800) | Top 25% (RM6,100)
- Kumar's bar in brand color; others in muted

### `BnplCatalog`
- Grid of 4–6 cards
- Each card: item image, name, price, monthly installment
- Tap → opens `QuoteModal`

### `QuoteModal`
- Asset name + price
- Tenor: 12 months
- Monthly: RM280
- Projected earnings lift: +40%
- Big green "Approved — Your Layak Score qualifies you" button

### Lender Portal badges
```
[ ✓ Issuer: tng.layak.my ]  [ ✓ Signature valid ]  [ ✓ Within TTL ]
```

---

## Status Updates

### H0–H1
- Waiting for API stubs from Naz (Go skeleton)
- Started planning component tree
- Will use shadcn/ui `Card`, `Badge`, `Button`, `Dialog` for modal
