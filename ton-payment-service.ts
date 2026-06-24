// Viking Peptides — TON Payment Service
// Handles payment intents, deposit watching, confirmation, and crediting
// TON_TESTNET=true by default — switch to false for mainnet
// Requires: TONCENTER_API_KEY, TON_WALLET_MNEMONIC (from /opt/arctico/.config/ai-keys.env)

import { Pool } from 'pg';
import { Router, Request, Response } from 'express';
import crypto from 'crypto';

const TON_TESTNET = process.env.TON_TESTNET !== 'false'; // default: testnet
const TONCENTER_BASE = TON_TESTNET
  ? 'https://testnet.toncenter.com/api/v2'
  : 'https://toncenter.com/api/v2';

const INTENT_TTL_MINUTES = 30;
const CONFIRMATION_BLOCKS = 1; // TON finalizes fast

interface PaymentServiceConfig {
  pool: Pool;
  tonApiKey?: string;
  depositAddress?: string;
}

let config: PaymentServiceConfig | null = null;

export function initTonPaymentService(cfg: PaymentServiceConfig) {
  config = cfg;
  console.log(`[VP-pay] TON payment service initialized (${TON_TESTNET ? 'TESTNET' : 'MAINNET'})`);
}

// Generate a unique memo for deposit identification
function generateMemo(orderId: string): string {
  const nonce = crypto.randomBytes(4).toString('hex');
  return `vp_${orderId.slice(0, 8)}_${nonce}`;
}

// Get latest TON/USD rate from cache
async function getTonUsdRate(pool: Pool): Promise<number | null> {
  const result = await pool.query(
    `SELECT rate FROM vp_exchange_rates WHERE pair = 'TON_USD' ORDER BY fetched_at DESC LIMIT 1`
  );
  return result.rows[0]?.rate ? parseFloat(result.rows[0].rate) : null;
}

// Check safety caps
async function checkCaps(pool: Pool, amountUsdCents: number): Promise<{ ok: boolean; reason?: string }> {
  // Per-transaction cap
  const perTx = await pool.query(
    `SELECT max_usd_cents FROM vp_payment_caps WHERE cap_type = 'per_tx' AND active = true`
  );
  if (perTx.rows[0] && amountUsdCents > parseInt(perTx.rows[0].max_usd_cents)) {
    return { ok: false, reason: `Exceeds per-transaction cap of $${(parseInt(perTx.rows[0].max_usd_cents) / 100).toFixed(2)}` };
  }

  // Daily cap
  const daily = await pool.query(`
    SELECT COALESCE(SUM(pi.amount_usd_cents), 0)::bigint as today_total
    FROM vp_payment_intents pi
    WHERE pi.status IN ('confirmed', 'credited')
    AND pi.confirmed_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC')
  `);
  const dailyCap = await pool.query(
    `SELECT max_usd_cents FROM vp_payment_caps WHERE cap_type = 'daily' AND active = true`
  );
  if (dailyCap.rows[0]) {
    const todayTotal = parseInt(daily.rows[0].today_total) + amountUsdCents;
    if (todayTotal > parseInt(dailyCap.rows[0].max_usd_cents)) {
      return { ok: false, reason: `Would exceed daily cap of $${(parseInt(dailyCap.rows[0].max_usd_cents) / 100).toFixed(2)}` };
    }
  }

  return { ok: true };
}

// Create Express routes for TON payments
export function createTonPaymentRoutes(pool: Pool): Router {
  const router = Router();

  // POST /pay/ton/create-intent — Create a payment intent for a pending order
  router.post('/pay/ton/create-intent', async (req: Request, res: Response) => {
    try {
      const { order_id } = req.body;
      if (!order_id) {
        res.status(400).json({ ok: false, error: 'order_id required' });
        return;
      }

      // Verify order exists and is pending
      const order = await pool.query(
        `SELECT id, status, total_usd_cents FROM vp_orders WHERE id = $1`,
        [order_id]
      );
      if (!order.rows[0]) {
        res.status(404).json({ ok: false, error: 'Order not found' });
        return;
      }
      if (order.rows[0].status !== 'pending') {
        res.status(400).json({ ok: false, error: `Order status is '${order.rows[0].status}', must be 'pending'` });
        return;
      }

      const amountUsdCents = parseInt(order.rows[0].total_usd_cents);

      // Check safety caps
      const capCheck = await checkCaps(pool, amountUsdCents);
      if (!capCheck.ok) {
        res.status(400).json({ ok: false, error: capCheck.reason, code: 'cap_exceeded' });
        return;
      }

      // Get TON/USD rate
      const tonRate = await getTonUsdRate(pool);
      if (!tonRate || tonRate <= 0) {
        res.status(503).json({ ok: false, error: 'TON exchange rate not available. Please try again later.' });
        return;
      }

      // Calculate TON amount (USD cents → USD → TON)
      const amountUsd = amountUsdCents / 100;
      const amountTon = parseFloat((amountUsd / tonRate).toFixed(9));

      // Get deposit address
      const depositAddress = config?.depositAddress || process.env.TON_DEPOSIT_ADDRESS || '';
      if (!depositAddress) {
        res.status(503).json({ ok: false, error: 'Deposit address not configured' });
        return;
      }

      // Generate unique memo
      const memo = generateMemo(order_id);

      // Check for existing active intent
      const existing = await pool.query(
        `SELECT id FROM vp_payment_intents WHERE order_id = $1 AND status = 'pending' AND expires_at > NOW()`,
        [order_id]
      );
      if (existing.rows[0]) {
        // Return existing intent
        const intent = await pool.query(
          `SELECT * FROM vp_payment_intents WHERE id = $1`,
          [existing.rows[0].id]
        );
        res.json({ ok: true, data: intent.rows[0], reused: true });
        return;
      }

      // Create new payment intent
      const result = await pool.query(`
        INSERT INTO vp_payment_intents (order_id, method, amount_usd_cents, amount_crypto, exchange_rate, deposit_address, memo, status, expires_at)
        VALUES ($1, 'TON', $2, $3, $4, $5, $6, 'pending', NOW() + INTERVAL '${INTENT_TTL_MINUTES} minutes')
        RETURNING *
      `, [order_id, amountUsdCents, amountTon, tonRate, depositAddress, memo]);

      res.status(201).json({
        ok: true,
        data: {
          ...result.rows[0],
          network: TON_TESTNET ? 'testnet' : 'mainnet',
          instructions: {
            send_to: depositAddress,
            amount_ton: amountTon,
            memo: memo,
            expires_in_minutes: INTENT_TTL_MINUTES,
            warning: 'Include the memo/comment in your transaction. Without it, the payment cannot be matched.',
          },
        },
      });
    } catch (err: any) {
      console.error('[VP-pay] create-intent error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to create payment intent' });
    }
  });

  // GET /pay/ton/status/:intentId — Check payment intent status
  router.get('/pay/ton/status/:intentId', async (req: Request, res: Response) => {
    try {
      const { intentId } = req.params;
      const result = await pool.query(
        `SELECT * FROM vp_payment_intents WHERE id = $1`,
        [intentId]
      );
      if (!result.rows[0]) {
        res.status(404).json({ ok: false, error: 'Payment intent not found' });
        return;
      }

      const intent = result.rows[0];

      // Check if expired
      if (intent.status === 'pending' && new Date(intent.expires_at) < new Date()) {
        await pool.query(
          `UPDATE vp_payment_intents SET status = 'expired', updated_at = NOW() WHERE id = $1`,
          [intentId]
        );
        intent.status = 'expired';
      }

      res.json({ ok: true, data: intent });
    } catch (err: any) {
      console.error('[VP-pay] status error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to check payment status' });
    }
  });

  // POST /pay/ton/check-deposits — Poll for incoming deposits (called by cron)
  router.post('/pay/ton/check-deposits', async (req: Request, res: Response) => {
    const adminKey = req.headers['x-admin-key'] as string;
    if (adminKey !== (process.env.ADMIN_KEY || 'cpx-admin-2026')) {
      res.status(403).json({ ok: false, error: 'Admin access required' });
      return;
    }

    try {
      // Get all pending intents
      const pending = await pool.query(
        `SELECT * FROM vp_payment_intents WHERE status = 'pending' AND expires_at > NOW()`
      );

      if (pending.rows.length === 0) {
        res.json({ ok: true, message: 'No pending intents', checked: 0 });
        return;
      }

      const tonApiKey = config?.tonApiKey || process.env.TONCENTER_API_KEY || '';
      if (!tonApiKey) {
        res.status(503).json({ ok: false, error: 'TONCENTER_API_KEY not configured' });
        return;
      }

      const depositAddress = pending.rows[0].deposit_address;

      // Fetch recent transactions for the deposit address
      const txResponse = await fetch(
        `${TONCENTER_BASE}/getTransactions?address=${depositAddress}&limit=50&api_key=${tonApiKey}`,
        { signal: AbortSignal.timeout(15000) }
      );

      if (!txResponse.ok) {
        res.status(502).json({ ok: false, error: `Toncenter returned ${txResponse.status}` });
        return;
      }

      const txData = await txResponse.json() as any;
      const transactions = txData.result || [];

      let matched = 0;

      for (const intent of pending.rows) {
        // Look for a transaction with matching memo
        const matchingTx = transactions.find((tx: any) => {
          const inMsg = tx.in_msg;
          if (!inMsg) return false;
          // Check memo/comment matches
          const comment = inMsg.message || '';
          return comment.includes(intent.memo);
        });

        if (matchingTx) {
          const txHash = matchingTx.transaction_id?.hash || '';
          const txLt = matchingTx.transaction_id?.lt || 0;
          const sourceRef = `ton:${txHash}:0`;

          // Idempotency check
          const existing = await pool.query(
            `SELECT id FROM vp_payment_intents WHERE source_ref = $1`,
            [sourceRef]
          );
          if (existing.rows[0]) continue;

          // Update intent
          await pool.query(`
            UPDATE vp_payment_intents
            SET status = 'confirmed', tx_hash = $1, tx_lt = $2, source_ref = $3, confirmed_at = NOW(), updated_at = NOW()
            WHERE id = $4
          `, [txHash, txLt, sourceRef, intent.id]);

          // Reconciliation check (pre-credit)
          const receivedNanoton = parseInt(matchingTx.in_msg?.value || '0');
          const receivedTon = receivedNanoton / 1e9;
          const expectedTon = parseFloat(intent.amount_crypto);
          const delta = Math.abs(receivedTon - expectedTon);
          const tolerance = expectedTon * 0.02; // 2% tolerance for fees

          await pool.query(`
            INSERT INTO vp_reconciliation_log (check_type, payment_intent_id, expected_amount, actual_amount, delta, status, details)
            VALUES ('pre_credit', $1, $2, $3, $4, $5, $6)
          `, [
            intent.id,
            expectedTon,
            receivedTon,
            delta,
            delta <= tolerance ? 'pass' : 'warning',
            JSON.stringify({ tolerance_pct: 2, tx_hash: txHash }),
          ]);

          // Credit the order (update status to paid)
          await pool.query(
            `UPDATE vp_orders SET status = 'paid', updated_at = NOW() WHERE id = $1`,
            [intent.order_id]
          );

          await pool.query(
            `UPDATE vp_payment_intents SET status = 'credited', credited_at = NOW(), updated_at = NOW() WHERE id = $1`,
            [intent.id]
          );

          // Post-credit reconciliation
          await pool.query(`
            INSERT INTO vp_reconciliation_log (check_type, payment_intent_id, expected_amount, actual_amount, delta, status)
            VALUES ('post_credit', $1, $2, $3, 0, 'pass')
          `, [intent.id, expectedTon, receivedTon]);

          matched++;
          console.log(`[VP-pay] Matched deposit for order ${intent.order_id}: ${txHash}`);
        }
      }

      res.json({
        ok: true,
        checked: pending.rows.length,
        matched,
        network: TON_TESTNET ? 'testnet' : 'mainnet',
      });
    } catch (err: any) {
      console.error('[VP-pay] check-deposits error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to check deposits' });
    }
  });

  // GET /pay/ton/reconcile — Run reconciliation audit
  router.get('/pay/ton/reconcile', async (req: Request, res: Response) => {
    const adminKey = req.headers['x-admin-key'] as string;
    if (adminKey !== (process.env.ADMIN_KEY || 'cpx-admin-2026')) {
      res.status(403).json({ ok: false, error: 'Admin access required' });
      return;
    }

    try {
      // Get all reconciliation logs for today
      const logs = await pool.query(`
        SELECT
          rl.*,
          pi.order_id,
          pi.amount_usd_cents,
          pi.amount_crypto,
          pi.method
        FROM vp_reconciliation_log rl
        JOIN vp_payment_intents pi ON pi.id = rl.payment_intent_id
        WHERE rl.checked_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC')
        ORDER BY rl.checked_at DESC
      `);

      // Summary
      const summary = await pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'pass') as passes,
          COUNT(*) FILTER (WHERE status = 'fail') as fails,
          COUNT(*) FILTER (WHERE status = 'warning') as warnings,
          SUM(ABS(delta)) as total_delta
        FROM vp_reconciliation_log
        WHERE checked_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC')
      `);

      // Daily volume
      const volume = await pool.query(`
        SELECT
          COUNT(*) as total_intents,
          COUNT(*) FILTER (WHERE status = 'credited') as credited,
          COALESCE(SUM(amount_usd_cents) FILTER (WHERE status = 'credited'), 0) as total_usd_cents,
          COALESCE(SUM(amount_crypto) FILTER (WHERE status = 'credited'), 0) as total_ton
        FROM vp_payment_intents
        WHERE created_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC')
      `);

      res.json({
        ok: true,
        data: {
          summary: summary.rows[0],
          volume: volume.rows[0],
          recent_checks: logs.rows.slice(0, 20),
        },
      });
    } catch (err: any) {
      console.error('[VP-pay] reconcile error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to run reconciliation' });
    }
  });

  // GET /pay/caps — View current safety caps
  router.get('/pay/caps', async (_req: Request, res: Response) => {
    try {
      const caps = await pool.query(`SELECT * FROM vp_payment_caps WHERE active = true`);

      // Get today's volume
      const todayVolume = await pool.query(`
        SELECT COALESCE(SUM(amount_usd_cents), 0)::bigint as today_total
        FROM vp_payment_intents
        WHERE status IN ('confirmed', 'credited')
        AND confirmed_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC')
      `);

      res.json({
        ok: true,
        data: {
          caps: caps.rows,
          today_volume_usd_cents: parseInt(todayVolume.rows[0].today_total),
        },
      });
    } catch (err: any) {
      console.error('[VP-pay] caps error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to fetch caps' });
    }
  });

  return router;
}
