export default function Contact() {
  return (
    <section id="contact" className="section-spacing" style={{ background: 'var(--charcoal)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="label-caps animate-fade-up">Get in Touch</span>
        <h2 className="animate-fade-up delay-1" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          Ready to place an order?
        </h2>
        <p className="animate-fade-up delay-2" style={{ margin: '0 auto 2.5rem', maxWidth: '500px' }}>
          Contact our research liaison team for pricing, bulk orders, custom synthesis
          requests, or any technical questions about our compounds.
        </p>

        <div
          className="animate-fade-up delay-3"
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem',
          }}
        >
          <a href="mailto:research@vikingpeptides.com" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="3" width="14" height="10" rx="1.5" />
              <path d="M1 4l7 5 7-5" />
            </svg>
            Email Us
          </a>
          <a href="https://t.me/vikingpeptides" className="btn btn-secondary" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.95 2.05L1.64 6.88c-.84.34-.83.8-.16 1.01l3.16.99 7.34-4.63c.35-.21.67-.1.4.13L5.99 10.7l-.36 3.43c.34 0 .49-.16.68-.34l1.63-1.58 3.39 2.5c.62.34 1.07.17 1.23-.58l2.23-10.5c.23-.92-.35-1.34-1.84-.6z" />
            </svg>
            Telegram
          </a>
        </div>

        {/* Trust signals */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            padding: '2rem 0',
            borderTop: '1px solid var(--border)',
          }}
        >
          {[
            'Worldwide Shipping',
            'Discreet Packaging',
            'Secure Payment',
            'Research Support',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--gold)',
                }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', letterSpacing: '0.02em' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
