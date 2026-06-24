-- Viking Peptides Migration 005: Guest checkout support
-- Adds customer_id to orders, allows user_id to be nullable for guest orders

BEGIN;

-- Add customer_id FK to vp_orders
ALTER TABLE vp_orders ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES vp_customers(id);
CREATE INDEX IF NOT EXISTS idx_vp_orders_customer ON vp_orders(customer_id);

-- Make user_id nullable for guest orders (guests don't have a users table entry)
ALTER TABLE vp_orders ALTER COLUMN user_id DROP NOT NULL;

COMMIT;
