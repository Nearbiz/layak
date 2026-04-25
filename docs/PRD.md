# LAYAK — Build PRD (24-Hour Demo Scope)
> TNG Digital FINHACK 2026 · Team FinNIX

---

## 1. Scope — What We Are Building (and Not)

### 1.1 The 4-minute demo defines the build

We are not building LAYAK. We are building the **demo of LAYAK**. Every line of code traces back to one of six demo moments. Anything that doesn't appear on screen during the 4-minute pitch is **out of scope, full stop**.

#### The six demo moments (the only things that need to work)

| # | Scene | Duration | Key artifact |
|---|-------|----------|-------------|
| 1 | Kumar opens his Layak app — score 720 visible | 0:00–0:35 | `ScoreCard` component |
| 2 | Market position card — bar chart vs peers | 0:35–1:00 | `MarketPositionCard` |
| 3 | Productive-asset BNPL — second barber chair | 1:00–1:50 | `BnplCatalog` + `QuoteModal` |
| 4 | Lender API call — AEON Credit pulls credential | 1:50–2:30 | `LenderPortal` page |
| 5 | TNG analytics dashboard — KL heatmap | 2:30–3:00 | `AnalyticsDashboard` |
| 6 | Flywheel close — circular diagram | 3:00–3:30 | Static slide |

---

### 1.2 In scope (build these)

- Mock dataset of ~50 QR-economy workers with 6 months of realistic transaction history (Kumar + Siti as hero personas)
- Layak Score function — input: transactions, output: score (300–850) + driver breakdown
- Worker dashboard (Kumar's view) — score, market position, BNPL catalog
- Lender portal (one screen) — shows API call result for a pulled credential
- TNG analytics dashboard (one screen) — heatmap of KL QR earnings
- Backend API: `/credentials/issue`, `/credentials/pull`, `/score/compute`, `/bnpl/quote`
- One signed credential format (JWT or VC-style) — proves the standard exists

### 1.3 Out of scope (do not build)

- Real authentication (mock JWT login is fine — hardcode Kumar)
- Real consent revocation flow (show the toggle, don't wire it)
- Multi-lender competition / bidding (one lender on screen is enough)
- Real BNPL repayment tracking (show the offer, not the amortization)
- Federated DuitNow data sharing (this is the v2 answer to a Q&A question)
- Real TNG SDK integration (mock the transaction feed)
- Admin panels, settings, profile editing, password reset, onboarding flows
- Production-grade encryption (use HMAC-SHA256 signed JWTs, move on)
- i18n / Bahasa Malaysia toggle (English-only demo)
- Mobile-responsive everything (demo on a 15-inch laptop — design for that)

---

## 2. The Demo Script (every screen, every second)

> Fikhry narrates. Total runtime: 3:30. If a teammate finds themselves building something not in this script, ask why.

### Scene 1 (0:00–0:35) — Kumar opens his Layak app
- **On screen:** Layak Score 720
- **Narration:** "This is Kumar. He runs a one-chair barbershop in Brickfields. 15 customers a day, RM25 each, all paid via TNG QR. His Layak Score is 720 — driven by 12 months consistent earnings, low volatility, and 4 income sources. He's never had a credential like this before."
- **Build target:** `ScoreCard` component with score, tier badge ("Excellent"), 3 driver chips below.

### Scene 2 (0:35–1:00) — Market position card
- **On screen:** "Barbers in Brickfields" card. Bar chart: Kumar (RM4,200) vs avg (RM4,800) vs top quartile (RM6,100).
- **Narration:** "This is Layer 1 — collective intelligence. TNG sees the entire QR economy. Kumar can finally see where he stands. This same data calibrates his score honestly — we know what 'good' actually looks like."
- **Build target:** `MarketPositionCard` with one Recharts bar chart. 3 bars only.

### Scene 3 (1:00–1:50) — Productive-asset BNPL
- **On screen:** Kumar taps "Grow your business" tab. Catalog of 4–6 items. He taps the second barber chair.
- **On screen:** "Approved instantly — your Layak Score qualifies you."
- **Narration:** "This is Layer 3. Productive-asset BNPL — credit only for tools that grow earnings. The chair is RM3,000. Underwriting projects 40% earnings lift. Repayment scales to that lift. This is not consumer credit — it's income-multiplying credit."
- **Build target:** `BnplCatalog` grid + `QuoteModal`. Real call to `/bnpl/quote` with Kumar's score.

### Scene 4 (1:50–2:30) — Lender API call (the platform reveal)
- **On screen:** Cut to second browser tab — "Partner Lender Portal — AEON Credit". Empty input. Type Kumar's worker ID. Hit Pull.
- **On screen:** `"issuer": "tng.layak.my"`
- **Narration:** "This is the platform moment. AEON Credit just pulled Kumar's Layak credential through the API. Same way they pull EPF data. Signed by TNG, consented by Kumar, consumed by any lender. This is what makes Layak a standard, not a feature."
- **Build target:** `LenderPortal` page. Real `GET /credentials/pull/:workerId` call. Pretty-print signed JWT.

### Scene 5 (2:30–3:00) — TNG analytics view
- **On screen:** Cut to TNG-side dashboard. Heatmap of KL with earnings density by zone. Side panel: top 5 trades by avg earnings.
- **Narration:** "And this is what TNG sees. The entire market in aggregate. This is why TNG is the only player who can issue these credentials neutrally — TNG isn't a lender."
- **Build target:** `AnalyticsDashboard` with one heatmap (mock KL grid) + ranked list. Static is fine.

### Scene 6 (3:00–3:30) — The flywheel close
- **On screen:** Single slide. Circular diagram: 5 nodes — workers, data, scores, credit, tools. Arrow loops back.
- **Narration:** "More workers earning through TNG → richer data → better scores → cheaper credit → workers buy productive tools → they earn more through TNG. The loop tightens. You already have the asset. Layak is the platform you build on top of it."

---

## 3. Architecture

### 3.1 Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React + Vite + shadcn/ui | Fastest hackathon UI; component kit ready |
| API | Go (Gin) — port 8080 | Fast, single binary, easy deploy |
| Score service | FastAPI (Python) — port 8001 | Score formula is numerical; Python is natural |
| Database | PostgreSQL 16 locally → OceanBase (Alibaba Cloud, sponsor) | Single bet |
| Credential format | HMAC-SHA256 signed JWT | Proves the standard; implementable in 1 hour |
| Hosting | Fly.io or Railway (single deploy command) | TBD at H20 |

### 3.2 System diagram

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Worker App      │     │  Lender Portal   │     │  TNG Dashboard   │
│  /worker/:id     │     │  /lender         │     │  /tng            │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼
                        ┌──────────────────┐
                        │  Layak API (Go)  │  ← consent, sign, verify, route
                        │  Port 8080       │
                        └────────┬─────────┘
                                 │
                ┌────────────────┼────────────────┐
                ▼                ▼                ▼
      ┌─────────────────┐  ┌──────────┐  ┌──────────────────┐
      │ Score service   │  │  DB      │  │ Mock TNG txn     │
      │ (FastAPI)       │  │(Postgres)│  │ feed (seeded)    │
      │ Port 8001       │  │           │  └──────────────────┘
      └─────────────────┘  └──────────┘
```

### 3.3 The credential format

The signed Layak credential is the most strategically important artifact in the demo.

```json
{
  "iss": "tng.layak.my",
  "sub": "worker_kumar_001",
  "iat": 1735200000,
  "exp": 1735203600,
  "jti": "lyk_2026_a3f9c1...",
  "credential": {
    "score": 720,
    "tier": "excellent",
    "earnings_12mo": 112400,
    "earnings_6mo_monthly_avg": 4280,
    "consistency": 0.91,
    "income_sources": 4,
    "tenure_months": 18,
    "trade": "barber_services",
    "zone": "brickfields_kl"
  },
  "consent": {
    "scope": ["earnings", "score", "tenure"],
    "lender_id": "aeon_credit",
    "expires_at": 1735203600
  }
}
.<HMAC-SHA256 signature>
```

---

## 4. Data Model

### 4.1 Tables (5 total)

#### `workers`
| Column | Type | Notes |
|--------|------|-------|
| worker_id | VARCHAR(64) PK | |
| full_name | VARCHAR(120) | |
| trade | VARCHAR(40) | `barber_services`, `kuih_seller`, `mobile_mechanic` |
| zone | VARCHAR(40) | `brickfields_kl`, `cheras_kl`, etc. |
| tng_account_ref | VARCHAR(64) | |
| joined_at | TIMESTAMP | |
| status | VARCHAR(20) | `active`, `pending`, `suspended` |

#### `transactions` (seeded mock TNG feed)
| Column | Type | Notes |
|--------|------|-------|
| txn_id | VARCHAR(64) PK | |
| worker_id | VARCHAR(64) FK | |
| amount_myr | DECIMAL(10,2) | |
| counterparty_id | VARCHAR(64) | pseudo customer id (diversity metric) |
| channel | VARCHAR(20) | `tng_qr`, `duitnow_qr` |
| occurred_at | TIMESTAMP | INDEX (worker_id, occurred_at) |

#### `layak_scores` (computed, cached)
| Column | Type | Notes |
|--------|------|-------|
| worker_id | VARCHAR(64) PK | |
| score | INT | 300–850 |
| tier | VARCHAR(20) | `excellent`, `good`, `fair`, `building` |
| drivers | JSONB | `{"consistency":0.91,"diversity":0.78,...}` |
| computed_at | TIMESTAMP | |

#### `credentials` (signed, issued, consented pulls)
| Column | Type | Notes |
|--------|------|-------|
| credential_id | VARCHAR(64) PK | `lyk_2026_xxxx` |
| worker_id | VARCHAR(64) FK | |
| lender_id | VARCHAR(64) | |
| scope | JSONB | |
| jwt | TEXT | signed token |
| issued_at | TIMESTAMP | |
| expires_at | TIMESTAMP | |
| revoked_at | TIMESTAMP NULL | NULL = still valid |

#### `bnpl_quotes` (productive-asset financing offers)
| Column | Type | Notes |
|--------|------|-------|
| quote_id | VARCHAR(64) PK | |
| worker_id | VARCHAR(64) FK | |
| asset_sku | VARCHAR(64) | `barber_chair_v2`, etc. |
| asset_price_myr | DECIMAL(10,2) | |
| tenor_months | INT | |
| monthly_myr | DECIMAL(10,2) | |
| projected_lift | DECIMAL(5,2) | 0.40 = 40% earnings lift |
| created_at | TIMESTAMP | |

### 4.2 Seed data spec (Aein's H1–H2 deliverable)

- 50 workers total: 30 barbers, 12 kuih sellers, 8 mobile mechanics — across 6 KL zones
- Kumar (`worker_kumar_001`) and Siti (`worker_siti_001`) are hero personas — extra detail
- Each worker: 6 months of transactions, 8–25 per week, RM15–RM80 per txn, realistic clustering
- Counterparty diversity: 40–100 unique pseudo-customers per worker over 6 months
- Asset catalog: 8 SKUs (barber chair, clipper set, commercial oven, packaging machine, DSLR kit, motorcycle, lighting kit, POS terminal)
- Save as `/seed/workers.json` + `/seed/transactions.json` — **Aein owns format, Fiz owns ingestion**

---

## 5. The Layak Score Formula

### 5.1 Signal definitions

| Signal | Weight | Formula |
|--------|--------|---------|
| consistency | 0.30 | `1 - (std_monthly / mean_monthly)` — lower variance = higher score |
| tenure | 0.20 | `log(months + 1) / log(24)` — normalized to 24-month max |
| diversity | 0.20 | `unique_counterparties / 30` — capped at 1.0 |
| volume | 0.20 | `earnings_6mo_avg / 30000` — capped at 1.0 |
| recency | 0.10 | `txns_last_30d / 28` — capped at 1.0 |

### 5.2 Final score mapping

```
raw = 0.30*consistency + 0.20*tenure + 0.20*diversity + 0.20*volume + 0.10*recency
score = 300 + round(raw * 550)        // maps [0,1] → [300, 850]

tier = excellent  if score >= 740
       good       if score >= 670
       fair       if score >= 580
       building   otherwise
```

### 5.3 Kumar's worked example (memorize this)

```
Kumar's 6-month data:
  monthly earnings: [4100, 4280, 4150, 4350, 4220, 4280]  mean=4230, std=92

  consistency = 1 - (92/4230)        = 0.978
  tenure (18mo) = log(19)/log(24)    = 0.926
  diversity (62 customers / 30)      = 1.000  (capped)
  volume (25,380 / 30,000)           = 0.846
  recency (32 txns / 28 avg)         = 1.143  → cap at 1.0

raw = 0.30(0.978) + 0.20(0.926) + 0.20(1.0) + 0.20(0.846) + 0.10(1.0)
    = 0.293 + 0.185 + 0.200 + 0.169 + 0.100
    = 0.947

score = 300 + round(0.947 * 550) = 300 + 521 = 821
```

> Note: The demo shows 720 (not 821) — the 720 is a deliberate, calibrated number for a "great but not perfect" story. Aein owns making the seed data produce 720 for Kumar.

---

## 6. API Contracts (the only 6 endpoints)

Every screen in the demo hits one of these. If you find yourself adding a 7th endpoint, you are out of scope.

### `GET /api/workers/:id`
```json
{
  "worker_id": "worker_kumar_001",
  "name": "Kumar Selvarajan",
  "trade": "barber_services",
  "zone": "brickfields_kl",
  "score": { "value": 720, "tier": "excellent",
             "drivers": { "consistency": 0.91, "tenure": 0.85 } },
  "earnings_6mo_monthly": [4100, 4280, 4150, 4350, 4220, 4280],
  "joined_at": "2024-04-01T00:00:00Z"
}
```

### `GET /api/market/:trade/:zone`
```json
{
  "trade": "barber_services",
  "zone": "brickfields_kl",
  "n_workers": 30,
  "avg_monthly_myr": 4800,
  "p25_monthly_myr": 3900,
  "p75_monthly_myr": 6100
}
```

### `POST /api/score/compute`
```json
// Request:  { "worker_id": "worker_kumar_001" }
// Response:
{
  "score": 720,
  "tier": "excellent",
  "drivers": {
    "consistency": { "value": 0.91, "weight": 0.30, "contribution": 0.273 },
    "tenure":      { "value": 0.85, "weight": 0.20, "contribution": 0.170 },
    "diversity":   { "value": 0.78, "weight": 0.20, "contribution": 0.156 },
    "volume":      { "value": 0.85, "weight": 0.20, "contribution": 0.170 },
    "recency":     { "value": 1.00, "weight": 0.10, "contribution": 0.100 }
  },
  "computed_at": "2026-04-26T03:14:22Z"
}
```

### `POST /api/bnpl/quote`
```json
// Request:  { "worker_id": "worker_kumar_001", "asset_sku": "barber_chair_v2" }
// Response:
{
  "quote_id": "q_a3f9c1",
  "asset": { "sku": "barber_chair_v2", "name": "Professional Barber Chair", "price_myr": 3000 },
  "tenor_months": 12,
  "monthly_myr": 280,
  "projected_lift_pct": 40,
  "approval_status": "approved",
  "approval_reason": "layak_score_720_qualifies"
}
```

### `POST /api/credentials/issue`
```json
// Request:
{
  "worker_id": "worker_kumar_001",
  "lender_id": "aeon_credit",
  "scope": ["earnings", "score", "tenure"],
  "ttl_seconds": 3600
}
// Response (201):
{
  "credential_id": "lyk_2026_a3f9c1",
  "jwt": "eyJhbGc...<signed JWT>...",
  "expires_at": "2026-04-26T04:14:22Z"
}
```

### `GET /api/credentials/pull/:workerId`
```
Headers: X-Lender-Id: aeon_credit
         X-Lender-Key: <demo shared secret>
```
```json
{
  "credential_id": "lyk_2026_a3f9c1",
  "issuer": "tng.layak.my",
  "subject": "worker_kumar_001",
  "issued_at": "2026-04-26T03:14:22Z",
  "expires_at": "2026-04-26T04:14:22Z",
  "verified_payload": { "score": 720, "tier": "excellent", "...": "..." },
  "signature_algorithm": "HS256",
  "signature": "<hex>"
}
```

---

## 7. Screens (Fikhry's territory)

### 7.1 Worker App — `/worker/:id`
- Header bar: TNG logo + "Layak" wordmark + Kumar's avatar
- Hero card: big score (720) + tier badge + 3 driver chips below
- Market position card: bar chart (you / avg / top quartile) + one-line summary
- "Grow your business" tab: BNPL catalog (4–6 SKUs as cards with image + price + monthly)
- Tap card → quote modal (price, tenor, monthly, projected lift, big green Approve button)

### 7.2 Lender Portal — `/lender`
- Branded header: "AEON Credit · Layak Partner Console"
- Single input: worker ID + Pull button
- Result panel: pretty-printed JSON of the verified credential
- Highlight badges: ✓ Issuer verified · ✓ Signature valid · ✓ Within TTL
- Sidebar (static): "Recent pulls today: 142 · This month: 3,891"

### 7.3 TNG Analytics Dashboard — `/tng`
- Page title: "Layak — TNG Operations View"
- Hero: KL zone heatmap (mock — colored grid) showing earnings density
- Right panel: top 5 trades by avg monthly earnings
- Bottom strip: 4 metric tiles (workers credentialed, scores issued today, lender pulls today, BNPL volume)
- All data static — this screen exists to land the moat

---

## 8. Build Timeline — Naz's Lane (DB + Deploy + CI)

> Full team timeline in [SOURCE_OF_TRUTH.md](./SOURCE_OF_TRUTH.md). This section is the backend/infra lane only.

| Hour | Deliverable | Done? |
|------|-------------|-------|
| H0–H1 | Repo scaffold, migrations applied, Postgres up locally | — |
| H1–H2 | `.env` wired, DB queryable end-to-end; Go API compiles | — |
| H2–H4 | All 6 Go handler stubs return mock JSON; FastAPI runs | — |
| H4–H6 | Score service queries DB; real data in API responses | — |
| **H6 checkpoint** | **DB queryable E2E; seed data lands cleanly** | — |
| H6–H12 | Credential signing working; `/credentials/pull` returns JWT | — |
| H12–H18 | All 6 endpoints functional with real seed data | — |
| H18–H20 | Deploy to Fly.io/Railway; CI passing on main | — |
| H20–H22 | Haziq smoke-tests all 6 demo moments on deploy URL | — |
| H22 | 🚀 SHIPPED | — |

---

## 9. Risks & Rules

| Risk | Rule |
|------|------|
| Score service goes down during demo | Go API falls back to cached `layak_scores` row |
| DB seed data wrong / Kumar's score not 720 | Aein owns fix by H4; Fiz re-seeds if needed |
| Credential JWT expired during demo | Set TTL to 24h for demo build |
| Deploy fails at H20 | Fallback: demo on localhost with screen share |
| Out of scope creep | Any feature not in the 6 scenes gets cut |

---

## 10. Definition of Done

LAYAK ships when **all** of the following are true at hour 22:

- [ ] All 6 demo moments work end-to-end on the deployed URL — verified by Haziq, not the engineer who built it
- [ ] Demo video recorded, edited, uploaded as unlisted YouTube link
- [ ] Pitch deck final, 7 slides, locked phrases verbatim — Haziq has rehearsed 3×
- [ ] README in repo with architecture diagram, deploy URL, run-locally steps
- [ ] Submission packet queued — pitch deck PDF, demo video link, repo URL, team info
- [ ] All 5 teammates know the 4-min demo flow cold and can recite Kumar's worked example
- [ ] Submission window 9:00–9:30 AM Day 2: everything queued by 7 AM
