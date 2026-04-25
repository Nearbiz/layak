#!/usr/bin/env python3
"""Generates seed/workers.json and seed/transactions.json for the LAYAK demo."""
import json, random, sys, os
from datetime import datetime, timedelta, timezone
from collections import defaultdict

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend", "score"))
from score import ScoreInput, compute_score

random.seed(42)

DEMO_DATE = datetime(2026, 4, 26, tzinfo=timezone.utc)

# Six full/partial calendar months within the 6-month lookback window.
# SQL: occurred_at >= NOW() - INTERVAL '6 months' (= Oct 26 2025).
# We start Nov 1 so all months are clean full months.
MONTH_STARTS = [
    datetime(2025, 11,  1, tzinfo=timezone.utc),
    datetime(2025, 12,  1, tzinfo=timezone.utc),
    datetime(2026,  1,  1, tzinfo=timezone.utc),
    datetime(2026,  2,  1, tzinfo=timezone.utc),
    datetime(2026,  3,  1, tzinfo=timezone.utc),
    datetime(2026,  4,  1, tzinfo=timezone.utc),
]
MONTH_ENDS = MONTH_STARTS[1:] + [DEMO_DATE]

TXN_COUNTER = [0]


def rand_ts(start: datetime, end: datetime) -> datetime:
    delta = (end - start).total_seconds()
    for _ in range(100):
        t = start + timedelta(seconds=random.random() * delta)
        if t.weekday() != 6 and 8 <= t.hour <= 20:
            return t
    return start.replace(hour=10)


def generate_txns(worker_id: str, monthly_targets: list,
                  amt_lo: float, amt_hi: float, counterparties: list) -> list:
    txns = []
    avg_amt = (amt_lo + amt_hi) / 2
    for start, end, target in zip(MONTH_STARTS, MONTH_ENDS, monthly_targets):
        n = max(4, round(target / avg_amt) + random.randint(-2, 2))
        timestamps = sorted([rand_ts(start, end) for _ in range(n)])

        # Distribute amounts summing to target
        amounts = []
        remaining = float(target)
        for i in range(n - 1):
            lo = amt_lo
            hi = min(amt_hi, remaining - amt_lo * (n - 1 - i))
            hi = max(lo, hi)
            a = round(random.uniform(lo, hi), 2)
            amounts.append(a)
            remaining -= a
        amounts.append(round(max(amt_lo, min(amt_hi, remaining)), 2))
        random.shuffle(amounts)

        for ts, amt in zip(timestamps, amounts):
            TXN_COUNTER[0] += 1
            txns.append({
                "txn_id": f"txn_{worker_id}_{TXN_COUNTER[0]:05d}",
                "worker_id": worker_id,
                "amount_myr": float(round(amt, 2)),
                "counterparty_id": random.choice(counterparties),
                "channel": "tng_qr" if random.random() < 0.75 else "duitnow_qr",
                "occurred_at": ts.strftime("%Y-%m-%dT%H:%M:%SZ"),
            })
    return txns


workers = []
all_txns = []


def add_worker(wid, name, trade, zone, joined_at_str, monthly,
               amt_lo, amt_hi, n_customers, cust_prefix):
    counterparties = [f"{cust_prefix}_{i:04d}" for i in range(1, n_customers + 1)]
    workers.append({
        "worker_id": wid,
        "full_name": name,
        "trade": trade,
        "zone": zone,
        "tng_account_ref": f"tng_{wid}",
        "joined_at": joined_at_str,
        "status": "active",
    })
    txns = generate_txns(wid, monthly, amt_lo, amt_hi, counterparties)
    all_txns.extend(txns)


# ── HERO: Kumar (barber, Brickfields, target score ~729 → "excellent") ────────
# monthly [3800,3950,4100,4050,3900,4200], 55 customers, tenure 18mo
add_worker(
    "worker_kumar_001", "Kumar Selvarajan",
    "barber_services", "brickfields_kl",
    "2024-10-01T00:00:00Z",
    [3800, 3950, 4100, 4050, 3900, 4200],
    35, 60, 55, "cust_kumar",
)

# ── HERO: Siti (kuih seller, Cheras) ─────────────────────────────────────────
add_worker(
    "worker_siti_001", "Siti Rahimah",
    "kuih_seller", "cheras_kl",
    "2024-06-01T00:00:00Z",
    [2800, 2950, 3100, 3050, 2900, 3200],
    8, 25, 75, "cust_siti",
)

# ── Barbers: 28 more → 30 total ───────────────────────────────────────────────
BARBERS = [
    ("Ravi Kumar",     "brickfields_kl"), ("Sham Selvam",    "chow_kit_kl"),
    ("Muthu Krishnan", "setapak_kl"),     ("Dinesh Pillai",  "brickfields_kl"),
    ("Suresh Nair",    "chow_kit_kl"),    ("Azlan Hamid",    "setapak_kl"),
    ("Farid Zulkifli", "brickfields_kl"), ("Hafiz Rahman",   "chow_kit_kl"),
    ("Rizal Hasan",    "setapak_kl"),     ("Zamri Idris",    "brickfields_kl"),
    ("Ahmad Razif",    "chow_kit_kl"),    ("Kamarul Ariff",  "setapak_kl"),
    ("Shafiq Rosli",   "brickfields_kl"), ("Lokman Hakim",   "chow_kit_kl"),
    ("Azhar Malik",    "setapak_kl"),     ("Bala Krishnan",  "brickfields_kl"),
    ("Gopal Raj",      "chow_kit_kl"),    ("Venkat Raman",   "setapak_kl"),
    ("Senthil Kumar",  "brickfields_kl"), ("Prakash Pillai", "chow_kit_kl"),
    ("Izwan Kamal",    "setapak_kl"),     ("Shahril Azam",   "brickfields_kl"),
    ("Fadzli Nordin",  "chow_kit_kl"),    ("Hazli Jamil",    "setapak_kl"),
    ("Khairul Azri",   "brickfields_kl"), ("Syafiq Zuhri",   "chow_kit_kl"),
    ("Wan Khairul",    "setapak_kl"),     ("Mohd Razali",    "brickfields_kl"),
]
for i, (name, zone) in enumerate(BARBERS, 2):
    wid = f"worker_barber_{i:03d}"
    months_ago = random.randint(6, 36)
    joined = (DEMO_DATE - timedelta(days=months_ago * 30)).strftime("%Y-%m-%dT00:00:00Z")
    base = random.uniform(3200, 5800)
    monthly = [round(base * random.uniform(0.88, 1.12)) for _ in range(6)]
    add_worker(wid, name, "barber_services", zone, joined, monthly,
               35, 65, random.randint(35, 80), f"cust_b{i}")

# ── Kuih sellers: 11 more → 12 total (incl. Siti) ────────────────────────────
KUIH = [
    ("Aishah Yusof",  "cheras_kl"),      ("Rosnah Majid",  "ampang_kl"),
    ("Halimah Bakar", "wangsa_maju_kl"), ("Zainab Alias",  "cheras_kl"),
    ("Kamariah Daud", "ampang_kl"),       ("Rohani Hassan", "wangsa_maju_kl"),
    ("Noraini Talib", "cheras_kl"),       ("Maimunah Zain", "ampang_kl"),
    ("Fauziah Rahim", "wangsa_maju_kl"), ("Ramlah Ismail", "cheras_kl"),
    ("Rugayah Ahmad", "ampang_kl"),
]
for i, (name, zone) in enumerate(KUIH, 2):
    wid = f"worker_kuih_{i:03d}"
    months_ago = random.randint(6, 36)
    joined = (DEMO_DATE - timedelta(days=months_ago * 30)).strftime("%Y-%m-%dT00:00:00Z")
    base = random.uniform(2000, 4200)
    monthly = [round(base * random.uniform(0.85, 1.15)) for _ in range(6)]
    add_worker(wid, name, "kuih_seller", zone, joined, monthly,
               8, 25, random.randint(50, 100), f"cust_k{i}")

# ── Mechanics: 8 total ────────────────────────────────────────────────────────
MECHS = [
    ("Chong Wei Ming", "kepong_kl"),  ("Lim Boon Tat",  "setapak_kl"),
    ("Tan Ah Kow",     "cheras_kl"),  ("Wong Fook Meng", "kepong_kl"),
    ("Lee Swee Huat",  "setapak_kl"), ("Ng Beng Hock",  "cheras_kl"),
    ("Ong Ah Seng",    "kepong_kl"),  ("Yap Kim Leng",  "setapak_kl"),
]
for i, (name, zone) in enumerate(MECHS, 1):
    wid = f"worker_mech_{i:03d}"
    months_ago = random.randint(6, 36)
    joined = (DEMO_DATE - timedelta(days=months_ago * 30)).strftime("%Y-%m-%dT00:00:00Z")
    base = random.uniform(4500, 9000)
    monthly = [round(base * random.uniform(0.80, 1.20)) for _ in range(6)]
    add_worker(wid, name, "mobile_mechanic", zone, joined, monthly,
               80, 280, random.randint(30, 60), f"cust_m{i}")


# ── Write output ──────────────────────────────────────────────────────────────
out_dir = os.path.dirname(__file__)

with open(os.path.join(out_dir, "workers.json"), "w") as f:
    json.dump(workers, f, indent=2)

with open(os.path.join(out_dir, "transactions.json"), "w") as f:
    json.dump(all_txns, f, indent=2)

print(f"workers: {len(workers)}")
print(f"transactions: {len(all_txns)}")

# ── Verify Kumar's projected score ────────────────────────────────────────────
kumar_txns = [t for t in all_txns if t["worker_id"] == "worker_kumar_001"]
monthly_map = defaultdict(float)
counterparties = set()
last30 = 0
cutoff_6mo = DEMO_DATE - timedelta(days=180)
cutoff_30d  = DEMO_DATE - timedelta(days=30)

for t in kumar_txns:
    ts = datetime.strptime(t["occurred_at"], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
    if ts >= cutoff_6mo:
        monthly_map[ts.strftime("%Y-%m")] += t["amount_myr"]
        counterparties.add(t["counterparty_id"])
    if ts >= cutoff_30d:
        last30 += 1

monthly_list = [monthly_map[k] for k in sorted(monthly_map)]
avg = sum(monthly_list) / len(monthly_list) if monthly_list else 0
tenure = max(1, int((DEMO_DATE - datetime(2024, 10, 1, tzinfo=timezone.utc)).days / 30))

inp = ScoreInput(
    monthly_earnings=monthly_list,
    tenure_months=tenure,
    unique_counterparties=len(counterparties),
    earnings_6mo_avg=avg,
    txns_last_30d=last30,
)
result = compute_score(inp)
print(f"\nKumar projected DB score: {result.score} ({result.tier})")
print(f"  monthly sums : {[round(m) for m in monthly_list]}")
print(f"  avg          : {round(avg)}")
print(f"  counterparties: {len(counterparties)}")
print(f"  last 30d txns: {last30}")
print(f"  tenure       : {tenure} months")
