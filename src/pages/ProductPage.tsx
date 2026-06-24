import { useParams, Link } from 'react-router-dom'
import { products, categories } from '../data/products'
import { pairings } from '../data/pairings'
import { productDetails } from '../data/productDetails'
import { useCart } from '../context/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PeptideInfoGraphic from '../components/PeptideInfoGraphic'
import { useState } from 'react'

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { addItem, getPrice, totalItems, nextTier } = useCart()
  const [addedSpec, setAddedSpec] = useState<string | null>(null)

  const product = products.find(p => slugify(p.name) === slug)
  if (!product) {
    return (
      <>
        <Header />
        <main className="section-spacing">
          <div className="container" style={{ textAlign: 'center' }}>
            <h2>Product Not Found</h2>
            <p style={{ margin: '1rem auto' }}>The peptide you're looking for doesn't exist.</p>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const productSlug = slugify(product.name)
  const category = categories.find(c => c.id === product.category)
  const details = productDetails[productSlug]
  const productPairings = pairings[productSlug] || []

  const handleAddToCart = (spec: string) => {
    addItem(productSlug, spec)
    setAddedSpec(spec)
    setTimeout(() => setAddedSpec(null), 2000)
  }

  const formatPrice = (price: number) => {
    return `$${(price / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  }

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumb */}
        <div style={{ background: 'var(--charcoal)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--fg-dim)' }}>
              <Link to="/" style={{ color: 'var(--gold)', transition: 'opacity 0.2s' }}>Home</Link>
              <span>/</span>
              {category && (
                <>
                  <Link to={`/category/${category.id}`} style={{ color: 'var(--gold)', transition: 'opacity 0.2s' }}>{category.name}</Link>
                  <span>/</span>
                </>
              )}
              <span style={{ color: 'var(--parchment)' }}>{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Hero */}
        <section className="section-spacing" style={{ paddingBottom: '3rem' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
              {/* Left — Info */}
              <div className="animate-fade-up">
                {category && (
                  <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
                    {category.icon} {category.name}
                  </span>
                )}
                <h1 style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{product.name}</h1>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 'none' }}>
                  {details?.longDescription || product.description}
                </p>

                {product.popular && (
                  <span className="badge badge-research" style={{ marginBottom: '1.5rem' }}>Popular Choice</span>
                )}

                {/* Discount banner */}
                {nextTier && (
                  <div style={{
                    background: 'var(--gold-dim)',
                    border: '1px solid rgba(197, 165, 90, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--gold)',
                  }}>
                    {totalItems > 0
                      ? `Add ${nextTier.minQty - totalItems} more item${nextTier.minQty - totalItems > 1 ? 's' : ''} to save ${nextTier.pct}%!`
                      : `${nextTier.label}`
                    }
                  </div>
                )}
              </div>

              {/* Right — Specs & Pricing */}
              <div className="animate-fade-up delay-1">
                <div className="card" style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Available Specifications</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {product.specs.map((spec) => {
                      const price = getPrice(productSlug, spec)
                      return (
                        <div
                          key={spec}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: 'var(--charcoal)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--parchment)', fontSize: '0.95rem' }}>{spec}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--gold)', marginTop: '0.25rem' }}>
                              {price > 0 ? formatPrice(price) : 'Contact for pricing'}
                            </div>
                          </div>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
                            onClick={() => handleAddToCart(spec)}
                          >
                            {addedSpec === spec ? '✓ Added' : 'Add to Cart'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <style>{`
              @media (max-width: 768px) {
                .container > div { grid-template-columns: 1fr !important; gap: 2rem !important; }
              }
            `}</style>
          </div>
        </section>

        {/* Mechanism / Dosage / Safety */}
        {details && (
          <section style={{ background: 'var(--charcoal)', padding: '3rem 0' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                <div className="animate-fade-up">
                  <h3 style={{ color: 'var(--gold)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Mechanism of Action
                  </h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{details.mechanism}</p>
                </div>
                <div className="animate-fade-up delay-1">
                  <h3 style={{ color: 'var(--gold)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Research Dosage
                  </h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{details.dosage}</p>
                </div>
                <div className="animate-fade-up delay-2">
                  <h3 style={{ color: 'var(--gold)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Safety Notes
                  </h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{details.safety}</p>
                </div>
              </div>
              <style>{`
                @media (max-width: 768px) {
                  .container > div { grid-template-columns: 1fr !important; }
                }
              `}</style>
            </div>
          </section>
        )}

        {/* Science Infographic */}
        <PeptideInfoGraphic slug={productSlug} category={product.category} />

        {/* Goes Well Together With */}
        {productPairings.length > 0 && (
          <section className="section-spacing" style={{ paddingTop: '3rem' }}>
            <div className="container">
              <h2 className="animate-fade-up" style={{ marginBottom: '0.5rem' }}>Goes Well Together With</h2>
              <p className="animate-fade-up delay-1" style={{ marginBottom: '2rem' }}>
                Recommended research companions for {product.name}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {productPairings.map((pairing) => {
                  const paired = products.find(p => slugify(p.name) === pairing.slug)
                  if (!paired) return null
                  const pairedCat = categories.find(c => c.id === paired.category)
                  return (
                    <Link
                      key={pairing.slug}
                      to={`/products/${pairing.slug}`}
                      className="card animate-fade-up"
                      style={{ padding: '1.5rem', display: 'block' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>{paired.name}</h3>
                        {pairing.stackName && (
                          <span className="badge badge-gold" style={{ fontSize: '0.6rem', whiteSpace: 'nowrap' }}>
                            {pairing.stackName}
                          </span>
                        )}
                      </div>
                      {pairedCat && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--fg-dim)', marginBottom: '0.5rem' }}>
                          {pairedCat.icon} {pairedCat.name}
                        </div>
                      )}
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--fg-muted)' }}>
                        {pairing.reason}
                      </p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Research disclaimer */}
        <section style={{ padding: '2rem 0', borderTop: '1px solid var(--border)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--fg-dim)', maxWidth: '600px', margin: '0 auto' }}>
              All products are sold strictly for research purposes only. Not for human consumption.
              Consult applicable laws and regulations in your jurisdiction before ordering.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
