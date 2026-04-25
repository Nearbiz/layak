#!/usr/bin/env node
"use strict";
const fs   = require("fs");
const path = require("path");

// ── Seeded PRNG (Mulberry32) ──────────────────────────────────────────────────
let _seed = 42;
function rand() {
  _seed += 0x6D2B79F5;
  let t = _seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function randInt(lo, hi)    { return Math.floor(rand() * (hi - lo + 1)) + lo; }
function randFloat(lo, hi)  { return rand() * (hi - lo) + lo; }
function randChoice(arr)    { return arr[Math.floor(rand() * arr.length)]; }
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ── Date helpers ──────────────────────────────────────────────────────────────
const DEMO_DATE = new Date("2026-04-26T00:00:00Z");

const MONTH_STARTS = [
  new Date("2025-11-01T00:00:00Z"),
  new Date("2025-12-01T00:00:00Z"),
  new Date("2026-01-01T00:00:00Z"),
  new Date("2026-02-01T00:00:00Z"),
  new Date("2026-03-01T00:00:00Z"),
  new Date("2026-04-01T00:00:00Z"),
];
const MONTH_ENDS = [...MONTH_STARTS.slice(1), DEMO_DATE];

function fmtTs(d) {
  return d.toISOString().replace(".000Z", "Z").replace(/\.\d+Z$/, "Z");
}

function randTs(start, end) {
  const span = end - start;
  for (let attempts = 0; attempts < 200; attempts++) {
    const t = new Date(start.getTime() + rand() * span);
    const dow  = t.getUTCDay();  // 0=Sun
    const hour = t.getUTCHours();
    if (dow !== 0 && hour >= 8 && hour <= 20) return t;
  }
  return new Date(start.getTime() + 3600000 * 10);
}

// ── Score formula (mirrors backend/score/score.py) ────────────────────────────
function computeScore(inp) {
  const { monthlyEarnings, tenureMonths, uniqueCounterparties,
          earnings6moAvg, txnsLast30d } = inp;
  const n    = monthlyEarnings.length;
  const mean = monthlyEarnings.reduce((a, b) => a + b, 0) / n;
  const variance = monthlyEarnings.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
  const std  = Math.sqrt(variance);

  const consistency = mean > 0 ? Math.max(0, 1 - std / mean) : 0;
  const tenure      = tenureMonths > 0 ? Math.log(tenureMonths + 1) / Math.log(24) : 0;
  const diversity   = Math.min(1.0, uniqueCounterparties / 30);
  const volume      = Math.min(1.0, earnings6moAvg / 30000);
  const recency     = Math.min(1.0, txnsLast30d / 28);

  const raw = 0.30 * consistency + 0.20 * tenure + 0.20 * diversity
            + 0.20 * volume      + 0.10 * recency;
  const score = Math.max(300, Math.min(850, 300 + Math.round(raw * 550)));
  const tier  = score >= 700 ? "excellent" : score >= 600 ? "good"
              : score >= 500 ? "fair" : "building";

  return { score, tier, raw: Math.round(raw * 10000) / 10000,
           consistency: Math.round(consistency * 10000) / 10000 };
}

// ── Transaction generator ─────────────────────────────────────────────────────
let txnCounter = 0;

function generateTxns(workerId, monthlyTargets, amtLo, amtHi, counterparties) {
  const avgAmt = (amtLo + amtHi) / 2;
  const txns = [];

  for (let m = 0; m < MONTH_STARTS.length; m++) {
    const start  = MONTH_STARTS[m];
    const end    = MONTH_ENDS[m];
    const target = monthlyTargets[m];
    const n      = Math.max(4, Math.round(target / avgAmt) + randInt(-2, 2));

    const timestamps = Array.from({ length: n }, () => randTs(start, end))
                            .sort((a, b) => a - b);

    // Distribute amounts summing close to target
    const amounts = [];
    let remaining = target;
    for (let i = 0; i < n - 1; i++) {
      const lo = amtLo;
      const hi = Math.max(lo, Math.min(amtHi, remaining - amtLo * (n - 1 - i)));
      const a  = Math.round(randFloat(lo, hi) * 100) / 100;
      amounts.push(a);
      remaining -= a;
    }
    amounts.push(Math.round(Math.max(amtLo, Math.min(amtHi, remaining)) * 100) / 100);
    shuffle(amounts);

    for (let i = 0; i < n; i++) {
      txnCounter++;
      txns.push({
        txn_id:           `txn_${workerId}_${String(txnCounter).padStart(5, "0")}`,
        worker_id:        workerId,
        amount_myr:       amounts[i],
        counterparty_id:  randChoice(counterparties),
        channel:          rand() < 0.75 ? "tng_qr" : "duitnow_qr",
        occurred_at:      fmtTs(timestamps[i]),
      });
    }
  }
  return txns;
}

// ── Worker / data definitions ─────────────────────────────────────────────────
const workers   = [];
const allTxns   = [];

function addWorker(wid, name, trade, zone, joinedAt, monthly, amtLo, amtHi, nCust, custPrefix) {
  const counterparties = Array.from({ length: nCust }, (_, i) =>
    `${custPrefix}_${String(i + 1).padStart(4, "0")}`);
  workers.push({ worker_id: wid, full_name: name, trade, zone,
                 tng_account_ref: `tng_${wid}`, joined_at: joinedAt, status: "active" });
  allTxns.push(...generateTxns(wid, monthly, amtLo, amtHi, counterparties));
}

// Heroes
addWorker("worker_kumar_001", "Kumar Selvarajan",
          "barber_services", "brickfields_kl", "2024-10-01T00:00:00Z",
          [3800, 3950, 4100, 4050, 3900, 4200], 35, 60, 55, "cust_kumar");

addWorker("worker_siti_001", "Siti Rahimah",
          "kuih_seller", "cheras_kl", "2024-06-01T00:00:00Z",
          [2800, 2950, 3100, 3050, 2900, 3200], 8, 25, 75, "cust_siti");

// 28 more barbers
const BARBERS = [
  ["Ravi Kumar",     "brickfields_kl"], ["Sham Selvam",    "chow_kit_kl"],
  ["Muthu Krishnan", "setapak_kl"],     ["Dinesh Pillai",  "brickfields_kl"],
  ["Suresh Nair",    "chow_kit_kl"],    ["Azlan Hamid",    "setapak_kl"],
  ["Farid Zulkifli", "brickfields_kl"], ["Hafiz Rahman",   "chow_kit_kl"],
  ["Rizal Hasan",    "setapak_kl"],     ["Zamri Idris",    "brickfields_kl"],
  ["Ahmad Razif",    "chow_kit_kl"],    ["Kamarul Ariff",  "setapak_kl"],
  ["Shafiq Rosli",   "brickfields_kl"], ["Lokman Hakim",   "chow_kit_kl"],
  ["Azhar Malik",    "setapak_kl"],     ["Bala Krishnan",  "brickfields_kl"],
  ["Gopal Raj",      "chow_kit_kl"],    ["Venkat Raman",   "setapak_kl"],
  ["Senthil Kumar",  "brickfields_kl"], ["Prakash Pillai", "chow_kit_kl"],
  ["Izwan Kamal",    "setapak_kl"],     ["Shahril Azam",   "brickfields_kl"],
  ["Fadzli Nordin",  "chow_kit_kl"],    ["Hazli Jamil",    "setapak_kl"],
  ["Khairul Azri",   "brickfields_kl"], ["Syafiq Zuhri",   "chow_kit_kl"],
  ["Wan Khairul",    "setapak_kl"],     ["Mohd Razali",    "brickfields_kl"],
  ["Saiful Bahari",  "chow_kit_kl"],
];
BARBERS.forEach(([name, zone], i) => {
  const wid       = `worker_barber_${String(i + 2).padStart(3, "0")}`;
  const mthsAgo   = randInt(6, 36);
  const joined    = new Date(DEMO_DATE - mthsAgo * 30 * 86400000)
                        .toISOString().replace(/T.*/, "T00:00:00Z");
  const base      = randFloat(3200, 5800);
  const monthly   = Array.from({ length: 6 }, () => Math.round(base * randFloat(0.88, 1.12)));
  addWorker(wid, name, "barber_services", zone, joined, monthly,
            35, 65, randInt(35, 80), `cust_b${i + 2}`);
});

// 11 more kuih sellers
const KUIH = [
  ["Aishah Yusof",  "cheras_kl"],      ["Rosnah Majid",  "ampang_kl"],
  ["Halimah Bakar", "wangsa_maju_kl"], ["Zainab Alias",  "cheras_kl"],
  ["Kamariah Daud", "ampang_kl"],       ["Rohani Hassan", "wangsa_maju_kl"],
  ["Noraini Talib", "cheras_kl"],       ["Maimunah Zain", "ampang_kl"],
  ["Fauziah Rahim", "wangsa_maju_kl"], ["Ramlah Ismail", "cheras_kl"],
  ["Rugayah Ahmad", "ampang_kl"],
];
KUIH.forEach(([name, zone], i) => {
  const wid     = `worker_kuih_${String(i + 2).padStart(3, "0")}`;
  const mthsAgo = randInt(6, 36);
  const joined  = new Date(DEMO_DATE - mthsAgo * 30 * 86400000)
                      .toISOString().replace(/T.*/, "T00:00:00Z");
  const base    = randFloat(2000, 4200);
  const monthly = Array.from({ length: 6 }, () => Math.round(base * randFloat(0.85, 1.15)));
  addWorker(wid, name, "kuih_seller", zone, joined, monthly,
            8, 25, randInt(50, 100), `cust_k${i + 2}`);
});

// 8 mechanics
const MECHS = [
  ["Chong Wei Ming", "kepong_kl"],  ["Lim Boon Tat",   "setapak_kl"],
  ["Tan Ah Kow",     "cheras_kl"],  ["Wong Fook Meng",  "kepong_kl"],
  ["Lee Swee Huat",  "setapak_kl"], ["Ng Beng Hock",   "cheras_kl"],
  ["Ong Ah Seng",    "kepong_kl"],  ["Yap Kim Leng",   "setapak_kl"],
];
MECHS.forEach(([name, zone], i) => {
  const wid     = `worker_mech_${String(i + 1).padStart(3, "0")}`;
  const mthsAgo = randInt(6, 36);
  const joined  = new Date(DEMO_DATE - mthsAgo * 30 * 86400000)
                      .toISOString().replace(/T.*/, "T00:00:00Z");
  const base    = randFloat(4500, 9000);
  const monthly = Array.from({ length: 6 }, () => Math.round(base * randFloat(0.80, 1.20)));
  addWorker(wid, name, "mobile_mechanic", zone, joined, monthly,
            80, 280, randInt(30, 60), `cust_m${i + 1}`);
});

// ── Write output ──────────────────────────────────────────────────────────────
const outDir = __dirname;
fs.writeFileSync(path.join(outDir, "workers.json"),      JSON.stringify(workers,  null, 2));
fs.writeFileSync(path.join(outDir, "transactions.json"), JSON.stringify(allTxns, null, 2));
console.log(`workers      : ${workers.length}`);
console.log(`transactions : ${allTxns.length}`);

// ── Verify Kumar's projected DB score ─────────────────────────────────────────
const cutoff6mo = new Date(DEMO_DATE - 180 * 86400000);
const cutoff30d = new Date(DEMO_DATE -  30 * 86400000);

const kumarTxns = allTxns.filter(t => t.worker_id === "worker_kumar_001");
const monthlyMap = {};
const counterparties = new Set();
let last30 = 0;

for (const t of kumarTxns) {
  const ts = new Date(t.occurred_at);
  if (ts >= cutoff6mo) {
    const mo = t.occurred_at.slice(0, 7);
    monthlyMap[mo] = (monthlyMap[mo] || 0) + t.amount_myr;
    counterparties.add(t.counterparty_id);
  }
  if (ts >= cutoff30d) last30++;
}

const monthlyList = Object.keys(monthlyMap).sort().map(k => monthlyMap[k]);
const avg6mo      = monthlyList.reduce((a, b) => a + b, 0) / monthlyList.length;
const joinedDate  = new Date("2024-10-01T00:00:00Z");
const tenure      = Math.max(1, Math.floor((DEMO_DATE - joinedDate) / (30 * 86400000)));

const result = computeScore({
  monthlyEarnings:      monthlyList,
  tenureMonths:         tenure,
  uniqueCounterparties: counterparties.size,
  earnings6moAvg:       avg6mo,
  txnsLast30d:          last30,
});

console.log(`\nKumar projected DB score: ${result.score} (${result.tier})`);
console.log(`  monthly sums  : [${monthlyList.map(x => Math.round(x)).join(", ")}]`);
console.log(`  avg 6mo       : ${Math.round(avg6mo)}`);
console.log(`  counterparties: ${counterparties.size}`);
console.log(`  last 30d txns : ${last30}`);
console.log(`  tenure        : ${tenure} months`);
console.log(`  consistency   : ${result.consistency}`);
console.log(`  raw           : ${result.raw}`);
