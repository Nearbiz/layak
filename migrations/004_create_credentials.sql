-- Migration 004: credentials
-- Signed Layak credentials issued to workers and consumed by lenders via API.

CREATE TABLE IF NOT EXISTS credentials (
    credential_id VARCHAR(64)  PRIMARY KEY,           -- lyk_2026_xxxx
    worker_id     VARCHAR(64)  NOT NULL REFERENCES workers(worker_id) ON DELETE CASCADE,
    lender_id     VARCHAR(64)  NOT NULL,              -- 'aeon_credit', 'bsn', etc.
    scope         JSONB        NOT NULL DEFAULT '[]', -- ["earnings","score","tenure"]
    jwt           TEXT         NOT NULL,              -- signed JWT token
    issued_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    expires_at    TIMESTAMP    NOT NULL,
    revoked_at    TIMESTAMP    NULL                   -- NULL = still valid
);

CREATE INDEX IF NOT EXISTS idx_cred_worker       ON credentials (worker_id);
CREATE INDEX IF NOT EXISTS idx_cred_lender       ON credentials (lender_id);
CREATE INDEX IF NOT EXISTS idx_cred_expires      ON credentials (expires_at DESC);
CREATE INDEX IF NOT EXISTS idx_cred_active       ON credentials (worker_id, lender_id)
    WHERE revoked_at IS NULL;
