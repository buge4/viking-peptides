/**
 * Viking Peptides — Customer Auth Service
 *
 * Endpoints:
 *   POST /auth/guest              — Guest checkout (upsert by email)
 *   POST /auth/register           — Register with password
 *   POST /auth/login              — Login with email/password
 *   POST /auth/admin/magic-link   — Send admin magic link via Resend
 *   POST /auth/admin/verify       — Verify admin magic link token
 *
 * Mounted at /api/viking-peptides via server.ts:
 *   app.use('/api/viking-peptides', createVPAuthRoutes(pool));
 */

import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendAdminMagicLink } from './vp-email-service';

const BCRYPT_ROUNDS = 10;
const MAGIC_LINK_TTL_MINUTES = 15;

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createVPAuthRoutes(pool: Pool): Router {
  const router = Router();

  // -----------------------------------------------------------------------
  // POST /auth/guest — Guest checkout (upsert by email)
  // -----------------------------------------------------------------------
  router.post('/auth/guest', async (req: Request, res: Response) => {
    try {
      const { email, full_name } = req.body;

      if (!email || typeof email !== 'string') {
        res.status(400).json({ ok: false, error: 'email is required' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Upsert: if email exists, return existing customer; if not, create guest
      const result = await pool.query(`
        INSERT INTO vp_customers (id, email, display_name, is_guest, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, true, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET
          display_name = COALESCE(EXCLUDED.display_name, vp_customers.display_name),
          updated_at = NOW()
        RETURNING id, email, display_name
      `, [normalizedEmail, full_name || null]);

      const customer = result.rows[0];

      res.json({
        ok: true,
        data: {
          customer_id: customer.id,
          email: customer.email,
          display_name: customer.display_name,
        },
      });
    } catch (err: any) {
      console.error('[VP-auth] POST /auth/guest error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to process guest checkout' });
    }
  });

  // -----------------------------------------------------------------------
  // POST /auth/register — Register with password
  // -----------------------------------------------------------------------
  router.post('/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, full_name } = req.body;

      if (!email || typeof email !== 'string') {
        res.status(400).json({ ok: false, error: 'email is required' });
        return;
      }
      if (!password || typeof password !== 'string' || password.length < 6) {
        res.status(400).json({ ok: false, error: 'password is required (minimum 6 characters)' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check if account already exists with a password (not guest)
      const existing = await pool.query(
        `SELECT id, is_guest, password_hash FROM vp_customers WHERE email = $1`,
        [normalizedEmail]
      );

      if (existing.rows[0] && !existing.rows[0].is_guest && existing.rows[0].password_hash) {
        res.status(409).json({ ok: false, error: 'An account with this email already exists', code: 'email_taken' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

      let customer;

      if (existing.rows[0]) {
        // Upgrade guest to registered
        const upgraded = await pool.query(`
          UPDATE vp_customers
          SET password_hash = $1, is_guest = false, display_name = COALESCE($2, display_name), updated_at = NOW()
          WHERE id = $3
          RETURNING id, email, display_name
        `, [passwordHash, full_name || null, existing.rows[0].id]);
        customer = upgraded.rows[0];
      } else {
        // Create new registered customer
        const created = await pool.query(`
          INSERT INTO vp_customers (id, email, display_name, password_hash, is_guest, created_at, updated_at)
          VALUES (gen_random_uuid(), $1, $2, $3, false, NOW(), NOW())
          RETURNING id, email, display_name
        `, [normalizedEmail, full_name || null, passwordHash]);
        customer = created.rows[0];
      }

      res.status(201).json({
        ok: true,
        data: {
          customer_id: customer.id,
          email: customer.email,
          display_name: customer.display_name,
        },
      });
    } catch (err: any) {
      console.error('[VP-auth] POST /auth/register error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to register account' });
    }
  });

  // -----------------------------------------------------------------------
  // POST /auth/login — Login with email/password
  // -----------------------------------------------------------------------
  router.post('/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ ok: false, error: 'email and password are required' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      const result = await pool.query(
        `SELECT id, email, display_name, password_hash, is_guest FROM vp_customers WHERE email = $1`,
        [normalizedEmail]
      );

      const customer = result.rows[0];

      if (!customer) {
        res.status(401).json({ ok: false, error: 'Invalid email or password', code: 'invalid_credentials' });
        return;
      }

      if (!customer.password_hash) {
        res.status(401).json({
          ok: false,
          error: 'This is a guest account. Please register with a password first.',
          code: 'guest_account',
        });
        return;
      }

      const passwordValid = await bcrypt.compare(password, customer.password_hash);
      if (!passwordValid) {
        res.status(401).json({ ok: false, error: 'Invalid email or password', code: 'invalid_credentials' });
        return;
      }

      res.json({
        ok: true,
        data: {
          customer_id: customer.id,
          email: customer.email,
          display_name: customer.display_name,
          is_guest: customer.is_guest,
        },
      });
    } catch (err: any) {
      console.error('[VP-auth] POST /auth/login error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to login' });
    }
  });

  // -----------------------------------------------------------------------
  // POST /auth/admin/magic-link — Send magic link to admin email
  // -----------------------------------------------------------------------
  router.post('/auth/admin/magic-link', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email || typeof email !== 'string') {
        res.status(400).json({ ok: false, error: 'email is required' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check if email is a registered admin
      const admin = await pool.query(
        `SELECT id, email, role FROM vp_admin_users WHERE LOWER(email) = $1`,
        [normalizedEmail]
      );

      if (!admin.rows[0]) {
        // Return generic success to prevent email enumeration
        res.json({ ok: true, message: 'If this email is registered as admin, a magic link has been sent.' });
        return;
      }

      // Generate secure random token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MINUTES * 60 * 1000);

      // Store token on admin user
      await pool.query(
        `UPDATE vp_admin_users SET magic_link_token = $1, magic_link_expires = $2 WHERE id = $3`,
        [token, expiresAt, admin.rows[0].id]
      );

      // Send email via Resend
      await sendAdminMagicLink(admin.rows[0].email, token);

      console.log(`[VP-auth] Magic link sent to ${admin.rows[0].email} (expires ${expiresAt.toISOString()})`);

      res.json({ ok: true, message: 'If this email is registered as admin, a magic link has been sent.' });
    } catch (err: any) {
      console.error('[VP-auth] POST /auth/admin/magic-link error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to send magic link' });
    }
  });

  // -----------------------------------------------------------------------
  // POST /auth/admin/verify — Verify magic link token
  // -----------------------------------------------------------------------
  router.post('/auth/admin/verify', async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token || typeof token !== 'string') {
        res.status(400).json({ ok: false, error: 'token is required' });
        return;
      }

      // Find admin with matching non-expired token
      const result = await pool.query(
        `SELECT id, user_id, email, role
         FROM vp_admin_users
         WHERE magic_link_token = $1 AND magic_link_expires > NOW()`,
        [token]
      );

      if (!result.rows[0]) {
        res.status(401).json({ ok: false, error: 'Invalid or expired token', code: 'invalid_token' });
        return;
      }

      const admin = result.rows[0];

      // Invalidate the token (one-time use)
      await pool.query(
        `UPDATE vp_admin_users SET magic_link_token = NULL, magic_link_expires = NULL WHERE id = $1`,
        [admin.id]
      );

      console.log(`[VP-auth] Admin verified: ${admin.email} (role: ${admin.role})`);

      res.json({
        ok: true,
        data: {
          admin_id: admin.id,
          user_id: admin.user_id,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err: any) {
      console.error('[VP-auth] POST /auth/admin/verify error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to verify token' });
    }
  });

  return router;
}
