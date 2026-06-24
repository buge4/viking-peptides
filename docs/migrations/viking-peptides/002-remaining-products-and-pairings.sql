-- Viking Peptides Migration 002: Remaining products, specs with prices, pairings, discounts

BEGIN;

-- ============================================
-- SEED: Products — Recovery & Healing
-- ============================================

INSERT INTO vp_products (slug, name, short_description, long_description, mechanism_of_action, dosage_range, safety_notes, category_id, popular) VALUES
('bpc-157', 'BPC 157', 'A body protection compound renowned for accelerating the healing of tendons, ligaments, and gut tissue.',
 'BPC-157 (Body Protection Compound-157) is a 15-amino-acid peptide derived from a protective protein found in human gastric juice. It is one of the most extensively studied tissue-repair peptides, demonstrating remarkable healing acceleration across tendons, ligaments, muscles, gut lining, and even nerve tissue in over 100 preclinical studies.',
 'Activates the FAK-paxillin pathway for cell migration and tissue repair. Upregulates growth hormone receptors in injured tissue. Modulates the NO system (both eNOS and iNOS), promoting angiogenesis at injury sites. Increases VEGF expression for new blood vessel formation. Also interacts with the dopaminergic system and has cytoprotective effects on the GI tract.',
 'Research dosing: 250-500mcg subcutaneously near injury site, 1-2 times daily. Systemic dosing: 250-500mcg subcutaneously in the abdomen. Oral: higher doses for gut healing. 4-12 week protocols typical.',
 'Remarkably well-tolerated in all studies to date. No significant toxicity reported even at high doses. Injection site discomfort possible. No known drug interactions. Considered one of the safest research peptides.',
 (SELECT id FROM vp_categories WHERE slug='recovery-healing'), true),

('tb500', 'TB500 (Thymosin Beta-4)', 'A peptide that promotes angiogenesis and accelerates muscle/tissue healing.',
 'TB-500 is a synthetic version of the 43-amino-acid protein Thymosin Beta-4 (TB4), which is naturally present in nearly all human cells. It plays a central role in tissue repair by promoting cell migration, angiogenesis, and reducing inflammation. It is particularly effective for muscle, tendon, and cardiac tissue healing.',
 'Upregulates actin, a cell-building protein essential for cell migration and wound healing. Promotes angiogenesis through VEGF pathway activation. Reduces pro-inflammatory cytokines (IL-1β, TNF-α). Activates cardiac progenitor cells. The LKKTET sequence is the active site responsible for actin binding and cell migration.',
 'Research dosing: loading phase 2-5mg twice weekly for 4-6 weeks, then maintenance 2mg every 2 weeks. Subcutaneous or intramuscular.',
 'Well-tolerated with minimal side effects. Temporary head rush at injection. Some reports of temporary lethargy. Theoretical concern about promoting existing tumor growth (due to angiogenesis), though no evidence in studies.',
 (SELECT id FROM vp_categories WHERE slug='recovery-healing'), true),

('bpc157-tb500-high', 'BPC 157 + TB500 (High Dose)', 'A high-dose synergistic combination of tissue repair peptides.',
 'This high-dose combination pairs 10mg BPC-157 with 10mg TB-500 in a single vial for maximum tissue repair research. The two peptides work through complementary mechanisms — BPC-157 through the FAK-paxillin and NO pathways, TB-500 through actin upregulation and angiogenesis — producing synergistic healing acceleration.',
 'Dual pathway tissue repair: BPC-157 activates local growth factor receptors and modulates nitric oxide for vasculogenesis, while TB-500 promotes systemic cell migration via actin polymerization and reduces inflammation. Together they address both local and systemic aspects of tissue repair.',
 'Research dosing: reconstitute and dose based on individual component requirements. Typical 500mcg-1mg combined daily.',
 'Both components have excellent safety profiles. Combination has not been formally studied for interactions but mechanisms are complementary, not competitive.',
 (SELECT id FROM vp_categories WHERE slug='recovery-healing'), false),

('bpc157-tb500-standard', 'BPC 157 + TB500 (Standard)', 'A standard-dose synergistic combination of tissue repair peptides.',
 'Standard-dose combination of 5mg BPC-157 and 5mg TB-500 per vial, offering the same synergistic tissue repair benefits as the high-dose version in a more economical format suitable for standard research protocols.',
 'Same dual-pathway mechanism as the high-dose version. BPC-157 drives local tissue repair via growth factor modulation; TB-500 promotes systemic healing through cell migration and anti-inflammatory action.',
 'Research dosing: standard protocols using 250-500mcg combined daily for 4-8 weeks.',
 'Excellent safety profile for both components. Standard dosing reduces any dose-dependent side effect risk.',
 (SELECT id FROM vp_categories WHERE slug='recovery-healing'), false),

('glow-blend', 'Glow (TB + BPC + GHK)', 'A specialized recovery and anti-aging compound blend combining three restorative peptides.',
 'The Glow blend combines TB-500, BPC-157, and GHK-Cu in a single vial for comprehensive tissue repair and skin rejuvenation. GHK-Cu adds copper-dependent collagen synthesis and matrix metalloproteinase regulation to the healing and cell migration effects of the other two components.',
 'Three-pathway regeneration: TB-500 (cell migration via actin), BPC-157 (growth factor modulation and angiogenesis), and GHK-Cu (collagen synthesis via TGF-β activation, MMP regulation for tissue remodeling, and antioxidant gene upregulation through Nrf2 pathway).',
 'Combined vial: 10mg TB-500 + 10mg BPC-157 + 50mg GHK-Cu. Dose per injection based on research protocol requirements.',
 'All three components well-tolerated individually. GHK-Cu may cause mild blue-green discoloration at injection site due to copper content. No known adverse interactions between components.',
 (SELECT id FROM vp_categories WHERE slug='recovery-healing'), false),

('klow-blend', 'Klow (TB + BPC + GHK + KPV)', 'A comprehensive recovery blend featuring four restorative and anti-inflammatory peptides.',
 'The Klow blend adds KPV (a potent anti-inflammatory tripeptide) to the Glow formula, creating the most comprehensive recovery blend available. KPV''s NF-κB inhibition addresses inflammation directly, while the other three components handle tissue repair, cell migration, and collagen synthesis.',
 'Four-pathway healing: TB-500 (cell migration), BPC-157 (angiogenesis and growth factors), GHK-Cu (collagen and tissue remodeling), and KPV (NF-κB-mediated anti-inflammatory signaling). This addresses inflammation, repair, regeneration, and remodeling simultaneously.',
 'Combined vial: 10mg TB-500 + 10mg BPC-157 + 50mg GHK-Cu + 10mg KPV. Dose based on research goals.',
 'All four components have favorable safety profiles. The anti-inflammatory action of KPV may enhance tolerability of the overall blend. No known interactions.',
 (SELECT id FROM vp_categories WHERE slug='recovery-healing'), false),

('ghk-cu', 'GHK-Cu', 'A copper peptide known for stimulating collagen production, wound healing, and skin improvement.',
 'GHK-Cu (glycyl-L-histidyl-L-lysine copper complex) is a naturally occurring copper tripeptide found in human plasma, saliva, and urine. It declines with age (from 200ng/ml at age 20 to 80ng/ml at age 60). It is one of the most studied peptides for skin rejuvenation, wound healing, and tissue remodeling.',
 'Binds copper(II) ions with high affinity, delivering copper to tissues for enzymatic processes. Activates TGF-β and VEGF for tissue repair. Upregulates collagen I, III, and elastin synthesis. Modulates matrix metalloproteinases for balanced tissue remodeling. Activates Nrf2 pathway for antioxidant gene expression. Stimulates decorin (anti-scarring proteoglycan).',
 'Research dosing: injectable 1-5mg/day subcutaneously. Topical: 1-2% in cream/serum. Courses of 2-4 weeks with breaks.',
 'Very well tolerated. Mild injection site reaction. Temporary blue-green skin tinge at injection site (copper). Some reports of temporary hair shedding before regrowth phase.',
 (SELECT id FROM vp_categories WHERE slug='recovery-healing'), false),

('mgf', 'MGF (Mechano Growth Factor)', 'Supports muscle repair and recovery after mechanical stress.',
 'MGF (Mechano Growth Factor) is a splice variant of IGF-1 (specifically IGF-1Ec) that is produced locally in muscle tissue in response to mechanical stress (exercise or injury). It activates satellite cells (muscle stem cells) to begin the repair process, making it uniquely suited for post-exercise recovery research.',
 'Activates quiescent satellite cells in muscle tissue, pushing them into the cell cycle for proliferation. This is distinct from IGF-1''s role (which promotes differentiation of already-activated satellite cells). MGF works upstream, initiating the repair cascade. Also has neuroprotective properties.',
 'Research dosing: 100-200mcg intramuscularly at target muscle site immediately post-exercise. Short half-life (minutes) necessitates local injection. Used 2-3 times per week.',
 'Very short half-life limits systemic effects. Must be injected locally for efficacy. No significant reported side effects. Does not appreciably affect blood glucose (unlike IGF-1).',
 (SELECT id FROM vp_categories WHERE slug='recovery-healing'), false),

('peg-mgf', 'PEG-MGF', 'A pegylated version of MGF with an extended half-life for prolonged muscle recovery.',
 'PEG-MGF is a pegylated form of Mechano Growth Factor where polyethylene glycol chains are attached to extend the half-life from minutes to several hours. This allows systemic administration rather than requiring local muscle injection, making it more practical for research protocols.',
 'Same satellite cell activation mechanism as MGF, but the PEG modification allows sustained systemic delivery. The extended half-life means PEG-MGF reaches muscle tissue throughout the body rather than acting only locally. May produce more systemic anabolic effects.',
 'Research dosing: 200mcg subcutaneously or intramuscularly, 2-3 times per week. Can be administered systemically rather than locally.',
 'Better tolerated than local MGF injections due to subcutaneous route. Mild injection site reactions possible. Extended half-life means longer washout period.',
 (SELECT id FROM vp_categories WHERE slug='recovery-healing'), false),

('ara-290', 'ARA 290', 'A tissue-repair peptide primarily researched for reducing neuropathy and systemic inflammation.',
 'ARA 290 (cibinetide) is an 11-amino-acid peptide designed to selectively activate the innate repair receptor (IRR), a heterodimer of the erythropoietin receptor and the IL-3 receptor beta chain. Unlike EPO, ARA 290 does not stimulate red blood cell production but specifically targets tissue repair and anti-inflammatory pathways.',
 'Selectively activates the Innate Repair Receptor (IRR = EPOR/βcR heterodimer) without activating the classical erythropoietin receptor homodimer. This selectivity means tissue repair and anti-inflammatory signaling without erythropoietic stimulation. Reduces TNF-α, IL-6, and other pro-inflammatory cytokines.',
 'Research dosing: 2-4mg subcutaneously daily or three times weekly. Clinical trials used 4mg IV or SC for neuropathy.',
 'Well-tolerated in clinical trials. No erythropoietic effects (does not increase red blood cells or blood viscosity). Mild injection site reactions. Headache reported occasionally.',
 (SELECT id FROM vp_categories WHERE slug='recovery-healing'), false);

-- ============================================
-- SEED: Products — Cognitive Enhancement
-- ============================================

INSERT INTO vp_products (slug, name, short_description, long_description, mechanism_of_action, dosage_range, safety_notes, category_id, popular) VALUES
('selank', 'Selank', 'A nootropic peptide known for its potent anti-anxiety and mood-stabilizing effects.',
 'Selank is a synthetic analog of the immunomodulatory peptide tuftsin, developed at the Institute of Molecular Genetics of the Russian Academy of Sciences. It was approved in Russia as an anxiolytic and nootropic. Selank enhances BDNF expression, modulates monoamine neurotransmitter metabolism, and stabilizes enkephalin degradation.',
 'Inhibits enkephalinase enzymes, increasing endogenous enkephalin levels (endogenous opioid peptides that modulate anxiety). Increases BDNF (brain-derived neurotrophic factor) expression in the hippocampus. Modulates serotonin, dopamine, and norepinephrine metabolism. Also influences IL-6 and affects the expression of 36 genes related to neuroplasticity.',
 'Research dosing: 250-500mcg intranasally, 2-3 times daily. Some protocols use subcutaneous injection at 100-300mcg.',
 'Approved medication in Russia with extensive safety data. No sedation, no dependence, no withdrawal symptoms. Does not impair cognitive function. Extremely well-tolerated even with chronic use.',
 (SELECT id FROM vp_categories WHERE slug='cognitive'), false),

('semax', 'Semax', 'A neuroprotective peptide used to significantly enhance memory, focus, and overall cognitive performance.',
 'Semax is a synthetic analog of ACTH(4-10) with a Pro-Gly-Pro extension that prevents enzymatic degradation. Developed at the Institute of Molecular Genetics in Moscow, it is approved in Russia and Ukraine for treating stroke, cognitive disorders, and as a nootropic. It dramatically increases BDNF levels (up to 800% in some studies).',
 'Melanocortin receptor activation (MC3R/MC4R) drives neurotrophic factor expression. Massively upregulates BDNF (brain-derived neurotrophic factor) — studies show 3-8x increases. Also increases NGF and NT-3. Modulates dopaminergic and serotoninergic systems. Enhances attention and short-term memory through hippocampal signaling.',
 'Research dosing: 200-600mcg intranasally, 2-3 times daily. Some protocols use 100-200mcg subcutaneously. Courses of 10-14 days with breaks.',
 'Approved medication in Russia with strong safety record. No serious adverse effects reported. May cause mild nasal dryness with intranasal use. No addiction potential. No withdrawal symptoms.',
 (SELECT id FROM vp_categories WHERE slug='cognitive'), false),

('dsip', 'DSIP', 'Delta Sleep-Inducing Peptide, heavily researched for improving sleep architecture.',
 'DSIP (Delta Sleep-Inducing Peptide) is a naturally occurring 9-amino-acid neuropeptide first isolated from rabbit brain during induced sleep. It promotes delta wave (deep sleep) patterns, modulates cortisol and LH release, and shows pain-modulating properties. Research interest spans insomnia, stress adaptation, and pain management.',
 'Modulates the circadian rhythm and sleep-wake cycle through interaction with multiple receptor systems. Enhances delta wave EEG activity during sleep (stage 3/4 NREM). Reduces cortisol secretion and normalizes ACTH release. Modulates pain perception through opioid-independent mechanisms. May act as a sleep-promoting factor rather than a sedative.',
 'Research dosing: 100-250mcg subcutaneously or intravenously before sleep. Some protocols use 30mcg/kg. Courses of 5-10 consecutive days.',
 'Generally well-tolerated. Not a sedative — does not cause forced sleep or next-day drowsiness. No habituation or dependence reported. May cause vivid dreams initially. Mild headache possible.',
 (SELECT id FROM vp_categories WHERE slug='cognitive'), false),

('uridine-choline', 'Uridine + Choline', 'A highly effective nootropic blend designed to support neurogenesis and brain plasticity.',
 'This nootropic combination provides the two key substrates for enhanced phosphatidylcholine (PC) synthesis — the most abundant phospholipid in neuronal membranes. Together, uridine and choline support synaptogenesis (new synapse formation), enhance dopamine release, and improve membrane fluidity for faster neural signaling.',
 'Uridine crosses the blood-brain barrier and is converted to UTP, then CTP — a rate-limiting substrate for phosphatidylcholine synthesis (Kennedy pathway). Choline provides the other essential substrate. Together they accelerate neuronal membrane synthesis. Uridine also activates P2Y receptors, stimulating NGF release and dendritic branching. Enhanced dopamine release via D2 receptor upregulation.',
 'Research dosing: various formulations. Oral or injectable. Often combined with omega-3 fatty acids (DHA) for the ''trisynaptic stack.''',
 'Both components are naturally occurring nutrients with excellent safety profiles. High-dose choline may cause fishy body odor (trimethylaminuria) in some individuals. Uridine may cause mild GI discomfort at high doses.',
 (SELECT id FROM vp_categories WHERE slug='cognitive'), false),

('melatonin', 'Melatonin', 'A natural hormone widely used to facilitate sleep onset and regulate the sleep-wake cycle.',
 'Melatonin is a neurohormone synthesized from serotonin in the pineal gland, primarily during darkness. Injectable melatonin bypasses the variable oral bioavailability (15-33%) and first-pass hepatic metabolism, providing precise dosing for circadian rhythm research. It has additional antioxidant and immunomodulatory properties.',
 'Activates MT1 receptors (promotes sleepiness, reduces neuronal firing) and MT2 receptors (phase-shifts circadian rhythms) in the suprachiasmatic nucleus (SCN). Acts as a direct free radical scavenger (particularly effective against hydroxyl radicals). Stimulates antioxidant enzymes (SOD, GPx, catalase). Modulates immune function through T-helper cell activation.',
 'Injectable form: 1-10mg subcutaneously 30-60 minutes before desired sleep onset. Research doses may be higher for antioxidant protocols.',
 'Very well-established safety profile. May cause vivid dreams, morning grogginess at high doses. Can affect reproductive hormones with chronic high-dose use. May interact with anticoagulants and immunosuppressants.',
 (SELECT id FROM vp_categories WHERE slug='cognitive'), false),

('oxytocin', 'Oxytocin Acetate', 'The bonding hormone involved in social interaction, sexual reproduction, and stress reduction.',
 'Oxytocin is a 9-amino-acid neuropeptide produced in the hypothalamus and released from the posterior pituitary. Known as the ''love hormone'' or ''bonding hormone,'' it plays crucial roles in social bonding, trust, empathy, sexual reproduction, and stress reduction. Research applications include social cognition, PTSD, and anxiety studies.',
 'Binds to oxytocin receptors (OXTR) in the brain and periphery. Central effects include reduced amygdala reactivity (anxiety reduction), enhanced social salience processing, and increased trust/empathy. Peripheral effects include uterine contraction, milk ejection reflex, and modulation of the HPA stress axis (reduces cortisol).',
 'Research dosing: intranasal 20-40 IU, or subcutaneous 2-5mg for research protocols. Intranasal is preferred for central nervous system effects.',
 'Generally well-tolerated at research doses. May enhance emotional sensitivity. Intranasal use may cause nasal irritation. Peripheral administration can affect blood pressure and uterine activity. Not for use during pregnancy.',
 (SELECT id FROM vp_categories WHERE slug='cognitive'), false);

-- ============================================
-- SEED: Products — Anti-Aging & Longevity
-- ============================================

INSERT INTO vp_products (slug, name, short_description, long_description, mechanism_of_action, dosage_range, safety_notes, category_id, popular) VALUES
('epitalon', 'Epitalon', 'An anti-aging peptide that interacts with telomerase to promote cellular longevity.',
 'Epitalon (epithalamin/epithalone) is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) based on the natural pineal gland peptide epithalamin, discovered by Professor Vladimir Khavinson. It is the only known compound shown to activate telomerase in human somatic cells, effectively lengthening telomeres and extending cellular replicative capacity.',
 'Activates telomerase reverse transcriptase (hTERT) in somatic cells, enabling telomere elongation during cell division. This directly addresses the Hayflick limit (replicative senescence). Also restores melatonin secretion from the pineal gland, normalizes anterior pituitary hormone profiles, and reduces lipid peroxidation.',
 'Research dosing: 5-10mg subcutaneously daily for 10-20 day cycles, repeated every 4-6 months. Some protocols use 3-5mg daily.',
 'Excellent safety profile in 35+ years of research. No adverse effects reported in clinical studies. Telomerase activation is cell-type specific — does not immortalize cells. No known drug interactions.',
 (SELECT id FROM vp_categories WHERE slug='anti-aging'), true),

('foxo4-dri', 'FOXO4-DRI', 'A senolytic peptide designed to target and clear senescent (aging) cells from the body.',
 'FOXO4-DRI is a D-retro-inverso peptidomimetic of FOXO4, designed to selectively induce apoptosis in senescent cells without affecting healthy cells. Senescent cells accumulate with age and secrete inflammatory factors (SASP) that accelerate aging of surrounding tissue. FOXO4-DRI represents a targeted senolytic approach.',
 'In senescent cells, FOXO4 protein binds to p53 in the nucleus, preventing p53-mediated apoptosis (this is how senescent cells survive despite being damaged). FOXO4-DRI disrupts this FOXO4-p53 interaction, liberating p53 to trigger apoptosis exclusively in senescent cells. Healthy cells lack the elevated FOXO4-p53 interaction and are unaffected.',
 'Research dosing: 5-10mg subcutaneously, protocols vary. Some researchers use 5mg every 3 days for 9 days (3 injections), repeated every 2-3 months.',
 'Selective for senescent cells (spares healthy cells). Some subjects report temporary flu-like symptoms as senescent cells are cleared. Expensive compound. Long-term safety data still limited.',
 (SELECT id FROM vp_categories WHERE slug='anti-aging'), false),

('nad-plus', 'NAD+', 'A crucial cellular coenzyme administered to boost ATP production and combat aging.',
 'NAD+ (nicotinamide adenine dinucleotide) is a coenzyme found in every living cell, essential for hundreds of metabolic reactions. NAD+ levels decline 50%+ between ages 40-60. Injectable NAD+ directly replenishes cellular stores, bypassing the conversion steps needed with oral precursors (NMN, NR). It is central to DNA repair, cellular energy production, and sirtuin activation.',
 'Direct cofactor for: (1) Sirtuins (SIRT1-7) — histone deacetylases that regulate gene expression, DNA repair, and metabolism; (2) PARPs — poly-ADP-ribose polymerases for DNA repair; (3) CD38/CD157 — cyclic ADP-ribose signaling. Also essential for mitochondrial electron transport chain (complexes I and III) for ATP production.',
 'Injectable: 250-750mg IV infusion over 2-4 hours, or 100-250mg subcutaneously. IV infusions 1-2 times weekly initially, then monthly maintenance.',
 'IV NAD+ commonly causes chest tightness, abdominal cramping, and nausea during infusion (rate-dependent — slow the drip). Subcutaneous route avoids most infusion reactions. Not recommended with active cancer (NAD+ supports rapidly dividing cells).',
 (SELECT id FROM vp_categories WHERE slug='anti-aging'), false),

('ss-31', 'SS-31 (Elamipretide)', 'A cellular health peptide that targets the inner mitochondrial membrane to restore bioenergetics.',
 'SS-31 (elamipretide/Bendavia) is a mitochondria-targeted tetrapeptide that selectively concentrates 1000-5000x in the inner mitochondrial membrane. It stabilizes cardiolipin, a phospholipid essential for electron transport chain organization, directly restoring mitochondrial bioenergetics in aging or damaged cells.',
 'Binds to cardiolipin in the inner mitochondrial membrane, stabilizing the interaction between cardiolipin and cytochrome c. This prevents cytochrome c peroxidase activity, reduces reactive oxygen species (ROS) production at the source, and maintains efficient electron transport. Does not act as a conventional antioxidant — it prevents ROS generation rather than scavenging existing ROS.',
 'Research dosing: 0.5-5mg/kg subcutaneously or intravenously. Clinical trials used 40mg daily SC for Barth syndrome. Dosing frequency varies by protocol.',
 'Well-tolerated in clinical trials for Barth syndrome and heart failure. Injection site reactions most common. Some studies report mild headache. Orphan drug designation for Barth syndrome.',
 (SELECT id FROM vp_categories WHERE slug='anti-aging'), false),

('thymalin', 'Thymalin', 'A bioregulator peptide that supports thymus gland function and helps balance the immune system.',
 'Thymalin is a bioregulator peptide complex extracted from calf thymus glands, developed by Professor Khavinson (same lab as Epitalon). The thymus gland atrophies with age, contributing to immune system decline (immunosenescence). Thymalin helps restore thymic function and T-cell immunity, showing life extension effects in animal and human studies.',
 'Restores thymus gland function by providing peptide signals that regulate thymocyte maturation and T-cell differentiation. Normalizes the CD4/CD8 T-cell ratio. Increases natural killer (NK) cell activity. Modulates cytokine production toward balanced Th1/Th2 responses. In combination with Epitalon, showed 46% mortality reduction in elderly humans over 6 years.',
 'Research dosing: 10mg intramuscularly daily for 5-10 days. Courses repeated every 3-6 months. Often combined with Epitalon.',
 'Well-established safety profile from decades of use in Russia. No significant adverse effects reported. Injection site soreness possible. Derived from animal tissue — theoretical allergic reaction risk.',
 (SELECT id FROM vp_categories WHERE slug='anti-aging'), false),

('thymosin-alpha-1', 'Thymosin Alpha-1', 'A primary immune-modulating peptide used to fight chronic infections and enhance immunity.',
 'Thymosin Alpha-1 (Tα1) is a 28-amino-acid peptide naturally produced by the thymus gland. It is approved in 37 countries for treating hepatitis B and C, and as an immune adjuvant. It enhances both innate and adaptive immunity without the overstimulation risks of cytokine therapies. Also studied for cancer immunotherapy adjunctive use.',
 'Activates dendritic cells through TLR9, enhancing antigen presentation. Promotes T-cell maturation (particularly CD4+ and CD8+ cells) and increases MHC class I expression. Stimulates natural killer (NK) cell activity. Enhances antibody responses to vaccines. Modulates cytokine balance without causing cytokine storm.',
 'Research dosing: 1.6mg subcutaneously daily or every other day. Clinical protocols for hepatitis: 1.6mg SC twice weekly for 6-12 months.',
 'Approved drug in 37 countries with excellent safety record. Mild injection site reactions. No immunosuppressive rebound after discontinuation. Well-tolerated even in immunocompromised subjects.',
 (SELECT id FROM vp_categories WHERE slug='anti-aging'), false);

-- ============================================
-- SEED: Products — Sexual Health & Fertility
-- ============================================

INSERT INTO vp_products (slug, name, short_description, long_description, mechanism_of_action, dosage_range, safety_notes, category_id, popular) VALUES
('pt-141', 'PT-141 (Bremelanotide)', 'A peptide highly effective for treating central male and female sexual dysfunction.',
 'PT-141 (bremelanotide) is an FDA-approved melanocortin receptor agonist for treating hypoactive sexual desire disorder (HSDD) in premenopausal women. Unlike PDE5 inhibitors (Viagra, etc.) which act peripherally on blood flow, PT-141 works centrally in the brain to enhance sexual desire and arousal through melanocortin pathways.',
 'Activates melanocortin receptors MC3R and MC4R in the hypothalamus, specifically in areas involved in sexual arousal and desire (medial preoptic area, paraventricular nucleus). This triggers downstream dopaminergic signaling in the mesolimbic reward pathway. Works on the ''wanting'' component of sexual motivation, not just the mechanical component.',
 'FDA-approved dose: 1.75mg subcutaneously, taken 45 minutes before anticipated activity. Maximum 1 dose per 24 hours, 8 doses per month. Research doses: 0.5-2mg.',
 'FDA-approved with known safety profile. Nausea is the most common side effect (~40%). Transient facial flushing, headache. Increases blood pressure temporarily. Contraindicated in uncontrolled hypertension. May cause skin darkening with repeated use.',
 (SELECT id FROM vp_categories WHERE slug='sexual-health'), false),

('kisspeptin-10', 'Kisspeptin-10', 'A neuropeptide that regulates the reproductive axis and naturally boosts testosterone.',
 'Kisspeptin-10 is the 10-amino-acid active fragment of the 54-amino-acid kisspeptin (metastin). It is the master regulator of the hypothalamic-pituitary-gonadal (HPG) axis, directly stimulating GnRH neurons to pulse. Research interest spans fertility treatment, puberty disorders, and natural testosterone optimization.',
 'Binds to KISS1R (GPR54) on GnRH neurons in the hypothalamus, directly triggering GnRH pulsatile release. This is upstream of the entire reproductive axis — LH and FSH follow the GnRH signal, driving testosterone/estrogen production. Kisspeptin is the body''s natural ''on switch'' for reproduction.',
 'Research dosing: 1-10mcg/kg intravenously or subcutaneously. Typical research dose 5-50mcg. Pulsatile dosing protocols for sustained effect.',
 'Well-tolerated in human studies. Short half-life (minutes) limits side effects. Continuous administration can cause tachyphylaxis (receptor desensitization). Best used in pulsatile protocols mimicking natural release.',
 (SELECT id FROM vp_categories WHERE slug='sexual-health'), false),

('gonadorelin', 'Gonadorelin', 'A synthetic GnRH used to stimulate the pulsatile release of FSH and LH from the pituitary.',
 'Gonadorelin is a synthetic decapeptide identical to endogenous gonadotropin-releasing hormone (GnRH). When administered in pulsatile fashion, it stimulates FSH and LH release. When given continuously, it paradoxically suppresses the HPG axis (this is the basis for GnRH agonist medications). Used in fertility and TRT research.',
 'Binds to GnRH receptors on anterior pituitary gonadotrophs. Pulsatile administration (every 60-120 minutes) mimics natural hypothalamic signaling, maintaining normal FSH/LH secretion. Continuous administration causes receptor downregulation and chemical castration (used therapeutically for prostate cancer, precocious puberty).',
 'Research dosing: 100-200mcg subcutaneously. For HPG stimulation testing: single 100mcg dose. For maintenance: various pulsatile protocols.',
 'Generally well-tolerated. Pulsatile use: headache, nausea, abdominal discomfort possible. Continuous use causes HPG suppression (intentional in some protocols). Injection site reactions.',
 (SELECT id FROM vp_categories WHERE slug='sexual-health'), false),

('hcg', 'HCG', 'Human Chorionic Gonadotropin, used to maintain testicular function and natural testosterone production.',
 'HCG (Human Chorionic Gonadotropin) is a glycoprotein hormone that mimics luteinizing hormone (LH) due to structural similarity. In males, it stimulates Leydig cells to produce testosterone, maintaining testicular size and function. Widely used alongside TRT to prevent testicular atrophy and preserve fertility.',
 'Binds to LH/CG receptors on Leydig cells in the testes, stimulating steroidogenesis (testosterone production) through the cAMP-PKA pathway. Also stimulates intratesticular estradiol production and maintains spermatogenesis via paracrine Sertoli cell support. In females, mimics LH surge for ovulation induction.',
 'Research dosing: males 250-500 IU subcutaneously every other day to twice weekly. Fertility protocols: 1000-5000 IU per dose. Ovulation trigger: 5000-10000 IU single dose.',
 'Well-characterized safety profile from decades of clinical use. May increase estradiol (aromatase activity in testes). Gynecomastia possible if estrogen not managed. Excessive use can desensitize Leydig cells.',
 (SELECT id FROM vp_categories WHERE slug='sexual-health'), false),

('hmg', 'HMG', 'Human Menopausal Gonadotropin, utilized to treat infertility by directly stimulating FSH and LH receptors.',
 'HMG (Human Menopausal Gonadotropin) contains both FSH and LH activity, extracted and purified from the urine of postmenopausal women. It directly stimulates gonadal function through both gonadotropin pathways simultaneously. Used in both male and female infertility protocols.',
 'Provides both FSH and LH activity. FSH acts on Sertoli cells (males) or granulosa cells (females), while LH acts on Leydig cells (males) or theca cells (females). In males, FSH drives spermatogenesis while LH drives testosterone production. In females, FSH recruits follicles while LH supports maturation.',
 'Research dosing: fertility protocols vary. Males: 75-150 IU 2-3 times weekly. Females: individualized based on follicular response monitoring.',
 'Must be used under medical supervision for fertility. Ovarian hyperstimulation syndrome (OHSS) risk in females. Males: generally well-tolerated. Monitor estradiol levels.',
 (SELECT id FROM vp_categories WHERE slug='sexual-health'), false),

('papaverine', 'Papaverine (Trimix)', 'A smooth muscle relaxant and vasodilator commonly used for erectile dysfunction.',
 'Trimix is a compounded injectable combination of papaverine (smooth muscle relaxant), phentolamine (alpha-adrenergic blocker), and prostaglandin E1 (vasodilator). It is injected directly into the corpus cavernosum for erectile dysfunction when oral PDE5 inhibitors are ineffective. Widely used as second-line ED therapy.',
 'Three complementary vasodilatory mechanisms: Papaverine inhibits phosphodiesterase (non-selective), increasing cAMP and causing smooth muscle relaxation. Phentolamine blocks alpha-adrenergic receptors, preventing norepinephrine-mediated vasoconstriction. PGE1 activates prostaglandin EP receptors, directly relaxing trabecular smooth muscle.',
 'Intracavernosal injection. Dosing is individually titrated starting with low concentrations. Typical ranges: papaverine 8-40mg, phentolamine 0.25-2mg, PGE1 5-40mcg per dose.',
 'Primary risk: priapism (erection lasting >4 hours) — medical emergency. Start with low doses and titrate. Penile fibrosis with chronic use. Pain at injection site (PGE1 component). Dizziness, hypotension possible.',
 (SELECT id FROM vp_categories WHERE slug='sexual-health'), false);

-- ============================================
-- SEED: Products — Immune Support
-- ============================================

INSERT INTO vp_products (slug, name, short_description, long_description, mechanism_of_action, dosage_range, safety_notes, category_id, popular) VALUES
('kpv', 'KPV', 'A naturally occurring peptide with powerful anti-inflammatory and systemic antimicrobial properties.',
 'KPV is a C-terminal tripeptide fragment (Lys-Pro-Val) of alpha-melanocyte stimulating hormone (α-MSH). Despite being only 3 amino acids, it retains the potent anti-inflammatory activity of the parent hormone without its melanogenic (tanning) effects. Extensively studied for IBD, dermatitis, and systemic inflammation.',
 'Enters cells and inhibits NF-κB activation by preventing IκBα phosphorylation and nuclear translocation of p65. This blocks the transcription of pro-inflammatory cytokines (IL-1β, IL-6, TNF-α). Also inhibits NO production in macrophages. Shows antimicrobial activity against S. aureus and Candida albicans. Anti-inflammatory effect is melanocortin receptor-independent (direct intracellular action).',
 'Research dosing: 200-500mcg subcutaneously daily for systemic anti-inflammatory. 100-200mcg orally in capsule for GI inflammation. Topical formulations for skin.',
 'Extremely well-tolerated. No melanogenic effects (unlike full-length α-MSH). No significant side effects reported. Can be administered subcutaneously, orally, or topically depending on target.',
 (SELECT id FROM vp_categories WHERE slug='immune'), false),

('ll37', 'LL37', 'A naturally occurring antimicrobial peptide that aids in fighting off infections.',
 'LL-37 (cathelicidin) is a 37-amino-acid antimicrobial peptide and the only cathelicidin found in humans. It is expressed by immune cells, epithelial cells, and keratinocytes as a first line of defense against microbial invasion. Beyond direct antimicrobial activity, LL-37 modulates immune cell recruitment and wound healing.',
 'Forms amphipathic alpha-helical structure that inserts into microbial membranes, creating pores that destroy bacteria, fungi, and enveloped viruses. Also acts as a chemokine — recruits neutrophils, monocytes, and T-cells to infection sites. Promotes wound healing through EGFR transactivation. Neutralizes bacterial endotoxin (LPS).',
 'Research dosing: 100-500mcg subcutaneously or topically. Protocols vary based on application (antimicrobial vs. wound healing vs. immune modulation).',
 'Part of innate immunity with established physiological role. May cause injection site inflammation (due to immune recruitment). Excessive levels may promote autoimmune activation in susceptible individuals.',
 (SELECT id FROM vp_categories WHERE slug='immune'), false),

('vip', 'VIP', 'Vasoactive Intestinal Peptide, which regulates systemic inflammation, pulmonary health, and immune function.',
 'VIP (Vasoactive Intestinal Peptide) is a 28-amino-acid neuropeptide found throughout the nervous system, immune system, and GI tract. It has potent anti-inflammatory, immunomodulatory, and neuroprotective properties. Researched extensively for chronic inflammatory respiratory disease (CIRS), pulmonary hypertension, and autoimmune conditions.',
 'Binds to VPAC1 and VPAC2 receptors, activating cAMP-dependent anti-inflammatory cascades. Inhibits NF-κB and AP-1 transcription factors. Reduces TNF-α, IL-6, and IL-12. Promotes regulatory T-cell (Treg) generation. In the lungs, relaxes bronchial and pulmonary vascular smooth muscle. Neuroprotective effects through VPAC2 receptor activation.',
 'Research dosing: intranasal VIP for respiratory protocols (50-100mcg daily). Subcutaneous 50-100mcg for systemic protocols. IV protocols also studied.',
 'Short half-life (1-2 minutes in plasma) limits systemic side effects. Transient vasodilation, flushing, hypotension possible. Intranasal route minimizes systemic effects. May worsen conditions driven by Th2 excess.',
 (SELECT id FROM vp_categories WHERE slug='immune'), false),

('pnc-27', 'PNC 27', 'A membrane-active peptide researched for its targeted anti-cancer properties.',
 'PNC-27 is a synthetic peptide containing an HDM-2 binding domain fused to a membrane-penetrating domain. It selectively targets and kills cancer cells that overexpress HDM-2 on their cell surface — a feature absent in normal cells. This selectivity makes it a promising targeted anti-cancer research compound.',
 'Binds to HDM-2 (human double minute 2) protein, which is overexpressed on the surface of many cancer cell types but absent from normal cell surfaces. Upon binding, PNC-27 creates transmembrane pores in the cancer cell membrane, causing necrotic cell death. Normal cells are unaffected because they do not display surface HDM-2.',
 'Research dosing: various concentrations studied in vitro (20-100µM) and in animal models. In vivo dosing protocols still under development.',
 'Selective for cancer cells in preclinical studies — does not affect normal cells. Still primarily a research compound with limited in vivo data. Injection site reactions possible.',
 (SELECT id FROM vp_categories WHERE slug='immune'), false),

('glutathione', 'Glutathione', 'The body''s master antioxidant, used for cellular detoxification and immune support.',
 'Glutathione (GSH) is a tripeptide (Glu-Cys-Gly) found in every cell, with the highest concentrations in the liver. It is the body''s primary intracellular antioxidant and is essential for detoxification (phase II conjugation), immune function, and protection against oxidative stress. Injectable glutathione bypasses the poor oral bioavailability issue.',
 'Direct antioxidant: donates electrons to neutralize reactive oxygen species (ROS) and reactive nitrogen species (RNS). Cofactor for glutathione peroxidase (GPx) enzymes. Essential for phase II liver detoxification (glutathione S-transferase conjugation). Maintains vitamins C and E in their reduced (active) forms. Supports T-cell proliferation and NK cell activity.',
 'Injectable: 600-1500mg intramuscularly or intravenously, 1-3 times weekly. IV push or drip. Often combined with vitamin C.',
 'Extremely well-established safety profile. May cause mild injection site discomfort. IV push too fast may cause transient nausea. Very rarely, allergic reaction to preservatives in formulation.',
 (SELECT id FROM vp_categories WHERE slug='immune'), false);

-- ============================================
-- SEED: Products — Cosmetic & Skin
-- ============================================

INSERT INTO vp_products (slug, name, short_description, long_description, mechanism_of_action, dosage_range, safety_notes, category_id, popular) VALUES
('melanotan-1', 'Melanotan I (MT-1)', 'A synthetic peptide that safely stimulates melanin production for a UV-protective tan.',
 'Melanotan I (afamelanotide) is a 13-amino-acid synthetic analog of alpha-melanocyte-stimulating hormone (α-MSH) that stimulates melanin production without requiring UV exposure. It is FDA-approved (as Scenesse) for treating erythropoietic protoporphyria (EPP). Produces a natural-looking, photoprotective tan.',
 'Activates melanocortin 1 receptor (MC1R) on melanocytes, triggering the cAMP-PKA signaling cascade that upregulates tyrosinase and melanin synthesis. Produces eumelanin (brown/black protective melanin) rather than pheomelanin (red/yellow). The resulting melanin absorbs UV radiation, providing genuine photoprotection (SPF 3-4 equivalent).',
 'Research dosing: 0.5-1mg subcutaneously daily for 10 days (loading), then maintenance 0.5mg every 2-3 days. Some protocols use 1mg three times weekly.',
 'FDA-approved (as Scenesse) with established safety profile. Nausea most common side effect. Facial flushing, fatigue possible. Moles may darken — dermatological monitoring recommended. Does not significantly affect libido (unlike MT-2).',
 (SELECT id FROM vp_categories WHERE slug='cosmetic'), false),

('melanotan-2', 'Melanotan II (MT-2)', 'A stronger variant of Melanotan that induces rapid tanning and is known to boost libido.',
 'Melanotan II is a cyclic heptapeptide analog of α-MSH that non-selectively activates MC1R (tanning), MC3R and MC4R (sexual arousal, appetite), and MC5R (sebaceous gland function). It produces rapid, deep tanning even in fair-skinned individuals and has pronounced sexual arousal effects in both males and females.',
 'Non-selective melanocortin receptor agonist. MC1R activation drives melanogenesis (tanning). MC4R activation in the hypothalamus triggers sexual arousal pathways and appetite suppression. MC3R activation further modulates sexual function. The non-selectivity accounts for both the tanning and sexual side effects that distinguish MT-2 from MT-1.',
 'Research dosing: 0.25-0.5mg subcutaneously daily during loading (7-14 days), then 0.5mg 1-2 times weekly for maintenance. Lower starting doses for fair-skinned individuals.',
 'Nausea common (especially first few doses — mitigate by starting at 0.25mg). Facial flushing. Spontaneous erections in males. Mole darkening — monitor for changes. Appetite suppression. Slight increase in blood pressure.',
 (SELECT id FROM vp_categories WHERE slug='cosmetic'), false),

('snap-8', 'Snap-8', 'A cosmetic octapeptide applied topically or injected to reduce the depth of facial wrinkles.',
 'Snap-8 (acetyl octapeptide-3) is an elongated version of the anti-wrinkle peptide Argireline (acetyl hexapeptide-3). It inhibits the SNARE complex assembly needed for neurotransmitter release at the neuromuscular junction, reducing muscle contraction intensity and depth of expression lines — essentially a topical/injectable botulinum-like effect.',
 'Competes with SNAP-25 (a SNARE complex protein) for binding sites on the SNARE complex, preventing full complex assembly needed for vesicle fusion and acetylcholine release. With reduced acetylcholine release, facial muscle contractions are attenuated. Unlike botulinum toxin, the effect is partial (30-40% reduction) and gradual.',
 'Topical: 3-10% in serums/creams, applied twice daily. Injectable: 1-5mg in mesotherapy protocols. Effects build over 2-4 weeks of consistent use.',
 'Extremely well-tolerated topically. No systemic absorption concerns at cosmetic concentrations. Injectable use: mild injection site reactions. Effects are reversible and less dramatic than botulinum toxin.',
 (SELECT id FROM vp_categories WHERE slug='cosmetic'), false),

('botulinum-toxin', 'Botulinum Toxin', 'A neurotoxic protein widely utilized in cosmetic procedures to temporarily relax muscles and reduce wrinkles.',
 'Botulinum toxin type A is a purified neurotoxin produced by Clostridium botulinum. It is the most popular cosmetic procedure worldwide, used to temporarily paralyze targeted facial muscles to reduce dynamic wrinkles (crow''s feet, forehead lines, frown lines). Effects last 3-4 months.',
 'Cleaves SNAP-25 protein (a component of the SNARE complex), preventing acetylcholine vesicle fusion at the neuromuscular junction. This blocks nerve signaling to the injected muscle, causing temporary flaccid paralysis. The muscle cannot contract, so dynamic wrinkles (caused by muscle movement) smooth out. New SNAP-25 synthesis restores function over 3-4 months.',
 'Standard cosmetic doses: 20-64 units per treatment area. Glabellar lines: 20 units. Forehead: 20 units. Crow''s feet: 24 units. Administered by trained practitioners only.',
 'Well-established safety profile when used by trained practitioners. Bruising at injection sites. Temporary ptosis (drooping eyelid) if injected incorrectly. Headache common. Rare: allergic reaction, distant toxin spread. Must be stored refrigerated.',
 (SELECT id FROM vp_categories WHERE slug='cosmetic'), false),

('hyaluronic-acid', 'Hyaluronic Acid', 'A hydrating and lubricating compound primarily used for skin plumping and joint support.',
 'Hyaluronic acid (HA) is a naturally occurring glycosaminoglycan that can hold up to 1000x its weight in water. It is a major component of the extracellular matrix, synovial fluid, and skin dermis. Injectable HA provides direct hydration, volume restoration, and stimulates fibroblast activity for collagen production.',
 'Binds to CD44 and RHAMM receptors on cell surfaces, activating intracellular signaling for cell migration and proliferation. Creates a hydrated extracellular matrix that supports tissue repair. Stimulates fibroblast migration and collagen synthesis. The massive water-binding capacity provides mechanical cushioning in joints and volume in skin.',
 'Injectable: viscosupplementation (joints) 20mg/2ml intra-articular. Skin: dermal filler (cross-linked HA) or mesotherapy (non-cross-linked HA). Research formulations vary.',
 'Excellent biocompatibility (naturally occurring). Dermal fillers: bruising, swelling at injection site. Rare: vascular occlusion if injected into a blood vessel (emergency). Joint injections: temporary pain, swelling. Allergic reactions very rare.',
 (SELECT id FROM vp_categories WHERE slug='cosmetic'), false);

-- ============================================
-- SEED: Products — Supplies
-- ============================================

INSERT INTO vp_products (slug, name, short_description, long_description, mechanism_of_action, dosage_range, safety_notes, category_id, popular) VALUES
('bacteriostatic-water', 'Bacteriostatic Water', 'Sterile water containing benzyl alcohol, universally used to safely reconstitute peptides.',
 'Bacteriostatic Water (BAC Water) is sterile water for injection with 0.9% benzyl alcohol as a bacteriostatic preservative. The benzyl alcohol prevents microbial growth, allowing the vial to be used for multiple withdrawals over up to 28 days — unlike single-use Sterile Water for Injection. Essential for safe peptide reconstitution.',
 'Benzyl alcohol at 0.9% concentration inhibits bacterial reproduction by disrupting cell membrane integrity of most common microorganisms. This preservative effect allows multiple-use vials to remain sterile for up to 28 days after initial puncture, making it ideal for peptides that are dosed in small amounts over days or weeks.',
 'Use appropriate volume based on desired concentration. Typically 1-2ml per peptide vial. Inject slowly along the vial wall to prevent peptide denaturation from agitation.',
 'Do not use in neonates (benzyl alcohol toxicity). Not for intrathecal or epidural use. Store at room temperature. Discard 28 days after first use. Use proper aseptic technique for all withdrawals.',
 (SELECT id FROM vp_categories WHERE slug='supplies'), false),

('acetic-acid-water', 'Acetic Acid Water', 'A specialized diluent strictly required for reconstituting specific complex peptides.',
 'Acetic acid water (0.6% acetic acid solution) is a specialized reconstitution solvent required for peptides that are not soluble in neutral pH water. Certain peptides with high isoelectric points or specific charge characteristics require the mildly acidic environment to dissolve properly without aggregation or precipitation.',
 'The mild acidity (pH ~3) protonates basic amino acid residues, improving solubility of peptides that would otherwise aggregate at neutral pH. This is particularly important for peptides with multiple basic residues (lysine, arginine, histidine) or those with hydrophobic sequences prone to aggregation.',
 'Use as directed for specific peptides. Typically 1-2ml per vial. Inject slowly along vial wall. Required for: IGF-1 LR3, certain growth factors, and other specified peptides.',
 'Mildly acidic — may cause slight sting at injection site. Same 28-day use window as BAC water. Not interchangeable with BAC water — use only when specified for the peptide. Store at room temperature.',
 (SELECT id FROM vp_categories WHERE slug='supplies'), false);

-- ============================================
-- DISCOUNT SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS vp_discount_tiers (
  id SERIAL PRIMARY KEY,
  min_quantity INT NOT NULL,
  discount_pct NUMERIC(5,2) NOT NULL,
  label TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO vp_discount_tiers (min_quantity, discount_pct, label) VALUES
(3, 5.00, 'Buy 3+ items, save 5%'),
(5, 10.00, 'Buy 5+ items, save 10%'),
(10, 20.00, 'Buy 10+ items, save 20%');

-- Admin-configurable pricing
ALTER TABLE vp_product_specs ADD COLUMN IF NOT EXISTS admin_price_override BIGINT;

-- ============================================
-- EXCHANGE RATE CACHE
-- ============================================

CREATE TABLE IF NOT EXISTS vp_exchange_rates (
  id SERIAL PRIMARY KEY,
  pair TEXT NOT NULL,           -- e.g. 'TON_USD', 'USDT_USD'
  rate NUMERIC(20,8) NOT NULL,
  source TEXT DEFAULT 'coingecko',
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vp_exchange_rates_pair ON vp_exchange_rates(pair, fetched_at DESC);

-- ============================================
-- CUSTOMER AUTH
-- ============================================

CREATE TABLE IF NOT EXISTS vp_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  password_hash TEXT,           -- null for guest checkout
  is_guest BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vp_admin_users (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,        -- references Supabase auth.users or vp_customers
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  assigned_by TEXT DEFAULT 'bjorn',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
