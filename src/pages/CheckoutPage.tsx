import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { products } from '../data/products'
import { apiPost, apiGet } from '../hooks/useApi'
import Header from '../components/Header'
import Footer from '../components/Footer'

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function formatPrice(price: number) {
  return `$${(price / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
  'France', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Switzerland', 'Austria', 'Belgium', 'Ireland', 'New Zealand',
  'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'Brazil',
  'Mexico', 'Spain', 'Italy', 'Portugal', 'Poland', 'Czech Republic',
  'Romania', 'Hungary', 'Greece', 'Turkey', 'Israel', 'UAE',
  'South Africa', 'India', 'Thailand', 'Philippines', 'Indonesia',
  'Malaysia', 'Vietnam', 'Colombia', 'Chile', 'Argentina', 'Peru',
]

interface ExchangeRateResponse {
  ton_usd: number
  updated_at: string
}

interface OrderResponse {
  order_id: string
}

interface PaymentIntentResponse {
  intent_id: string
  deposit_address: string
  memo: string
  amount_ton: number
  expires_at: string
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const {
    items, clearCart,
    totalItems, subtotal, discount, discountAmount, total,
  } = useCart()

  // Form state
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('United States')

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tonRate, setTonRate] = useState<number | null>(null)
  const [rateLoading, setRateLoading] = useState(true)

  // Fetch TON exchange rate
  useEffect(() => {
    let cancelled = false
    async function fetchRate() {
      try {
        const data = await apiGet<ExchangeRateResponse>('/exchange-rates')
        if (!cancelled) {
          setTonRate(data.ton_usd)
          setRateLoading(false)
        }
      } catch {
        if (!cancelled) {
          setTonRate(null)
          setRateLoading(false)
        }
      }
    }
    fetchRate()
    return () => { cancelled = true }
  }, [])

  // Redirect to cart if empty
  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="section-spacing" style={{ minHeight: '60vh' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>⚖</div>
            <h3 style={{ marginBottom: '1rem' }}>Your cart is empty</h3>
            <p style={{ marginBottom: '2rem', margin: '0 auto 2rem' }}>Add some items before checking out.</p>
            <Link to="/cart" className="btn btn-secondary">Back to Cart</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const isFormValid = email.trim() && fullName.trim() && address1.trim() && city.trim() && postalCode.trim() && country

  async function handlePayWithTon() {
    if (!isFormValid) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Create the order
      const orderData = await apiPost<OrderResponse>('/orders', {
        items: items.map(item => ({
          product_slug: item.productSlug,
          spec_label: item.specLabel,
          quantity: item.quantity,
          unit_price: item.unitPrice,
        })),
        customer_email: email.trim(),
        shipping_address: {
          full_name: fullName.trim(),
          address_line_1: address1.trim(),
          address_line_2: address2.trim() || undefined,
          city: city.trim(),
          state: state.trim() || undefined,
          postal_code: postalCode.trim(),
          country,
        },
      })

      // 2. Create TON payment intent
      const intentData = await apiPost<PaymentIntentResponse>('/pay/ton/create-intent', {
        order_id: orderData.order_id,
      })

      // 3. Clear cart and navigate to order page
      clearCart()
      navigate(`/order/${orderData.order_id}`, {
        state: {
          intent_id: intentData.intent_id,
          deposit_address: intentData.deposit_address,
          memo: intentData.memo,
          amount_ton: intentData.amount_ton,
          expires_at: intentData.expires_at,
          total_usd: total,
          email: email.trim(),
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const tonEquivalent = tonRate && total > 0 ? (total / 100) / tonRate : null

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'var(--charcoal)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--parchment)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color var(--duration) var(--ease)',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--fg-muted)',
    marginBottom: '0.4rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  }

  return (
    <>
      <Header />
      <main className="section-spacing" style={{ minHeight: '60vh' }}>
        <div className="container">
          <div style={{ marginBottom: '0.5rem' }}>
            <Link to="/cart" style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>
              &#8592; Back to Cart
            </Link>
          </div>
          <h1 className="animate-fade-up" style={{ marginBottom: '0.5rem' }}>Checkout</h1>
          <p className="animate-fade-up delay-1" style={{ marginBottom: '2.5rem' }}>
            Complete your order details below.
          </p>

          <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'start' }}>
            {/* Left: Form */}
            <div className="animate-fade-up delay-1">
              {/* Contact Info */}
              <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'var(--gold-dim)', border: '1px solid rgba(197, 165, 90, 0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)',
                  }}>1</span>
                  Contact Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="researcher@institution.edu"
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Dr. Erik Nordstrom"
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'var(--gold-dim)', border: '1px solid rgba(197, 165, 90, 0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)',
                  }}>2</span>
                  Shipping Address
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Address Line 1 *</label>
                    <input
                      type="text"
                      value={address1}
                      onChange={e => setAddress1(e.target.value)}
                      placeholder="123 Research Drive"
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Address Line 2</label>
                    <input
                      type="text"
                      value={address2}
                      onChange={e => setAddress2(e.target.value)}
                      placeholder="Suite 400, Lab Building B"
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Boston"
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>State / Province</label>
                    <input
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      placeholder="Massachusetts"
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Postal Code *</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      placeholder="02101"
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Country *</label>
                    <select
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      style={{
                        ...inputStyle,
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C5A55A' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        paddingRight: '2.5rem',
                      }}
                    >
                      {COUNTRIES.map(c => (
                        <option key={c} value={c} style={{ background: 'var(--charcoal)', color: 'var(--parchment)' }}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'var(--gold-dim)', border: '1px solid rgba(197, 165, 90, 0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)',
                  }}>3</span>
                  Payment Method
                </h3>

                {/* TON Payment - Active */}
                <button
                  onClick={handlePayWithTon}
                  disabled={loading || !isFormValid}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '1rem 1.5rem',
                    fontSize: '1rem',
                    marginBottom: '1rem',
                    opacity: loading || !isFormValid ? 0.5 : 1,
                    cursor: loading || !isFormValid ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '16px', height: '16px', border: '2px solid var(--charcoal)',
                        borderTopColor: 'transparent', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite', display: 'inline-block',
                      }} />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.3"/>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Pay with TON {tonEquivalent ? `(~${tonEquivalent.toFixed(2)} TON)` : ''}
                    </>
                  )}
                </button>

                {/* Coming soon methods */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { label: 'USDT on TON', icon: 'T' },
                    { label: 'Card via Telegram', icon: '***' },
                  ].map(method => (
                    <div
                      key={method.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        opacity: 0.4,
                        cursor: 'not-allowed',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg-dim)', fontSize: '0.9rem' }}>
                        <span style={{
                          width: '24px', height: '24px', borderRadius: 'var(--radius-sm)',
                          background: 'var(--charcoal-light)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.65rem', fontWeight: 700, color: 'var(--fg-dim)',
                        }}>
                          {method.icon}
                        </span>
                        {method.label}
                      </span>
                      <span className="badge badge-gold" style={{ fontSize: '0.6rem' }}>Coming Soon</span>
                    </div>
                  ))}
                </div>

                {error && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(201, 68, 68, 0.1)',
                    border: '1px solid rgba(201, 68, 68, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--danger)',
                    fontSize: '0.85rem',
                  }}>
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary (sticky) */}
            <div className="card animate-fade-up delay-2" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>

              {/* Item list */}
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                {items.map(item => {
                  const product = products.find(p => slugify(p.name) === item.productSlug)
                  return (
                    <div
                      key={`${item.productSlug}-${item.specLabel}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        padding: '0.6rem 0',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--parchment)', fontWeight: 500 }}>
                          {product?.name || item.productSlug}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--fg-dim)', marginTop: '0.15rem' }}>
                          {item.specLabel} x {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        {formatPrice(item.unitPrice * item.quantity)}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--fg-dim)' }}>Subtotal ({totalItems} items)</span>
                <span style={{ color: 'var(--parchment)', fontFamily: 'var(--font-mono)' }}>{formatPrice(subtotal)}</span>
              </div>

              {discount && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--success)' }}>Discount ({discount.pct}%)</span>
                  <span style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--fg-dim)' }}>Shipping</span>
                <span style={{ color: 'var(--success)', fontSize: '0.85rem' }}>FREE</span>
              </div>

              <hr className="divider" style={{ margin: '0.75rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--parchment)', fontSize: '1.1rem' }}>Total</span>
                <span style={{ fontWeight: 600, color: 'var(--gold)', fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>
                  {formatPrice(total)}
                </span>
              </div>

              {/* TON equivalent */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                background: 'var(--gold-dim)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>TON equivalent</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {rateLoading ? '...' : tonEquivalent ? `~${tonEquivalent.toFixed(2)} TON` : 'Rate unavailable'}
                </span>
              </div>

              {/* Security note */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                padding: '0.75rem',
                background: 'rgba(74, 157, 91, 0.06)',
                border: '1px solid rgba(74, 157, 91, 0.15)',
                borderRadius: 'var(--radius-md)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" style={{ marginTop: '1px', flexShrink: 0 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span style={{ fontSize: '0.7rem', color: 'var(--fg-dim)', lineHeight: 1.4 }}>
                  Secure checkout powered by TON blockchain. Your payment is verified on-chain for full transparency.
                </span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @media (max-width: 968px) {
            .checkout-grid { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 640px) {
            .checkout-grid .card { padding: 1.25rem !important; }
            .checkout-grid .card div[style*="grid-template-columns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
          }
          select option {
            background: #1A1611;
            color: #F5F0E8;
          }
        `}</style>
      </main>
      <Footer />
    </>
  )
}
