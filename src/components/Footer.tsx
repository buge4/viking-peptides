export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '3rem 0 2rem' }}>
      <div className="container-wide">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
                <circle cx="14" cy="13" r="2" fill="var(--gold)" />
              </svg>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.04em' }}>
                VIKING PEPTIDES
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', maxWidth: '300px' }}>
              Research-grade peptides forged with Norse precision.
              Serving researchers and institutions worldwide.
            </p>
          </div>

          {/* Products */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--parchment)', marginBottom: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Categories
            </div>
            {['Weight Management', 'Growth Hormone', 'Recovery', 'Cognitive', 'Anti-Aging'].map((item) => (
              <a
                key={item}
                href="#products"
                style={{ display: 'block', fontSize: '0.8rem', color: 'var(--fg-dim)', padding: '0.25rem 0', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-dim)')}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--parchment)', marginBottom: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Company
            </div>
            {['About', 'Research', 'Quality', 'Contact', 'Terms'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{ display: 'block', fontSize: '0.8rem', color: 'var(--fg-dim)', padding: '0.25rem 0', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-dim)')}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--parchment)', marginBottom: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Resources
            </div>
            {['Handling Guide', 'Reconstitution', 'Storage', 'FAQ', 'CoA Database'].map((item) => (
              <a
                key={item}
                href="#"
                style={{ display: 'block', fontSize: '0.8rem', color: 'var(--fg-dim)', padding: '0.25rem 0', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-dim)')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '0.7rem', color: 'var(--fg-dim)' }}>
            &copy; {year} Viking Peptides. All rights reserved. Products are for research use only.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Disclaimer'].map((item) => (
              <a
                key={item}
                href="#"
                style={{ fontSize: '0.7rem', color: 'var(--fg-dim)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-dim)')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            footer .container-wide > div:first-child { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) {
            footer .container-wide > div:first-child { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </footer>
  )
}
