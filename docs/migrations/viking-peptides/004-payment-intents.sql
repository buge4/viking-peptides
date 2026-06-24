-- Viking Peptides Migration 004: Payment intents for TON/USDT payments
-- Tracks pending deposits, confirmations, and reconciliation

BEGIN;

CREATE TABLE IF NOT EXISTS vp_payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES vp_orders(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('TON', 'USDT_TON', 'USDT_TRC20', 'STARS')),
  amount_usd_cents BIGINT NOT NULL,
  amount_crypto NUMERIC(20,9),        -- amount in crypto (TON, USDT)
  exchange_rate NUMERIC(20,8),         -- rate at time of intent creation
  deposit_address TEXT NOT NULL,       -- wallet address to send to
  memo TEXT,                           -- unique memo/comment for identification
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'detected', 'confirming', 'confirmed', 'credited', 'expired', 'failed')),
  tx_hash TEXT,                        -- on-chain transaction hash
  tx_lt BIGINT,                        -- TON logical time
  confirmed_at TIMESTAMPTZ,
  credited_at TIMESTAMPTZ,
  ledger_event_id BIGINT,             -- references ledger_events(id) after credit
  source_ref TEXT UNIQUE,             -- idempotency: ton:<txid>:<idx>
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 minutes'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vp_payment_intents_order ON vp_payment_intents(order_id);
CREATE INDEX idx_vp_payment_intents_status ON vp_payment_intents(status);
CREATE INDEX idx_vp_payment_intents_memo ON vp_payment_intents(memo);
CREATE INDEX idx_vp_payment_intents_source_ref ON vp_payment_intents(source_ref);

-- Safety caps table
CREATE TABLE IF NOT EXISTS vp_payment_caps (
  id SERIAL PRIMARY KEY,
  cap_type TEXT NOT NULL CHECK (cap_type IN ('per_tx', 'daily')),
  max_usd_cents BIGINT NOT NULL,
  current_usd_cents BIGINT DEFAULT 0,
  reset_at TIMESTAMPTZ,                -- for daily: resets at midnight UTC
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO vp_payment_caps (cap_type, max_usd_cents) VALUES
('per_tx', 100000),    -- $1,000 per transaction
('daily', 1000000);    -- $10,000 daily

-- Reconciliation log
CREATE TABLE IF NOT EXISTS vp_reconciliation_log (
  id SERIAL PRIMARY KEY,
  check_type TEXT NOT NULL,            -- 'pre_credit', 'post_credit', 'daily_audit'
  payment_intent_id UUID REFERENCES vp_payment_intents(id),
  expected_amount NUMERIC(20,9),
  actual_amount NUMERIC(20,9),
  delta NUMERIC(20,9),
  status TEXT CHECK (status IN ('pass', 'fail', 'warning')),
  details JSONB,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
