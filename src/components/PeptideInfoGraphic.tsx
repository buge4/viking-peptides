import React, { useState, useEffect, useRef, useCallback } from 'react'
import { getPeptideScienceData } from '../data/peptideScience'
import type {
  PeptideScienceData,
  MechanismStep,
  BodyRegion,
  TimelineEvent,
  ComparisonStat,
} from '../data/peptideScience'

// ── Unique style ID ────────────────────────────────────────────────────
const STYLE_ID = 'peptide-infographic-styles'

function ensureStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes ig-pulse {
      0%, 100% { box-shadow: 0 0 4px rgba(197,165,90,0.3); }
      50% { box-shadow: 0 0 18px rgba(197,165,90,0.55), 0 0 36px rgba(197,165,90,0.12); }
    }
    @keyframes ig-pulse-ring {
      0% { opacity: 0.5; transform: scale(1); }
      100% { opacity: 0; transform: scale(3); }
    }
    @keyframes ig-flow-arrow {
      0% { stroke-dashoffset: 16; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes ig-fade-in-up {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ig-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes ig-tl-dot-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(197,165,90,0.35); }
      50% { box-shadow: 0 0 0 6px rgba(197,165,90,0); }
    }
    @keyframes ig-stat-pop {
      from { opacity: 0; transform: scale(0.7) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes ig-scan-line {
      0% { top: 0%; opacity: 0; }
      10% { opacity: 0.07; }
      90% { opacity: 0.07; }
      100% { top: 100%; opacity: 0; }
    }
    @keyframes ig-breathe {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.22; }
    }
    .ig-reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .ig-reveal.ig-vis {
      opacity: 1;
      transform: translateY(0);
    }
    .ig-mech-step {
      transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .ig-mech-step:hover {
      border-color: rgba(197,165,90,0.35) !important;
      background: rgba(197,165,90,0.06) !important;
      transform: translateY(-3px) !important;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(197,165,90,0.08);
    }
    .ig-stat-card {
      transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .ig-stat-card:hover {
      border-color: rgba(197,165,90,0.3) !important;
      transform: translateY(-4px) !important;
      box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 20px rgba(197,165,90,0.05);
    }
    .ig-tl-item {
      transition: transform 0.25s ease;
    }
    .ig-tl-item:hover {
      transform: translateY(-2px);
    }
    .ig-tl-item:hover .ig-tl-dot-fill {
      background: var(--gold) !important;
      transform: scale(1.3);
    }
    .ig-legend-row {
      transition: all 0.25s ease;
    }
    .ig-legend-row:hover {
      background: rgba(197,165,90,0.05) !important;
      border-color: rgba(197,165,90,0.18) !important;
    }
    @media (max-width: 768px) {
      .ig-mech-flow { flex-direction: column !important; align-items: stretch !important; }
      .ig-arrow-h { display: none !important; }
      .ig-arrow-v { display: flex !important; }
      .ig-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .ig-body-layout { flex-direction: column !important; }
      .ig-body-wrap { max-width: 160px !important; margin: 0 auto !important; flex: 0 0 auto !important; }
      .ig-mol-row { flex-direction: column !important; gap: 1rem !important; }
    }
    @media (max-width: 480px) {
      .ig-stats-grid { grid-template-columns: 1fr !important; }
    }
  `
  document.head.appendChild(style)
}

// ── Scroll-reveal hook ────────────────────────────────────────────────

function useScrollReveal(): [(el: HTMLElement | null) => void, boolean] {
  const [visible, setVisible] = useState(false)
  const elRef = useRef<HTMLElement | null>(null)

  const setRef = useCallback((el: HTMLElement | null) => {
    elRef.current = el
  }, [])

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  })

  return [setRef, visible]
}

// ── SVG Icons for Mechanism Steps ─────────────────────────────────────

function MechIcon({ type, size = 26 }: { type: string; size?: number }) {
  const c = 'var(--gold)'
  const d = 'var(--gold-dim)'

  const map: Record<string, React.ReactNode> = {
    receptor: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke={c} strokeWidth="1.4" fill={d} />
        <circle cx="16" cy="16" r="4" fill={c} opacity="0.55" />
        <path d="M16 6v4M16 22v4M6 16h4M22 16h4" stroke={c} strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
    signal: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M8 24l4-8 4 4 4-12 4 8" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="24" r="2" fill={c} opacity="0.45" />
        <circle cx="24" cy="16" r="2" fill={c} opacity="0.45" />
      </svg>
    ),
    brain: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M16 6c-3 0-6 2-7 5-2 0-3 2-3 4s1 3 2 4c0 2 1 4 3 5 1 1 3 2 5 2s4-1 5-2c2-1 3-3 3-5 1-1 2-2 2-4s-1-4-3-4c-1-3-4-5-7-5z" stroke={c} strokeWidth="1.2" fill={d} />
        <path d="M16 6v20M11 12h10M11 18h10" stroke={c} strokeWidth="0.7" opacity="0.35" />
      </svg>
    ),
    metabolism: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="9" stroke={c} strokeWidth="1.2" fill={d} />
        <path d="M12 16l3 3 5-6" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 7v2M16 23v2M7 16h2M23 16h2" stroke={c} strokeWidth="0.9" opacity="0.35" />
      </svg>
    ),
    liver: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M10 10c0 0-2 2-2 6s3 8 8 10c5-2 8-6 8-10s-2-6-2-6" stroke={c} strokeWidth="1.2" fill={d} />
        <path d="M16 10v16" stroke={c} strokeWidth="0.7" opacity="0.35" />
        <circle cx="16" cy="18" r="3" stroke={c} strokeWidth="0.9" fill="none" />
      </svg>
    ),
    growth: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M16 26V10" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11 14l5-5 5 5" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 26h16" stroke={c} strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
        <circle cx="16" cy="8" r="2" fill={c} opacity="0.45" />
      </svg>
    ),
    vessel: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M8 20c4-6 12-6 16 0" stroke={c} strokeWidth="1.2" fill="none" />
        <path d="M8 16c4-6 12-6 16 0" stroke={c} strokeWidth="1.2" fill="none" opacity="0.45" />
        <circle cx="16" cy="14" r="3" fill={d} stroke={c} strokeWidth="0.9" />
      </svg>
    ),
    repair: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M12 8v16M20 8v16" stroke={c} strokeWidth="0.9" opacity="0.25" />
        <path d="M8 12h16M8 20h16" stroke={c} strokeWidth="0.9" opacity="0.25" />
        <path d="M13 16l3 3 5-6" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    cognition: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="14" r="8" stroke={c} strokeWidth="1.2" fill={d} />
        <path d="M13 14h6M16 11v6" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M12 24h8" stroke={c} strokeWidth="1.1" strokeLinecap="round" />
        <path d="M14 26h4" stroke={c} strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
    mitochondria: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="16" rx="11" ry="7" stroke={c} strokeWidth="1.2" fill={d} />
        <path d="M8 16c2-3 5-4 8-2s6 1 8-2" stroke={c} strokeWidth="0.9" opacity="0.45" />
        <path d="M9 18c2 2 5 2 7 0s5-2 7 0" stroke={c} strokeWidth="0.9" opacity="0.25" />
      </svg>
    ),
    rejuvenation: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="9" stroke={c} strokeWidth="1.2" fill={d} />
        <path d="M16 10c0 0-4 3-4 6a4 4 0 008 0c0-3-4-6-4-6z" fill={c} opacity="0.25" />
        <path d="M22 10l-3 3M10 22l3-3" stroke={c} strokeWidth="0.9" strokeLinecap="round" opacity="0.45" />
      </svg>
    ),
    hormone: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="12" r="5" stroke={c} strokeWidth="1.2" fill={d} />
        <path d="M16 17v7" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M13 21h6" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M12 8l-3-3M20 8l3-3" stroke={c} strokeWidth="0.9" strokeLinecap="round" opacity="0.45" />
      </svg>
    ),
    function: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M8 16c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke={c} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M16 8v3l2 2" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="2" fill={c} opacity="0.45" />
      </svg>
    ),
    defense: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M16 6l-8 4v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11v-6l-8-4z" stroke={c} strokeWidth="1.2" fill={d} />
        <path d="M13 16l3 3 5-5" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    balance: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M16 8v16" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M8 14l8-2 8 2" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 14l3 6h-6l3-6zM25 14l3 6h-6l3-6z" stroke={c} strokeWidth="0.9" fill={d} />
        <circle cx="16" cy="8" r="2" fill={c} opacity="0.45" />
      </svg>
    ),
    skin: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect x="6" y="8" width="20" height="16" rx="3" stroke={c} strokeWidth="1.2" fill={d} />
        <path d="M6 14h20" stroke={c} strokeWidth="0.7" opacity="0.35" />
        <path d="M6 20h20" stroke={c} strokeWidth="0.7" opacity="0.25" />
        <circle cx="12" cy="11" r="1.5" fill={c} opacity="0.35" />
        <circle cx="20" cy="17" r="1.5" fill={c} opacity="0.35" />
      </svg>
    ),
    result: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke={c} strokeWidth="1.2" fill={d} />
        <path d="M10 16l4 4 8-8" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  }

  return map[type] || (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="10" stroke={c} strokeWidth="1.2" fill={d} />
      <circle cx="16" cy="16" r="3" fill={c} opacity="0.45" />
    </svg>
  )
}

// ── Stat Icons ────────────────────────────────────────────────────────

function SIcon({ type, size = 26 }: { type: string; size?: number }) {
  const c = 'var(--gold)'
  const map: Record<string, React.ReactNode> = {
    bioavail: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.1" opacity="0.25" />
        <path d="M12 3a9 9 0 018.5 6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" fill={c} opacity="0.35" />
      </svg>
    ),
    halflife: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.1" opacity="0.25" />
        <path d="M12 6v6l4 3" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    route: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 3v13" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M8 12l4 4 4-4" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 20h12" stroke={c} strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
      </svg>
    ),
    storage: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="8" y="3" width="8" height="18" rx="2" stroke={c} strokeWidth="1.1" opacity="0.25" />
        <path d="M12 17v-6" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M10 9h4M10 12h4" stroke={c} strokeWidth="0.9" opacity="0.35" />
        <circle cx="12" cy="17" r="2" fill={c} opacity="0.35" />
      </svg>
    ),
  }
  return map[type] || (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.1" opacity="0.25" />
      <circle cx="12" cy="12" r="3" fill={c} opacity="0.35" />
    </svg>
  )
}

// ── Flow Arrow SVG ────────────────────────────────────────────────────

function FlowArrow({ horizontal = true }: { horizontal?: boolean }) {
  if (horizontal) {
    return (
      <div className="ig-arrow-h" style={{ display: 'flex', alignItems: 'center', padding: '0 2px', flexShrink: 0 }}>
        <svg width="36" height="12" viewBox="0 0 36 12" fill="none">
          <path d="M0 6h28M24 2l6 4-6 4" stroke="var(--gold)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" style={{ animation: 'ig-flow-arrow 1.2s linear infinite' }} />
        </svg>
      </div>
    )
  }
  return (
    <div className="ig-arrow-v" style={{ display: 'none', justifyContent: 'center', padding: '4px 0', flexShrink: 0 }}>
      <svg width="12" height="28" viewBox="0 0 12 28" fill="none">
        <path d="M6 0v20M2 16l4 6 4-6" stroke="var(--gold)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" style={{ animation: 'ig-flow-arrow 1.2s linear infinite' }} />
      </svg>
    </div>
  )
}

// ── Section Label ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{
      fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 600,
      letterSpacing: '0.16em', textTransform: 'uppercase' as const,
      color: 'var(--gold)', marginBottom: '1.25rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
    }}>
      <span>{children}</span>
      <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(197,165,90,0.2), transparent)' }} />
    </div>
  )
}

// ====================================================================
// 1. BODY MAP
// ====================================================================

function BodySilhouetteSVG() {
  return (
    <svg viewBox="0 0 200 500" fill="none" style={{ width: '100%', height: '100%', maxWidth: '180px' }}>
      <ellipse cx="100" cy="40" rx="22" ry="28" stroke="var(--fg-dim)" strokeWidth="0.8" opacity="0.3" />
      <path d="M92 68v14M108 68v14" stroke="var(--fg-dim)" strokeWidth="0.8" opacity="0.25" />
      <path d="M72 82 Q60 85 55 110 Q50 140 55 170 Q58 190 70 200 Q80 210 100 215 Q120 210 130 200 Q142 190 145 170 Q150 140 145 110 Q140 85 128 82 Z" stroke="var(--fg-dim)" strokeWidth="0.8" opacity="0.25" fill="none" />
      <path d="M55 110 Q40 115 30 140 Q22 165 25 190 Q27 200 32 205" stroke="var(--fg-dim)" strokeWidth="0.8" opacity="0.2" fill="none" />
      <path d="M145 110 Q160 115 170 140 Q178 165 175 190 Q173 200 168 205" stroke="var(--fg-dim)" strokeWidth="0.8" opacity="0.2" fill="none" />
      <path d="M80 215 Q75 260 72 310 Q70 360 68 400 Q66 430 65 460" stroke="var(--fg-dim)" strokeWidth="0.8" opacity="0.2" fill="none" />
      <path d="M120 215 Q125 260 128 310 Q130 360 132 400 Q134 430 135 460" stroke="var(--fg-dim)" strokeWidth="0.8" opacity="0.2" fill="none" />
      <path d="M100 82v133" stroke="var(--fg-dim)" strokeWidth="0.4" opacity="0.08" />
      <path d="M70 120h60" stroke="var(--fg-dim)" strokeWidth="0.4" opacity="0.06" />
      <path d="M75 150h50" stroke="var(--fg-dim)" strokeWidth="0.4" opacity="0.06" />
    </svg>
  )
}

function BodyMapSection({ regions }: { regions: BodyRegion[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [ref, visible] = useScrollReveal()

  if (!regions.length) return null

  return (
    <div ref={ref} className={`ig-reveal${visible ? ' ig-vis' : ''}`} style={{ marginBottom: '2rem' }}>
      <SectionLabel>Target Regions</SectionLabel>

      <div style={{
        background: 'linear-gradient(145deg, rgba(26,22,17,0.9) 0%, rgba(15,13,10,0.95) 100%)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        padding: 'clamp(1.25rem, 2.5vw, 2rem)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Slow scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(197,165,90,0.12), transparent)',
          animation: 'ig-scan-line 6s ease-in-out infinite', pointerEvents: 'none',
        }} />

        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="ig-body-layout" style={{ display: 'flex', gap: '2rem', alignItems: 'center', position: 'relative' }}>
          {/* Body silhouette with dots */}
          <div className="ig-body-wrap" style={{
            position: 'relative', flex: '0 0 200px',
            height: '370px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BodySilhouetteSVG />

            {regions.map((region, i) => {
              const hovered = hoveredId === region.id
              return (
                <div
                  key={region.id}
                  style={{
                    position: 'absolute', left: `${region.cx}%`, top: `${region.cy}%`,
                    transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: hovered ? 10 : 1,
                  }}
                  onMouseEnter={() => setHoveredId(region.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Pulse ring */}
                  <div style={{
                    position: 'absolute', inset: '-9px', borderRadius: '50%',
                    border: '1px solid var(--gold)',
                    animation: `ig-pulse-ring 2.8s ease-out infinite`,
                    animationDelay: `${i * 0.45}s`, pointerEvents: 'none',
                  }} />

                  {/* Core dot */}
                  <div style={{
                    width: hovered ? '14px' : '10px', height: hovered ? '14px' : '10px',
                    borderRadius: '50%',
                    background: hovered ? 'var(--gold)' : 'radial-gradient(circle, var(--gold) 35%, rgba(197,165,90,0.25) 100%)',
                    boxShadow: hovered
                      ? '0 0 22px rgba(197,165,90,0.65), 0 0 44px rgba(197,165,90,0.2)'
                      : '0 0 10px rgba(197,165,90,0.35)',
                    animation: hovered ? 'none' : `ig-pulse 3s ease-in-out infinite`,
                    animationDelay: `${i * 0.6}s`,
                    transition: 'width 0.25s ease, height 0.25s ease, box-shadow 0.25s ease',
                  }} />

                  {/* Tooltip */}
                  {hovered && (
                    <div style={{
                      position: 'absolute', bottom: 'calc(100% + 12px)', left: '50%',
                      transform: 'translateX(-50%)', background: 'rgba(15,13,10,0.96)',
                      border: '1px solid rgba(197,165,90,0.35)', borderRadius: 'var(--radius-sm)',
                      padding: '0.4rem 0.75rem', whiteSpace: 'nowrap', pointerEvents: 'none',
                      boxShadow: '0 6px 24px rgba(0,0,0,0.6)', animation: 'ig-fade-in-up 0.2s ease both',
                    }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gold)', marginBottom: '0.15rem' }}>
                        {region.label}
                      </div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--fg-dim)' }}>
                        {region.description}
                      </div>
                      {/* Arrow */}
                      <div style={{
                        position: 'absolute', bottom: '-5px', left: '50%',
                        transform: 'translateX(-50%) rotate(45deg)', width: '8px', height: '8px',
                        background: 'rgba(15,13,10,0.96)',
                        borderRight: '1px solid rgba(197,165,90,0.35)',
                        borderBottom: '1px solid rgba(197,165,90,0.35)',
                      }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {regions.map((region) => {
              const hovered = hoveredId === region.id
              return (
                <div
                  key={region.id}
                  className="ig-legend-row"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem 0.85rem',
                    background: hovered ? 'rgba(197,165,90,0.05)' : 'transparent',
                    border: '1px solid',
                    borderColor: hovered ? 'rgba(197,165,90,0.18)' : 'transparent',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredId(region.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                    background: hovered ? 'var(--gold)' : 'rgba(197,165,90,0.45)',
                    boxShadow: hovered ? '0 0 10px rgba(197,165,90,0.5)' : 'none',
                    transition: 'all 0.25s ease',
                  }} />
                  <div>
                    <div style={{
                      fontSize: '0.85rem', fontWeight: 600,
                      color: hovered ? 'var(--gold)' : 'var(--parchment)',
                      transition: 'color 0.25s ease',
                    }}>
                      {region.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--fg-dim)', lineHeight: 1.4 }}>
                      {region.description}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ====================================================================
// 2. MECHANISM OF ACTION
// ====================================================================

function MechanismSection({ steps }: { steps: MechanismStep[] }) {
  const [ref, visible] = useScrollReveal()
  if (!steps.length) return null

  return (
    <div ref={ref} className={`ig-reveal${visible ? ' ig-vis' : ''}`} style={{ marginBottom: '2rem', transitionDelay: '0.1s' }}>
      <SectionLabel>Mechanism of Action</SectionLabel>

      <div className="ig-mech-flow" style={{ display: 'flex', alignItems: 'stretch', gap: 0, justifyContent: 'center' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'contents' }}>
            <div className="ig-mech-step" style={{
              flex: '1 1 0', maxWidth: '260px',
              padding: '1.5rem 1rem 1.25rem',
              background: 'rgba(26,22,17,0.85)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center', cursor: 'default',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Top accent */}
              <div style={{
                position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(197,165,90,0.18), transparent)',
              }} />

              {/* Step badge */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem', fontWeight: 700,
                color: 'var(--gold)', opacity: 0.45, marginBottom: '0.65rem', letterSpacing: '0.18em',
              }}>
                STEP {String(i + 1).padStart(2, '0')}
              </div>

              {/* Icon circle */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.8rem' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'var(--gold-dim)', border: '1px solid rgba(197,165,90,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                }}>
                  <MechIcon type={step.icon} size={24} />
                  <div style={{
                    position: 'absolute', inset: '-3px', borderRadius: '50%',
                    border: '1px solid rgba(197,165,90,0.06)',
                    animation: `ig-breathe 4s ease-in-out infinite`, animationDelay: `${i * 0.7}s`,
                  }} />
                </div>
              </div>

              {/* Label */}
              <div style={{
                fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 500,
                color: 'var(--parchment)', marginBottom: '0.5rem', lineHeight: 1.2,
              }}>
                {step.label}
              </div>

              {/* Detail */}
              <div style={{ fontSize: '0.76rem', color: 'var(--fg-dim)', lineHeight: 1.55 }}>
                {step.detail}
              </div>
            </div>

            {i < steps.length - 1 && (
              <>
                <FlowArrow horizontal />
                <FlowArrow horizontal={false} />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ====================================================================
// 3. RESEARCH TIMELINE  (vertical, left-aligned)
// ====================================================================

function TimelineSection({ events }: { events: TimelineEvent[] }) {
  const [ref, visible] = useScrollReveal()
  if (!events.length) return null

  return (
    <div ref={ref} className={`ig-reveal${visible ? ' ig-vis' : ''}`} style={{ marginBottom: '2rem', transitionDelay: '0.2s' }}>
      <SectionLabel>Research Timeline</SectionLabel>

      <div style={{
        background: 'linear-gradient(145deg, rgba(26,22,17,0.9) 0%, rgba(15,13,10,0.95) 100%)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        padding: 'clamp(1.5rem, 2.5vw, 2rem)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Vertical gold line */}
        <div style={{
          position: 'absolute', left: '28px', top: '1.5rem', bottom: '1.5rem', width: '2px',
          background: 'linear-gradient(180deg, transparent, rgba(197,165,90,0.2) 10%, rgba(197,165,90,0.15) 90%, transparent)',
        }} />
        {/* Shimmer on line */}
        <div style={{
          position: 'absolute', left: '27px', top: '1.5rem', bottom: '1.5rem', width: '4px', borderRadius: '2px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(197,165,90,0.25) 50%, transparent 100%)',
          backgroundSize: '100% 200%', animation: 'ig-shimmer 4s ease-in-out infinite', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {events.map((event, i) => (
            <div
              key={i}
              className="ig-tl-item"
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
                paddingLeft: '10px', paddingTop: '0.6rem', paddingBottom: '0.6rem',
                cursor: 'default',
                marginLeft: i % 2 === 1 ? '12px' : '0',
              }}
            >
              {/* Year + dot */}
              <div style={{ flexShrink: 0, position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%',
                  border: '2px solid var(--gold)', background: 'var(--bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: `ig-tl-dot-pulse 3.5s ease-in-out infinite`, animationDelay: `${i * 0.6}s`,
                }}>
                  <div className="ig-tl-dot-fill" style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: 'rgba(197,165,90,0.4)', transition: 'all 0.3s ease',
                  }} />
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700,
                  color: 'var(--gold)', minWidth: '44px',
                }}>
                  {event.year}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--parchment)', marginBottom: '0.2rem', lineHeight: 1.25 }}>
                  {event.label}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--fg-dim)', lineHeight: 1.5 }}>
                  {event.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ====================================================================
// 4. QUICK STATS
// ====================================================================

function StatsSection({ stats, data }: { stats: ComparisonStat[]; data: PeptideScienceData }) {
  const [ref, visible] = useScrollReveal()
  if (!stats.length) return null

  const hasMol = data.molecularWeight || data.aminoAcidCount || data.sequence

  return (
    <div ref={ref} className={`ig-reveal${visible ? ' ig-vis' : ''}`} style={{ transitionDelay: '0.3s' }}>
      <SectionLabel>Key Parameters</SectionLabel>

      {/* Molecular Profile sub-card */}
      {hasMol && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(26,22,17,0.92) 0%, rgba(42,35,25,0.5) 100%)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          padding: 'clamp(1.25rem, 2vw, 1.75rem)', marginBottom: '1rem',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Corner accents */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', opacity: 0.12, pointerEvents: 'none' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M0 0h40v1H1v39H0z" fill="var(--gold)" /></svg>
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', opacity: 0.12, pointerEvents: 'none' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M40 40H0v-1h39V0h1z" fill="var(--gold)" /></svg>
          </div>

          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase' as const,
            color: 'var(--fg-dim)', marginBottom: '0.85rem',
          }}>
            Molecular Profile
          </div>

          <div className="ig-mol-row" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {data.molecularWeight && (
              <div>
                <div style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--fg-dim)', marginBottom: '0.2rem' }}>
                  Molecular Weight
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 500, color: 'var(--gold)' }}>
                  {data.molecularWeight}
                </div>
              </div>
            )}
            {data.aminoAcidCount && (
              <div>
                <div style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--fg-dim)', marginBottom: '0.2rem' }}>
                  Structure
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 500, color: 'var(--parchment)' }}>
                  {data.aminoAcidCount}
                </div>
              </div>
            )}
          </div>

          {data.sequence && (
            <div style={{
              marginTop: '0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              color: 'var(--fg-dim)', lineHeight: 1.6, wordBreak: 'break-all' as const,
              padding: '0.55rem 0.8rem', background: 'rgba(0,0,0,0.3)',
              borderRadius: 'var(--radius-sm)', border: '1px solid rgba(197,165,90,0.06)',
            }}>
              {data.sequence}
            </div>
          )}
        </div>
      )}

      {/* 4-column stat grid */}
      <div className="ig-stats-grid" style={{
        display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, gap: '1rem',
      }}>
        {stats.map((stat, i) => (
          <div key={i} className="ig-stat-card" style={{
            background: 'rgba(26,22,17,0.85)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '1.35rem 1rem',
            textAlign: 'center', cursor: 'default', position: 'relative', overflow: 'hidden',
          }}>
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: '18%', right: '18%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(197,165,90,0.18), transparent)',
            }} />

            {/* Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.8rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'var(--gold-dim)', border: '1px solid rgba(197,165,90,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SIcon type={stat.icon} size={24} />
              </div>
            </div>

            {/* Value */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 600,
              color: 'var(--gold)', lineHeight: 1, marginBottom: '0.15rem',
              animation: visible ? `ig-stat-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both` : 'none',
              animationDelay: `${0.12 * i + 0.3}s`,
            }}>
              {stat.value}{stat.unit === '%' ? '%' : ''}
            </div>

            {/* Unit */}
            {stat.unit && stat.unit !== '%' && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--fg-dim)', marginBottom: '0.35rem' }}>
                {stat.unit === 'C' ? '\u00B0C' : stat.unit}
              </div>
            )}

            {/* Label */}
            <div style={{
              fontSize: '0.72rem', fontWeight: 600, color: 'var(--parchment)',
              letterSpacing: '0.02em',
              marginTop: stat.unit && stat.unit !== '%' ? 0 : '0.35rem',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ====================================================================
// MAIN COMPONENT
// ====================================================================

interface PeptideInfoGraphicProps {
  slug: string
  category: string
}

export default function PeptideInfoGraphic({ slug, category }: PeptideInfoGraphicProps) {
  useEffect(() => { ensureStyles() }, [])

  const data = getPeptideScienceData(slug, category)
  if (!data) return null

  return (
    <section style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 0', position: 'relative' }}>
      <div className="container">
        {/* Faint dot texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.012, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 15% 25%, var(--gold) 1px, transparent 1px), radial-gradient(circle at 85% 75%, var(--gold) 1px, transparent 1px)',
          backgroundSize: '60px 60px, 80px 80px',
        }} />

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase' as const,
            color: 'var(--gold)', marginBottom: '0.5rem',
          }}>
            Scientific Overview
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 500, color: 'var(--parchment)', lineHeight: 1.15, margin: 0,
          }}>
            Research Data &amp; Mechanisms
          </h2>
          <div style={{
            width: '60px', height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            margin: '0.75rem auto 0',
          }} />
        </div>

        {/* 1 */}
        <BodyMapSection regions={data.bodyRegions} />

        {/* 2 */}
        <MechanismSection steps={data.mechanismSteps} />

        {/* 3 */}
        <TimelineSection events={data.timeline} />

        {/* 4 */}
        <StatsSection stats={data.stats} data={data} />
      </div>

      {/* Bottom divider */}
      <div style={{
        marginTop: '2.5rem', height: '1px',
        background: 'linear-gradient(90deg, transparent 5%, rgba(197,165,90,0.15) 50%, transparent 95%)',
      }} />
    </section>
  )
}
