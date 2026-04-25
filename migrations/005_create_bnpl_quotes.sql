-- Migration 005: bnpl_quotes
-- Productive-asset BNPL financing quotes generated for workers.

CREATE TABLE IF NOT EXISTS bnpl_quotes (
    quote_id        VARCHAR(64)   PRIMARY KEY,
    worker_id       VARCHAR(64)   NOT NULL REFERENCES workers(worker_id) ON DELETE CASCADE,
    asset_sku       VARCHAR(64)   NOT NULL,           -- 'barber_chair_v2', 'commercial_oven_30l'
    asset_price_myr DECIMAL(10,2) NOT NULL CHECK (asset_price_myr > 0),
    tenor_months    INT           NOT NULL CHECK (tenor_months > 0),
    monthly_myr     DECIMAL(10,2) NOT NULL CHECK (monthly_myr > 0),
    projected_lift  DECIMAL(5,2)  NOT NULL,           -- 0.40 = 40% earnings lift
    approval_status VARCHAR(20)   NOT NULL DEFAULT 'approved'
                    CHECK (approval_status IN ('approved', 'declined', 'pending')),
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bnpl_worker     ON bnpl_quotes (worker_id);
CREATE INDEX IF NOT EXISTS idx_bnpl_created_at ON bnpl_quotes (created_at DESC);

-- Asset catalog reference (not a FK — SKUs are defined in application code)
-- SKUs: barber_chair_v2, clipper_set_pro, commercial_oven_30l, packaging_machine,
--       dslr_kit, motorcycle_honda_wave, led_lighting_kit, pos_terminal
