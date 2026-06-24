import { useState, useMemo, type ReactNode } from 'react'
import { products, categories, type Category } from '../data/products'
import { useCart } from '../context/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

const ADMIN_KEY = 'cpx-admin-2026'
const SESSION_KEY = 'vp-admin-auth'

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function formatPrice(price: number) {
  return `$${(price / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

// Mock order data
const MOCK_ORDERS = [
  { id: 'VP-1001', customer: 'Erik Thorsen', items: 3, total: 14970, status: 'fulfilled' as const, date: '2026-06-22' },
  { id: 'VP-1002', customer: 'Ingrid Halvardsson', items: 1, total: 4990, status: 'processing' as const, date: '2026-06-22' },
  { id: 'VP-1003', customer: 'Magnus Bjornsson', items: 5, total: 38950, status: 'fulfilled' as const, date: '2026-06-21' },
  { id: 'VP-1004', customer: 'Freya Nilssen', items: 2, total: 9980, status: 'shipped' as const, date: '2026-06-21' },
  { id: 'VP-1005', customer: 'Olaf Ragnarsson', items: 7, total: 67430, status: 'processing' as const, date: '2026-06-20' },
  { id: 'VP-1006', customer: 'Astrid Svensson', items: 1, total: 29900, status: 'pending' as const, date: '2026-06-20' },
  { id: 'VP-1007', customer: 'Leif Eriksson', items: 4, total: 22960, status: 'fulfilled' as const, date: '2026-06-19' },
  { id: 'VP-1008', customer: 'Sigrid Haraldsen', items: 2, total: 8990, status: 'cancelled' as const, date: '2026-06-19' },
  { id: 'VP-1009', customer: 'Bjorn Ironside', items: 10, total: 124900, status: 'shipped' as const, date: '2026-06-18' },
  { id: 'VP-1010', customer: 'Ragnhild Ostensen', items: 3, total: 18970, status: 'fulfilled' as const, date: '2026-06-18' },
]

type Tab = 'products' | 'discounts' | 'orders' | 'analytics'
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'fulfilled' | 'cancelled'

const STATUS_STYLES: Record<OrderStatus, { bg: string; color: string; border: string }> = {
  pending: { bg: 'rgba(197, 165, 90, 0.1)', color: 'var(--gold)', border: 'rgba(197, 165, 90, 0.2)' },
  processing: { bg: 'rgba(90, 140, 197, 0.1)', color: '#5A8CC5', border: 'rgba(90, 140, 197, 0.2)' },
  shipped: { bg: 'rgba(90, 197, 165, 0.1)', color: '#5AC5A5', border: 'rgba(90, 197, 165, 0.2)' },
  fulfilled: { bg: 'rgba(74, 157, 91, 0.1)', color: 'var(--success)', border: 'rgba(74, 157, 91, 0.2)' },
  cancelled: { bg: 'rgba(201, 68, 68, 0.1)', color: 'var(--danger)', border: 'rgba(201, 68, 68, 0.2)' },
}

/* ─── Login Gate ─────────────────────────────────────────────── */

function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_KEY) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onAuth()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--bg)',
    }}>
      <div className="card animate-fade-up" style={{ padding: '3rem', maxWidth: '420px', width: '100%' }}>
        {/* Shield icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 1rem' }}>
            <path d="M24 4L8 12v12c0 11 7 20 16 22 9-2 16-11 16-22V12L24 4z"
              stroke="var(--gold)" strokeWidth="1.5" fill="var(--gold-dim)" />
            <path d="M24 14L16 18v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11v-6L24 14z"
              stroke="var(--gold)" strokeWidth="1" fill="none" />
            <circle cx="24" cy="23" r="3" fill="var(--gold)" />
            <line x1="24" y1="26" x2="24" y2="31" stroke="var(--gold)" strokeWidth="1.5" />
          </svg>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Hall of Administration</h2>
          <p style={{ fontSize: '0.85rem' }}>Enter the keystone to pass the gate.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block', fontSize: '0.7rem', fontWeight: 600,
              color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}>
              Admin Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin key..."
              autoFocus
              style={{
                width: '100%', padding: '0.75rem 1rem',
                background: 'var(--charcoal)', border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)', color: 'var(--parchment)',
                fontFamily: 'var(--font-mono)', fontSize: '0.9rem',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = 'var(--gold)' }}
              onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = 'var(--border)' }}
            />
          </div>

          {error && (
            <div style={{
              marginBottom: '1rem', padding: '0.5rem 1rem',
              background: 'rgba(201, 68, 68, 0.1)', border: '1px solid rgba(201, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--danger)',
              textAlign: 'center',
            }}>
              Invalid key. The gate remains sealed.
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
            Enter the Hall
          </button>
        </form>
      </div>
    </div>
  )
}

/* ─── Products Tab ───────────────────────────────────────────── */

function ProductsTab() {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all')
  const [filterPopular, setFilterPopular] = useState<'all' | 'popular' | 'regular'>('all')
  const { getPrice } = useCart()

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.includes(search.toLowerCase())
      const matchCat = filterCat === 'all' || p.category === filterCat
      const matchPop = filterPopular === 'all' ||
        (filterPopular === 'popular' && p.popular) ||
        (filterPopular === 'regular' && !p.popular)
      return matchSearch && matchCat && matchPop
    })
  }, [search, filterCat, filterPopular])

  return (
    <div>
      {/* Filters */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center',
      }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{
            flex: '1 1 250px', padding: '0.6rem 1rem',
            background: 'var(--charcoal)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', color: 'var(--parchment)',
            fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        />

        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value as Category | 'all')}
          style={{
            padding: '0.6rem 1rem', background: 'var(--charcoal)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', color: 'var(--parchment)',
            fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={filterPopular}
          onChange={(e) => setFilterPopular(e.target.value as 'all' | 'popular' | 'regular')}
          style={{
            padding: '0.6rem 1rem', background: 'var(--charcoal)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', color: 'var(--parchment)',
            fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="all">All Products</option>
          <option value="popular">Popular Only</option>
          <option value="regular">Regular Only</option>
        </select>

        <span style={{ fontSize: '0.8rem', color: 'var(--fg-dim)' }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Product', 'Category', 'Specs', 'Price Range', 'Status'].map(h => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left', padding: '0.75rem 1rem',
                    fontSize: '0.7rem', fontWeight: 600, color: 'var(--gold)',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const slug = slugify(p.name)
              const cat = categories.find(c => c.id === p.category)
              const prices = p.specs.map(s => getPrice(slug, s)).filter(pr => pr > 0)
              const minPrice = prices.length > 0 ? Math.min(...prices) : 0
              const maxPrice = prices.length > 0 ? Math.max(...prices) : 0

              return (
                <tr
                  key={slug}
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--charcoal)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--parchment)', fontSize: '0.9rem' }}>
                        {p.name}
                      </span>
                      {p.popular && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          padding: '0.15rem 0.5rem', borderRadius: '999px',
                          fontSize: '0.6rem', fontWeight: 600,
                          background: 'var(--gold-dim)', color: 'var(--gold)',
                          border: '1px solid rgba(197, 165, 90, 0.2)',
                          letterSpacing: '0.04em', textTransform: 'uppercase',
                        }}>
                          Popular
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>
                      {cat?.icon} {cat?.name}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--fg-muted)',
                    }}>
                      {p.specs.length}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--parchment)' }}>
                      {minPrice > 0 ? (
                        minPrice === maxPrice
                          ? formatPrice(minPrice)
                          : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                      ) : (
                        <span style={{ color: 'var(--fg-dim)' }}>No pricing</span>
                      )}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.2rem 0.6rem', borderRadius: '999px',
                      fontSize: '0.65rem', fontWeight: 600,
                      background: 'rgba(74, 157, 91, 0.1)', color: 'var(--success)',
                      border: '1px solid rgba(74, 157, 91, 0.2)',
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: 'var(--success)',
                      }} />
                      In Stock
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── Discounts Tab ──────────────────────────────────────────── */

function DiscountsTab() {
  const { discountTiers } = useCart()
  const [tiers, setTiers] = useState(discountTiers.map(t => ({ ...t })))
  const [editing, setEditing] = useState<number | null>(null)

  const handleSave = (_idx: number) => {
    setEditing(null)
    // In the future this would POST to the API
  }

  const addTier = () => {
    const maxQty = Math.max(...tiers.map(t => t.minQty), 0)
    setTiers([...tiers, { minQty: maxQty + 5, pct: 25, label: `Buy ${maxQty + 5}+ items, save 25%` }])
    setEditing(tiers.length)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Volume Discount Tiers</h3>
          <p style={{ fontSize: '0.85rem' }}>Configure quantity-based discounts applied at checkout.</p>
        </div>
        <button className="btn btn-secondary" onClick={addTier} style={{ fontSize: '0.8rem' }}>
          + Add Tier
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              padding: '1.5rem 2rem',
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: '2rem', alignItems: 'center',
            }}
          >
            <div>
              <div style={{
                fontSize: '0.7rem', fontWeight: 600, color: 'var(--gold)',
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem',
              }}>
                Minimum Items
              </div>
              {editing === idx ? (
                <input
                  type="number"
                  value={tier.minQty}
                  onChange={(e) => {
                    const updated = [...tiers]
                    updated[idx] = { ...updated[idx], minQty: parseInt(e.target.value) || 0 }
                    setTiers(updated)
                  }}
                  style={{
                    width: '80px', padding: '0.4rem 0.6rem',
                    background: 'var(--charcoal)', border: '1px solid var(--border-hover)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--parchment)',
                    fontFamily: 'var(--font-mono)', fontSize: '1.1rem', outline: 'none',
                  }}
                />
              ) : (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--parchment)', fontWeight: 600 }}>
                  {tier.minQty}+
                </span>
              )}
            </div>

            <div>
              <div style={{
                fontSize: '0.7rem', fontWeight: 600, color: 'var(--gold)',
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem',
              }}>
                Discount
              </div>
              {editing === idx ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input
                    type="number"
                    value={tier.pct}
                    onChange={(e) => {
                      const updated = [...tiers]
                      updated[idx] = { ...updated[idx], pct: parseInt(e.target.value) || 0 }
                      setTiers(updated)
                    }}
                    style={{
                      width: '60px', padding: '0.4rem 0.6rem',
                      background: 'var(--charcoal)', border: '1px solid var(--border-hover)',
                      borderRadius: 'var(--radius-sm)', color: 'var(--parchment)',
                      fontFamily: 'var(--font-mono)', fontSize: '1.1rem', outline: 'none',
                    }}
                  />
                  <span style={{ color: 'var(--fg-dim)', fontFamily: 'var(--font-mono)' }}>%</span>
                </div>
              ) : (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--success)', fontWeight: 600 }}>
                  {tier.pct}%
                </span>
              )}
            </div>

            <div>
              <div style={{
                fontSize: '0.7rem', fontWeight: 600, color: 'var(--gold)',
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem',
              }}>
                Description
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
                {tier.label}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {editing === idx ? (
                <button
                  className="btn btn-primary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
                  onClick={() => handleSave(idx)}
                >
                  Save
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
                  onClick={() => setEditing(idx)}
                >
                  Edit
                </button>
              )}
              {tiers.length > 1 && (
                <button
                  style={{
                    background: 'none', border: '1px solid rgba(201, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-md)', color: 'var(--danger)',
                    padding: '0.4rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer',
                  }}
                  onClick={() => setTiers(tiers.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '1.5rem', padding: '1rem 1.5rem',
        background: 'var(--gold-dim)', border: '1px solid rgba(197, 165, 90, 0.15)',
        borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--gold)',
      }}>
        Note: Discount changes are local only. When the API is live (VP_LIVE=true), edits will persist to the database.
      </div>
    </div>
  )
}

/* ─── Orders Tab ─────────────────────────────────────────────── */

function OrdersTab() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const filtered = statusFilter === 'all'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(o => o.status === statusFilter)

  return (
    <div>
      {/* Status filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['all', 'pending', 'processing', 'shipped', 'fulfilled', 'cancelled'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '999px',
              border: `1px solid ${statusFilter === s ? 'var(--gold)' : 'var(--border)'}`,
              background: statusFilter === s ? 'var(--gold-dim)' : 'transparent',
              color: statusFilter === s ? 'var(--gold)' : 'var(--fg-dim)',
              fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
              textTransform: 'capitalize', letterSpacing: '0.02em',
              transition: 'all 0.2s',
            }}
          >
            {s === 'all' ? `All (${MOCK_ORDERS.length})` : `${s} (${MOCK_ORDERS.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left', padding: '0.75rem 1rem',
                    fontSize: '0.7rem', fontWeight: 600, color: 'var(--gold)',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const st = STATUS_STYLES[order.status]
              return (
                <tr
                  key={order.id}
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--charcoal)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600 }}>
                      {order.id}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--parchment)' }}>
                      {order.customer}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
                      {order.items}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--parchment)', fontWeight: 600 }}>
                      {formatPrice(order.total)}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '0.2rem 0.6rem', borderRadius: '999px',
                      fontSize: '0.65rem', fontWeight: 600,
                      background: st.bg, color: st.color,
                      border: `1px solid ${st.border}`,
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--fg-dim)' }}>
                      {order.date}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: '1.5rem', padding: '1rem 1.5rem',
        background: 'var(--gold-dim)', border: '1px solid rgba(197, 165, 90, 0.15)',
        borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--gold)',
      }}>
        Showing mock data. Orders will populate from the database when the API goes live.
      </div>
    </div>
  )
}

/* ─── Analytics Tab ──────────────────────────────────────────── */

function AnalyticsTab() {
  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalCategories = categories.length
    const popularCount = products.filter(p => p.popular).length
    const totalSpecs = products.reduce((sum, p) => sum + p.specs.length, 0)

    // Per-category breakdown
    const categoryBreakdown = categories.map(cat => ({
      ...cat,
      count: products.filter(p => p.category === cat.id).length,
      popularCount: products.filter(p => p.category === cat.id && p.popular).length,
      specCount: products.filter(p => p.category === cat.id).reduce((sum, p) => sum + p.specs.length, 0),
    }))

    return { totalProducts, totalCategories, popularCount, totalSpecs, categoryBreakdown }
  }, [])

  const metricCards = [
    { label: 'Total Products', value: stats.totalProducts, color: 'var(--parchment)' },
    { label: 'Categories', value: stats.totalCategories, color: 'var(--gold)' },
    { label: 'In Stock', value: stats.totalProducts, color: 'var(--success)' },
    { label: 'Popular Products', value: stats.popularCount, color: '#5AC5A5' },
    { label: 'Total SKUs', value: stats.totalSpecs, color: '#5A8CC5' },
    { label: 'Avg Specs/Product', value: (stats.totalSpecs / stats.totalProducts).toFixed(1), color: 'var(--gold-light)' },
  ]

  return (
    <div>
      {/* Metric cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        {metricCards.map((m) => (
          <div key={m.label} className="card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 600, color: 'var(--gold)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem',
            }}>
              {m.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700,
              color: m.color, lineHeight: 1,
            }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Category Breakdown</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {stats.categoryBreakdown
          .sort((a, b) => b.count - a.count)
          .map((cat) => {
            const pct = (cat.count / stats.totalProducts) * 100
            return (
              <div
                key={cat.id}
                className="card"
                style={{ padding: '1rem 1.5rem' }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '0.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                    <span style={{ fontWeight: 600, color: 'var(--parchment)', fontSize: '0.9rem' }}>
                      {cat.name}
                    </span>
                    {cat.popularCount > 0 && (
                      <span style={{
                        fontSize: '0.6rem', padding: '0.1rem 0.4rem',
                        background: 'var(--gold-dim)', color: 'var(--gold)',
                        borderRadius: '999px', border: '1px solid rgba(197, 165, 90, 0.2)',
                        fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                      }}>
                        {cat.popularCount} popular
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
                      {cat.specCount} SKUs
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--parchment)', fontWeight: 600 }}>
                      {cat.count} products
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: '4px', background: 'var(--border)', borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: 'linear-gradient(90deg, var(--gold-dark), var(--gold))',
                    borderRadius: '2px', transition: 'width 0.5s var(--ease)',
                  }} />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

/* ─── Main Admin Page ────────────────────────────────────────── */

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [tab, setTab] = useState<Tab>('products')

  if (!authed) {
    return <AdminLogin onAuth={() => setAuthed(true)} />
  }

  const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
    {
      id: 'products',
      label: 'Products',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
    {
      id: 'discounts',
      label: 'Discounts',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="19" y1="5" x2="5" y2="19" />
          <circle cx="6.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ]

  return (
    <>
      <Header />
      <main className="section-spacing" style={{ minHeight: '80vh' }}>
        <div className="container-wide">
          {/* Header */}
          <div className="animate-fade-up" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '0.5rem',
          }}>
            <div>
              <div style={{
                fontSize: '0.7rem', fontWeight: 600, color: 'var(--gold)',
                letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.4rem',
              }}>
                Administration
              </div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>Command Hall</h1>
            </div>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem' }}
              onClick={() => {
                sessionStorage.removeItem(SESSION_KEY)
                setAuthed(false)
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>

          <p className="animate-fade-up delay-1" style={{ marginBottom: '2rem' }}>
            Manage products, discounts, orders, and view analytics.
          </p>

          {/* Tabs */}
          <div className="animate-fade-up delay-2" style={{
            display: 'flex', gap: '0.25rem', marginBottom: '2rem',
            borderBottom: '1px solid var(--border)', paddingBottom: '0',
          }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'none', border: 'none',
                  borderBottom: `2px solid ${tab === t.id ? 'var(--gold)' : 'transparent'}`,
                  color: tab === t.id ? 'var(--gold)' : 'var(--fg-dim)',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', marginBottom: '-1px',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={(e) => {
                  if (tab !== t.id) e.currentTarget.style.color = 'var(--parchment)'
                }}
                onMouseLeave={(e) => {
                  if (tab !== t.id) e.currentTarget.style.color = 'var(--fg-dim)'
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="animate-fade-up delay-3">
            {tab === 'products' && <ProductsTab />}
            {tab === 'discounts' && <DiscountsTab />}
            {tab === 'orders' && <OrdersTab />}
            {tab === 'analytics' && <AnalyticsTab />}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .container-wide table { font-size: 0.8rem; }
            .container-wide table th,
            .container-wide table td { padding: 0.5rem 0.5rem !important; }
          }
          @media (max-width: 640px) {
            .container-wide > div:nth-child(4) > div { grid-template-columns: 1fr 1fr !important; }
          }
          select option {
            background: var(--charcoal);
            color: var(--parchment);
          }
        `}</style>
      </main>
      <Footer />
    </>
  )
}
