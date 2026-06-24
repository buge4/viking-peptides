import { useState, useEffect, useCallback } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { apiGet, apiPost } from '../hooks/useApi'
import Header from '../components/Header'
import Footer from '../components/Footer'

function formatPrice(price: number) {
  return `$${(price / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

type PaymentStatus = 'pending' | 'confirmed' | 'credited' | 'expired'

interface PaymentStatusResponse {
  status: PaymentStatus
  amount_ton: number
  tx_hash?: string
}

interface LocationState {
  intent_id: string
  deposit_address: string
  memo: string
  amount_ton: number
  expires_at: string
  total_usd: number
  email: string
}

interface NewIntentResponse {
  intent_id: string
  deposit_address: string
  memo: string
  amount_ton: number
  expires_at: string
}

export default function OrderPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const location = useLocation()
  const locationState = location.state as LocationState | null

  const [intentId, setIntentId] = useState(locationState?.intent_id ?? '')
  const [depositAddress, setDepositAddress] = useState(locationState?.deposit_address ?? '')
  const [memo, setMemo] = useState(locationState?.memo ?? '')
  const [amountTon, setAmountTon] = useState(locationState?.amount_ton ?? 0)
  const [expiresAt, setExpiresAt] = useState(locationState?.expires_at ?? '')
  const [totalUsd] = useState(locationState?.total_usd ?? 0)
  const [email] = useState(locationState?.email ?? '')

  const [status, setStatus] = useState<PaymentStatus>('pending')
  const [copied, setCopied] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [retrying, setRetrying] = useState(false)

  // Calculate remaining time
  useEffect(() => {
    if (!expiresAt) return

    function calcTime() {
      const diff = new Date(expiresAt).getTime() - Date.now()
      return Math.max(0, Math.floor(diff / 1000))
    }

    setTimeLeft(calcTime())
    const timer = setInterval(() => {
      const remaining = calcTime()
      setTimeLeft(remaining)
      if (remaining <= 0) {
        setStatus('expired')
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt])

  // Poll payment status
  useEffect(() => {
    if (!intentId || status === 'confirmed' || status === 'credited' || status === 'expired') return

    const pollInterval = setInterval(async () => {
      try {
        const data = await apiGet<PaymentStatusResponse>(`/pay/ton/status/${intentId}`)
        if (data.status === 'confirmed' || data.status === 'credited') {
          setStatus(data.status)
          clearInterval(pollInterval)
        }
      } catch {
        // Silently retry on polling errors
      }
    }, 10000)

    return () => clearInterval(pollInterval)
  }, [intentId, status])

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    })
  }, [])

  async function handleRetry() {
    if (!orderId) return
    setRetrying(true)
    try {
      const data = await apiPost<NewIntentResponse>('/pay/ton/create-intent', {
        order_id: orderId,
      })
      setIntentId(data.intent_id)
      setDepositAddress(data.deposit_address)
      setMemo(data.memo)
      setAmountTon(data.amount_ton)
      setExpiresAt(data.expires_at)
      setStatus('pending')
    } catch {
      // Error handled silently
    } finally {
      setRetrying(false)
    }
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  // No data state
  if (!intentId && !depositAddress) {
    return (
      <>
        <Header />
        <main className="section-spacing" style={{ minHeight: '60vh' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>?</div>
            <h3 style={{ marginBottom: '1rem' }}>Order Not Found</h3>
            <p style={{ marginBottom: '2rem', margin: '0 auto 2rem' }}>
              This order page requires payment data. Please start a new checkout.
            </p>
            <Link to="/cart" className="btn btn-primary">Go to Cart</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="section-spacing" style={{ minHeight: '60vh' }}>
        <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>

          {/* CONFIRMED / CREDITED */}
          {(status === 'confirmed' || status === 'credited') && (
            <div className="animate-fade-up" style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(74, 157, 91, 0.12)',
                border: '2px solid var(--success)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 style={{ marginBottom: '0.75rem', color: 'var(--success)' }}>Payment Received!</h2>
              <p style={{ marginBottom: '2rem', margin: '0 auto 2rem', maxWidth: '45ch' }}>
                Your payment has been verified on the TON blockchain. Your order is now being processed.
              </p>

              <div className="card" style={{ padding: '2rem', textAlign: 'left', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.25rem' }}>Order Details</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                      Order ID
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--parchment)' }}>
                      {orderId}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                      Amount Paid
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--gold)' }}>
                      {amountTon.toFixed(2)} TON
                      {totalUsd > 0 && <span style={{ color: 'var(--fg-dim)', marginLeft: '0.5rem' }}>({formatPrice(totalUsd)})</span>}
                    </div>
                  </div>
                  {email && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                        Confirmation Email
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--parchment)' }}>
                        {email}
                      </div>
                    </div>
                  )}
                </div>

                <hr className="divider" style={{ margin: '1.25rem 0' }} />

                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  padding: '0.75rem', background: 'rgba(74, 157, 91, 0.06)',
                  border: '1px solid rgba(74, 157, 91, 0.15)', borderRadius: 'var(--radius-md)',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" style={{ marginTop: '1px', flexShrink: 0 }}>
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
                    Your order will be processed and shipped within 2-3 business days.
                    A confirmation email with tracking information will be sent to your email address.
                  </span>
                </div>
              </div>

              <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                Back to Home
              </Link>
            </div>
          )}

          {/* EXPIRED */}
          {status === 'expired' && (
            <div className="animate-fade-up" style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(201, 68, 68, 0.1)',
                border: '2px solid var(--danger)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>

              <h2 style={{ marginBottom: '0.75rem', color: 'var(--danger)' }}>Payment Window Expired</h2>
              <p style={{ marginBottom: '2rem', margin: '0 auto 2rem', maxWidth: '50ch' }}>
                The 30-minute payment window has expired. You can create a new payment intent or return to your cart.
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleRetry}
                  disabled={retrying}
                  className="btn btn-primary"
                  style={{
                    padding: '0.75rem 2rem',
                    opacity: retrying ? 0.5 : 1,
                    cursor: retrying ? 'not-allowed' : 'pointer',
                  }}
                >
                  {retrying ? 'Creating...' : 'Try Again'}
                </button>
                <Link to="/cart" className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }}>
                  Back to Cart
                </Link>
              </div>
            </div>
          )}

          {/* PENDING */}
          {status === 'pending' && (
            <div className="animate-fade-up">
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Complete Your Payment</h2>
                <p style={{ margin: '0 auto', maxWidth: '50ch' }}>
                  Send the exact amount of TON to the address below. Include the memo in your transaction.
                </p>
              </div>

              {/* Countdown timer */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                marginBottom: '2rem', padding: '0.75rem',
                background: timeLeft < 300 ? 'rgba(201, 68, 68, 0.08)' : 'var(--gold-dim)',
                border: `1px solid ${timeLeft < 300 ? 'rgba(201, 68, 68, 0.2)' : 'rgba(197, 165, 90, 0.2)'}`,
                borderRadius: 'var(--radius-md)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={timeLeft < 300 ? 'var(--danger)' : 'var(--gold)'} strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.9rem',
                  color: timeLeft < 300 ? 'var(--danger)' : 'var(--gold)',
                }}>
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--fg-dim)' }}>remaining</span>
              </div>

              {/* Payment card */}
              <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                {/* Amount */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                    Amount to Send
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 700,
                    color: 'var(--gold)', letterSpacing: '-0.02em',
                  }}>
                    {amountTon.toFixed(2)} TON
                  </div>
                  {totalUsd > 0 && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--fg-dim)', marginTop: '0.25rem' }}>
                      {formatPrice(totalUsd)} USD
                    </div>
                  )}
                </div>

                <hr className="divider" style={{ margin: '0 0 1.5rem' }} />

                {/* Deposit Address */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    fontSize: '0.7rem', fontWeight: 600, color: 'var(--fg-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem',
                  }}>
                    Deposit Address
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--charcoal)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
                  }}>
                    <code style={{
                      flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                      color: 'var(--parchment)', wordBreak: 'break-all', lineHeight: 1.4,
                    }}>
                      {depositAddress}
                    </code>
                    <button
                      onClick={() => copyToClipboard(depositAddress, 'address')}
                      style={{
                        background: 'none', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.6rem',
                        cursor: 'pointer', color: copied === 'address' ? 'var(--success)' : 'var(--fg-dim)',
                        fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap',
                        transition: 'all var(--duration) var(--ease)',
                      }}
                    >
                      {copied === 'address' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Memo */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    fontSize: '0.7rem', fontWeight: 600, color: 'var(--fg-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}>
                    Memo / Comment
                    <span style={{
                      fontSize: '0.6rem', background: 'rgba(201, 68, 68, 0.15)',
                      color: 'var(--danger)', padding: '0.1rem 0.4rem',
                      borderRadius: '999px', fontWeight: 700,
                    }}>
                      REQUIRED
                    </span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--charcoal)', border: '1px solid rgba(201, 68, 68, 0.2)',
                    borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
                  }}>
                    <code style={{
                      flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.9rem',
                      color: 'var(--parchment)', fontWeight: 600,
                    }}>
                      {memo}
                    </code>
                    <button
                      onClick={() => copyToClipboard(memo, 'memo')}
                      style={{
                        background: 'none', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.6rem',
                        cursor: 'pointer', color: copied === 'memo' ? 'var(--success)' : 'var(--fg-dim)',
                        fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap',
                        transition: 'all var(--duration) var(--ease)',
                      }}
                    >
                      {copied === 'memo' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div style={{
                    marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--danger)',
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    You MUST include this memo in your transaction or your payment cannot be matched.
                  </div>
                </div>

                {/* Amount reminder */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'var(--charcoal)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.7rem', fontWeight: 600, color: 'var(--fg-dim)',
                      textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15rem',
                    }}>
                      Exact Amount
                    </div>
                    <code style={{
                      fontFamily: 'var(--font-mono)', fontSize: '1rem',
                      color: 'var(--gold)', fontWeight: 700,
                    }}>
                      {amountTon.toFixed(2)} TON
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(amountTon.toFixed(2), 'amount')}
                    style={{
                      background: 'none', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.6rem',
                      cursor: 'pointer', color: copied === 'amount' ? 'var(--success)' : 'var(--fg-dim)',
                      fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap',
                      transition: 'all var(--duration) var(--ease)',
                    }}
                  >
                    {copied === 'amount' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Polling indicator */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                padding: '0.75rem', marginBottom: '1.5rem',
              }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: 'var(--gold)', animation: 'pulse-dot 1.5s ease-in-out infinite',
                }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--fg-dim)' }}>
                  Waiting for payment confirmation...
                </span>
              </div>

              {/* Order reference */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--fg-dim)', marginBottom: '0.25rem' }}>
                  Order Reference
                </div>
                <code style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--fg-muted)',
                }}>
                  {orderId}
                </code>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.8); }
          }
          @media (max-width: 640px) {
            .container { padding: 0 1rem !important; }
          }
        `}</style>
      </main>
      <Footer />
    </>
  )
}
