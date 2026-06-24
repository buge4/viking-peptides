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
- 004-payment-intents.sql (payment intents, safety caps, reconciliation log)
- All prices in USD cents (price_usd_cents, total_usd_cents, unit_price_usd_cents)

### Wave 3: Apply DB Migrations (DONE)
- All 4 migration files applied to Supabase
- Verified: 68 products, 122 specs, 51 pairings, 9 categories, 3 discount tiers
- Payment tables: vp_payment_intents, vp_payment_caps, vp_reconciliation_log
- VP_LIVE=true set in vp-routes.ts
- API returns live data from production DB

### Wave 4: Prices in USD (DONE - frontend)
- All frontend prices converted to USD cents
- formatPrice() shows $XX.XX across all pages
- CartContext.tsx has market-researched prices for all 70+ products
- SQL migrations updated to match

### Wave 6: Payment System (DONE - code ready, testnet)
- ton-payment-service.ts: 5 endpoints (create-intent, status, check-deposits, reconcile, caps)
- exchange-rate-cron.ts: CoinGecko TON/USD + USDT/USD every 5 minutes
- 004-payment-intents.sql: Applied (payment intents, safety caps $1K/tx + $10K/day, reconciliation log)
- Testnet by default (TON_TESTNET=true)
- Idempotent credits via source_ref UNIQUE constraint
- Pre-credit + post-credit reconciliation with 2% tolerance
- Awaiting: TONCENTER_API_KEY, TON_DEPOSIT_ADDRESS from Mac Mini

### Wave 7: API Routes on VPS Engine (DONE - deployed)
- vp-routes.ts deployed to /root/engine/src/viking-peptides/
- Registered in server.ts, mounted at /api/viking-peptides/
- 20+ endpoints: categories, products, pairings, cart, orders, admin, exchange-rates, discounts
- VP_LIVE=true, API returns live data
- Live at: https://arctico.duckdns.org/api/viking-peptides/categories

### Wave 8: Admin Dashboard (DONE)
- AdminPage.tsx with password gate (cpx-admin-2026)
- 4 tabs: Products (searchable), Discounts (editable), Orders, Analytics
- Subtle lock icon in header (hidden until hover)
- Built and deployed

### Wave 9: SaaS Registration (DONE)
- viking-peptides registered as saas_tenant (id: 5dd73d81-f209-4feb-a59d-472e7365f719)
- API key: vp_live_viking2026 (SHA-256 hashed)
- game_deployments entry: ecommerce, marketplace, USD currency

### Wave 10: Infographics & Science Data (IN PROGRESS)
- peptideScience.ts: Complete science data for all 9 categories + 12 product overrides
- Body regions, mechanism steps, research timelines, molecular stats
- Molecular weight, amino acid count, and sequence for key peptides
- PeptideInfoGraphic.tsx: Building (body map SVG, mechanism flow, timeline, stats)

---

## Remaining Waves

### Wave 5: Customer Auth (register/guest) + Admin Auth (magic link)
- Customer registration: email + password via Supabase Auth
- Guest checkout: no account required, email for order tracking
- Admin auth: magic link via Resend (awaiting API key from Mac Mini)
- Admin role assignment: only Bjorn can assign via DB flag
- Tables: vp_customers, vp_admin_users (created in migration 002)

### Wave 11: AI Agents for Site Management
- Set up agent configs on Hetzner VPS
- Product content agent (updates descriptions, adds new products)
- Order processing agent (status updates, notifications)
- Price monitoring agent (competitor price checks)
- Customer support agent (FAQ, order tracking)

---

## Awaiting from Mac Mini
1. TONCENTER_API_KEY — for TON deposit watching
2. TON_DEPOSIT_ADDRESS — deposit wallet for payments
3. TON_WALLET_MNEMONIC — for payout signing
4. RESEND_API_KEY — for magic link auth + receipt emails
