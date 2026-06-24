export interface Product {
  name: string
  description: string
  specs: string[]
  category: Category
  popular?: boolean
}

export type Category =
  | 'weight-management'
  | 'growth-hormone'
  | 'recovery-healing'
  | 'cognitive'
  | 'anti-aging'
  | 'sexual-health'
  | 'immune'
  | 'cosmetic'
  | 'supplies'

export interface CategoryInfo {
  id: Category
  name: string
  tagline: string
  icon: string
}

export const categories: CategoryInfo[] = [
  { id: 'weight-management', name: 'Weight Management', tagline: 'GLP-1 agonists & metabolic peptides', icon: '⚖' },
  { id: 'growth-hormone', name: 'Growth Hormone', tagline: 'GH secretagogues & GHRH analogs', icon: '↑' },
  { id: 'recovery-healing', name: 'Recovery & Healing', tagline: 'Tissue repair & body protection', icon: '✦' },
  { id: 'cognitive', name: 'Cognitive Enhancement', tagline: 'Nootropics & neuroprotective', icon: '◈' },
  { id: 'anti-aging', name: 'Anti-Aging & Longevity', tagline: 'Telomere, senolytic & mitochondrial', icon: '∞' },
  { id: 'sexual-health', name: 'Sexual Health & Fertility', tagline: 'Hormonal optimization', icon: '♦' },
  { id: 'immune', name: 'Immune Support', tagline: 'Antimicrobial & anti-inflammatory', icon: '◉' },
  { id: 'cosmetic', name: 'Cosmetic & Skin', tagline: 'Tanning, collagen & skin health', icon: '◆' },
  { id: 'supplies', name: 'Supplies', tagline: 'Reconstitution & accessories', icon: '▪' },
]

export const products: Product[] = [
  // ── Weight Management ──────────────────────────────────────
  {
    name: 'Semaglutide',
    description: 'A widely used GLP-1 agonist that helps lower blood sugar and promotes significant weight loss.',
    specs: ['5mg', '10mg', '15mg', '20mg', '30mg', '80mg'],
    category: 'weight-management',
    popular: true,
  },
  {
    name: 'Tirzepatide',
    description: 'A dual GIP and GLP-1 receptor agonist highly effective for managing type 2 diabetes and obesity.',
    specs: ['10mg', '15mg', '20mg', '30mg', '40mg', '50mg', '60mg', '80mg', '120mg'],
    category: 'weight-management',
    popular: true,
  },
  {
    name: 'Retatrutide',
    description: 'A triple-hormone receptor agonist for robust weight loss and metabolic control.',
    specs: ['5mg', '10mg', '20mg', '30mg', '40mg', '60mg', '80mg', '100mg'],
    category: 'weight-management',
    popular: true,
  },
  {
    name: 'Cagrilintide',
    description: 'A long-acting amylin analog used to promote satiety and weight loss.',
    specs: ['5mg', '10mg'],
    category: 'weight-management',
  },
  {
    name: 'Retatrutide + Cagrilintide',
    description: 'A potent investigational combination therapy for maximizing metabolic health.',
    specs: ['10mg (5mg + 5mg)'],
    category: 'weight-management',
  },
  {
    name: 'Cagrilintide + Semaglutide',
    description: 'A dual-action combination targeting multiple metabolic pathways for appetite suppression.',
    specs: ['10mg (5mg + 5mg)'],
    category: 'weight-management',
  },
  {
    name: 'AOD9604 (HGH Fragment 176-191)',
    description: 'A modified peptide fragment of human growth hormone designed to stimulate fat burning.',
    specs: ['2mg', '5mg', '10mg'],
    category: 'weight-management',
  },
  {
    name: '5-amino-1MQ',
    description: 'An enzyme inhibitor that enhances cellular energy metabolism and facilitates fat loss.',
    specs: ['10mg x 10 vials'],
    category: 'weight-management',
  },
  {
    name: 'MOTS-C',
    description: 'A mitochondrial-derived peptide that promotes metabolic flexibility and exercise endurance.',
    specs: ['10mg', '40mg'],
    category: 'weight-management',
  },
  {
    name: 'L-Carnitine',
    description: 'An amino acid derivative that assists in converting fatty acids into usable energy.',
    specs: ['600mg x 10ml'],
    category: 'weight-management',
  },
  {
    name: 'Lipo-C',
    description: 'A lipotropic injection designed to boost fat metabolism and liver function.',
    specs: ['10ml'],
    category: 'weight-management',
  },
  {
    name: 'Maritide (AMG133)',
    description: 'A bispecific GIP receptor antagonist and GLP-1 receptor agonist in development for weight reduction.',
    specs: ['1g (bulk)'],
    category: 'weight-management',
  },
  {
    name: 'VK2735',
    description: 'An investigational dual GLP-1 and GIP receptor agonist in development for metabolic disorders.',
    specs: ['1g (bulk)'],
    category: 'weight-management',
  },
  {
    name: 'Eloralintide (LY3841136)',
    description: 'An investigational peptide targeting obesity and metabolic health.',
    specs: ['10g (bulk)'],
    category: 'weight-management',
  },
  {
    name: 'Petrelintide',
    description: 'A long-acting amylin analog currently researched for chronic weight management.',
    specs: ['1g (bulk)'],
    category: 'weight-management',
  },
  {
    name: 'MK-0616',
    description: 'An oral PCSK9 inhibitor developed to drastically lower cholesterol levels.',
    specs: ['100g (bulk)'],
    category: 'weight-management',
  },

  // ── Growth Hormone ─────────────────────────────────────────
  {
    name: 'HGH 191AA',
    description: 'Bio-identical synthetic human growth hormone used for muscle growth, recovery, and anti-aging.',
    specs: ['10iu', '16iu', '24iu', '36iu'],
    category: 'growth-hormone',
    popular: true,
  },
  {
    name: 'CJC 1295 with DAC',
    description: 'A long-acting GHRH analogue that provides a continuous increase in IGF-1 and GH levels.',
    specs: ['5mg', '10mg'],
    category: 'growth-hormone',
  },
  {
    name: 'CJC 1295 without DAC',
    description: 'A synthetic analogue of growth hormone-releasing hormone (GHRH) with a shorter half-life.',
    specs: ['5mg', '10mg'],
    category: 'growth-hormone',
  },
  {
    name: 'CJC 1295 + Ipamorelin',
    description: 'A high-dose synergistic pairing to maximize natural growth hormone release.',
    specs: ['10mg (5mg + 5mg)', '20mg (10mg + 10mg)'],
    category: 'growth-hormone',
    popular: true,
  },
  {
    name: 'Ipamorelin',
    description: 'A highly selective growth hormone secretagogue that stimulates GH release with minimal side effects.',
    specs: ['5mg', '10mg'],
    category: 'growth-hormone',
  },
  {
    name: 'GHRP-2 Acetate',
    description: 'A first-generation growth hormone-releasing peptide that robustly stimulates the pituitary gland.',
    specs: ['5mg', '10mg'],
    category: 'growth-hormone',
  },
  {
    name: 'GHRP-6 Acetate',
    description: 'A growth hormone-releasing peptide known to strongly stimulate appetite alongside GH release.',
    specs: ['5mg', '10mg'],
    category: 'growth-hormone',
  },
  {
    name: 'Hexarelin',
    description: 'A highly potent, fast-acting growth hormone secretagogue.',
    specs: ['2mg', '5mg'],
    category: 'growth-hormone',
  },
  {
    name: 'IGF-1 LR3',
    description: 'An extended half-life version of Insulin-like Growth Factor 1 that promotes muscle hyperplasia.',
    specs: ['0.1mg', '1mg'],
    category: 'growth-hormone',
  },
  {
    name: 'Sermorelin',
    description: 'A classic GHRH analog used to gently stimulate the pituitary gland to produce more GH.',
    specs: ['5mg', '10mg'],
    category: 'growth-hormone',
  },
  {
    name: 'Tesamorelin',
    description: 'A targeted GHRH analog clinically proven to be highly effective at reducing visceral adipose tissue.',
    specs: ['5mg', '10mg'],
    category: 'growth-hormone',
  },
  {
    name: 'ACE-031',
    description: 'A soluble form of activin receptor type IIB that promotes muscle growth by inhibiting myostatin.',
    specs: ['10mg'],
    category: 'growth-hormone',
  },

  // ── Recovery & Healing ─────────────────────────────────────
  {
    name: 'BPC 157',
    description: 'A body protection compound renowned for accelerating the healing of tendons, ligaments, and gut tissue.',
    specs: ['5mg', '10mg'],
    category: 'recovery-healing',
    popular: true,
  },
  {
    name: 'TB500 (Thymosin Beta-4)',
    description: 'A peptide that promotes angiogenesis and accelerates muscle/tissue healing.',
    specs: ['5mg', '10mg'],
    category: 'recovery-healing',
    popular: true,
  },
  {
    name: 'BPC 157 + TB500 (High Dose)',
    description: 'A high-dose synergistic combination of tissue repair peptides.',
    specs: ['20mg (10mg + 10mg)'],
    category: 'recovery-healing',
  },
  {
    name: 'BPC 157 + TB500 (Standard)',
    description: 'A standard-dose synergistic combination of tissue repair peptides.',
    specs: ['10mg (5mg + 5mg)'],
    category: 'recovery-healing',
  },
  {
    name: 'Glow (TB + BPC + GHK)',
    description: 'A specialized recovery and anti-aging compound blend combining three restorative peptides.',
    specs: ['70mg (10mg + 10mg + 50mg)'],
    category: 'recovery-healing',
  },
  {
    name: 'Klow (TB + BPC + GHK + KPV)',
    description: 'A comprehensive recovery blend featuring four restorative and anti-inflammatory peptides.',
    specs: ['80mg (10mg + 10mg + 50mg + 10mg)'],
    category: 'recovery-healing',
  },
  {
    name: 'GHK-Cu',
    description: 'A copper peptide known for stimulating collagen production, wound healing, and skin improvement.',
    specs: ['50mg', '100mg'],
    category: 'recovery-healing',
  },
  {
    name: 'MGF (Mechano Growth Factor)',
    description: 'Supports muscle repair and recovery after mechanical stress.',
    specs: ['2mg'],
    category: 'recovery-healing',
  },
  {
    name: 'PEG-MGF',
    description: 'A pegylated version of MGF with an extended half-life for prolonged muscle recovery.',
    specs: ['2mg'],
    category: 'recovery-healing',
  },
  {
    name: 'ARA 290',
    description: 'A tissue-repair peptide primarily researched for reducing neuropathy and systemic inflammation.',
    specs: ['10mg'],
    category: 'recovery-healing',
  },

  // ── Cognitive Enhancement ──────────────────────────────────
  {
    name: 'Selank',
    description: 'A nootropic peptide known for its potent anti-anxiety and mood-stabilizing effects.',
    specs: ['5mg', '10mg'],
    category: 'cognitive',
  },
  {
    name: 'Semax',
    description: 'A neuroprotective peptide used to significantly enhance memory, focus, and overall cognitive performance.',
    specs: ['5mg', '10mg'],
    category: 'cognitive',
  },
  {
    name: 'DSIP',
    description: 'Delta Sleep-Inducing Peptide, heavily researched for improving sleep architecture.',
    specs: ['5mg', '10mg', '15mg'],
    category: 'cognitive',
  },
  {
    name: 'Uridine + Choline',
    description: 'A highly effective nootropic blend designed to support neurogenesis and brain plasticity.',
    specs: ['100mg', '500mg'],
    category: 'cognitive',
  },
  {
    name: 'Melatonin',
    description: 'A natural hormone widely used to facilitate sleep onset and regulate the sleep-wake cycle.',
    specs: ['10mg'],
    category: 'cognitive',
  },
  {
    name: 'Oxytocin Acetate',
    description: 'The bonding hormone involved in social interaction, sexual reproduction, and stress reduction.',
    specs: ['2mg', '5mg'],
    category: 'cognitive',
  },

  // ── Anti-Aging & Longevity ─────────────────────────────────
  {
    name: 'Epitalon',
    description: 'An anti-aging peptide that interacts with telomerase to promote cellular longevity.',
    specs: ['10mg', '50mg'],
    category: 'anti-aging',
    popular: true,
  },
  {
    name: 'FOXO4-DRI',
    description: 'A senolytic peptide designed to target and clear senescent (aging) cells from the body.',
    specs: ['10mg'],
    category: 'anti-aging',
  },
  {
    name: 'NAD+',
    description: 'A crucial cellular coenzyme administered to boost ATP production and combat aging.',
    specs: ['1000mg'],
    category: 'anti-aging',
  },
  {
    name: 'SS-31 (Elamipretide)',
    description: 'A cellular health peptide that targets the inner mitochondrial membrane to restore bioenergetics.',
    specs: ['10mg', '50mg'],
    category: 'anti-aging',
  },
  {
    name: 'Thymalin',
    description: 'A bioregulator peptide that supports thymus gland function and helps balance the immune system.',
    specs: ['10mg'],
    category: 'anti-aging',
  },
  {
    name: 'Thymosin Alpha-1',
    description: 'A primary immune-modulating peptide used to fight chronic infections and enhance immunity.',
    specs: ['5mg', '10mg'],
    category: 'anti-aging',
  },

  // ── Sexual Health & Fertility ──────────────────────────────
  {
    name: 'PT-141 (Bremelanotide)',
    description: 'A peptide highly effective for treating central male and female sexual dysfunction.',
    specs: ['10mg'],
    category: 'sexual-health',
  },
  {
    name: 'Kisspeptin-10',
    description: 'A neuropeptide that regulates the reproductive axis and naturally boosts testosterone.',
    specs: ['5mg', '10mg'],
    category: 'sexual-health',
  },
  {
    name: 'Gonadorelin',
    description: 'A synthetic GnRH used to stimulate the pulsatile release of FSH and LH from the pituitary.',
    specs: ['2mg'],
    category: 'sexual-health',
  },
  {
    name: 'HCG',
    description: 'Human Chorionic Gonadotropin, used to maintain testicular function and natural testosterone production.',
    specs: ['5000iu', '10000iu'],
    category: 'sexual-health',
  },
  {
    name: 'HMG',
    description: 'Human Menopausal Gonadotropin, utilized to treat infertility by directly stimulating FSH and LH receptors.',
    specs: ['75iu'],
    category: 'sexual-health',
  },
  {
    name: 'Papaverine (Trimix)',
    description: 'A smooth muscle relaxant and vasodilator commonly used for erectile dysfunction.',
    specs: ['Trimix injection'],
    category: 'sexual-health',
  },

  // ── Immune Support ─────────────────────────────────────────
  {
    name: 'KPV',
    description: 'A naturally occurring peptide with powerful anti-inflammatory and systemic antimicrobial properties.',
    specs: ['10mg'],
    category: 'immune',
  },
  {
    name: 'LL37',
    description: 'A naturally occurring antimicrobial peptide that aids in fighting off infections.',
    specs: ['5mg'],
    category: 'immune',
  },
  {
    name: 'VIP',
    description: 'Vasoactive Intestinal Peptide, which regulates systemic inflammation, pulmonary health, and immune function.',
    specs: ['10mg'],
    category: 'immune',
  },
  {
    name: 'PNC 27',
    description: 'A membrane-active peptide researched for its targeted anti-cancer properties.',
    specs: ['5mg', '10mg'],
    category: 'immune',
  },
  {
    name: 'Glutathione',
    description: "The body's master antioxidant, used for cellular detoxification and immune support.",
    specs: ['600mg', '1500mg'],
    category: 'immune',
  },

  // ── Cosmetic & Skin ────────────────────────────────────────
  {
    name: 'Melanotan I (MT-1)',
    description: 'A synthetic peptide that safely stimulates melanin production for a UV-protective tan.',
    specs: ['10mg'],
    category: 'cosmetic',
  },
  {
    name: 'Melanotan II (MT-2)',
    description: 'A stronger variant of Melanotan that induces rapid tanning and is known to boost libido.',
    specs: ['10mg'],
    category: 'cosmetic',
  },
  {
    name: 'Snap-8',
    description: 'A cosmetic octapeptide applied topically or injected to reduce the depth of facial wrinkles.',
    specs: ['10mg'],
    category: 'cosmetic',
  },
  {
    name: 'Botulinum Toxin',
    description: 'A neurotoxic protein widely utilized in cosmetic procedures to temporarily relax muscles and reduce wrinkles.',
    specs: ['100iu'],
    category: 'cosmetic',
  },
  {
    name: 'Hyaluronic Acid',
    description: 'A hydrating and lubricating compound primarily used for skin plumping and joint support.',
    specs: ['5mg/vial'],
    category: 'cosmetic',
  },

  // ── Supplies ───────────────────────────────────────────────
  {
    name: 'Bacteriostatic Water',
    description: 'Sterile water containing benzyl alcohol, universally used to safely reconstitute peptides.',
    specs: ['3ml x 10', '10ml x 10'],
    category: 'supplies',
  },
  {
    name: 'Acetic Acid Water',
    description: 'A specialized diluent strictly required for reconstituting specific complex peptides.',
    specs: ['3ml x 10'],
    category: 'supplies',
  },
]

export function getProductsByCategory(cat: Category): Product[] {
  return products.filter((p) => p.category === cat)
}

export function getPopularProducts(): Product[] {
  return products.filter((p) => p.popular)
}

export function getCategoryInfo(cat: Category): CategoryInfo | undefined {
  return categories.find((c) => c.id === cat)
}
