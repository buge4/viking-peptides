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

### Wave 2: DB Migrations (DONE - files created, USD cents)
- 001-viking-peptides-schema.sql (tables + weight/GH category seeds)
- 002-remaining-products-and-pairings.sql (remaining categories + discount tiers + exchange rates + auth tables)
- 003-specs-prices-pairings.sql (pricing in USD cents + 50+ pairings)
- All prices in USD cents (price_usd_cents, total_usd_cents, unit_price_usd_cents)

### Wave 4: Prices in USD (DONE - frontend)
- All frontend prices converted to USD cents
- formatPrice() shows $XX.XX across all pages
- CartContext.tsx has market-researched prices for all 70+ products
- SQL migrations updated to match

### Wave 7: API Routes on VPS Engine (DONE - deployed)
- vp-routes.ts deployed to /root/engine/src/viking-peptides/
- Registered in server.ts, mounted at /api/viking-peptides/
- 20+ endpoints: categories, products, pairings, cart, orders, admin, exchange-rates, discounts
- VP_LIVE=false guard returns 501 until DB migrations applied
- Live at: https://arctico.duckdns.org/api/viking-peptides/categories

### Wave 8: Admin Dashboard (IN PROGRESS)
- Building admin page at /admin route

---

## Remaining Waves

### Wave 3: Apply DB Migrations (BJORN-GATED: DDL on prod)
- Apply all 3 migration files to Supabase
- Verify: 70+ products, 100+ specs, 50+ pairings, discount tiers
- Set VP_LIVE=true in vp-routes.ts after migration

### Wave 5: Customer Auth (register/guest) + Admin Auth (magic link)
- Customer registration: email + password via Supabase Auth
- Guest checkout: no account required, email for order tracking
- Admin auth: magic link via Resend (BJORN-GATED: needs API key)
- Admin role assignment: only Bjorn can assign via DB flag
- Tables: vp_customers, vp_admin_users (added to migration 002)

### Wave 6: Payment System (USDT + TON + Visa/MC via Telegram)
- Accept USDT (TRC-20 or TON USDT)
- Accept TON/Gram native
- Visa/Mastercard through Telegram Stars payment system
- All payments through ledger_events (source_project='viking-peptides')
- Exchange rate cache: vp_exchange_rates table, cron every 5 min via CoinGecko

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
