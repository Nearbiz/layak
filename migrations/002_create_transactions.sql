-- Migration 002: transactions
-- Seeded mock TNG QR transaction feed. Every row is one payment received by a worker.

CREATE TABLE IF NOT EXISTS transactions (
    txn_id          VARCHAR(64)    PRIMARY KEY,
    worker_id       VARCHAR(64)    NOT NULL REFERENCES workers(worker_id) ON DELETE CASCADE,
    amount_myr      DECIMAL(10,2)  NOT NULL CHECK (amount_myr > 0),
    counterparty_id VARCHAR(64)    NOT NULL,  -- pseudo customer id (diversity metric input)
    channel         VARCHAR(20)    NOT NULL DEFAULT 'tng_qr'
                    CHECK (channel IN ('tng_qr', 'duitnow_qr')),
    occurred_at     TIMESTAMP      NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_txn_worker_time  ON transactions (worker_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_txn_occurred_at  ON transactions (occurred_at DESC);
