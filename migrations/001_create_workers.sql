-- Migration 001: workers
-- QR-economy workers registered in the Layak system.

CREATE TABLE IF NOT EXISTS workers (
    worker_id       VARCHAR(64)  PRIMARY KEY,
    full_name       VARCHAR(120) NOT NULL,
    trade           VARCHAR(40)  NOT NULL,   -- 'barber_services', 'kuih_seller', 'mobile_mechanic'
    zone            VARCHAR(40)  NOT NULL,   -- 'brickfields_kl', 'cheras_kl', etc.
    tng_account_ref VARCHAR(64),
    joined_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    status          VARCHAR(20)  NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'pending', 'suspended'))
);

CREATE INDEX IF NOT EXISTS idx_workers_trade_zone ON workers (trade, zone);
CREATE INDEX IF NOT EXISTS idx_workers_status     ON workers (status);
