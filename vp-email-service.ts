/**
 * Viking Peptides — Receipt & Notification Email Service
 * Uses Resend API (https://api.resend.com/emails)
 *
 * Functions:
 *   sendOrderConfirmation(email, order)  — Order placed confirmation
 *   sendPaymentReceived(email, order, payment)  — Payment credited
 *   sendShippingNotification(email, order, tracking)  — Shipment tracking
 *   sendAdminMagicLink(email, token)  — Admin magic link login
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const FROM_EMAIL = 'Viking Peptides <onboarding@resend.dev>';
const SITE_URL = 'https://arctico.duckdns.org/viking-peptides';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrderData {
  id: string;
  status: string;
  total_usd_cents: number;
  items?: OrderItem[];
  shipping_address?: any;
  notes?: string;
  created_at?: string;
}

export interface OrderItem {
  product_name: string;
  spec_label: string;
  quantity: number;
  unit_price_usd_cents: number;
  line_total_usd_cents?: number;
}

export interface PaymentData {
  tx_hash?: string;
  amount_ton?: number;
  method?: string;
}

// ---------------------------------------------------------------------------
// Shared HTML wrapper — dark theme, gold accents, parchment text
// ---------------------------------------------------------------------------

function wrapHtml(title: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1a1a2e;border-radius:12px;overflow:hidden;border:1px solid #2a2a4a;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);padding:30px 40px;text-align:center;border-bottom:2px solid #c9a84c;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#c9a84c;letter-spacing:2px;">VIKING PEPTIDES</h1>
              <p style="margin:5px 0 0;font-size:12px;color:#8a8aaa;text-transform:uppercase;letter-spacing:3px;">Premium Research Compounds</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:30px 40px;color:#d4c5a0;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background-color:#12122a;border-top:1px solid #2a2a4a;text-align:center;">
              <p style="margin:0;font-size:12px;color:#5a5a7a;">Viking Peptides — Research compounds for scientific use only.</p>
              <p style="margin:5px 0 0;font-size:11px;color:#4a4a6a;">This is an automated message. Do not reply directly.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Core send function
// ---------------------------------------------------------------------------

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('[VP-email] RESEND_API_KEY not configured, skipping email to:', to);
    return;
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend API error ${response.status}: ${errorBody}`);
  }

  const result = await response.json() as any;
  console.log(`[VP-email] Email sent to ${to}: ${subject} (id: ${result.id})`);
}

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------

function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function renderItems(items?: OrderItem[]): string {
  if (!items || items.length === 0) return '';
  let html = `
    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;margin:15px 0;">
      <tr style="border-bottom:1px solid #2a2a4a;">
        <td style="color:#c9a84c;font-size:12px;text-transform:uppercase;font-weight:600;">Product</td>
        <td style="color:#c9a84c;font-size:12px;text-transform:uppercase;font-weight:600;text-align:center;">Qty</td>
        <td style="color:#c9a84c;font-size:12px;text-transform:uppercase;font-weight:600;text-align:right;">Price</td>
        <td style="color:#c9a84c;font-size:12px;text-transform:uppercase;font-weight:600;text-align:right;">Total</td>
      </tr>`;

  for (const item of items) {
    const lineTotal = item.line_total_usd_cents || (item.quantity * item.unit_price_usd_cents);
    html += `
      <tr style="border-bottom:1px solid #1f1f3a;">
        <td style="color:#d4c5a0;font-size:14px;padding:10px 8px;">
          ${item.product_name}
          <br><span style="color:#8a8aaa;font-size:12px;">${item.spec_label}</span>
        </td>
        <td style="color:#d4c5a0;font-size:14px;text-align:center;">${item.quantity}</td>
        <td style="color:#d4c5a0;font-size:14px;text-align:right;">${formatUsd(item.unit_price_usd_cents)}</td>
        <td style="color:#d4c5a0;font-size:14px;text-align:right;">${formatUsd(lineTotal)}</td>
      </tr>`;
  }

  html += `</table>`;
  return html;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function sendOrderConfirmation(email: string, order: OrderData): Promise<void> {
  const subject = `Order Confirmed — Viking Peptides (#${order.id.slice(0, 8)})`;
  const body = `
    <h2 style="margin:0 0 15px;color:#c9a84c;font-size:22px;">Order Confirmed</h2>
    <p style="font-size:15px;line-height:1.6;color:#d4c5a0;">
      Your order has been placed successfully. We are preparing it for processing.
    </p>

    <div style="background-color:#12122a;border-radius:8px;padding:15px 20px;margin:20px 0;border-left:3px solid #c9a84c;">
      <p style="margin:0 0 5px;font-size:13px;color:#8a8aaa;">Order ID</p>
      <p style="margin:0;font-size:16px;color:#d4c5a0;font-family:monospace;">${order.id}</p>
    </div>

    ${renderItems(order.items)}

    <div style="text-align:right;margin:10px 0 20px;padding-top:10px;border-top:2px solid #c9a84c;">
      <span style="font-size:18px;color:#c9a84c;font-weight:700;">Total: ${formatUsd(order.total_usd_cents)}</span>
    </div>

    <p style="font-size:14px;color:#8a8aaa;">
      Date: ${formatDate(order.created_at)}<br>
      Status: <span style="color:#4ade80;">Pending Payment</span>
    </p>

    <p style="font-size:14px;line-height:1.6;color:#d4c5a0;">
      Please complete your payment to proceed. Once payment is confirmed, we will ship your order promptly.
    </p>
  `;

  await sendEmail(email, subject, wrapHtml(subject, body));
}

export async function sendPaymentReceived(email: string, order: OrderData, payment: PaymentData): Promise<void> {
  const subject = `Payment Received — Viking Peptides (#${order.id.slice(0, 8)})`;
  const txDisplay = payment.tx_hash ? payment.tx_hash.slice(0, 16) + '...' : 'N/A';

  const body = `
    <h2 style="margin:0 0 15px;color:#4ade80;font-size:22px;">Payment Received</h2>
    <p style="font-size:15px;line-height:1.6;color:#d4c5a0;">
      We have received and confirmed your payment. Your order is now being prepared for shipment.
    </p>

    <div style="background-color:#12122a;border-radius:8px;padding:15px 20px;margin:20px 0;border-left:3px solid #4ade80;">
      <p style="margin:0 0 5px;font-size:13px;color:#8a8aaa;">Order ID</p>
      <p style="margin:0 0 10px;font-size:16px;color:#d4c5a0;font-family:monospace;">${order.id}</p>
      <p style="margin:0 0 5px;font-size:13px;color:#8a8aaa;">Transaction</p>
      <p style="margin:0 0 10px;font-size:14px;color:#d4c5a0;font-family:monospace;">${txDisplay}</p>
      ${payment.amount_ton ? `
      <p style="margin:0 0 5px;font-size:13px;color:#8a8aaa;">Amount</p>
      <p style="margin:0;font-size:16px;color:#d4c5a0;">${payment.amount_ton} TON (${formatUsd(order.total_usd_cents)} USD)</p>
      ` : ''}
    </div>

    ${renderItems(order.items)}

    <div style="text-align:right;margin:10px 0 20px;padding-top:10px;border-top:2px solid #4ade80;">
      <span style="font-size:18px;color:#4ade80;font-weight:700;">Paid: ${formatUsd(order.total_usd_cents)}</span>
    </div>

    <p style="font-size:14px;line-height:1.6;color:#d4c5a0;">
      You will receive a shipping notification with tracking information once your order has been dispatched.
    </p>
  `;

  await sendEmail(email, subject, wrapHtml(subject, body));
}

export async function sendShippingNotification(email: string, order: OrderData, tracking: string): Promise<void> {
  const subject = `Your Order Has Shipped — Viking Peptides (#${order.id.slice(0, 8)})`;

  const body = `
    <h2 style="margin:0 0 15px;color:#60a5fa;font-size:22px;">Order Shipped</h2>
    <p style="font-size:15px;line-height:1.6;color:#d4c5a0;">
      Your order has been dispatched and is on its way to you.
    </p>

    <div style="background-color:#12122a;border-radius:8px;padding:15px 20px;margin:20px 0;border-left:3px solid #60a5fa;">
      <p style="margin:0 0 5px;font-size:13px;color:#8a8aaa;">Order ID</p>
      <p style="margin:0 0 10px;font-size:16px;color:#d4c5a0;font-family:monospace;">${order.id}</p>
      <p style="margin:0 0 5px;font-size:13px;color:#8a8aaa;">Tracking Number</p>
      <p style="margin:0;font-size:18px;color:#60a5fa;font-family:monospace;font-weight:700;">${tracking}</p>
    </div>

    ${renderItems(order.items)}

    <p style="font-size:14px;line-height:1.6;color:#d4c5a0;">
      You can track your shipment using the tracking number above with your carrier.
      Estimated delivery time is 3-7 business days depending on your location.
    </p>
  `;

  await sendEmail(email, subject, wrapHtml(subject, body));
}

export async function sendAdminMagicLink(email: string, token: string): Promise<void> {
  const subject = 'Admin Login — Viking Peptides';
  const magicUrl = `${SITE_URL}/admin?token=${token}`;

  const body = `
    <h2 style="margin:0 0 15px;color:#c9a84c;font-size:22px;">Admin Login</h2>
    <p style="font-size:15px;line-height:1.6;color:#d4c5a0;">
      You requested access to the Viking Peptides admin panel. Click the button below to log in.
    </p>

    <div style="text-align:center;margin:30px 0;">
      <a href="${magicUrl}" style="display:inline-block;background-color:#c9a84c;color:#0f0f0f;text-decoration:none;font-size:16px;font-weight:700;padding:14px 40px;border-radius:8px;letter-spacing:1px;">
        ACCESS ADMIN PANEL
      </a>
    </div>

    <div style="background-color:#12122a;border-radius:8px;padding:15px 20px;margin:20px 0;border-left:3px solid #c9a84c;">
      <p style="margin:0 0 5px;font-size:13px;color:#8a8aaa;">Or copy this link</p>
      <p style="margin:0;font-size:12px;color:#d4c5a0;word-break:break-all;font-family:monospace;">${magicUrl}</p>
    </div>

    <p style="font-size:13px;color:#8a8aaa;line-height:1.6;">
      This link expires in <strong style="color:#c9a84c;">15 minutes</strong>. If you did not request this, you can safely ignore this email.
    </p>
  `;

  await sendEmail(email, subject, wrapHtml(subject, body));
}
