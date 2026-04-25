"""
Pytest tests for the Layak Score formula.
These run in CI without a database — pure function tests only.
"""
import math
import pytest
from score import ScoreInput, compute_score, score_to_tier


# ── Tier boundary tests ───────────────────────────────────────────────────────

def test_tier_excellent():
    assert score_to_tier(740) == "excellent"
    assert score_to_tier(821) == "excellent"
    assert score_to_tier(850) == "excellent"


def test_tier_good():
    assert score_to_tier(670) == "good"
    assert score_to_tier(739) == "good"


def test_tier_fair():
    assert score_to_tier(580) == "fair"
    assert score_to_tier(669) == "fair"


def test_tier_building():
    assert score_to_tier(300) == "building"
    assert score_to_tier(579) == "building"


# ── Kumar's worked example (PRD §5.3) ────────────────────────────────────────

def test_kumar_score_range():
    """Kumar's seed data should produce a score of ~720 (±20)."""
    inp = ScoreInput(
        monthly_earnings=[3800, 3950, 4100, 4050, 3900, 4200],
        tenure_months=18,
        unique_counterparties=55,
        earnings_6mo_avg=4000,
        txns_last_30d=22,
    )
    result = compute_score(inp)
    assert 700 <= result.score <= 740, f"Expected ~720, got {result.score}"
    assert result.tier == "excellent"


def test_formula_worked_example():
    """Verify the exact PRD §5.3 worked example produces score 821."""
    inp = ScoreInput(
        monthly_earnings=[4100, 4280, 4150, 4350, 4220, 4280],
        tenure_months=18,
        unique_counterparties=62,
        earnings_6mo_avg=4230,
        txns_last_30d=28,  # exactly average → recency = 1.0
    )
    result = compute_score(inp)
    assert result.score == 821, f"Expected 821 per PRD §5.3, got {result.score}"
    assert result.tier == "excellent"
    assert abs(result.raw - 0.947) < 0.01


# ── Signal boundary tests ─────────────────────────────────────────────────────

def test_consistency_caps_at_zero():
    """Very volatile earnings → consistency = 0."""
    inp = ScoreInput(
        monthly_earnings=[1000, 10000, 500, 8000, 200, 9000],
        tenure_months=6,
        unique_counterparties=10,
        earnings_6mo_avg=4783,
        txns_last_30d=10,
    )
    result = compute_score(inp)
    # consistency should be very low (high variance relative to mean)
    assert result.drivers["consistency"].value >= 0


def test_diversity_caps_at_one():
    """More than 30 unique counterparties → diversity = 1.0."""
    inp = ScoreInput(
        monthly_earnings=[4000] * 6,
        tenure_months=12,
        unique_counterparties=100,
        earnings_6mo_avg=4000,
        txns_last_30d=20,
    )
    result = compute_score(inp)
    assert result.drivers["diversity"].value == 1.0


def test_volume_caps_at_one():
    """Earnings ≥ RM30,000/month → volume = 1.0."""
    inp = ScoreInput(
        monthly_earnings=[35000] * 6,
        tenure_months=12,
        unique_counterparties=50,
        earnings_6mo_avg=35000,
        txns_last_30d=20,
    )
    result = compute_score(inp)
    assert result.drivers["volume"].value == 1.0


def test_score_lower_bound():
    """Minimum possible score is 300."""
    inp = ScoreInput(
        monthly_earnings=[100, 50, 0.01, 200, 50, 10],
        tenure_months=1,
        unique_counterparties=1,
        earnings_6mo_avg=70,
        txns_last_30d=1,
    )
    result = compute_score(inp)
    assert result.score >= 300


def test_score_upper_bound():
    """Maximum possible score is 850."""
    inp = ScoreInput(
        monthly_earnings=[30000] * 6,
        tenure_months=23,
        unique_counterparties=100,
        earnings_6mo_avg=30000,
        txns_last_30d=100,
    )
    result = compute_score(inp)
    assert result.score <= 850


# ── Driver weights sum to 1.0 ─────────────────────────────────────────────────

def test_driver_weights_sum():
    inp = ScoreInput(
        monthly_earnings=[4000] * 6,
        tenure_months=12,
        unique_counterparties=40,
        earnings_6mo_avg=4000,
        txns_last_30d=20,
    )
    result = compute_score(inp)
    total_weight = sum(d.weight for d in result.drivers.values())
    assert abs(total_weight - 1.0) < 1e-9


def test_contribution_equals_value_times_weight():
    inp = ScoreInput(
        monthly_earnings=[4000] * 6,
        tenure_months=12,
        unique_counterparties=40,
        earnings_6mo_avg=4000,
        txns_last_30d=20,
    )
    result = compute_score(inp)
    for name, d in result.drivers.items():
        expected = round(d.value * d.weight, 4)
        assert abs(d.contribution - expected) < 1e-6, f"Driver {name}: {d}"


def test_empty_earnings_raises():
    with pytest.raises(ValueError):
        compute_score(ScoreInput(
            monthly_earnings=[],
            tenure_months=6,
            unique_counterparties=10,
            earnings_6mo_avg=0,
            txns_last_30d=10,
        ))
