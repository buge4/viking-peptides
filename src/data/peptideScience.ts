// Per-category and per-product science data for infographic displays

export interface MechanismStep {
  icon: string       // SVG path or symbol
  label: string
  detail: string
}

export interface BodyRegion {
  id: string
  label: string
  cx: number         // % x position on body silhouette
  cy: number         // % y position on body silhouette
  description: string
}

export interface TimelineEvent {
  year: string
  label: string
  detail: string
}

export interface ComparisonStat {
  icon: string
  label: string
  value: string
  unit?: string
}

export interface PeptideScienceData {
  mechanismSteps: MechanismStep[]
  bodyRegions: BodyRegion[]
  timeline: TimelineEvent[]
  stats: ComparisonStat[]
  molecularWeight?: string
  aminoAcidCount?: string
  sequence?: string
}

// ── Category-level defaults ────────────────────────────────────────────

const categoryDefaults: Record<string, PeptideScienceData> = {
  'weight-management': {
    mechanismSteps: [
      { icon: 'receptor', label: 'Receptor Binding', detail: 'Peptide binds to incretin receptors (GLP-1, GIP) on target cells' },
      { icon: 'signal', label: 'Signal Cascade', detail: 'Activates cAMP pathway, triggering insulin secretion and satiety signals' },
      { icon: 'brain', label: 'Appetite Suppression', detail: 'Hypothalamic neurons reduce hunger drive and food-seeking behavior' },
      { icon: 'metabolism', label: 'Metabolic Shift', detail: 'Enhanced fat oxidation, reduced hepatic glucose output, improved insulin sensitivity' },
    ],
    bodyRegions: [
      { id: 'brain', label: 'Hypothalamus', cx: 50, cy: 8, description: 'Appetite regulation center' },
      { id: 'pancreas', label: 'Pancreas', cx: 42, cy: 42, description: 'Insulin secretion modulation' },
      { id: 'gut', label: 'GI Tract', cx: 50, cy: 48, description: 'Gastric emptying delay' },
      { id: 'liver', label: 'Liver', cx: 58, cy: 38, description: 'Hepatic glucose regulation' },
      { id: 'adipose', label: 'Adipose Tissue', cx: 35, cy: 52, description: 'Fat oxidation enhancement' },
    ],
    timeline: [
      { year: '1987', label: 'GLP-1 Discovery', detail: 'GLP-1 identified as an incretin hormone from proglucagon processing' },
      { year: '2005', label: 'First GLP-1 RA', detail: 'Exenatide (Byetta) becomes first approved GLP-1 receptor agonist' },
      { year: '2017', label: 'Semaglutide Approved', detail: 'FDA approves semaglutide for type 2 diabetes (Ozempic)' },
      { year: '2022', label: 'Dual Agonist Era', detail: 'Tirzepatide approved; triple agonists enter Phase 2 trials' },
      { year: '2024', label: 'Triple Agonists', detail: 'Retatrutide Phase 3 trials show 24%+ weight reduction' },
    ],
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '89', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '5-7', unit: 'days' },
      { icon: 'route', label: 'Administration', value: 'Subcutaneous' },
      { icon: 'storage', label: 'Storage', value: '2-8', unit: 'C' },
    ],
  },

  'growth-hormone': {
    mechanismSteps: [
      { icon: 'receptor', label: 'GHRH/Ghrelin Binding', detail: 'Peptide engages growth hormone secretagogue receptors or GHRH receptors' },
      { icon: 'signal', label: 'Pituitary Activation', detail: 'Somatotroph cells in anterior pituitary increase GH synthesis and pulsatile release' },
      { icon: 'liver', label: 'IGF-1 Production', detail: 'Liver converts GH signal to IGF-1, amplifying anabolic cascades systemically' },
      { icon: 'growth', label: 'Tissue Growth', detail: 'Muscle hypertrophy, bone density increase, enhanced lipolysis and recovery' },
    ],
    bodyRegions: [
      { id: 'pituitary', label: 'Pituitary Gland', cx: 50, cy: 7, description: 'GH synthesis and release' },
      { id: 'liver', label: 'Liver', cx: 58, cy: 38, description: 'IGF-1 production hub' },
      { id: 'muscles', label: 'Skeletal Muscle', cx: 32, cy: 58, description: 'Protein synthesis target' },
      { id: 'bones', label: 'Bone Tissue', cx: 65, cy: 65, description: 'Osteoblast stimulation' },
      { id: 'adipose', label: 'Adipose Tissue', cx: 35, cy: 48, description: 'Lipolysis activation' },
    ],
    timeline: [
      { year: '1958', label: 'GH Isolated', detail: 'Human growth hormone first purified from cadaveric pituitary extracts' },
      { year: '1981', label: 'GHRH Discovery', detail: 'Growth hormone-releasing hormone identified from pancreatic tumors' },
      { year: '1985', label: 'Recombinant GH', detail: 'FDA approves first recombinant human GH (somatropin)' },
      { year: '1999', label: 'Secretagogues', detail: 'CJC-1295 and Ipamorelin emerge as targeted GH secretagogues' },
      { year: '2020', label: 'Modern Protocols', detail: 'Combination protocols with synergistic peptide stacking gain research traction' },
    ],
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '70-90', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '2-8', unit: 'hrs' },
      { icon: 'route', label: 'Administration', value: 'Subcutaneous' },
      { icon: 'storage', label: 'Storage', value: '-20', unit: 'C' },
    ],
  },

  'recovery-healing': {
    mechanismSteps: [
      { icon: 'receptor', label: 'Growth Factor Activation', detail: 'Peptide upregulates VEGF, FGF, and EGF receptors at injury sites' },
      { icon: 'signal', label: 'Cell Migration', detail: 'FAK-paxillin pathway activation drives fibroblast and endothelial cell migration' },
      { icon: 'vessel', label: 'Angiogenesis', detail: 'New blood vessel formation increases nutrient delivery to damaged tissue' },
      { icon: 'repair', label: 'Tissue Remodeling', detail: 'Collagen deposition, tendon strengthening, and neural reconnection' },
    ],
    bodyRegions: [
      { id: 'muscles', label: 'Muscle Tissue', cx: 32, cy: 55, description: 'Fiber repair and regeneration' },
      { id: 'tendons', label: 'Tendons', cx: 68, cy: 60, description: 'Collagen synthesis acceleration' },
      { id: 'joints', label: 'Joints', cx: 28, cy: 68, description: 'Cartilage repair support' },
      { id: 'gut', label: 'GI Tract', cx: 50, cy: 45, description: 'Mucosal healing (BPC-157)' },
      { id: 'nerves', label: 'Peripheral Nerves', cx: 65, cy: 50, description: 'Neuronal reconnection' },
    ],
    timeline: [
      { year: '1991', label: 'BPC Discovery', detail: 'BPC-157 isolated from human gastric juice as a protective compound' },
      { year: '1999', label: 'TB-4 Characterized', detail: 'Thymosin Beta-4 wound healing properties extensively documented' },
      { year: '2010', label: 'GHK-Cu Research', detail: 'Copper peptide GHK-Cu shown to activate 4,000+ genes related to repair' },
      { year: '2018', label: 'Combination Stacks', detail: 'BPC-157 + TB-500 synergy demonstrated in preclinical injury models' },
      { year: '2024', label: 'Clinical Translation', detail: 'Multiple clinical trials initiated for BPC-157 in tendinopathy' },
    ],
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '65-80', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '4-6', unit: 'hrs' },
      { icon: 'route', label: 'Administration', value: 'SC / Local' },
      { icon: 'storage', label: 'Storage', value: '-20', unit: 'C' },
    ],
  },

  cognitive: {
    mechanismSteps: [
      { icon: 'receptor', label: 'Receptor Modulation', detail: 'Binds melanocortin or tuftsin receptors modulating monoamine systems' },
      { icon: 'signal', label: 'BDNF Upregulation', detail: 'Brain-derived neurotrophic factor expression increases up to 800%' },
      { icon: 'brain', label: 'Synaptic Plasticity', detail: 'Enhanced long-term potentiation and dendritic spine density' },
      { icon: 'cognition', label: 'Cognitive Output', detail: 'Improved memory consolidation, attention span, and anxiety reduction' },
    ],
    bodyRegions: [
      { id: 'prefrontal', label: 'Prefrontal Cortex', cx: 48, cy: 5, description: 'Executive function and focus' },
      { id: 'hippocampus', label: 'Hippocampus', cx: 55, cy: 9, description: 'Memory consolidation center' },
      { id: 'amygdala', label: 'Amygdala', cx: 45, cy: 10, description: 'Anxiety and fear modulation' },
      { id: 'pineal', label: 'Pineal Gland', cx: 52, cy: 7, description: 'Circadian rhythm regulation' },
    ],
    timeline: [
      { year: '1982', label: 'Semax Developed', detail: 'Synthetic ACTH(4-10) analog created at Russian Academy of Sciences' },
      { year: '1996', label: 'Selank Synthesized', detail: 'Tuftsin analog with anxiolytic properties enters preclinical research' },
      { year: '2008', label: 'DSIP Mechanisms', detail: 'Delta sleep-inducing peptide sleep architecture effects clarified' },
      { year: '2015', label: 'Genomic Studies', detail: 'Selank shown to modulate expression of 36+ neuroplasticity genes' },
      { year: '2023', label: 'BDNF Focus', detail: 'Nootropic peptide research converges on neurotrophic factor pathways' },
    ],
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '40-60', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '1-3', unit: 'min' },
      { icon: 'route', label: 'Administration', value: 'Intranasal' },
      { icon: 'storage', label: 'Storage', value: '2-8', unit: 'C' },
    ],
  },

  'anti-aging': {
    mechanismSteps: [
      { icon: 'receptor', label: 'Cellular Targeting', detail: 'Peptide reaches senescent cells, mitochondria, or telomeric complexes' },
      { icon: 'signal', label: 'Telomerase Activation', detail: 'hTERT expression restores telomere length in somatic cells' },
      { icon: 'mitochondria', label: 'Mitochondrial Repair', detail: 'Restored electron transport chain efficiency and ATP production' },
      { icon: 'rejuvenation', label: 'Cellular Rejuvenation', detail: 'Reduced oxidative damage, senescent cell clearance, improved biomarkers' },
    ],
    bodyRegions: [
      { id: 'telomeres', label: 'Telomeres', cx: 50, cy: 5, description: 'Chromosome end-cap maintenance' },
      { id: 'mitochondria', label: 'Mitochondria', cx: 50, cy: 35, description: 'Energy production organelles' },
      { id: 'thymus', label: 'Thymus', cx: 50, cy: 25, description: 'Immune system regeneration' },
      { id: 'pineal', label: 'Pineal Gland', cx: 52, cy: 8, description: 'Melatonin and circadian control' },
      { id: 'skin', label: 'Skin / Collagen', cx: 35, cy: 40, description: 'Structural protein renewal' },
    ],
    timeline: [
      { year: '1973', label: 'Epitalon Origin', detail: 'Khavinson begins research on pineal gland bioregulators at IEM' },
      { year: '2001', label: 'Telomerase Link', detail: 'Epitalon demonstrated to activate telomerase in human somatic cells' },
      { year: '2013', label: 'Senolytic Era', detail: 'FOXO4-DRI identified as targeted senescent cell elimination peptide' },
      { year: '2018', label: 'SS-31 Trials', detail: 'Elamipretide enters clinical trials for mitochondrial dysfunction' },
      { year: '2024', label: 'NAD+ Protocols', detail: 'NAD+ replenishment integrated with telomerase-activating peptide stacks' },
    ],
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '75-95', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '2-12', unit: 'hrs' },
      { icon: 'route', label: 'Administration', value: 'SC / IV' },
      { icon: 'storage', label: 'Storage', value: '-20', unit: 'C' },
    ],
  },

  'sexual-health': {
    mechanismSteps: [
      { icon: 'receptor', label: 'Melanocortin Binding', detail: 'Peptide activates MC3R/MC4R in the hypothalamus or GnRH receptors' },
      { icon: 'signal', label: 'Neuroendocrine Cascade', detail: 'Downstream dopaminergic signaling in mesolimbic reward pathway' },
      { icon: 'hormone', label: 'Hormonal Response', detail: 'FSH/LH release stimulates gonadal function and sex hormone production' },
      { icon: 'function', label: 'Physiological Effect', detail: 'Enhanced sexual desire, improved erectile function, fertility support' },
    ],
    bodyRegions: [
      { id: 'hypothalamus', label: 'Hypothalamus', cx: 50, cy: 7, description: 'Sexual desire center (MC4R)' },
      { id: 'pituitary', label: 'Pituitary', cx: 52, cy: 9, description: 'FSH and LH secretion' },
      { id: 'gonads', label: 'Gonads', cx: 50, cy: 62, description: 'Testosterone / estrogen production' },
      { id: 'adrenals', label: 'Adrenal Glands', cx: 42, cy: 38, description: 'DHEA and cortisol balance' },
    ],
    timeline: [
      { year: '1998', label: 'PT-141 Origins', detail: 'Bremelanotide discovered as a derivative of melanotan II research' },
      { year: '2005', label: 'Central Mechanism', detail: 'PT-141 confirmed to work via CNS melanocortin pathways, not PDE5' },
      { year: '2013', label: 'Kisspeptin Research', detail: 'Kisspeptin-10 identified as master regulator of reproductive axis' },
      { year: '2019', label: 'FDA Approval', detail: 'Bremelanotide (Vyleesi) FDA-approved for premenopausal HSDD' },
      { year: '2024', label: 'Fertility Peptides', detail: 'Kisspeptin and GnRH analogs researched for male and female fertility' },
    ],
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '80', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '2-4', unit: 'hrs' },
      { icon: 'route', label: 'Administration', value: 'Subcutaneous' },
      { icon: 'storage', label: 'Storage', value: '2-8', unit: 'C' },
    ],
  },

  immune: {
    mechanismSteps: [
      { icon: 'receptor', label: 'Immune Recognition', detail: 'Peptide engages toll-like receptors or direct antimicrobial membrane interaction' },
      { icon: 'signal', label: 'Cytokine Modulation', detail: 'Downregulates pro-inflammatory NF-kB while enhancing innate immunity' },
      { icon: 'defense', label: 'Pathogen Clearance', detail: 'Enhanced phagocytosis, antimicrobial peptide expression, and T-cell activity' },
      { icon: 'balance', label: 'Immune Homeostasis', detail: 'Restored Th1/Th2 balance, reduced autoimmune markers, mucosal defense' },
    ],
    bodyRegions: [
      { id: 'thymus', label: 'Thymus', cx: 50, cy: 25, description: 'T-cell maturation center' },
      { id: 'bone-marrow', label: 'Bone Marrow', cx: 35, cy: 70, description: 'Immune cell production' },
      { id: 'spleen', label: 'Spleen', cx: 38, cy: 40, description: 'Immune filtration organ' },
      { id: 'lymph', label: 'Lymph Nodes', cx: 60, cy: 30, description: 'Immune surveillance hubs' },
      { id: 'gut', label: 'GALT', cx: 50, cy: 48, description: 'Gut-associated lymphoid tissue' },
    ],
    timeline: [
      { year: '1966', label: 'Thymosin Discovery', detail: 'Thymosin alpha-1 isolated from thymus gland as immune modulator' },
      { year: '1995', label: 'KPV Identified', detail: 'Alpha-MSH-derived tripeptide KPV demonstrated anti-inflammatory action' },
      { year: '2003', label: 'LL-37 Mechanism', detail: 'Human cathelicidin LL-37 antimicrobial mechanism fully characterized' },
      { year: '2015', label: 'VIP Research', detail: 'Vasoactive intestinal peptide shown to modulate CIRS and mold illness' },
      { year: '2023', label: 'Peptide Immunity', detail: 'Antimicrobial peptides gain recognition as next-gen anti-infective agents' },
    ],
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '60-85', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '3-6', unit: 'hrs' },
      { icon: 'route', label: 'Administration', value: 'SC / IV' },
      { icon: 'storage', label: 'Storage', value: '-20', unit: 'C' },
    ],
  },

  cosmetic: {
    mechanismSteps: [
      { icon: 'receptor', label: 'Melanocortin Activation', detail: 'MC1R receptor binding on melanocytes or neuromuscular junction modulation' },
      { icon: 'signal', label: 'Melanin Synthesis', detail: 'Tyrosinase activation pathway drives eumelanin production in skin cells' },
      { icon: 'skin', label: 'Structural Remodeling', detail: 'Collagen I/III synthesis, elastin fiber restoration, wrinkle depth reduction' },
      { icon: 'result', label: 'Cosmetic Outcome', detail: 'Even pigmentation, reduced wrinkle depth, improved skin hydration' },
    ],
    bodyRegions: [
      { id: 'skin-face', label: 'Facial Skin', cx: 50, cy: 10, description: 'Wrinkle and pigmentation target' },
      { id: 'skin-body', label: 'Body Skin', cx: 35, cy: 45, description: 'Melanin distribution' },
      { id: 'hair', label: 'Hair Follicles', cx: 50, cy: 3, description: 'Growth cycle regulation' },
      { id: 'dermis', label: 'Dermis Layer', cx: 65, cy: 35, description: 'Collagen and elastin matrix' },
    ],
    timeline: [
      { year: '1980', label: 'Melanotan Origin', detail: 'University of Arizona begins melanocortin peptide research' },
      { year: '1999', label: 'MT-II Synthesized', detail: 'Melanotan II demonstrates potent tanning and libido effects' },
      { year: '2007', label: 'Snap-8 Research', detail: 'Octapeptide shown to reduce wrinkle depth by modulating SNARE complex' },
      { year: '2015', label: 'GHK-Cu Skin', detail: 'Copper peptide research shows 4,000+ gene modulation for skin repair' },
      { year: '2024', label: 'Peptide Cosmetics', detail: 'Cosmeceutical peptides become mainstream in anti-aging dermatology' },
    ],
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '70-90', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '1-3', unit: 'hrs' },
      { icon: 'route', label: 'Administration', value: 'SC / Topical' },
      { icon: 'storage', label: 'Storage', value: '2-8', unit: 'C' },
    ],
  },

  supplies: {
    mechanismSteps: [],
    bodyRegions: [],
    timeline: [],
    stats: [],
  },
}

// ── Product-specific overrides ─────────────────────────────────────────

const productOverrides: Record<string, Partial<PeptideScienceData>> = {
  semaglutide: {
    molecularWeight: '4,113.58 Da',
    aminoAcidCount: '31 amino acids',
    sequence: 'Modified GLP-1(7-37) with Aib8, Arg34, C-18 fatty diacid at Lys26',
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '89', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '~7', unit: 'days' },
      { icon: 'route', label: 'Administration', value: 'Subcutaneous' },
      { icon: 'storage', label: 'Storage', value: '2-8', unit: 'C' },
    ],
    mechanismSteps: [
      { icon: 'receptor', label: 'GLP-1R Binding', detail: 'Binds GLP-1 receptors with 94% homology to native GLP-1, C-18 fatty acid chain enables albumin binding for extended duration' },
      { icon: 'signal', label: 'Incretin Signaling', detail: 'Activates cAMP cascade in pancreatic beta cells and hypothalamic neurons' },
      { icon: 'brain', label: 'Central Satiety', detail: 'Reduces appetite via POMC/CART neuron activation in arcuate nucleus' },
      { icon: 'metabolism', label: 'Metabolic Improvement', detail: '15-17% average weight reduction, HbA1c decrease, cardiovascular risk reduction' },
    ],
    timeline: [
      { year: '1987', label: 'GLP-1 Discovered', detail: 'Glucagon-like peptide-1 identified as incretin hormone' },
      { year: '2012', label: 'Semaglutide Patent', detail: 'Novo Nordisk patents semaglutide chemical structure' },
      { year: '2017', label: 'Ozempic Approval', detail: 'FDA approves for type 2 diabetes management' },
      { year: '2021', label: 'Wegovy Approval', detail: 'FDA approves 2.4mg for chronic weight management' },
      { year: '2023', label: 'CV Benefit', detail: 'SELECT trial shows 20% cardiovascular risk reduction' },
    ],
  },
  tirzepatide: {
    molecularWeight: '4,813.45 Da',
    aminoAcidCount: '39 amino acids',
    sequence: 'Dual GIP/GLP-1 receptor agonist with C-20 fatty diacid linker',
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '80', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '~5', unit: 'days' },
      { icon: 'route', label: 'Administration', value: 'Subcutaneous' },
      { icon: 'storage', label: 'Storage', value: '2-8', unit: 'C' },
    ],
    mechanismSteps: [
      { icon: 'receptor', label: 'Dual Receptor Binding', detail: 'Simultaneously engages GIP and GLP-1 receptors with balanced agonism' },
      { icon: 'signal', label: 'Dual Incretin Effect', detail: 'GIP enhances fat oxidation while GLP-1 drives appetite suppression' },
      { icon: 'brain', label: 'Superior Satiety', detail: 'Dual pathway activation produces greater weight loss than GLP-1 alone' },
      { icon: 'metabolism', label: 'Record Efficacy', detail: 'Up to 22.5% weight reduction in SURMOUNT trials, superior glycemic control' },
    ],
    timeline: [
      { year: '2016', label: 'Tirzepatide Designed', detail: 'Eli Lilly engineers first dual GIP/GLP-1 receptor agonist' },
      { year: '2021', label: 'SURPASS Trials', detail: 'Phase 3 demonstrates superiority to semaglutide in T2DM' },
      { year: '2022', label: 'Mounjaro Approval', detail: 'FDA approves for type 2 diabetes management' },
      { year: '2023', label: 'Zepbound Approval', detail: 'FDA approves for chronic weight management' },
      { year: '2024', label: 'Expansion Studies', detail: 'Trials in heart failure, MASH, and sleep apnea' },
    ],
  },
  retatrutide: {
    molecularWeight: '~4,600 Da',
    aminoAcidCount: '39 amino acids',
    sequence: 'Triple GLP-1/GIP/Glucagon receptor agonist',
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '85', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '~6', unit: 'days' },
      { icon: 'route', label: 'Administration', value: 'Subcutaneous' },
      { icon: 'storage', label: 'Storage', value: '2-8', unit: 'C' },
    ],
  },
  'bpc-157': {
    molecularWeight: '1,419.53 Da',
    aminoAcidCount: '15 amino acids',
    sequence: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val',
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '~70', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '~4', unit: 'hrs' },
      { icon: 'route', label: 'Administration', value: 'SC / Oral' },
      { icon: 'storage', label: 'Storage', value: '-20', unit: 'C' },
    ],
    mechanismSteps: [
      { icon: 'receptor', label: 'FAK-Paxillin Pathway', detail: 'Activates focal adhesion kinase signaling for rapid cell migration to injury sites' },
      { icon: 'signal', label: 'NO System Modulation', detail: 'Nitric oxide system regulation promotes angiogenesis and vasculoprotection' },
      { icon: 'vessel', label: 'VEGF Upregulation', detail: 'Vascular endothelial growth factor expression creates new blood supply to damaged tissue' },
      { icon: 'repair', label: 'Multi-Tissue Healing', detail: 'Tendons, ligaments, muscle, gut mucosa, bone, and nerve tissue all respond to BPC-157' },
    ],
  },
  tb500: {
    molecularWeight: '4,963 Da',
    aminoAcidCount: '43 amino acids',
    sequence: 'Active site: LKKTET (actin-binding domain)',
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '~75', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '~6', unit: 'hrs' },
      { icon: 'route', label: 'Administration', value: 'SC / IM' },
      { icon: 'storage', label: 'Storage', value: '-20', unit: 'C' },
    ],
  },
  'hgh-191aa': {
    molecularWeight: '22,124 Da',
    aminoAcidCount: '191 amino acids',
    sequence: 'Bio-identical recombinant human growth hormone (somatropin)',
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '75', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '3-5', unit: 'hrs' },
      { icon: 'route', label: 'Administration', value: 'Subcutaneous' },
      { icon: 'storage', label: 'Storage', value: '2-8', unit: 'C' },
    ],
  },
  epitalon: {
    molecularWeight: '390.35 Da',
    aminoAcidCount: '4 amino acids',
    sequence: 'Ala-Glu-Asp-Gly (tetrapeptide)',
    stats: [
      { icon: 'bioavail', label: 'Bioavailability', value: '95', unit: '%' },
      { icon: 'halflife', label: 'Half-Life', value: '~2', unit: 'hrs' },
      { icon: 'route', label: 'Administration', value: 'Subcutaneous' },
      { icon: 'storage', label: 'Storage', value: '-20', unit: 'C' },
    ],
    mechanismSteps: [
      { icon: 'receptor', label: 'Pineal Signaling', detail: 'Reaches pineal gland and somatic cell nuclei to activate telomere maintenance genes' },
      { icon: 'signal', label: 'hTERT Activation', detail: 'Induces human telomerase reverse transcriptase expression in somatic cells' },
      { icon: 'mitochondria', label: 'Telomere Extension', detail: 'Telomerase adds TTAGGG repeats to chromosome ends, extending replicative capacity' },
      { icon: 'rejuvenation', label: 'Biomarker Improvement', detail: 'Restored melatonin production, reduced lipid peroxidation, improved immune markers' },
    ],
  },
  selank: {
    molecularWeight: '751.87 Da',
    aminoAcidCount: '7 amino acids',
    sequence: 'Thr-Lys-Pro-Arg-Pro-Gly-Pro (tuftsin analog)',
  },
  semax: {
    molecularWeight: '813.93 Da',
    aminoAcidCount: '7 amino acids',
    sequence: 'Met-Glu-His-Phe-Pro-Gly-Pro (ACTH 4-10 analog)',
  },
  'pt-141': {
    molecularWeight: '1,025.18 Da',
    aminoAcidCount: '7 amino acids',
    sequence: 'Cyclic heptapeptide melanocortin agonist',
  },
  'nad-plus': {
    molecularWeight: '663.43 Da',
    aminoAcidCount: 'N/A (dinucleotide)',
    sequence: 'Nicotinamide adenine dinucleotide',
  },
}

// ── Public API ─────────────────────────────────────────────────────────

export function getPeptideScienceData(
  slug: string,
  category: string,
): PeptideScienceData | null {
  if (category === 'supplies') return null

  const base = categoryDefaults[category]
  if (!base) return null

  const override = productOverrides[slug]
  if (!override) return base

  return {
    ...base,
    ...override,
    mechanismSteps: override.mechanismSteps || base.mechanismSteps,
    bodyRegions: override.bodyRegions || base.bodyRegions,
    timeline: override.timeline || base.timeline,
    stats: override.stats || base.stats,
  }
}
