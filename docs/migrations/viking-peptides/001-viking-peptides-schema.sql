-- Viking Peptides E-Commerce Schema
-- Migration 001: Tables + Seed Data

BEGIN;

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS vp_categories (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vp_products (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  mechanism_of_action TEXT,
  dosage_range TEXT,
  safety_notes TEXT,
  category_id INT REFERENCES vp_categories(id),
  image_url TEXT,
  popular BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vp_product_specs (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES vp_products(id) ON DELETE CASCADE,
  spec_label TEXT NOT NULL,
  price_pngwin BIGINT NOT NULL DEFAULT 0,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS vp_product_pairings (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES vp_products(id) ON DELETE CASCADE,
  paired_product_id INT REFERENCES vp_products(id) ON DELETE CASCADE,
  reason TEXT,
  stack_name TEXT,
  UNIQUE(product_id, paired_product_id)
);

CREATE TYPE vp_order_status AS ENUM ('draft','pending','paid','shipped','completed','cancelled');

CREATE TABLE IF NOT EXISTS vp_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status vp_order_status DEFAULT 'draft',
  total_pngwin BIGINT DEFAULT 0,
  shipping_address JSONB,
  notes TEXT,
  hold_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vp_order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES vp_orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES vp_products(id),
  spec_id INT REFERENCES vp_product_specs(id),
  quantity INT DEFAULT 1,
  unit_price BIGINT NOT NULL
);

CREATE INDEX idx_vp_products_category ON vp_products(category_id);
CREATE INDEX idx_vp_products_slug ON vp_products(slug);
CREATE INDEX idx_vp_product_specs_product ON vp_product_specs(product_id);
CREATE INDEX idx_vp_pairings_product ON vp_product_pairings(product_id);
CREATE INDEX idx_vp_orders_user ON vp_orders(user_id);
CREATE INDEX idx_vp_orders_status ON vp_orders(status);
CREATE INDEX idx_vp_order_items_order ON vp_order_items(order_id);

-- ============================================
-- SEED: Categories
-- ============================================

INSERT INTO vp_categories (slug, name, tagline, icon, sort_order) VALUES
('weight-management', 'Weight Management', 'GLP-1 agonists & metabolic peptides', '⚖', 1),
('growth-hormone', 'Growth Hormone', 'GH secretagogues & GHRH analogs', '↑', 2),
('recovery-healing', 'Recovery & Healing', 'Tissue repair & body protection', '✦', 3),
('cognitive', 'Cognitive Enhancement', 'Nootropics & neuroprotective', '◈', 4),
('anti-aging', 'Anti-Aging & Longevity', 'Telomere, senolytic & mitochondrial', '∞', 5),
('sexual-health', 'Sexual Health & Fertility', 'Hormonal optimization', '♦', 6),
('immune', 'Immune Support', 'Antimicrobial & anti-inflammatory', '◉', 7),
('cosmetic', 'Cosmetic & Skin', 'Tanning, collagen & skin health', '◆', 8),
('supplies', 'Supplies', 'Reconstitution & accessories', '▪', 9);

-- ============================================
-- SEED: Products — Weight Management
-- ============================================

INSERT INTO vp_products (slug, name, short_description, long_description, mechanism_of_action, dosage_range, safety_notes, category_id, popular) VALUES
('semaglutide', 'Semaglutide', 'A widely used GLP-1 agonist that helps lower blood sugar and promotes significant weight loss.',
 'Semaglutide is a glucagon-like peptide-1 (GLP-1) receptor agonist originally developed for type 2 diabetes management. It has become one of the most extensively researched peptides for weight management, demonstrating average body weight reductions of 15-17% in clinical trials. Beyond weight loss, semaglutide shows cardiovascular protective effects and may reduce inflammation markers.',
 'Binds to and activates GLP-1 receptors in the pancreas (enhancing insulin secretion), brain (reducing appetite via hypothalamic signaling), and gut (slowing gastric emptying). The 94% amino acid homology with native GLP-1 and fatty acid side chain provide extended half-life of approximately 7 days.',
 'Typical research protocol: 0.25mg/week for 4 weeks, escalating to 0.5mg, then 1.0mg, up to 2.4mg/week. Subcutaneous injection.',
 'Most common side effects in research: nausea, vomiting, diarrhea (typically transient). Contraindicated with personal/family history of medullary thyroid carcinoma or MEN2. Not for use during pregnancy.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), true),

('tirzepatide', 'Tirzepatide', 'A dual GIP and GLP-1 receptor agonist highly effective for managing type 2 diabetes and obesity.',
 'Tirzepatide is a first-in-class dual glucose-dependent insulinotropic polypeptide (GIP) and GLP-1 receptor agonist. Clinical trials (SURMOUNT) demonstrated unprecedented weight loss of up to 22.5% of body weight. It represents a paradigm shift in metabolic peptide therapy by engaging two incretin pathways simultaneously.',
 'Activates both GIP and GLP-1 receptors. GIP receptor activation enhances fat oxidation, improves lipid metabolism, and may have direct effects on adipose tissue. Combined with GLP-1 effects (appetite suppression, slowed gastric emptying, enhanced insulin secretion), this dual mechanism produces superior metabolic outcomes.',
 'Research dosing: start at 2.5mg/week for 4 weeks, escalate through 5mg, 7.5mg, 10mg, 12.5mg to maximum 15mg/week. Subcutaneous injection.',
 'GI side effects (nausea, diarrhea, constipation) most common during dose escalation. Same MTC/MEN2 contraindication as semaglutide. Monitor for pancreatitis symptoms.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), true),

('retatrutide', 'Retatrutide', 'A triple-hormone receptor agonist for robust weight loss and metabolic control.',
 'Retatrutide is a novel triple agonist targeting GLP-1, GIP, and glucagon receptors simultaneously. Phase 2 trials showed remarkable weight loss of up to 24% at 48 weeks — the highest recorded for any anti-obesity medication. The glucagon receptor component adds thermogenic and lipolytic effects beyond what dual agonists achieve.',
 'Triple receptor activation: GLP-1 (appetite suppression, insulin secretion), GIP (fat metabolism, beta-cell protection), and glucagon receptor (hepatic lipid oxidation, thermogenesis, energy expenditure). This three-pronged approach addresses obesity from multiple metabolic angles.',
 'Phase 2 dosing: 1mg escalating to 4mg, 8mg, or 12mg/week over 24-48 weeks. Subcutaneous injection.',
 'Similar GI side effect profile to other incretin-based peptides. Glucagon component may affect blood glucose differently. Still investigational — monitor liver enzymes and lipid panels.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), true),

('cagrilintide', 'Cagrilintide', 'A long-acting amylin analog used to promote satiety and weight loss.',
 'Cagrilintide is a long-acting acylated amylin analog designed for once-weekly administration. Amylin is co-secreted with insulin from pancreatic beta cells and plays a key role in post-meal satiety. Studies show 10-11% weight loss as monotherapy, with potential for enhanced results when combined with semaglutide (CagriSema).',
 'Activates amylin receptors (AMY1 and AMY3) in the area postrema and nucleus tractus solitarius of the brainstem, reducing appetite and slowing gastric emptying through a pathway complementary to GLP-1. Does not directly affect insulin secretion.',
 'Research protocol: 1.2mg to 4.5mg once weekly, subcutaneous. Often studied in combination with semaglutide 2.4mg.',
 'Nausea most common side effect, generally mild and transient. Injection site reactions possible. Combination with insulin requires careful glucose monitoring.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false),

('retatrutide-cagrilintide', 'Retatrutide + Cagrilintide', 'A potent investigational combination therapy for maximizing metabolic health.',
 'This combination blend pairs the triple-agonist retatrutide with the amylin analog cagrilintide, targeting four distinct receptor pathways (GLP-1, GIP, glucagon, and amylin) in a single reconstituted vial. This represents the cutting edge of multi-receptor metabolic therapy.',
 'Four-receptor activation covering GLP-1, GIP, glucagon, and amylin pathways. Each mechanism addresses a different aspect of energy balance and glucose homeostasis, potentially providing additive or synergistic weight loss effects.',
 'Research use only. Dosing protocols still under investigation. Typically 5mg of each component per vial.',
 'Investigational combination — no established safety profile for the combination. Individual component safety profiles apply. Research supervision recommended.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false),

('cagrilintide-semaglutide', 'Cagrilintide + Semaglutide', 'A dual-action combination targeting multiple metabolic pathways for appetite suppression.',
 'Known commercially as CagriSema, this combination pairs two complementary appetite-suppressing peptides. Phase 3 trials showed ~25% body weight reduction — among the highest for any pharmacological intervention. The amylin and GLP-1 pathways produce additive satiety effects.',
 'Dual pathway: semaglutide activates GLP-1 receptors while cagrilintide activates amylin receptors. These pathways converge in different brainstem nuclei, producing complementary appetite suppression that exceeds either agent alone.',
 'Research protocol: combination vial typically 5mg + 5mg. Weekly subcutaneous administration.',
 'Combined GI side effect profile. Nausea and reduced appetite are pronounced during initiation. Standard incretin contraindications apply.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false),

('aod9604', 'AOD9604 (HGH Fragment 176-191)', 'A modified peptide fragment of human growth hormone designed to stimulate fat burning.',
 'AOD9604 is a synthetic analog of the lipolytic fragment of human growth hormone (amino acids 176-191). Unlike full HGH, AOD9604 does not affect IGF-1 levels or blood glucose, making it a targeted fat-loss agent without the systemic effects of growth hormone therapy.',
 'Mimics the fat-burning action of growth hormone by stimulating lipolysis (fat breakdown) and inhibiting lipogenesis (fat formation) in adipose tissue. Acts through a distinct receptor mechanism independent of the GH receptor, so it does not promote growth of bone, muscle, or organs.',
 'Typical research dose: 250-500mcg/day subcutaneously, usually in the morning on an empty stomach. 5-on-2-off cycling common.',
 'Generally well-tolerated in studies. No significant effect on blood glucose or IGF-1 levels. Injection site reactions possible. Not approved for human therapeutic use.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false),

('5-amino-1mq', '5-amino-1MQ', 'An enzyme inhibitor that enhances cellular energy metabolism and facilitates fat loss.',
 '5-amino-1-methylquinolinium is a selective inhibitor of nicotinamide N-methyltransferase (NNMT), an enzyme overexpressed in adipose tissue of obese individuals. By blocking NNMT, it increases NAD+ availability and activates the cellular energy sensor SIRT1, promoting fat cell shrinkage.',
 'Inhibits NNMT enzyme in adipose tissue, which increases intracellular NAD+ and SAM (S-adenosylmethionine) levels. Higher NAD+ activates SIRT1 and AMPK pathways, boosting mitochondrial biogenesis and fat oxidation. May also reduce fat cell size and proliferation.',
 'Research dosing: typically supplied as 10mg vials in sets of 10. Subcutaneous administration.',
 'Limited human safety data. Preclinical studies show good tolerability. Monitor for unexpected metabolic effects. Research compound only.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false),

('mots-c', 'MOTS-C', 'A mitochondrial-derived peptide that promotes metabolic flexibility and exercise endurance.',
 'MOTS-C is a 16-amino-acid peptide encoded by the mitochondrial genome (12S rRNA gene). It is the first mitochondrial-derived peptide shown to regulate nuclear gene expression. MOTS-C improves glucose regulation, enhances exercise capacity, and may have anti-aging properties through its role in metabolic homeostasis.',
 'Activates AMPK pathway and enhances folate-methionine cycle metabolism. Translocates to the nucleus under metabolic stress to regulate adaptive gene expression. Improves skeletal muscle insulin sensitivity and glucose uptake independently of insulin signaling.',
 'Research dosing: 5-10mg, 2-3 times per week subcutaneously. Some protocols use daily 5mg.',
 'Well-tolerated in preliminary human trials. As a naturally occurring peptide, it has a favorable safety profile. May enhance metformin effects — monitor blood glucose if combining.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false),

('l-carnitine', 'L-Carnitine', 'An amino acid derivative that assists in converting fatty acids into usable energy.',
 'L-Carnitine is a naturally occurring amino acid derivative essential for transporting long-chain fatty acids into the mitochondrial matrix for beta-oxidation. Injectable L-Carnitine bypasses the limited oral bioavailability (14-18%), providing significantly higher tissue concentrations for enhanced fat metabolism.',
 'Serves as the obligate cofactor for carnitine palmitoyltransferase (CPT-1 and CPT-2), the mitochondrial membrane transport system for long-chain fatty acids. Without adequate carnitine, fatty acids cannot enter mitochondria for energy production.',
 'Injectable form: 200-600mg intramuscularly or subcutaneously, 2-3 times per week.',
 'Very well-established safety profile. Mild injection site discomfort possible. TMA/TMAO production is primarily an oral bioavailability concern, less relevant for injectable forms.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false),

('lipo-c', 'Lipo-C', 'A lipotropic injection designed to boost fat metabolism and liver function.',
 'Lipo-C is a lipotropic compound injection containing methionine, inositol, choline, and cyanocobalamin (vitamin B12). These lipotropic agents work synergistically to mobilize and metabolize fat deposits, particularly from the liver, while supporting overall energy production.',
 'Methionine provides sulfur for detoxification and prevents fat accumulation in the liver. Inositol aids in fat transport and metabolism as a component of cell membranes. Choline is essential for fat transport as a precursor to phosphatidylcholine. B12 supports energy metabolism and red blood cell formation.',
 'Typical protocol: 1ml intramuscularly once or twice weekly.',
 'Generally very well tolerated. Components are essential nutrients. Allergic reactions rare. B12 component may cause mild flushing.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false),

('maritide', 'Maritide (AMG133)', 'A bispecific GIP receptor antagonist and GLP-1 receptor agonist in development for weight reduction.',
 'Maritide (AMG 133) is a novel bispecific molecule developed by Amgen that combines GIP receptor antagonism with GLP-1 receptor agonism. Unlike tirzepatide which activates both receptors, maritide blocks GIP while activating GLP-1 — a fundamentally different approach. Phase 2 data showed up to 14.5% weight loss in just 12 weeks.',
 'Unique dual mechanism: antagonizes GIP receptors (reducing fat storage signals in adipose tissue) while simultaneously agonizing GLP-1 receptors (suppressing appetite and enhancing insulin secretion). The anti-GIP approach may reduce GIP-mediated lipogenesis.',
 'Investigational. Phase 2 dosing: monthly subcutaneous injection at various dose levels (140-420mg).',
 'Still in clinical development. GI side effects reported. The GIP antagonism approach is novel — long-term metabolic effects under study. Bulk research compound.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false),

('vk2735', 'VK2735', 'An investigational dual GLP-1 and GIP receptor agonist in development for metabolic disorders.',
 'VK2735 is Viking Therapeutics'' dual GLP-1/GIP receptor agonist that showed impressive Phase 2 results with up to 14.7% weight loss in just 13 weeks. It is being developed in both injectable and oral formulations, with the oral version (VK2735 oral) potentially disrupting the market by offering pill-based incretin therapy.',
 'Dual agonism of GLP-1 and GIP receptors, similar to tirzepatide but with a distinct molecular structure optimized for potency and tolerability. Designed for enhanced receptor binding affinity and extended pharmacokinetic profile.',
 'Investigational. Phase 2 injectable: weekly subcutaneous doses up to 6.0mg. Oral formulation also in development.',
 'Phase 2 reported favorable tolerability with lower discontinuation rates than comparators. GI side effects present but generally mild. Bulk research compound.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false),

('eloralintide', 'Eloralintide (LY3841136)', 'An investigational peptide targeting obesity and metabolic health.',
 'Eloralintide is Eli Lilly''s investigational peptide for obesity treatment. It represents the company''s pipeline expansion beyond tirzepatide, targeting additional metabolic pathways for enhanced weight management efficacy.',
 'Mechanism details are proprietary and still emerging from clinical trials. Expected to target metabolic pathways complementary to existing GLP-1 based therapies.',
 'Investigational. Dosing protocols not yet publicly established. Bulk research material.',
 'Early-stage clinical compound. Safety profile still being characterized. Research use only.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false),

('petrelintide', 'Petrelintide', 'A long-acting amylin analog currently researched for chronic weight management.',
 'Petrelintide is a next-generation long-acting amylin receptor agonist designed for chronic weight management. It builds on the amylin analog approach of cagrilintide with potentially improved pharmacokinetic properties for sustained appetite suppression.',
 'Long-acting amylin receptor agonist targeting AMY1 and AMY3 receptors in the brainstem appetite centers. Provides sustained activation of satiety signaling pathways with extended dosing intervals.',
 'Investigational. Dosing schedules under clinical investigation. Bulk research material.',
 'Clinical safety data still accumulating. Expected side effect profile similar to other amylin analogs (nausea, reduced appetite). Research use only.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false),

('mk-0616', 'MK-0616', 'An oral PCSK9 inhibitor developed to drastically lower cholesterol levels.',
 'MK-0616 is Merck''s oral PCSK9 inhibitor — a potential game-changer in cholesterol management. Currently, PCSK9 inhibitors (evolocumab, alirocumab) require injection. An oral formulation would dramatically improve accessibility and patient compliance for achieving aggressive LDL-cholesterol targets.',
 'Inhibits PCSK9 protein, preventing it from binding to and degrading LDL receptors on hepatocyte surfaces. With more LDL receptors available, the liver clears more LDL-cholesterol from the bloodstream, achieving reductions of 50-60% on top of statin therapy.',
 'Investigational oral compound. Phase 3 dosing under evaluation. Supplied as bulk research material.',
 'Oral PCSK9 inhibition is a novel approach. Safety profile being characterized in phase 3 trials. Monitor lipid panels and liver function. Research use only.',
 (SELECT id FROM vp_categories WHERE slug='weight-management'), false);

-- ============================================
-- SEED: Products — Growth Hormone
-- ============================================

INSERT INTO vp_products (slug, name, short_description, long_description, mechanism_of_action, dosage_range, safety_notes, category_id, popular) VALUES
('hgh-191aa', 'HGH 191AA', 'Bio-identical synthetic human growth hormone used for muscle growth, recovery, and anti-aging.',
 'HGH 191AA is a bio-identical recombinant human growth hormone containing all 191 amino acids in the exact sequence of endogenous somatotropin. It is produced through recombinant DNA technology and represents the gold standard in GH supplementation for research into muscle growth, fat metabolism, tissue repair, and anti-aging.',
 'Binds to growth hormone receptors (GHR) on target tissues, triggering the JAK2-STAT5 signaling cascade. Stimulates hepatic production of IGF-1 (primary mediator of anabolic effects). Direct effects include lipolysis stimulation, protein synthesis enhancement, and cellular repair activation.',
 'Research protocols vary widely: anti-aging 1-2 IU/day, body composition 2-4 IU/day, recovery/healing 4-8 IU/day. Subcutaneous injection, typically morning or before bed.',
 'Water retention and joint stiffness common at higher doses. Monitor blood glucose (GH is diabetogenic). Potential for carpal tunnel syndrome symptoms. Do not use with active malignancy.',
 (SELECT id FROM vp_categories WHERE slug='growth-hormone'), true),

('cjc1295-dac', 'CJC 1295 with DAC', 'A long-acting GHRH analogue that provides a continuous increase in IGF-1 and GH levels.',
 'CJC 1295 with Drug Affinity Complex (DAC) is a synthetic GHRH analog with a half-life of approximately 6-8 days, compared to minutes for native GHRH. The DAC modification allows it to bind to albumin, dramatically extending its duration of action and providing continuous GH elevation.',
 'Binds to GHRH receptors on anterior pituitary somatotrophs, stimulating GH synthesis and secretion. The DAC moiety creates covalent bonds with serum albumin via reactive thiol groups, creating a long-lasting depot effect. Produces sustained GH elevation rather than pulsatile release.',
 'Research dosing: 1-2mg once or twice weekly via subcutaneous injection. Steady-state reached after 2-3 injections.',
 'Continuous GH elevation may suppress natural pulsatile GH release. Water retention, numbness/tingling in extremities possible. Monitor IGF-1 levels periodically.',
 (SELECT id FROM vp_categories WHERE slug='growth-hormone'), false),

('cjc1295-no-dac', 'CJC 1295 without DAC', 'A synthetic analogue of growth hormone-releasing hormone (GHRH) with a shorter half-life.',
 'CJC 1295 without DAC (also called Modified GRF 1-29) is a 29-amino-acid GHRH analog with four amino acid substitutions that protect it from enzymatic degradation. With a half-life of approximately 30 minutes, it produces a GH pulse that more closely mimics natural physiology compared to the DAC version.',
 'Binds to GHRH receptors on pituitary somatotrophs, triggering a GH secretion pulse. The shorter half-life means it amplifies natural GH pulses rather than creating sustained elevation. Best results when combined with a GHRP (like ipamorelin) to synergistically amplify the GH pulse.',
 'Research dosing: 100-300mcg subcutaneously, 1-3 times daily (commonly before bed). Often paired with Ipamorelin at 200mcg.',
 'Generally well-tolerated due to physiological pulsatile GH pattern. Mild flushing or head rush at injection possible. Less water retention than DAC version.',
 (SELECT id FROM vp_categories WHERE slug='growth-hormone'), false),

('cjc1295-ipamorelin', 'CJC 1295 + Ipamorelin', 'A high-dose synergistic pairing to maximize natural growth hormone release.',
 'This combination pairs a GHRH analog (CJC 1295) with a ghrelin mimetic (Ipamorelin) for synergistic GH release. The GHRH component amplifies the GH pulse while the GHRP component initiates it — together producing 3-5x more GH release than either peptide alone. This is the most popular GH peptide stack in research.',
 'Dual-pathway GH stimulation: CJC 1295 activates GHRH receptors (amplifies pulse amplitude) while Ipamorelin activates ghrelin/GHS receptors (initiates pulse). The synergy occurs because GHRH sensitizes somatotrophs to GHRP stimulation and vice versa.',
 'Combined vial: typically 5mg + 5mg or 10mg + 10mg. Research dose: 300mcg combined (150mcg each) subcutaneously before bed.',
 'Very favorable safety profile due to physiological GH pulsing. Mild hunger increase from Ipamorelin''s ghrelin activity. No significant cortisol or prolactin elevation.',
 (SELECT id FROM vp_categories WHERE slug='growth-hormone'), true),

('ipamorelin', 'Ipamorelin', 'A highly selective growth hormone secretagogue that stimulates GH release with minimal side effects.',
 'Ipamorelin is a pentapeptide ghrelin mimetic and growth hormone secretagogue that is uniquely selective for GH release. Unlike GHRP-6 and GHRP-2, ipamorelin does not significantly raise cortisol, prolactin, or cause intense hunger — making it the cleanest GH secretagogue available.',
 'Selectively activates the ghrelin receptor (GHS-R1a) on pituitary somatotrophs to initiate GH secretion pulses. Its selectivity comes from minimal activation of other pituitary hormone pathways. Does not significantly affect ACTH, cortisol, or prolactin secretion.',
 'Research dosing: 200-300mcg subcutaneously, 2-3 times daily. Most commonly dosed before bed. Often combined with CJC 1295 (no DAC).',
 'Among the best-tolerated GH secretagogues. Mild transient head rush at injection. Slight appetite increase possible but less than GHRP-6. No significant cortisol/prolactin effects.',
 (SELECT id FROM vp_categories WHERE slug='growth-hormone'), false),

('ghrp2', 'GHRP-2 Acetate', 'A first-generation growth hormone-releasing peptide that robustly stimulates the pituitary gland.',
 'GHRP-2 (Growth Hormone Releasing Peptide-2) is a synthetic hexapeptide that potently stimulates GH release. It is the strongest GHRP in terms of GH output, producing higher peak GH levels than ipamorelin or GHRP-6, but with more side effects including cortisol and prolactin elevation.',
 'Agonizes the ghrelin receptor (GHS-R1a) with high potency. Also activates secondary signaling pathways that increase ACTH and cortisol release. Stimulates appetite through hypothalamic ghrelin pathways. Produces the largest GH pulse among synthetic GHRPs.',
 'Research dosing: 100-300mcg subcutaneously, 2-3 times daily. Often combined with a GHRH analog for synergistic effect.',
 'More side effects than ipamorelin: increases cortisol and prolactin (dose-dependent), strong appetite stimulation, water retention. Monitor cortisol and prolactin with chronic use.',
 (SELECT id FROM vp_categories WHERE slug='growth-hormone'), false),

('ghrp6', 'GHRP-6 Acetate', 'A growth hormone-releasing peptide known to strongly stimulate appetite alongside GH release.',
 'GHRP-6 is a synthetic hexapeptide GH secretagogue notable for its potent appetite-stimulating effects. It produces robust GH pulses and is particularly useful in research contexts where appetite stimulation is desirable alongside GH elevation. It also shows gastroprotective and cardioprotective properties.',
 'Activates ghrelin receptors (GHS-R1a) in the pituitary and hypothalamus. Strong activation of hypothalamic appetite centers produces intense hunger within 20 minutes of administration. Also shows cytoprotective effects on gastric mucosa similar to BPC-157 and cardioprotective signaling.',
 'Research dosing: 100-300mcg subcutaneously, 2-3 times daily on an empty stomach. The 20-minute intense hunger window is characteristic.',
 'Intense hunger is the primary side effect — can be overwhelming for some subjects. Moderate cortisol and prolactin elevation. Water retention possible. May affect blood glucose.',
 (SELECT id FROM vp_categories WHERE slug='growth-hormone'), false),

('hexarelin', 'Hexarelin', 'A highly potent, fast-acting growth hormone secretagogue.',
 'Hexarelin is the most potent synthetic GH secretagogue, producing the highest GH peaks of any GHRP. However, it also has the most significant side effect profile and develops receptor desensitization faster than other GHRPs, typically within 2-4 weeks of continuous use.',
 'Potent ghrelin receptor agonist that produces massive GH pulses from the anterior pituitary. Also activates cardiac ghrelin receptors, showing direct cardioprotective and anti-fibrotic effects independent of GH release. Significant cortisol and prolactin co-release.',
 'Research dosing: 100-200mcg subcutaneously, 2-3 times daily. Cycling recommended (4 weeks on, 4 weeks off) due to desensitization.',
 'Strongest GH release but fastest desensitization. Significant cortisol and prolactin elevation. Intense hunger. Must cycle to maintain efficacy.',
 (SELECT id FROM vp_categories WHERE slug='growth-hormone'), false),

('igf1-lr3', 'IGF-1 LR3', 'An extended half-life version of Insulin-like Growth Factor 1 that promotes muscle hyperplasia.',
 'IGF-1 LR3 is a modified version of IGF-1 with an arginine substitution at position 3 and a 13-amino-acid extension at the N-terminus. These modifications reduce binding to IGF-binding proteins, increasing free IGF-1 levels and extending the half-life from minutes to approximately 20-30 hours.',
 'Binds to IGF-1 receptors with full agonist activity, but with dramatically reduced IGFBP binding. This means more bioactive IGF-1 reaches target tissues. Promotes both muscle hypertrophy (cell enlargement) and hyperplasia (new cell formation) — a unique property not shared by most anabolic agents.',
 'Research dosing: 20-100mcg/day subcutaneously or intramuscularly. Often used in 4-6 week cycles.',
 'Hypoglycemia is the primary risk — IGF-1 has insulin-like effects. Monitor blood glucose closely. May promote growth of existing tumors. Joint pain and headaches reported.',
 (SELECT id FROM vp_categories WHERE slug='growth-hormone'), false),

('sermorelin', 'Sermorelin', 'A classic GHRH analog used to gently stimulate the pituitary gland to produce more GH.',
 'Sermorelin is the original synthetic GHRH analog, consisting of the first 29 amino acids of the 44-amino-acid native GHRH molecule. It was FDA-approved for GH-deficient children and represents the gentlest approach to GH peptide therapy. It preserves normal pulsatile GH physiology.',
 'Binds to GHRH receptors on anterior pituitary somatotrophs, stimulating GH synthesis and secretion. Unlike exogenous GH, it works through the natural feedback system — the pituitary will not release excessive GH, providing a built-in safety mechanism.',
 'Research dosing: 200-300mcg subcutaneously before bed. Some protocols add a morning dose. 3-6 month protocols common.',
 'Excellent safety profile due to physiological mechanism. Mild injection site reactions. Transient facial flushing. Effects are gradual — weeks to months for full benefits.',
 (SELECT id FROM vp_categories WHERE slug='growth-hormone'), false),

('tesamorelin', 'Tesamorelin', 'A targeted GHRH analog clinically proven to be highly effective at reducing visceral adipose tissue.',
 'Tesamorelin is an FDA-approved GHRH analog with a trans-3-hexenoic acid modification that enhances potency and stability. It is specifically approved for reducing excess abdominal fat (lipodystrophy) in HIV patients, but research shows broader applications in visceral fat reduction and cognitive enhancement in aging.',
 'Modified GHRH analog with enhanced receptor binding affinity. Stimulates pulsatile GH release from the pituitary, which drives lipolysis particularly in visceral adipose depots. Research also shows improvements in cognitive function and carotid intima-media thickness.',
 'FDA-approved dose: 2mg/day subcutaneously. Research protocols may vary. Often used for 6-12 month periods.',
 'FDA-approved with well-characterized safety profile. Injection site reactions, arthralgia, peripheral edema most common. Contraindicated with pituitary pathology or active malignancy.',
 (SELECT id FROM vp_categories WHERE slug='growth-hormone'), false),

('ace-031', 'ACE-031', 'A soluble form of activin receptor type IIB that promotes muscle growth by inhibiting myostatin.',
 'ACE-031 is a soluble form of the activin type IIB receptor fused to an IgG1 Fc domain. It acts as a decoy receptor, binding and neutralizing myostatin and other TGF-beta superfamily ligands that normally limit muscle growth. This myostatin-trap approach produces significant muscle mass increases.',
 'Functions as a ligand trap for myostatin, activin A, GDF11, and other TGF-beta superfamily members that signal through ActRIIB. By sequestering these negative regulators of muscle growth, ACE-031 removes the natural brake on muscle protein synthesis and satellite cell activation.',
 'Research dosing: various dose levels studied in clinical trials. Intravenous or subcutaneous administration. Cycling protocols vary.',
 'Clinical trials paused due to minor bleeding events (epistaxis, gum bleeding, telangiectasias) possibly related to BMP9/10 inhibition. Myostatin inhibition is a powerful intervention — long-term effects under study.',
 (SELECT id FROM vp_categories WHERE slug='growth-hormone'), false);

COMMIT;
