# Haziq — Pitch · Q&A · PM

**Role:** Pitch deck owner, demo narrator, Q&A lead, team checkpoint enforcer, submission packet.

---

## Module Ownership

| Module | Description |
|--------|-------------|
| Pitch deck (7 slides) | Owns structure, locked phrases, and visual narrative |
| Demo script | Enforces the 6-scene script; every second is accounted for |
| Q&A preparation | Must drill all 10 Q&A answers until can recite from memory |
| H6 checkpoint | Reads pitch out loud; calls scope cuts if needed |
| Submission packet | Queues pitch deck PDF + demo video + repo URL by 7 AM Day 2 |

---

## Task Tracker

| Task | Status | Hour | Notes |
|------|--------|------|-------|
| Source of Truth locked | ✅ Done | H0 | |
| PRD finalized and distributed | ✅ Done | H0 | |
| Pitch deck slide 1 (Kumar hook) | 🔄 In progress | H0–H3 | |
| Pitch deck slide 2 (witness gap insight) | ⬜ Todo | H3–H6 | |
| Pitch deck slide 3 (solution — 3 layers) | ⬜ Todo | H3–H6 | |
| Pitch deck slide 4 (demo slot) | ⬜ Todo | After demo works | |
| Pitch deck slide 5 (moat — structural neutrality) | ⬜ Todo | H6–H12 | |
| Pitch deck slide 6 (market + revenue) | ⬜ Todo | H6–H12 | |
| Pitch deck slide 7 (ask + team) | ⬜ Todo | H6–H12 | |
| H6 checkpoint — read pitch out loud | ⬜ Todo | H6 | |
| Drill all 10 Q&A answers (1st pass) | ⬜ Todo | H12 | |
| Demo smoke test on deployed URL | ⬜ Todo | H20–H22 | All 6 scenes verified |
| Rehearse pitch 3× | ⬜ Todo | H20–H22 | |
| Record demo video | ⬜ Todo | H21 | YouTube unlisted |
| Submission packet queued | ⬜ Todo | H22 | By 7 AM Day 2 |

---

## The 7-Slide Arc (locked)

> Do not add slides without removing one.

| Slide | Title | Key message |
|-------|-------|-------------|
| 1 | Hook | Kumar. RM112k. Rejected for RM8k. *He is layak. The system doesn't see it.* |
| 2 | Insight | Trusted credit = third-party witness. Salaried workers have employer + EPF. QR workers have nobody. |
| 3 | Solution | Three layers: collective intelligence + Layak Score + productive-asset BNPL. Flywheel visual. |
| 4 | Demo | Worker app → market position → BNPL → lender API → TNG dashboard. 90 seconds. |
| 5 | Moat | Structural neutrality. TNG is the only major QR-economy player that isn't a lender. Plaid analogy. |
| 6 | Market + Revenue | 500k workers. Three revenue lines. 9-figure ARR by year 5. GOpinjam upgraded, not replaced. |
| 7 | Ask + Team | Pilot TNG + 2 micro-lenders. BrozKey (1,200+ barbers). UOB Innovation Hub. |

---

## Locked phrases (use verbatim)

- *"The trapped middle of the QR economy"*
- *"Trusted credit requires a third-party witness"*
- *"This isn't a documentation gap. It's a witness gap."*
- *"EPF for the QR economy"*
- *"Plaid for Malaysia"*
- *"TNG's moat isn't data exclusivity — it's structural neutrality"*
- *"GOpinjam is Layak's first lender integration, not its competitor"*
- *"GOpinjam proves TNG users will borrow inside the eWallet. Layak proves the credentials TNG issues are worth borrowing against — anywhere."*
- *"You already have the asset. You haven't built the platform on it yet."*
- *"Kumar is layak. The system doesn't see it. Today, we're going to fix that."*

---

## Demo smoke test checklist (H20–H22)

Test on the **deployed URL**, not localhost. Haziq runs this — not the engineer who built it.

- [ ] Scene 1: `/worker/worker_kumar_001` loads. Score shows 720. Tier badge shows "Excellent". 3 driver chips visible.
- [ ] Scene 2: Market position card shows bar chart (Kumar 4,200 / avg 4,800 / top quartile 6,100).
- [ ] Scene 3: "Grow your business" tab shows catalog. Tap barber chair → quote modal → "Approved instantly" visible.
- [ ] Scene 4: `/lender` page. Type `worker_kumar_001`. Hit Pull. Credential JSON shows `"issuer": "tng.layak.my"`.
- [ ] Scene 5: `/tng` page. KL heatmap visible. Top 5 trades listed. 4 metric tiles at bottom.
- [ ] Scene 6: Flywheel diagram renders (static or slide export).

---

## Status Updates

### H0
- Source of Truth locked. PRD distributed to team.
- Pitch deck outline started. Slide 1 in progress.
- Team briefed on H6 checkpoint rule.
