// Product pairings — "Goes well together with"
// Mirrors the DB seed in 003-specs-prices-pairings.sql

export interface Pairing {
  slug: string
  reason: string
  stackName?: string
}

export const pairings: Record<string, Pairing[]> = {
  semaglutide: [
    { slug: 'bpc-157', reason: 'BPC-157 helps protect the GI tract from nausea side effects common with GLP-1 agonists.' },
    { slug: 'l-carnitine', reason: 'L-Carnitine enhances mitochondrial fat oxidation, complementing appetite suppression for accelerated fat loss.' },
    { slug: 'cagrilintide', reason: 'The CagriSema combination targets both GLP-1 and amylin pathways for superior weight loss (~25% body weight).', stackName: 'CagriSema Stack' },
    { slug: 'mots-c', reason: 'MOTS-C enhances metabolic flexibility and exercise endurance, countering potential muscle loss.' },
  ],
  tirzepatide: [
    { slug: 'bpc-157', reason: 'BPC-157 provides GI protection against nausea during incretin therapy.' },
    { slug: 'l-carnitine', reason: 'L-Carnitine supports mitochondrial fat burning alongside dual-receptor metabolic effects.' },
    { slug: 'aod9604', reason: 'AOD9604 targets fat-specific lipolysis through a different pathway.' },
  ],
  retatrutide: [
    { slug: 'bpc-157', reason: 'BPC-157 helps mitigate GI side effects common with triple-receptor agonists.' },
    { slug: 'cagrilintide', reason: 'Adding amylin pathway creates four-receptor metabolic coverage.', stackName: 'Quad Stack' },
    { slug: 'mots-c', reason: 'MOTS-C supports metabolic flexibility during aggressive weight management.' },
  ],
  'bpc-157': [
    { slug: 'tb500', reason: 'The classic healing stack — BPC-157 drives local repair while TB-500 promotes systemic healing. Together they work faster than either alone.', stackName: 'Wolverine Stack' },
    { slug: 'ghk-cu', reason: 'GHK-Cu adds collagen synthesis and tissue remodeling to BPC-157\'s growth factor modulation.', stackName: 'Glow Stack' },
    { slug: 'ipamorelin', reason: 'GH pulses amplify tissue repair by providing anabolic support for healing.' },
    { slug: 'kpv', reason: 'KPV\'s NF-kB anti-inflammatory action pairs perfectly with tissue repair for injury recovery.' },
  ],
  tb500: [
    { slug: 'bpc-157', reason: 'BPC-157 + TB-500 is the gold standard healing combination, complementary repair pathways.', stackName: 'Wolverine Stack' },
    { slug: 'ghk-cu', reason: 'GHK-Cu enhances collagen production alongside TB-500\'s cell migration effects.', stackName: 'Glow Stack' },
    { slug: 'mgf', reason: 'MGF activates satellite cells for muscle repair, complementing broader tissue healing.' },
  ],
  'ghk-cu': [
    { slug: 'epitalon', reason: 'Telomere extension combined with collagen synthesis creates comprehensive anti-aging.', stackName: 'Longevity Stack' },
    { slug: 'snap-8', reason: 'GHK-Cu rebuilds collagen while Snap-8 reduces expression lines.', stackName: 'Anti-Wrinkle Stack' },
    { slug: 'bpc-157', reason: 'BPC-157\'s growth factor modulation enhances GHK-Cu\'s tissue remodeling.' },
  ],
  'hgh-191aa': [
    { slug: 'bpc-157', reason: 'BPC-157 upregulates GH receptors, potentially enhancing HGH effectiveness.' },
    { slug: 'igf1-lr3', reason: 'IGF-1 LR3 adds muscle hyperplasia to HGH\'s hypertrophy effects.', stackName: 'Anabolic Stack' },
    { slug: 'tesamorelin', reason: 'Tesamorelin\'s visceral fat reduction complements body composition effects.' },
  ],
  'cjc1295-ipamorelin': [
    { slug: 'sermorelin', reason: 'Additional GHRH stimulation through a slightly different receptor interaction.', stackName: 'GH Max Stack' },
    { slug: 'bpc-157', reason: 'GH receptor upregulation enhances the GH pulse produced by CJC/Ipamorelin.' },
    { slug: 'dsip', reason: 'DSIP improves deep sleep quality when the GH pulse is released before bed.', stackName: 'Sleep & Growth Stack' },
  ],
  ipamorelin: [
    { slug: 'cjc1295-no-dac', reason: 'The classic synergistic GH stack: GHRH amplifies the pulse initiated by GHRP.', stackName: 'GH Synergy Stack' },
    { slug: 'sermorelin', reason: 'Alternative GHRH pairing for pulsatile GH release.' },
  ],
  selank: [
    { slug: 'semax', reason: 'The Russian nootropic duo: Selank for anxiolysis + Semax for cognitive enhancement.', stackName: 'Russian Nootropic Stack' },
    { slug: 'dsip', reason: 'Selank reduces anxiety during the day while DSIP optimizes sleep at night.' },
  ],
  semax: [
    { slug: 'selank', reason: 'Selank\'s anxiolytic effects complement Semax\'s stimulating cognitive enhancement.', stackName: 'Russian Nootropic Stack' },
    { slug: 'uridine-choline', reason: 'Building blocks for neuronal membranes while Semax drives BDNF-mediated neuroplasticity.', stackName: 'Neurogenesis Stack' },
  ],
  epitalon: [
    { slug: 'thymalin', reason: 'Khavinson\'s longevity protocol: telomere extension + immune rejuvenation. 46% mortality reduction in studies.', stackName: 'Khavinson Longevity Stack' },
    { slug: 'foxo4-dri', reason: 'Extend telomeres + clear senescent cells — two pillars of aging simultaneously.', stackName: 'Anti-Aging Power Stack' },
    { slug: 'nad-plus', reason: 'Restore cellular energy + maintain telomere length — foundational anti-aging pair.', stackName: 'Cellular Rejuvenation Stack' },
    { slug: 'ss-31', reason: 'SS-31 repairs mitochondria while Epitalon extends cellular lifespan.' },
  ],
  'nad-plus': [
    { slug: 'ss-31', reason: 'NAD+ fuels sirtuins while SS-31 stabilizes mitochondrial membranes.', stackName: 'Mitochondrial Stack' },
    { slug: 'glutathione', reason: 'The two master molecules of cellular defense and energy — foundational pairing.' },
    { slug: 'epitalon', reason: 'Cellular energy restoration + telomere maintenance.', stackName: 'Cellular Rejuvenation Stack' },
  ],
  'foxo4-dri': [
    { slug: 'epitalon', reason: 'Clear senescent cells + extend remaining healthy cell telomeres.', stackName: 'Anti-Aging Power Stack' },
    { slug: 'thymosin-alpha-1', reason: 'Immune system helps process and remove debris from cleared senescent cells.' },
  ],
  'pt-141': [
    { slug: 'melanotan-2', reason: 'MT-2 activates same melanocortin receptors with tanning effects and arousal.' },
    { slug: 'kisspeptin-10', reason: 'Kisspeptin drives HPG axis (testosterone) while PT-141 activates central arousal.' },
  ],
  'kisspeptin-10': [
    { slug: 'gonadorelin', reason: 'Kisspeptin triggers GnRH neurons, Gonadorelin IS GnRH — restart a suppressed HPG axis.', stackName: 'HPG Restart Stack' },
    { slug: 'hcg', reason: 'Upstream hypothalamic + downstream Leydig cell — full-axis testosterone support.' },
  ],
  hcg: [
    { slug: 'gonadorelin', reason: 'Direct Leydig stimulation + maintained pituitary responsiveness.', stackName: 'TRT Support Stack' },
    { slug: 'kisspeptin-10', reason: 'Upstream and downstream support for the reproductive axis.' },
  ],
  kpv: [
    { slug: 'bpc-157', reason: 'NF-kB inhibition reduces inflammation while BPC-157 repairs tissue damage.' },
    { slug: 'll37', reason: 'Anti-inflammation + direct antimicrobial defense — complementary immune support.', stackName: 'Immune Shield Stack' },
  ],
  'thymosin-alpha-1': [
    { slug: 'thymalin', reason: 'Synthetic + natural thymic peptides for comprehensive T-cell immunity restoration.', stackName: 'Thymic Rejuvenation Stack' },
    { slug: 'glutathione', reason: 'Glutathione supports oxidative burst capacity of activated immune cells.' },
  ],
  'melanotan-2': [
    { slug: 'melanotan-1', reason: 'Use MT-2 for loading, MT-1 for steady maintenance.', stackName: 'Tan Protocol Stack' },
    { slug: 'pt-141', reason: 'Both activate melanocortin receptors — tanning + arousal effects.' },
  ],
  'snap-8': [
    { slug: 'ghk-cu', reason: 'Reduce expression lines + rebuild collagen — complementary anti-wrinkle.', stackName: 'Anti-Wrinkle Stack' },
    { slug: 'hyaluronic-acid', reason: 'Dynamic wrinkle reduction + volume and hydration for static wrinkles.' },
  ],
  'bacteriostatic-water': [
    { slug: 'acetic-acid-water', reason: 'Keep both diluents — most peptides use BAC water, but IGF-1 LR3 and others need acetic acid.' },
  ],
}
