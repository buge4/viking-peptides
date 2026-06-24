# Viking Peptides — Full E-Commerce Build Plan

**Date:** 2026-06-24
**Status:** EXECUTING
**Methodology:** Build Wave Loop (maker-checker from IBAS GBF)

---

## Completed Waves

### Wave 1: Frontend Scaffold (DONE)
- 70+ products, 9 categories, React Router, product pages, cart
- Volume discounts (3/5/10 tiers), pairings data, Norse design
- Deployed to https://arctico.duckdns.org/viking-peptides/
- GitHub: https://github.com/buge4/viking-peptides

### Wave 2: DB Migrations (DONE - files created)
- 001-viking-peptides-schema.sql (tables + weight/GH category seeds)
- 002-remaining-products-and-pairings.sql (all remaining categories)
- 003-specs-prices-pairings.sql (pricing + 200 pairings + discount tiers)

---

## Remaining Waves

### Wave 3: Apply DB Migrations (BJORN-GATED: DDL on prod)
- Apply all 3 migration files to Supabase
- Verify: 70+ products, 100+ specs, 50+ pairings, discount tiers

### Wave 4: Prices in USD + Exchange Rate Cache
- Change all pricing from PNGWIN to USD cents
- Create vp_exchange_rates table (ton_usd, usdt_usd, cached_at)
- systemd timer every 5 min to fetch TON/USD from CoinGecko, store in DB
- Frontend shows prices in USD ($29.99, $49.99 etc.)

### Wave 5: Customer Auth (register/guest) + Admin Auth (magic link)
- Customer registration: email + password via Supabase Auth
- Guest checkout: no account required, email for order tracking
- Admin auth: magic link via Resend (BJORN-GATED: needs API key)
- Admin role assignment: only Bjorn can assign via DB flag
- Tables: vp_customers, vp_admin_users

### Wave 6: Payment System (USDT + TON + Visa/MC via Telegram)
- Accept USDT (TRC-20 or TON USDT)
- Accept TON/Gram native
- Visa/Mastercard through Telegram Stars payment system
- All payments → ledger_events (source_project='viking-peptides')
- Tables: vp_payments (id, order_id, method, amount_usd, amount_crypto, tx_hash, status)

### Wave 7: API Routes on VPS Engine
- Register as SaaS tenant in Arctico
- Mount at /api/viking-peptides/
- Product catalog endpoints (categories, products, product/:slug, pairings)
- Cart/order endpoints with escrow
- Payment endpoints (initiate, confirm, webhook)
- Admin endpoints (update prices, manage discounts, view orders)

### Wave 8: Admin Dashboard
- Admin login page (magic link)
- Product management (edit prices, descriptions, stock status)
- Discount tier management (add/edit/remove tiers)
- Order management (view, update status, refund)
- Customer list
- Revenue dashboard

### Wave 9: SaaS Registration + Arctic Pay Integration
- Register viking-peptides tenant in saas_tenants
- Create API key (act_*) for viking-peptides
- Register in Arctic Pay token config
- Wire USDT/TON payment providers

### Wave 10: Infographics & Presentation (Nano Banana)
- Per-peptide infographic via Gemini (nano-banana-director agent)
- Interactive presentation website (scroll panels)
- Infographics toggle on product pages
- Body map showing where each peptide works

### Wave 11: AI Agents for Site Management
- Set up agent configs on Hetzner VPS
- Product content agent (updates descriptions, adds new products)
- Order processing agent (status updates, notifications)
- Price monitoring agent (competitor price checks)
- Customer support agent (FAQ, order tracking)

---

## Hard Gates (Bjorn must approve)
1. DB migrations on production Supabase
2. Resend API key for magic link auth
3. Payment wallet addresses for USDT/TON
4. Going live with real payments
5. Admin user assignments
