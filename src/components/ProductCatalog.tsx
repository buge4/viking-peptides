import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, getProductsByCategory, type Category, type Product } from '../data/products'
import { useCart } from '../context/CartContext'

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function ProductCard({ product }: { product: Product }) {
  const { getPrice } = useCart()
  const pSlug = slugify(product.name)
  const prices = product.specs.map(s => getPrice(pSlug, s)).filter(p => p > 0)
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0

  return (
    <Link to={`/products/${pSlug}`} className="card" style={{ padding: '1.5rem', display: 'block' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--parchment)', margin: 0, lineHeight: 1.3 }}>
          {product.name}
        </h3>
        {product.popular && <span className="badge badge-gold" style={{ flexShrink: 0, marginLeft: '0.5rem' }}>Popular</span>}
      </div>
      <p style={{ fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1rem' }}>
        {product.description}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {product.specs.slice(0, 3).map((spec) => (
            <span
              key={spec}
              style={{
                padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)', background: 'var(--gold-dim)',
                color: 'var(--gold)', border: '1px solid rgba(197, 165, 90, 0.15)',
              }}
            >
              {spec}
            </span>
          ))}
          {product.specs.length > 3 && (
            <span style={{
              padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)', background: 'var(--gold-dim)',
              color: 'var(--gold)', border: '1px solid rgba(197, 165, 90, 0.15)',
            }}>
              +{product.specs.length - 3}
            </span>
          )}
        </div>
        {lowestPrice > 0 && (
          <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
            From ${(lowestPrice / 100).toFixed(0)}
          </span>
        )}
      </div>
    </Link>
  )
}

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')

  const displayProducts = activeCategory === 'all'
    ? categories.flatMap((cat) => getProductsByCategory(cat.id))
    : getProductsByCategory(activeCategory)

  return (
    <section id="products" className="section-spacing">
      <div className="container-wide">
        <div style={{ maxWidth: '600px', marginBottom: '2rem' }}>
          <span className="label-caps">Full Catalog</span>
          <h2 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            70+ research compounds
          </h2>
          <p>
            Every peptide ships lyophilized in sealed vials with third-party
            certificates of analysis. Click any product for full details, pricing, and recommended pairings.
          </p>
        </div>

        {/* Discount banner */}
        <div style={{
          background: 'var(--gold-dim)', border: '1px solid rgba(197, 165, 90, 0.2)',
          borderRadius: 'var(--radius-md)', padding: '0.75rem 1.5rem',
          marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem',
          flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--gold)',
        }}>
          <span>Buy 3+ save 5%</span>
          <span>Buy 5+ save 10%</span>
          <span>Buy 10+ save 20%</span>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem',
            paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)',
          }}
        >
          <button
            onClick={() => setActiveCategory('all')}
            className={activeCategory === 'all' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
          >
            All ({categories.reduce((sum, c) => sum + getProductsByCategory(c.id).length, 0)})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={activeCategory === cat.id ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
            >
              {cat.name} ({getProductsByCategory(cat.id).length})
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid-3">
          {displayProducts.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>

        {/* Disclaimer */}
        <div
          style={{
            marginTop: '3rem', padding: '1.5rem', borderRadius: 'var(--radius-md)',
            background: 'rgba(201, 68, 68, 0.05)', border: '1px solid rgba(201, 68, 68, 0.15)',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--danger)', margin: 0, maxWidth: 'none', textAlign: 'center' }}>
            All products are sold strictly for laboratory research use only. Not for human consumption.
          </p>
        </div>
      </div>
    </section>
  )
}
