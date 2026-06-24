export default function About() {
  return (
    <section id="about" className="section-spacing">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Left — copy */}
          <div>
            <span className="label-caps animate-fade-up">About Viking Peptides</span>
            <h2 className="animate-fade-up delay-1" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
              Forged in the pursuit of knowledge
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p className="animate-fade-up delay-2" style={{ fontSize: '0.95rem' }}>
                Viking Peptides was founded on a simple principle: researchers deserve access
                to the highest-quality compounds without compromise. Every peptide in our catalog
                undergoes rigorous third-party testing before it earns the Viking seal.
              </p>
              <p className="animate-fade-up delay-3" style={{ fontSize: '0.95rem' }}>
                Our name draws inspiration from the Norse explorers who pushed boundaries,
                sought new horizons, and demanded excellence from their craft. We bring that
                same uncompromising standard to peptide science.
              </p>
              <p className="animate-fade-up delay-4" style={{ fontSize: '0.95rem' }}>
                Based in Scandinavia, we serve research institutions, universities, and
                independent researchers worldwide. Every order ships with full documentation,
                certificates of analysis, and handling guidelines.
              </p>
            </div>
          </div>

          {/* Right — feature list */}
          <div className="animate-fade-up delay-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'Third-Party Tested', desc: 'Every batch verified by independent ISO 17025 labs' },
                { title: 'Certificate of Analysis', desc: 'Full CoA included with HPLC, MS, and endotoxin results' },
                { title: 'Cold Chain Shipping', desc: 'Temperature-controlled logistics with ice packs and insulation' },
                { title: 'Lyophilized Format', desc: 'Freeze-dried for maximum stability and shelf life' },
                { title: 'Bulk & Custom Orders', desc: 'Custom synthesis and bulk quantities for institutional buyers' },
                { title: 'Research Support', desc: 'Technical documentation and molecular data for every compound' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="card"
                  style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--gold-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--gold)" strokeWidth="2">
                      <path d="M2 7l3.5 3.5L12 3" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--parchment)', marginBottom: '0.15rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--fg-dim)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            #about .container > div { grid-template-columns: 1fr !important; gap: 2rem !important; }
          }
        `}</style>
      </div>
    </section>
  )
}
