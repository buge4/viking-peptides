import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { products } from '../data/products'
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

export default function CartPage() {
  const {
    items, removeItem, updateQuantity, clearCart,
    totalItems, subtotal, discount, discountAmount, total, nextTier, discountTiers,
  } = useCart()

  return (
    <>
      <Header />
      <main className="section-spacing" style={{ minHeight: '60vh' }}>
        <div className="container">
          <h1 className="animate-fade-up" style={{ marginBottom: '0.5rem' }}>Shopping Cart</h1>
          <p className="animate-fade-up delay-1" style={{ marginBottom: '2.5rem' }}>
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>

          {items.length === 0 ? (
            <div className="animate-fade-up delay-2" style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>⚖</div>
              <h3 style={{ marginBottom: '1rem' }}>Your cart is empty</h3>
              <p style={{ marginBottom: '2rem' }}>Browse our catalog of 70+ research-grade peptides.</p>
              <Link to="/#products" className="btn btn-primary">Browse Products</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
              {/* Cart items */}
              <div className="animate-fade-up delay-1">
                {items.map((item) => {
                  const product = products.find(p => slugify(p.name) === item.productSlug)
                  return (
                    <div
                      key={`${item.productSlug}-${item.specLabel}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1.25rem',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <Link
                          to={`/products/${item.productSlug}`}
                          style={{ fontWeight: 600, color: 'var(--parchment)', fontSize: '1rem' }}
                        >
                          {product?.name || item.productSlug}
                        </Link>
                        <div style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', marginTop: '0.25rem' }}>
                          {item.specLabel} — {formatPrice(item.unitPrice)} each
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Quantity controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
                          <button
                            onClick={() => updateQuantity(item.productSlug, item.specLabel, item.quantity - 1)}
                            style={{
                              width: '28px', height: '28px', border: 'none', background: 'transparent',
                              color: 'var(--fg-dim)', cursor: 'pointer', fontSize: '1rem', borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            -
                          </button>
                          <span style={{ minWidth: '24px', textAlign: 'center', color: 'var(--parchment)', fontWeight: 600 }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productSlug, item.specLabel, item.quantity + 1)}
                            style={{
                              width: '28px', height: '28px', border: 'none', background: 'transparent',
                              color: 'var(--fg-dim)', cursor: 'pointer', fontSize: '1rem', borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            +
                          </button>
                        </div>

                        {/* Line total */}
                        <div style={{ minWidth: '120px', textAlign: 'right', fontWeight: 600, color: 'var(--gold)' }}>
                          {formatPrice(item.unitPrice * item.quantity)}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.productSlug, item.specLabel)}
                          style={{
                            background: 'none', border: 'none', color: 'var(--danger)',
                            cursor: 'pointer', fontSize: '0.8rem', padding: '0.25rem',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}

                <div style={{ padding: '1rem 0', display: 'flex', justifyContent: 'space-between' }}>
                  <Link to="/#products" style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>
                    ← Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    style={{ background: 'none', border: 'none', color: 'var(--fg-dim)', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order summary */}
              <div className="card animate-fade-up delay-2" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--fg-dim)' }}>Subtotal ({totalItems} items)</span>
                  <span style={{ color: 'var(--parchment)' }}>{formatPrice(subtotal)}</span>
                </div>

                {discount && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--success)' }}>Discount ({discount.pct}%)</span>
                    <span style={{ color: 'var(--success)' }}>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <hr className="divider" style={{ margin: '1rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--parchment)', fontSize: '1.1rem' }}>Total</span>
                  <span style={{ fontWeight: 600, color: 'var(--gold)', fontSize: '1.1rem' }}>{formatPrice(total)}</span>
                </div>

                {/* Discount upsell */}
                {nextTier && (
                  <div style={{
                    background: 'var(--gold-dim)',
                    border: '1px solid rgba(197, 165, 90, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--gold)',
                    textAlign: 'center',
                  }}>
                    Add {nextTier.minQty - totalItems} more item{nextTier.minQty - totalItems > 1 ? 's' : ''} to save {nextTier.pct}%!
                  </div>
                )}

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                  Place Order
                </button>

                <p style={{ fontSize: '0.7rem', color: 'var(--fg-dim)', textAlign: 'center', marginTop: '1rem' }}>
                  Secure checkout. All orders processed through the Arctico ledger.
                </p>

                {/* Volume discount tiers */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--parchment)', marginBottom: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Volume Discounts
                  </div>
                  {discountTiers.map((tier) => (
                    <div
                      key={tier.minQty}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.4rem 0',
                        fontSize: '0.8rem',
                        color: discount && discount.minQty >= tier.minQty ? 'var(--success)' : 'var(--fg-dim)',
                      }}
                    >
                      <span>{tier.minQty}+ items</span>
                      <span style={{ fontWeight: 600 }}>{tier.pct}% off</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <style>{`
            @media (max-width: 968px) {
              .container > div { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </main>
      <Footer />
    </>
  )
}
