/**
 * Viking Peptides — E-commerce API Routes
 * Product slug: viking-peptides | Currency: USD (cents)
 *
 * Mounted at /api/viking-peptides when registered in server.ts:
 *   import { createVPRoutes } from '../viking-peptides/vp-routes';
 *   app.use('/api/viking-peptides', createVPRoutes(pool));
 *
 * All prices are in USD cents (integer). Frontend converts to dollars.
 * Accepted payment methods: USDT, TON, Visa/MC (NOT PNGWIN).
 *
 * Endpoints:
 *
 *   READ (no auth):
 *     GET  /categories                    — All categories with product count
 *     GET  /products                      — All products, optional ?category=slug
 *     GET  /products/:slug                — Single product with specs, category, pairings
 *     GET  /products/:slug/pairings       — Paired products with reasons
 *     GET  /discounts                     — Active discount tiers
 *     GET  /exchange-rates                — Latest TON/USD, USDT/USD rates
 *
 *   CART (require user_id):
 *     GET    /cart                         — Current draft order for user
 *     POST   /cart/items                   — Add item {product_id, spec_id, quantity}
 *     PATCH  /cart/items/:id               — Update quantity
 *     DELETE /cart/items/:id               — Remove item
 *
 *   ORDERS (require user_id):
 *     POST   /orders                       — Convert cart to pending, apply discounts
 *     GET    /orders                       — User order history
 *     GET    /orders/:id                   — Single order detail
 *     POST   /orders/:id/cancel            — Cancel order
 *
 *   ADMIN (require admin key):
 *     PUT    /admin/products/:id           — Update product
 *     PUT    /admin/discounts/:id          — Update discount tier
 *     POST   /admin/discounts              — Create new discount tier
 *     GET    /admin/orders                 — All orders with filters
 */

import { Router, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';

// ---------------------------------------------------------------------------
// Admin key check middleware
// ---------------------------------------------------------------------------

const ADMIN_KEY = process.env.ADMIN_KEY || 'cpx-admin-2026';

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const key =
    (req.headers['x-admin-key'] as string | undefined) ||
    (req.headers['authorization'] as string | undefined)?.replace('Bearer ', '') ||
    (req.query.admin_key as string | undefined);

  if (key !== ADMIN_KEY) {
    res.status(403).json({ ok: false, error: 'Forbidden', code: 'admin_required' });
    return;
  }
  next();
}

// ---------------------------------------------------------------------------
// User ID extraction (JWT, header, query param)
// ---------------------------------------------------------------------------

function decodeJwtUserId(authHeader: string): string | null {
  try {
    if (!authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    const payloadB64 = token.split('.')[1];
    if (!payloadB64) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
    return payload.sub || null;
  } catch {
    return null;
  }
}

function getUserId(req: Request): string | null {
  const fromQuery = (req.query?.user_id as string | undefined) || undefined;
  const fromHeader = (req.headers['x-user-id'] as string | undefined) || undefined;
  const authHeader = req.headers['authorization'] as string | undefined;
  const fromAuth = authHeader ? decodeJwtUserId(authHeader) : null;
  return fromQuery || fromHeader || fromAuth || null;
}

function requireUser(req: Request, res: Response, next: NextFunction): void {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ ok: false, error: 'User identification required', code: 'user_required' });
    return;
  }
  (req as any).userId = userId;
  next();
}

// ---------------------------------------------------------------------------
// UUID validation
// ---------------------------------------------------------------------------

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(id: string): boolean {
  return UUID_RE.test(id);
}

// ---------------------------------------------------------------------------
// Feature flag — set to true once vp_* migration has been applied
// ---------------------------------------------------------------------------

const VP_LIVE = false;

function notLive(res: Response): void {
  res.status(501).json({
    ok: false,
    error: 'Viking Peptides tables not yet deployed. Awaiting migration.',
    code: 'not_live',
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Factory function
// ═══════════════════════════════════════════════════════════════════════════

export function createVPRoutes(pool: Pool): Router {
  const router = Router();

  // -----------------------------------------------------------------------
  // Helper: run query via pool
  // -----------------------------------------------------------------------

  async function queryRows(text: string, params?: any[]): Promise<any[]> {
    const result = await pool.query(text, params);
    return result.rows;
  }

  async function queryOne(text: string, params?: any[]): Promise<any | null> {
    const result = await pool.query(text, params);
    return result.rows[0] || null;
  }

  // =======================================================================
  //  READ ENDPOINTS (no auth)
  // =======================================================================

  // --- GET /categories ---------------------------------------------------
  router.get('/categories', async (_req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const rows = await queryRows(`
        SELECT
          c.id,
          c.slug,
          c.name,
          c.tagline,
          c.icon,
          c.sort_order,
          COUNT(p.id)::int AS product_count
        FROM vp_categories c
        LEFT JOIN vp_products p ON p.category_id = c.id
        GROUP BY c.id
        ORDER BY c.sort_order ASC, c.name ASC
      `);
      res.json({ ok: true, data: rows });
    } catch (err: any) {
      console.error('[VP] GET /categories error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to fetch categories' });
    }
  });

  // --- GET /products -----------------------------------------------------
  router.get('/products', async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const categorySlug = req.query.category as string | undefined;

      let sql = `
        SELECT
          p.id,
          p.slug,
          p.name,
          p.short_description,
          p.mechanism_of_action,
          p.image_url,
          p.popular,
          p.in_stock,
          c.slug AS category_slug,
          c.name AS category_name,
          (
            SELECT MIN(ps.price_usd_cents)
            FROM vp_product_specs ps
            WHERE ps.product_id = p.id
          ) AS min_price_usd_cents,
          (
            SELECT MAX(ps.price_usd_cents)
            FROM vp_product_specs ps
            WHERE ps.product_id = p.id
          ) AS max_price_usd_cents
        FROM vp_products p
        JOIN vp_categories c ON c.id = p.category_id
      `;
      const params: any[] = [];

      if (categorySlug) {
        sql += ` WHERE c.slug = $1`;
        params.push(categorySlug);
      }

      sql += ` ORDER BY p.popular DESC, p.name ASC`;

      const rows = await queryRows(sql, params);
      res.json({ ok: true, data: rows });
    } catch (err: any) {
      console.error('[VP] GET /products error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to fetch products' });
    }
  });

  // --- GET /products/:slug (static route before param) -------------------
  // Note: /products/:slug/pairings is registered BEFORE this to avoid
  // "pairings" being captured as :slug. But since Express matches in
  // registration order and this is :slug, we register pairings first.

  // --- GET /products/:slug/pairings --------------------------------------
  router.get('/products/:slug/pairings', async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const { slug } = req.params;

      const product = await queryOne(`SELECT id FROM vp_products WHERE slug = $1`, [slug]);
      if (!product) {
        res.status(404).json({ ok: false, error: 'Product not found' });
        return;
      }

      const pairings = await queryRows(`
        SELECT
          pp.id,
          pp.reason,
          pp.stack_name,
          p2.id AS paired_product_id,
          p2.slug AS paired_slug,
          p2.name AS paired_name,
          p2.short_description AS paired_description,
          p2.image_url AS paired_image_url,
          p2.in_stock AS paired_in_stock
        FROM vp_product_pairings pp
        JOIN vp_products p2 ON p2.id = pp.paired_product_id
        WHERE pp.product_id = $1
        ORDER BY pp.id ASC
      `, [product.id]);

      res.json({ ok: true, data: pairings });
    } catch (err: any) {
      console.error('[VP] GET /products/:slug/pairings error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to fetch pairings' });
    }
  });

  // --- GET /products/:slug -----------------------------------------------
  router.get('/products/:slug', async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const { slug } = req.params;

      const product = await queryOne(`
        SELECT
          p.id,
          p.slug,
          p.name,
          p.short_description,
          p.long_description,
          p.mechanism_of_action,
          p.dosage_range,
          p.safety_notes,
          p.image_url,
          p.popular,
          p.in_stock,
          c.id AS category_id,
          c.slug AS category_slug,
          c.name AS category_name,
          c.tagline AS category_tagline
        FROM vp_products p
        JOIN vp_categories c ON c.id = p.category_id
        WHERE p.slug = $1
      `, [slug]);

      if (!product) {
        res.status(404).json({ ok: false, error: 'Product not found' });
        return;
      }

      // Fetch specs
      const specs = await queryRows(`
        SELECT id, spec_label, price_usd_cents, sort_order
        FROM vp_product_specs
        WHERE product_id = $1
        ORDER BY sort_order ASC, price_usd_cents ASC
      `, [product.id]);

      // Fetch pairings
      const pairings = await queryRows(`
        SELECT
          pp.id,
          pp.reason,
          pp.stack_name,
          p2.id AS paired_product_id,
          p2.slug AS paired_slug,
          p2.name AS paired_name,
          p2.short_description AS paired_description,
          p2.image_url AS paired_image_url
        FROM vp_product_pairings pp
        JOIN vp_products p2 ON p2.id = pp.paired_product_id
        WHERE pp.product_id = $1
        ORDER BY pp.id ASC
      `, [product.id]);

      res.json({
        ok: true,
        data: {
          ...product,
          specs,
          pairings,
        },
      });
    } catch (err: any) {
      console.error('[VP] GET /products/:slug error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to fetch product' });
    }
  });

  // --- GET /discounts ----------------------------------------------------
  router.get('/discounts', async (_req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const rows = await queryRows(`
        SELECT id, min_quantity, discount_pct, label, active
        FROM vp_discount_tiers
        WHERE active = true
        ORDER BY min_quantity ASC
      `);
      res.json({ ok: true, data: rows });
    } catch (err: any) {
      console.error('[VP] GET /discounts error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to fetch discounts' });
    }
  });

  // --- GET /exchange-rates -----------------------------------------------
  router.get('/exchange-rates', async (_req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      // Get the latest rate for each pair
      const rows = await queryRows(`
        SELECT DISTINCT ON (pair) pair, rate, fetched_at
        FROM vp_exchange_rates
        ORDER BY pair, fetched_at DESC
      `);
      res.json({ ok: true, data: rows });
    } catch (err: any) {
      console.error('[VP] GET /exchange-rates error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to fetch exchange rates' });
    }
  });

  // =======================================================================
  //  CART ENDPOINTS (require user_id)
  // =======================================================================

  // --- GET /cart ----------------------------------------------------------
  router.get('/cart', requireUser, async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const userId = (req as any).userId;

      // Find or describe draft order
      const order = await queryOne(`
        SELECT id, status, total_usd_cents, notes, created_at, updated_at
        FROM vp_orders
        WHERE user_id = $1 AND status = 'draft'
        ORDER BY created_at DESC
        LIMIT 1
      `, [userId]);

      if (!order) {
        res.json({ ok: true, data: { order: null, items: [], total_usd_cents: 0, item_count: 0 } });
        return;
      }

      const items = await queryRows(`
        SELECT
          oi.id,
          oi.product_id,
          oi.spec_id,
          oi.quantity,
          oi.unit_price_usd_cents,
          (oi.quantity * oi.unit_price_usd_cents) AS line_total_usd_cents,
          p.slug AS product_slug,
          p.name AS product_name,
          p.image_url AS product_image_url,
          ps.spec_label
        FROM vp_order_items oi
        JOIN vp_products p ON p.id = oi.product_id
        JOIN vp_product_specs ps ON ps.id = oi.spec_id
        WHERE oi.order_id = $1
        ORDER BY oi.id ASC
      `, [order.id]);

      const totalCents = items.reduce(
        (sum: number, i: any) => sum + Number(i.line_total_usd_cents),
        0
      );

      res.json({
        ok: true,
        data: {
          order: { ...order, total_usd_cents: totalCents },
          items,
          total_usd_cents: totalCents,
          item_count: items.reduce((sum: number, i: any) => sum + i.quantity, 0),
        },
      });
    } catch (err: any) {
      console.error('[VP] GET /cart error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to fetch cart' });
    }
  });

  // --- POST /cart/items ---------------------------------------------------
  router.post('/cart/items', requireUser, async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const userId = (req as any).userId;
      const { product_id, spec_id, quantity } = req.body;

      if (!product_id || !spec_id) {
        res.status(400).json({ ok: false, error: 'product_id and spec_id are required' });
        return;
      }

      const qty = Math.max(1, parseInt(quantity, 10) || 1);

      // Validate product exists and is in stock
      const product = await queryOne(`
        SELECT id, in_stock FROM vp_products WHERE id = $1
      `, [product_id]);
      if (!product) {
        res.status(404).json({ ok: false, error: 'Product not found' });
        return;
      }
      if (!product.in_stock) {
        res.status(400).json({ ok: false, error: 'Product is out of stock' });
        return;
      }

      // Validate spec belongs to product
      const spec = await queryOne(`
        SELECT id, price_usd_cents FROM vp_product_specs
        WHERE id = $1 AND product_id = $2
      `, [spec_id, product_id]);
      if (!spec) {
        res.status(400).json({ ok: false, error: 'Spec not found for this product' });
        return;
      }

      // Find or create draft order
      let order = await queryOne(`
        SELECT id FROM vp_orders
        WHERE user_id = $1 AND status = 'draft'
        ORDER BY created_at DESC
        LIMIT 1
      `, [userId]);

      if (!order) {
        order = await queryOne(`
          INSERT INTO vp_orders (user_id, status, total_usd_cents)
          VALUES ($1, 'draft', 0)
          RETURNING id
        `, [userId]);
      }

      // Check if same product+spec already in cart -> increment quantity
      const existing = await queryOne(`
        SELECT id, quantity FROM vp_order_items
        WHERE order_id = $1 AND product_id = $2 AND spec_id = $3
      `, [order.id, product_id, spec_id]);

      let item;
      if (existing) {
        item = await queryOne(`
          UPDATE vp_order_items
          SET quantity = quantity + $1
          WHERE id = $2
          RETURNING id, product_id, spec_id, quantity, unit_price_usd_cents
        `, [qty, existing.id]);
      } else {
        item = await queryOne(`
          INSERT INTO vp_order_items (order_id, product_id, spec_id, quantity, unit_price_usd_cents)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, product_id, spec_id, quantity, unit_price_usd_cents
        `, [order.id, product_id, spec_id, qty, spec.price_usd_cents]);
      }

      // Recalculate order total
      await recalcOrderTotal(order.id);

      res.status(201).json({ ok: true, data: item });
    } catch (err: any) {
      console.error('[VP] POST /cart/items error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to add cart item' });
    }
  });

  // --- PATCH /cart/items/:id ----------------------------------------------
  router.patch('/cart/items/:id', requireUser, async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const userId = (req as any).userId;
      const itemId = parseInt(req.params.id as string, 10);
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        res.status(400).json({ ok: false, error: 'quantity must be >= 1' });
        return;
      }

      // Verify item belongs to user's draft order
      const item = await queryOne(`
        SELECT oi.id, oi.order_id
        FROM vp_order_items oi
        JOIN vp_orders o ON o.id = oi.order_id
        WHERE oi.id = $1 AND o.user_id = $2 AND o.status = 'draft'
      `, [itemId, userId]);

      if (!item) {
        res.status(404).json({ ok: false, error: 'Cart item not found' });
        return;
      }

      const updated = await queryOne(`
        UPDATE vp_order_items
        SET quantity = $1
        WHERE id = $2
        RETURNING id, product_id, spec_id, quantity, unit_price_usd_cents
      `, [quantity, itemId]);

      await recalcOrderTotal(item.order_id);

      res.json({ ok: true, data: updated });
    } catch (err: any) {
      console.error('[VP] PATCH /cart/items/:id error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to update cart item' });
    }
  });

  // --- DELETE /cart/items/:id ---------------------------------------------
  router.delete('/cart/items/:id', requireUser, async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const userId = (req as any).userId;
      const itemId = parseInt(req.params.id as string, 10);

      // Verify item belongs to user's draft order
      const item = await queryOne(`
        SELECT oi.id, oi.order_id
        FROM vp_order_items oi
        JOIN vp_orders o ON o.id = oi.order_id
        WHERE oi.id = $1 AND o.user_id = $2 AND o.status = 'draft'
      `, [itemId, userId]);

      if (!item) {
        res.status(404).json({ ok: false, error: 'Cart item not found' });
        return;
      }

      await pool.query(`DELETE FROM vp_order_items WHERE id = $1`, [itemId]);

      await recalcOrderTotal(item.order_id);

      res.json({ ok: true, message: 'Item removed from cart' });
    } catch (err: any) {
      console.error('[VP] DELETE /cart/items/:id error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to remove cart item' });
    }
  });

  // =======================================================================
  //  ORDER ENDPOINTS (require user_id)
  // =======================================================================

  // --- POST /orders (convert cart to pending) ----------------------------
  router.post('/orders', requireUser, async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    const client = await pool.connect();
    try {
      const userId = (req as any).userId;
      const { shipping_address, notes } = req.body;

      await client.query('BEGIN');

      // Find draft order
      const draft = await client.query(`
        SELECT id FROM vp_orders
        WHERE user_id = $1 AND status = 'draft'
        ORDER BY created_at DESC
        LIMIT 1
      `, [userId]);

      if (draft.rows.length === 0) {
        await client.query('ROLLBACK');
        res.status(400).json({ ok: false, error: 'No cart found. Add items first.' });
        return;
      }

      const orderId = draft.rows[0].id;

      // Get all items
      const itemsResult = await client.query(`
        SELECT
          oi.id,
          oi.product_id,
          oi.spec_id,
          oi.quantity,
          oi.unit_price_usd_cents,
          p.in_stock
        FROM vp_order_items oi
        JOIN vp_products p ON p.id = oi.product_id
        WHERE oi.order_id = $1
      `, [orderId]);

      if (itemsResult.rows.length === 0) {
        await client.query('ROLLBACK');
        res.status(400).json({ ok: false, error: 'Cart is empty' });
        return;
      }

      // Verify all items still in stock
      const outOfStock = itemsResult.rows.filter((i: any) => !i.in_stock);
      if (outOfStock.length > 0) {
        await client.query('ROLLBACK');
        res.status(400).json({
          ok: false,
          error: 'Some items are out of stock',
          out_of_stock_ids: outOfStock.map((i: any) => i.product_id),
        });
        return;
      }

      // Calculate subtotal
      let subtotalCents = 0;
      let totalQuantity = 0;
      for (const item of itemsResult.rows) {
        subtotalCents += item.quantity * item.unit_price_usd_cents;
        totalQuantity += item.quantity;
      }

      // Apply volume discount
      const discountResult = await client.query(`
        SELECT discount_pct FROM vp_discount_tiers
        WHERE active = true AND min_quantity <= $1
        ORDER BY min_quantity DESC
        LIMIT 1
      `, [totalQuantity]);

      let discountPct = 0;
      if (discountResult.rows.length > 0) {
        discountPct = parseFloat(discountResult.rows[0].discount_pct);
      }

      const discountCents = Math.round(subtotalCents * (discountPct / 100));
      const totalCents = subtotalCents - discountCents;

      // Update order: draft -> pending
      await client.query(`
        UPDATE vp_orders
        SET
          status = 'pending',
          total_usd_cents = $1,
          shipping_address = $2,
          notes = $3,
          updated_at = NOW()
        WHERE id = $4
      `, [totalCents, shipping_address ? JSON.stringify(shipping_address) : null, notes || null, orderId]);

      await client.query('COMMIT');

      res.json({
        ok: true,
        data: {
          order_id: orderId,
          status: 'pending',
          subtotal_usd_cents: subtotalCents,
          discount_pct: discountPct,
          discount_usd_cents: discountCents,
          total_usd_cents: totalCents,
          item_count: totalQuantity,
        },
      });
    } catch (err: any) {
      await client.query('ROLLBACK');
      console.error('[VP] POST /orders error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to create order' });
    } finally {
      client.release();
    }
  });

  // --- GET /orders (static, before /:id) ---------------------------------
  router.get('/orders', requireUser, async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const userId = (req as any).userId;
      const status = req.query.status as string | undefined;

      let sql = `
        SELECT
          o.id,
          o.status,
          o.total_usd_cents,
          o.notes,
          o.created_at,
          o.updated_at,
          (SELECT COUNT(*)::int FROM vp_order_items oi WHERE oi.order_id = o.id) AS item_count
        FROM vp_orders o
        WHERE o.user_id = $1
      `;
      const params: any[] = [userId];

      if (status) {
        sql += ` AND o.status = $2`;
        params.push(status);
      }

      // Exclude draft orders from history (those show via /cart)
      if (!status) {
        sql += ` AND o.status != 'draft'`;
      }

      sql += ` ORDER BY o.created_at DESC`;

      const rows = await queryRows(sql, params);
      res.json({ ok: true, data: rows });
    } catch (err: any) {
      console.error('[VP] GET /orders error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to fetch orders' });
    }
  });

  // --- GET /orders/:id ---------------------------------------------------
  router.get('/orders/:id', requireUser, async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const userId = (req as any).userId;
      const orderId = req.params.id as string;

      if (!isValidUuid(orderId)) {
        res.status(400).json({ ok: false, error: 'Invalid order ID' });
        return;
      }

      const order = await queryOne(`
        SELECT id, status, total_usd_cents, shipping_address, notes, hold_id, created_at, updated_at
        FROM vp_orders
        WHERE id = $1 AND user_id = $2
      `, [orderId, userId]);

      if (!order) {
        res.status(404).json({ ok: false, error: 'Order not found' });
        return;
      }

      const items = await queryRows(`
        SELECT
          oi.id,
          oi.product_id,
          oi.spec_id,
          oi.quantity,
          oi.unit_price_usd_cents,
          (oi.quantity * oi.unit_price_usd_cents) AS line_total_usd_cents,
          p.slug AS product_slug,
          p.name AS product_name,
          p.image_url AS product_image_url,
          ps.spec_label
        FROM vp_order_items oi
        JOIN vp_products p ON p.id = oi.product_id
        JOIN vp_product_specs ps ON ps.id = oi.spec_id
        WHERE oi.order_id = $1
        ORDER BY oi.id ASC
      `, [orderId]);

      res.json({ ok: true, data: { ...order, items } });
    } catch (err: any) {
      console.error('[VP] GET /orders/:id error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to fetch order' });
    }
  });

  // --- POST /orders/:id/cancel -------------------------------------------
  router.post('/orders/:id/cancel', requireUser, async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const userId = (req as any).userId;
      const orderId = req.params.id as string;

      if (!isValidUuid(orderId)) {
        res.status(400).json({ ok: false, error: 'Invalid order ID' });
        return;
      }

      const order = await queryOne(`
        SELECT id, status FROM vp_orders
        WHERE id = $1 AND user_id = $2
      `, [orderId, userId]);

      if (!order) {
        res.status(404).json({ ok: false, error: 'Order not found' });
        return;
      }

      if (order.status !== 'pending' && order.status !== 'draft') {
        res.status(400).json({
          ok: false,
          error: `Cannot cancel order with status '${order.status}'. Only pending or draft orders can be cancelled.`,
        });
        return;
      }

      await pool.query(`
        UPDATE vp_orders
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = $1
      `, [orderId]);

      res.json({ ok: true, message: 'Order cancelled', data: { order_id: orderId, status: 'cancelled' } });
    } catch (err: any) {
      console.error('[VP] POST /orders/:id/cancel error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to cancel order' });
    }
  });

  // =======================================================================
  //  ADMIN ENDPOINTS
  // =======================================================================

  // --- PUT /admin/products/:id -------------------------------------------
  router.put('/admin/products/:id', requireAdmin, async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const productId = parseInt(req.params.id as string, 10);
      if (isNaN(productId)) {
        res.status(400).json({ ok: false, error: 'Invalid product ID' });
        return;
      }

      const existing = await queryOne(`SELECT id FROM vp_products WHERE id = $1`, [productId]);
      if (!existing) {
        res.status(404).json({ ok: false, error: 'Product not found' });
        return;
      }

      // Allowed fields to update
      const allowedFields = [
        'name', 'short_description', 'long_description', 'mechanism_of_action',
        'dosage_range', 'safety_notes', 'image_url', 'popular', 'in_stock',
      ];

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates.push(`${field} = $${paramIndex}`);
          values.push(req.body[field]);
          paramIndex++;
        }
      }

      if (updates.length === 0) {
        res.status(400).json({ ok: false, error: 'No valid fields to update' });
        return;
      }

      values.push(productId);
      const updated = await queryOne(`
        UPDATE vp_products
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, values);

      res.json({ ok: true, data: updated });
    } catch (err: any) {
      console.error('[VP] PUT /admin/products/:id error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to update product' });
    }
  });

  // --- POST /admin/discounts ---------------------------------------------
  router.post('/admin/discounts', requireAdmin, async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const { min_quantity, discount_pct, label, active } = req.body;

      if (min_quantity === undefined || discount_pct === undefined) {
        res.status(400).json({ ok: false, error: 'min_quantity and discount_pct are required' });
        return;
      }

      const created = await queryOne(`
        INSERT INTO vp_discount_tiers (min_quantity, discount_pct, label, active)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [min_quantity, discount_pct, label || null, active !== false]);

      res.status(201).json({ ok: true, data: created });
    } catch (err: any) {
      console.error('[VP] POST /admin/discounts error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to create discount tier' });
    }
  });

  // --- PUT /admin/discounts/:id ------------------------------------------
  router.put('/admin/discounts/:id', requireAdmin, async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const tierId = parseInt(req.params.id as string, 10);
      if (isNaN(tierId)) {
        res.status(400).json({ ok: false, error: 'Invalid discount tier ID' });
        return;
      }

      const existing = await queryOne(`SELECT id FROM vp_discount_tiers WHERE id = $1`, [tierId]);
      if (!existing) {
        res.status(404).json({ ok: false, error: 'Discount tier not found' });
        return;
      }

      const allowedFields = ['min_quantity', 'discount_pct', 'label', 'active'];
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates.push(`${field} = $${paramIndex}`);
          values.push(req.body[field]);
          paramIndex++;
        }
      }

      if (updates.length === 0) {
        res.status(400).json({ ok: false, error: 'No valid fields to update' });
        return;
      }

      values.push(tierId);
      const updated = await queryOne(`
        UPDATE vp_discount_tiers
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, values);

      res.json({ ok: true, data: updated });
    } catch (err: any) {
      console.error('[VP] PUT /admin/discounts/:id error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to update discount tier' });
    }
  });

  // --- GET /admin/orders -------------------------------------------------
  router.get('/admin/orders', requireAdmin, async (req: Request, res: Response) => {
    if (!VP_LIVE) return notLive(res);
    try {
      const status = req.query.status as string | undefined;
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 50, 200);
      const offset = parseInt(req.query.offset as string, 10) || 0;

      let sql = `
        SELECT
          o.id,
          o.user_id,
          o.status,
          o.total_usd_cents,
          o.shipping_address,
          o.notes,
          o.created_at,
          o.updated_at,
          (SELECT COUNT(*)::int FROM vp_order_items oi WHERE oi.order_id = o.id) AS item_count,
          u.display_name AS user_display_name,
          u.email AS user_email
        FROM vp_orders o
        LEFT JOIN users u ON u.id = o.user_id
      `;
      const params: any[] = [];
      let paramIndex = 1;

      if (status) {
        sql += ` WHERE o.status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      sql += ` ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);

      const rows = await queryRows(sql, params);

      // Get total count for pagination
      let countSql = `SELECT COUNT(*)::int AS total FROM vp_orders`;
      const countParams: any[] = [];
      if (status) {
        countSql += ` WHERE status = $1`;
        countParams.push(status);
      }
      const countRow = await queryOne(countSql, countParams);

      res.json({
        ok: true,
        data: rows,
        pagination: {
          total: countRow?.total || 0,
          limit,
          offset,
        },
      });
    } catch (err: any) {
      console.error('[VP] GET /admin/orders error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to fetch orders' });
    }
  });

  // =======================================================================
  //  INTERNAL HELPERS
  // =======================================================================

  /** Recalculate and update the total_usd_cents on a draft order */
  async function recalcOrderTotal(orderId: string): Promise<void> {
    await pool.query(`
      UPDATE vp_orders
      SET
        total_usd_cents = COALESCE((
          SELECT SUM(quantity * unit_price_usd_cents)
          FROM vp_order_items
          WHERE order_id = $1
        ), 0),
        updated_at = NOW()
      WHERE id = $1
    `, [orderId]);
  }

  return router;
}
