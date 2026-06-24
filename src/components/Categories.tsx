import { Link } from 'react-router-dom'
import { categories, getProductsByCategory } from '../data/products'

export default function Categories() {
  return (
    <section id="categories" className="section-spacing" style={{ background: 'var(--charcoal)' }}>
      <div className="container-wide">
        <div style={{ maxWidth: '600px', marginBottom: '3rem' }}>
          <span className="label-caps animate-fade-up">Product Categories</span>
          <h2 className="animate-fade-up delay-1" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            Nine disciplines of peptide science
          </h2>
          <p className="animate-fade-up delay-2">
            From metabolic optimization to tissue repair, cognitive enhancement to longevity --
            every compound in our inventory is selected for research impact and purity.
          </p>
        </div>

        <div className="grid-3">
          {categories.map((cat, i) => {
            const count = getProductsByCategory(cat.id).length
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="card animate-fade-up"
                style={{
                  padding: '2rem',
                  animationDelay: `${0.06 * i}s`,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{cat.icon}</span>
                  <span className="badge badge-gold">{count} compounds</span>
                </div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.15rem' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>{cat.tagline}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
