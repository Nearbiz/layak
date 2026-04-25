-- Migration 003: layak_scores
-- Computed Layak Score cache. One row per worker, upserted by score service.

CREATE TABLE IF NOT EXISTS layak_scores (
    worker_id   VARCHAR(64)  PRIMARY KEY REFERENCES workers(worker_id) ON DELETE CASCADE,
    score       INT          NOT NULL CHECK (score BETWEEN 300 AND 850),
    tier        VARCHAR(20)  NOT NULL
                CHECK (tier IN ('excellent', 'good', 'fair', 'building')),
    drivers     JSONB        NOT NULL DEFAULT '{}',
    -- drivers shape: {"consistency":0.91,"tenure":0.85,"diversity":0.78,"volume":0.85,"recency":1.0}
    computed_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scores_tier        ON layak_scores (tier);
CREATE INDEX IF NOT EXISTS idx_scores_computed_at ON layak_scores (computed_at DESC);
