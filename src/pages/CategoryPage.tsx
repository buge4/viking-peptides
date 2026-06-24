import { useParams, Link } from 'react-router-dom'
import { products, categories } from '../data/products'
import { useCart } from '../context/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { getPrice } = useCart()
  const category = categories.find(c => c.id === slug)
  const categoryProducts = products.filter(p => p.category === slug)

  if (!category) {
    return (
      <>
        <Header />
        <main className="section-spacing">
          <div className="container" style={{ textAlign: 'center' }}>
            <h2>Category Not Found</h2>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Home</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const formatPrice = (price: number) => `$${(price / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  return (
    <>
      <Header />
      <main>
        {/* Category header */}
        <section style={{ background: 'var(--charcoal)', padding: '3rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--fg-dim)', marginBottom: '1rem' }}>
              <Link to="/" style={{ color: 'var(--gold)' }}>Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--parchment)' }}>{category.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>{category.icon}</span>
              <div>
                <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.25rem' }}>{category.name}</h1>
                <p style={{ color: 'var(--fg-dim)', fontSize: '1rem' }}>
                  {category.tagline} — {categoryProducts.length} products
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section className="section-spacing" style={{ paddingTop: '2rem' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {categoryProducts.map((product) => {
                const pSlug = slugify(product.name)
                const lowestPrice = Math.min(...product.specs.map(s => getPrice(pSlug, s)).filter(p => p > 0))
                return (
                  <Link
                    key={product.name}
                    to={`/products/${pSlug}`}
                    className="card"
                    style={{ padding: '1.5rem', display: 'block' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.1rem' }}>{product.name}</h3>
                      {product.popular && <span className="badge badge-gold">Popular</span>}
                    </div>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', color: 'var(--fg-muted)' }}>
                      {product.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {product.specs.slice(0, 3).map((spec) => (
                          <span key={spec} className="badge badge-gold" style={{ fontSize: '0.6rem' }}>{spec}</span>
                        ))}
                        {product.specs.length > 3 && (
                          <span className="badge badge-gold" style={{ fontSize: '0.6rem' }}>+{product.specs.length - 3} more</span>
                        )}
                      </div>
                      {lowestPrice > 0 && lowestPrice < Infinity && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600 }}>
                          From {formatPrice(lowestPrice)}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
