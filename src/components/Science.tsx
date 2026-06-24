const researchTopics = [
  {
    title: 'GLP-1 Receptor Agonists',
    description:
      'The next generation of metabolic peptides. Semaglutide, Tirzepatide, and Retatrutide represent a paradigm shift in weight management research, targeting GLP-1, GIP, and glucagon receptors simultaneously.',
    citations: '12,400+ PubMed citations',
    highlight: true,
  },
  {
    title: 'BPC-157 & Tissue Repair',
    description:
      'Body Protection Compound 157 has demonstrated remarkable tissue-healing properties across tendons, ligaments, muscle, and gut tissue in over 100 preclinical studies.',
    citations: '300+ preclinical studies',
  },
  {
    title: 'Telomere Biology & Epitalon',
    description:
      'Research into telomerase activation through the tetrapeptide Epitalon continues to show promising results in cellular longevity and biomarker improvement studies.',
    citations: '40+ published papers',
  },
  {
    title: 'Growth Hormone Secretagogues',
    description:
      'CJC-1295, Ipamorelin, and related peptides stimulate endogenous GH release through distinct receptor pathways, enabling targeted research into IGF-1 optimization.',
    citations: '2,000+ PubMed citations',
  },
  {
    title: 'Nootropic Peptides',
    description:
      'Selank and Semax, developed at the Institute of Molecular Genetics in Moscow, represent two of the most studied nootropic peptides with anxiolytic and neuroprotective properties.',
    citations: '200+ peer-reviewed papers',
  },
  {
    title: 'Mitochondrial-Derived Peptides',
    description:
      'MOTS-c and SS-31 target mitochondrial function directly, opening new research avenues in exercise physiology, metabolic health, and age-related decline.',
    citations: '150+ recent publications',
  },
]

export default function Science() {
  return (
    <section id="science" className="section-spacing" style={{ background: 'var(--charcoal)' }}>
      <div className="container-wide">
        <div style={{ maxWidth: '600px', marginBottom: '3rem' }}>
          <span className="label-caps animate-fade-up">Research & Science</span>
          <h2 className="animate-fade-up delay-1" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            Grounded in peer-reviewed literature
          </h2>
          <p className="animate-fade-up delay-2">
            Every compound in our catalog is backed by published research. We curate only
            peptides with demonstrated scientific interest and active research communities.
          </p>
        </div>

        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {researchTopics.map((topic, i) => (
            <div
              key={topic.title}
              className="card animate-fade-up"
              style={{
                padding: '2rem',
                animationDelay: `${0.08 * i}s`,
                ...(topic.highlight
                  ? {
                      borderColor: 'rgba(197, 165, 90, 0.3)',
                      background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(197, 165, 90, 0.04) 100%)',
                    }
                  : {}),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{topic.title}</h3>
                {topic.highlight && <span className="badge badge-research">Trending</span>}
              </div>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{topic.description}</p>
              <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.02em' }}>
                {topic.citations}
              </div>
            </div>
          ))}
        </div>

        {/* Quality standards */}
        <div
          style={{
            marginTop: '4rem',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
          }}
        >
          <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Quality Standards</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {[
              { label: 'HPLC Purity', value: '>99.1%', desc: 'High-performance liquid chromatography verified' },
              { label: 'Mass Spec', value: 'Confirmed', desc: 'Molecular weight verified by LC-MS' },
              { label: 'Endotoxin', value: '<0.5 EU/mg', desc: 'LAL tested per USP standards' },
              { label: 'Storage', value: '-20°C', desc: 'Lyophilized, nitrogen-sealed vials' },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--gold)', marginBottom: '0.25rem' }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--parchment)', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--fg-dim)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
