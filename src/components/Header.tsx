import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { totalItems } = useCart()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(15, 13, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="var(--gold)" strokeWidth="1.5" fill="none"/>
            <path d="M14 6l-6 3.5v7L14 20l6-3.5v-7L14 6z" fill="var(--gold-dim)" stroke="var(--gold)" strokeWidth="0.75"/>
            <circle cx="14" cy="13" r="2" fill="var(--gold)"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.04em' }}>
            VIKING PEPTIDES
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          {isHome ? (
            <>
              {['Products', 'Science', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  style={{
                    fontSize: '0.8rem', fontWeight: 500, color: 'var(--fg-muted)',
                    letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-muted)')}
                >
                  {item}
                </a>
              ))}
            </>
          ) : (
            <>
              <Link to="/" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--fg-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Home
              </Link>
              <Link to="/#products" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--fg-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Products
              </Link>
            </>
          )}

          {/* Cart icon */}
          <Link
            to="/cart"
            style={{
              position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.8rem', fontWeight: 500, color: 'var(--fg-muted)',
              letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-muted)')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Cart
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-10px',
                background: 'var(--gold)', color: 'var(--charcoal)',
                fontSize: '0.6rem', fontWeight: 700, width: '16px', height: '16px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          <Link to="/#products" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
            View Catalog
          </Link>

          {/* Admin link — subtle, visible on hover */}
          <Link
            to="/admin"
            className="admin-lock-link"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '28px', height: '28px', borderRadius: '50%',
              opacity: 0, transition: 'opacity 0.3s, background 0.2s',
              background: 'transparent',
            }}
            title="Admin"
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-dim)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--fg-dim)" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="mobile-nav-right">
          {/* Mobile cart */}
          <Link to="/cart" style={{ position: 'relative', color: 'var(--parchment)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-8px',
                background: 'var(--gold)', color: 'var(--charcoal)',
                fontSize: '0.55rem', fontWeight: 700, width: '14px', height: '14px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', color: 'var(--parchment)', cursor: 'pointer', padding: '0.5rem' }}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{ background: 'var(--charcoal)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
          <Link to="/" onClick={() => setOpen(false)} style={{ display: 'block', padding: '0.75rem 2rem', fontSize: '0.9rem', color: 'var(--fg-muted)' }}>Home</Link>
          <Link to="/#products" onClick={() => setOpen(false)} style={{ display: 'block', padding: '0.75rem 2rem', fontSize: '0.9rem', color: 'var(--fg-muted)' }}>Products</Link>
          <Link to="/cart" onClick={() => setOpen(false)} style={{ display: 'block', padding: '0.75rem 2rem', fontSize: '0.9rem', color: 'var(--gold)' }}>Cart ({totalItems})</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-right { display: flex !important; }
        }
        .desktop-nav:hover .admin-lock-link {
          opacity: 0.4 !important;
        }
        .desktop-nav .admin-lock-link:hover {
          opacity: 1 !important;
        }
      `}</style>
    </header>
  )
}
