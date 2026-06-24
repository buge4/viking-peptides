// Extended product details — mirrors DB long_description/mechanism/dosage/safety
// Used by ProductPage for rich content display

export interface ProductDetail {
  longDescription: string
  mechanism: string
  dosage: string
  safety: string
}

export const productDetails: Record<string, ProductDetail> = {
  semaglutide: {
    longDescription: 'Semaglutide is a glucagon-like peptide-1 (GLP-1) receptor agonist originally developed for type 2 diabetes management. It has become one of the most extensively researched peptides for weight management, demonstrating average body weight reductions of 15-17% in clinical trials. Beyond weight loss, semaglutide shows cardiovascular protective effects and may reduce inflammation markers.',
    mechanism: 'Binds to and activates GLP-1 receptors in the pancreas (enhancing insulin secretion), brain (reducing appetite via hypothalamic signaling), and gut (slowing gastric emptying). The 94% amino acid homology with native GLP-1 and fatty acid side chain provide extended half-life of approximately 7 days.',
    dosage: 'Typical research protocol: 0.25mg/week for 4 weeks, escalating to 0.5mg, then 1.0mg, up to 2.4mg/week. Subcutaneous injection.',
    safety: 'Most common side effects in research: nausea, vomiting, diarrhea (typically transient). Contraindicated with personal/family history of medullary thyroid carcinoma or MEN2.',
  },
  tirzepatide: {
    longDescription: 'Tirzepatide is a first-in-class dual glucose-dependent insulinotropic polypeptide (GIP) and GLP-1 receptor agonist. Clinical trials (SURMOUNT) demonstrated unprecedented weight loss of up to 22.5% of body weight. It represents a paradigm shift in metabolic peptide therapy by engaging two incretin pathways simultaneously.',
    mechanism: 'Activates both GIP and GLP-1 receptors. GIP receptor activation enhances fat oxidation, improves lipid metabolism, and may have direct effects on adipose tissue. Combined with GLP-1 effects, this dual mechanism produces superior metabolic outcomes.',
    dosage: 'Research dosing: start at 2.5mg/week for 4 weeks, escalate through 5mg, 7.5mg, 10mg, 12.5mg to maximum 15mg/week. Subcutaneous injection.',
    safety: 'GI side effects (nausea, diarrhea, constipation) most common during dose escalation. Same MTC/MEN2 contraindication as semaglutide.',
  },
  retatrutide: {
    longDescription: 'Retatrutide is a novel triple agonist targeting GLP-1, GIP, and glucagon receptors simultaneously. Phase 2 trials showed remarkable weight loss of up to 24% at 48 weeks — the highest recorded for any anti-obesity medication.',
    mechanism: 'Triple receptor activation: GLP-1 (appetite suppression), GIP (fat metabolism), and glucagon receptor (hepatic lipid oxidation, thermogenesis). This three-pronged approach addresses obesity from multiple metabolic angles.',
    dosage: 'Phase 2 dosing: 1mg escalating to 4mg, 8mg, or 12mg/week over 24-48 weeks. Subcutaneous injection.',
    safety: 'Similar GI side effect profile to other incretin-based peptides. Glucagon component may affect blood glucose differently. Still investigational.',
  },
  'bpc-157': {
    longDescription: 'BPC-157 (Body Protection Compound-157) is a 15-amino-acid peptide derived from a protective protein found in human gastric juice. It is one of the most extensively studied tissue-repair peptides, demonstrating remarkable healing acceleration across tendons, ligaments, muscles, gut lining, and nerve tissue in over 100 preclinical studies.',
    mechanism: 'Activates the FAK-paxillin pathway for cell migration and tissue repair. Upregulates growth hormone receptors. Modulates the NO system, promoting angiogenesis at injury sites. Increases VEGF expression for new blood vessel formation.',
    dosage: 'Research dosing: 250-500mcg subcutaneously near injury site, 1-2 times daily. Systemic: 250-500mcg SC in abdomen. 4-12 week protocols typical.',
    safety: 'Remarkably well-tolerated in all studies to date. No significant toxicity reported even at high doses. Considered one of the safest research peptides.',
  },
  tb500: {
    longDescription: 'TB-500 is a synthetic version of the 43-amino-acid protein Thymosin Beta-4, naturally present in nearly all human cells. It plays a central role in tissue repair by promoting cell migration, angiogenesis, and reducing inflammation.',
    mechanism: 'Upregulates actin, a cell-building protein essential for cell migration. Promotes angiogenesis through VEGF pathway. Reduces pro-inflammatory cytokines. The LKKTET sequence is the active site for actin binding.',
    dosage: 'Loading phase 2-5mg twice weekly for 4-6 weeks, then maintenance 2mg every 2 weeks. Subcutaneous or intramuscular.',
    safety: 'Well-tolerated with minimal side effects. Temporary head rush at injection. Theoretical concern about existing tumor growth due to angiogenesis.',
  },
  'hgh-191aa': {
    longDescription: 'HGH 191AA is bio-identical recombinant human growth hormone containing all 191 amino acids. Produced through recombinant DNA technology, it represents the gold standard in GH supplementation for research into muscle growth, fat metabolism, tissue repair, and anti-aging.',
    mechanism: 'Binds to GH receptors, triggering the JAK2-STAT5 signaling cascade. Stimulates hepatic IGF-1 production. Direct effects include lipolysis stimulation, protein synthesis enhancement, and cellular repair activation.',
    dosage: 'Anti-aging 1-2 IU/day, body composition 2-4 IU/day, recovery 4-8 IU/day. Subcutaneous, morning or before bed.',
    safety: 'Water retention and joint stiffness at higher doses. Monitor blood glucose. Potential carpal tunnel symptoms. Do not use with active malignancy.',
  },
  epitalon: {
    longDescription: 'Epitalon (epithalamin) is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) discovered by Professor Vladimir Khavinson. It is the only known compound shown to activate telomerase in human somatic cells, effectively lengthening telomeres and extending cellular replicative capacity.',
    mechanism: 'Activates telomerase reverse transcriptase (hTERT) in somatic cells, enabling telomere elongation. Also restores melatonin secretion from the pineal gland and reduces lipid peroxidation.',
    dosage: '5-10mg subcutaneously daily for 10-20 day cycles, repeated every 4-6 months.',
    safety: 'Excellent safety profile in 35+ years of research. Telomerase activation is cell-type specific. No known drug interactions.',
  },
  selank: {
    longDescription: 'Selank is a synthetic analog of tuftsin, developed at the Russian Academy of Sciences. Approved in Russia as an anxiolytic and nootropic, it enhances BDNF expression, modulates monoamine metabolism, and stabilizes enkephalin degradation.',
    mechanism: 'Inhibits enkephalinase enzymes, increasing endogenous enkephalin levels. Increases BDNF expression in the hippocampus. Modulates serotonin, dopamine, and norepinephrine. Influences 36 genes related to neuroplasticity.',
    dosage: '250-500mcg intranasally, 2-3 times daily. Some protocols use subcutaneous 100-300mcg.',
    safety: 'No sedation, no dependence, no withdrawal. Does not impair cognitive function. Extremely well-tolerated.',
  },
  semax: {
    longDescription: 'Semax is a synthetic analog of ACTH(4-10), approved in Russia for stroke and cognitive disorders. It dramatically increases BDNF levels (up to 800% in some studies) and enhances attention, memory, and overall cognitive performance.',
    mechanism: 'Melanocortin receptor activation drives neurotrophic factor expression. Massively upregulates BDNF (3-8x increases). Also increases NGF and NT-3. Enhances attention through hippocampal signaling.',
    dosage: '200-600mcg intranasally, 2-3 times daily. Courses of 10-14 days with breaks.',
    safety: 'Strong safety record. No serious adverse effects. May cause mild nasal dryness. No addiction potential.',
  },
  'pt-141': {
    longDescription: 'PT-141 (bremelanotide) is an FDA-approved melanocortin receptor agonist for treating hypoactive sexual desire disorder (HSDD). Unlike PDE5 inhibitors which act on blood flow, PT-141 works centrally in the brain to enhance sexual desire through melanocortin pathways.',
    mechanism: 'Activates MC3R and MC4R in the hypothalamus, triggering downstream dopaminergic signaling in the mesolimbic reward pathway. Works on the "wanting" component of sexual motivation.',
    dosage: 'FDA-approved: 1.75mg SC, 45 minutes before activity. Max 1 dose/24h, 8 doses/month.',
    safety: 'Nausea (~40%), facial flushing, headache. Increases blood pressure temporarily. May cause skin darkening with repeated use.',
  },
  'nad-plus': {
    longDescription: 'NAD+ is a coenzyme found in every living cell, essential for hundreds of metabolic reactions. Levels decline 50%+ between ages 40-60. Injectable NAD+ directly replenishes cellular stores, central to DNA repair, energy production, and sirtuin activation.',
    mechanism: 'Direct cofactor for Sirtuins (SIRT1-7), PARPs for DNA repair, and CD38/CD157 signaling. Essential for mitochondrial electron transport chain for ATP production.',
    dosage: 'Injectable: 250-750mg IV over 2-4 hours, or 100-250mg SC. 1-2x weekly initially, monthly maintenance.',
    safety: 'IV may cause chest tightness, cramping, nausea (rate-dependent). SC route avoids most infusion reactions. Not recommended with active cancer.',
  },
}
