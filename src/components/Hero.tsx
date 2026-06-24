export default function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 60% 50% at 50% 0%, rgba(197, 165, 90, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 80% 20%, rgba(139, 69, 19, 0.06) 0%, transparent 60%),
            var(--bg)
          `,
          zIndex: 0,
        }}
      />

      {/* Norse knotwork accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 10%, var(--gold-dim) 30%, var(--gold) 50%, var(--gold-dim) 70%, transparent 90%)',
          opacity: 0.4,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '6rem' }}>
        <div style={{ maxWidth: '720px' }}>
          {/* Label */}
          <span className="label-caps animate-fade-up" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
            Research-Grade Peptides
          </span>

          {/* Headline */}
          <h1 className="animate-fade-up delay-1" style={{ marginBottom: '1.5rem' }}>
            Norse Strength.{' '}
            <span style={{ color: 'var(--gold)' }}>Pure Science.</span>
          </h1>

          {/* Subhead */}
          <p
            className="animate-fade-up delay-2"
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              color: 'var(--fg-muted)',
            }}
          >
            Over 70 research-grade peptides across 9 categories. Every compound is lyophilized
            to pharmaceutical standards with full certificates of analysis. Built for researchers
            who demand precision.
          </p>

          {/* CTA row */}
          <div className="animate-fade-up delay-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#products" className="btn btn-primary">
              Browse Catalog
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
            <a href="#science" className="btn btn-secondary">
              Research & Science
            </a>
          </div>

          {/* Stats row */}
          <div
            className="animate-fade-up delay-4"
            style={{
              display: 'flex',
              gap: '3rem',
              marginTop: '4rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--border)',
            }}
          >
            {[
              { value: '70+', label: 'Peptides' },
              { value: '9', label: 'Categories' },
              { value: '99.1%', label: 'Purity' },
              { value: 'CoA', label: 'Certified' },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.75rem',
                    fontWeight: 500,
                    color: 'var(--gold)',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--fg-dim)',
                    marginTop: '0.25rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
