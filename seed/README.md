# seed/

Placeholder seed data for local dev. Aein owns the calibrated production seed —
**replace these files when Aein's data lands.**

## Files

- `workers.json` — 3 workers: Kumar (hero, brickfields_kl barber) + 2 comparison barbers (Anwar, Lim) so the market chart has data.
- `transactions.json` — 56 transactions across the 3 workers, distributed over the last 6 months.

## Calibration

Kumar's transactions are tuned to land near the demo target of **720** when the
score service runs against this data:

| driver       | value | weight | contribution |
|--------------|-------|--------|--------------|
| consistency  | 0.83  | 0.30   | 0.25         |
| tenure       | 0.91  | 0.20   | 0.18         |
| diversity    | 0.70  | 0.20   | 0.14         |
| volume       | 0.59  | 0.20   | 0.12         |
| recency      | 0.79  | 0.10   | 0.08         |

raw ≈ 0.77 → score ≈ 300 + round(0.77 × 550) ≈ **722**.

If `make seed` then `POST /api/score/compute {"worker_id":"worker_kumar_001"}`
returns a score off the 720 target, adjust transaction amounts here (or wait
for Aein's calibrated set).

## Running

From repo root with Postgres up and migrations applied:

```bash
make seed
```
