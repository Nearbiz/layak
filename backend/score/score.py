"""
Pure Layak Score computation logic (PRD §5).
No I/O — all functions are deterministic and testable.
"""
import math
from dataclasses import dataclass
from typing import List


@dataclass
class ScoreInput:
    monthly_earnings: List[float]   # last 6 months, oldest first
    tenure_months: int              # months since worker joined
    unique_counterparties: int      # distinct customers last 6 months
    earnings_6mo_avg: float         # mean monthly earnings over 6 months
    txns_last_30d: int              # transaction count in last 30 days


@dataclass
class DriverDetail:
    value: float
    weight: float
    contribution: float


@dataclass
class ScoreResult:
    score: int
    tier: str
    drivers: dict[str, DriverDetail]
    raw: float


def compute_score(inp: ScoreInput) -> ScoreResult:
    if not inp.monthly_earnings:
        raise ValueError("monthly_earnings must not be empty")

    mean = sum(inp.monthly_earnings) / len(inp.monthly_earnings)
    variance = sum((x - mean) ** 2 for x in inp.monthly_earnings) / len(inp.monthly_earnings)
    std = math.sqrt(variance)

    consistency = max(0.0, 1.0 - (std / mean)) if mean > 0 else 0.0
    tenure      = math.log(inp.tenure_months + 1) / math.log(24) if inp.tenure_months > 0 else 0.0
    diversity   = min(1.0, inp.unique_counterparties / 30.0)
    volume      = min(1.0, inp.earnings_6mo_avg / 30000.0)
    recency     = min(1.0, inp.txns_last_30d / 28.0)

    weights = {
        "consistency": 0.30,
        "tenure":      0.20,
        "diversity":   0.20,
        "volume":      0.20,
        "recency":     0.10,
    }
    values = {
        "consistency": consistency,
        "tenure":      tenure,
        "diversity":   diversity,
        "volume":      volume,
        "recency":     recency,
    }

    raw = sum(values[k] * weights[k] for k in weights)
    score = 300 + round(raw * 550)
    score = max(300, min(850, score))
    tier = score_to_tier(score)

    drivers = {
        k: DriverDetail(
            value=round(values[k], 4),
            weight=weights[k],
            contribution=round(values[k] * weights[k], 4),
        )
        for k in weights
    }

    return ScoreResult(score=score, tier=tier, drivers=drivers, raw=round(raw, 4))


def score_to_tier(score: int) -> str:
    if score >= 740:
        return "excellent"
    if score >= 670:
        return "good"
    if score >= 580:
        return "fair"
    return "building"
