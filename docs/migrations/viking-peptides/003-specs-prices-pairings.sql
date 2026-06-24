-- Viking Peptides Migration 003: Product specs with realistic prices + pairings
-- Prices in PNGWIN (1 PNGWIN = ~$0.001, so $50 = 50000 PNGWIN)
-- Prices researched from peptide suppliers, adjusted per mg amount

BEGIN;

-- ============================================
-- SPECS WITH PRICES — Weight Management
-- ============================================

-- Semaglutide (market: ~$3-5/mg)
INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='semaglutide'), '5mg', 29900, 1),
((SELECT id FROM vp_products WHERE slug='semaglutide'), '10mg', 49900, 2),
((SELECT id FROM vp_products WHERE slug='semaglutide'), '15mg', 69900, 3),
((SELECT id FROM vp_products WHERE slug='semaglutide'), '20mg', 89900, 4),
((SELECT id FROM vp_products WHERE slug='semaglutide'), '30mg', 119900, 5),
((SELECT id FROM vp_products WHERE slug='semaglutide'), '80mg', 279900, 6);

-- Tirzepatide (market: ~$4-6/mg)
INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='tirzepatide'), '10mg', 54900, 1),
((SELECT id FROM vp_products WHERE slug='tirzepatide'), '15mg', 74900, 2),
((SELECT id FROM vp_products WHERE slug='tirzepatide'), '20mg', 94900, 3),
((SELECT id FROM vp_products WHERE slug='tirzepatide'), '30mg', 129900, 4),
((SELECT id FROM vp_products WHERE slug='tirzepatide'), '40mg', 164900, 5),
((SELECT id FROM vp_products WHERE slug='tirzepatide'), '50mg', 194900, 6),
((SELECT id FROM vp_products WHERE slug='tirzepatide'), '60mg', 224900, 7),
((SELECT id FROM vp_products WHERE slug='tirzepatide'), '80mg', 289900, 8),
((SELECT id FROM vp_products WHERE slug='tirzepatide'), '120mg', 399900, 9);

-- Retatrutide (market: ~$5-8/mg, newer)
INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='retatrutide'), '5mg', 39900, 1),
((SELECT id FROM vp_products WHERE slug='retatrutide'), '10mg', 69900, 2),
((SELECT id FROM vp_products WHERE slug='retatrutide'), '20mg', 119900, 3),
((SELECT id FROM vp_products WHERE slug='retatrutide'), '30mg', 169900, 4),
((SELECT id FROM vp_products WHERE slug='retatrutide'), '40mg', 209900, 5),
((SELECT id FROM vp_products WHERE slug='retatrutide'), '60mg', 299900, 6),
((SELECT id FROM vp_products WHERE slug='retatrutide'), '80mg', 379900, 7),
((SELECT id FROM vp_products WHERE slug='retatrutide'), '100mg', 449900, 8);

-- Cagrilintide
INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='cagrilintide'), '5mg', 39900, 1),
((SELECT id FROM vp_products WHERE slug='cagrilintide'), '10mg', 69900, 2);

-- Combos
INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='retatrutide-cagrilintide'), '10mg (5mg + 5mg)', 79900, 1),
((SELECT id FROM vp_products WHERE slug='cagrilintide-semaglutide'), '10mg (5mg + 5mg)', 69900, 1);

-- AOD9604
INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='aod9604'), '2mg', 19900, 1),
((SELECT id FROM vp_products WHERE slug='aod9604'), '5mg', 34900, 2),
((SELECT id FROM vp_products WHERE slug='aod9604'), '10mg', 54900, 3);

-- 5-amino-1MQ
INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='5-amino-1mq'), '10mg x 10 vials', 89900, 1);

-- MOTS-C
INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='mots-c'), '10mg', 49900, 1),
((SELECT id FROM vp_products WHERE slug='mots-c'), '40mg', 149900, 2);

-- L-Carnitine
INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='l-carnitine'), '600mg x 10ml', 24900, 1);

-- Lipo-C
INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='lipo-c'), '10ml', 29900, 1);

-- Bulk compounds
INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='maritide'), '1g (bulk)', 1999900, 1),
((SELECT id FROM vp_products WHERE slug='vk2735'), '1g (bulk)', 1499900, 1),
((SELECT id FROM vp_products WHERE slug='eloralintide'), '10g (bulk)', 4999900, 1),
((SELECT id FROM vp_products WHERE slug='petrelintide'), '1g (bulk)', 1299900, 1),
((SELECT id FROM vp_products WHERE slug='mk-0616'), '100g (bulk)', 9999900, 1);

-- ============================================
-- SPECS WITH PRICES — Growth Hormone
-- ============================================

INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='hgh-191aa'), '10iu', 29900, 1),
((SELECT id FROM vp_products WHERE slug='hgh-191aa'), '16iu', 44900, 2),
((SELECT id FROM vp_products WHERE slug='hgh-191aa'), '24iu', 59900, 3),
((SELECT id FROM vp_products WHERE slug='hgh-191aa'), '36iu', 79900, 4),
((SELECT id FROM vp_products WHERE slug='cjc1295-dac'), '5mg', 34900, 1),
((SELECT id FROM vp_products WHERE slug='cjc1295-dac'), '10mg', 59900, 2),
((SELECT id FROM vp_products WHERE slug='cjc1295-no-dac'), '5mg', 29900, 1),
((SELECT id FROM vp_products WHERE slug='cjc1295-no-dac'), '10mg', 49900, 2),
((SELECT id FROM vp_products WHERE slug='cjc1295-ipamorelin'), '10mg (5mg + 5mg)', 54900, 1),
((SELECT id FROM vp_products WHERE slug='cjc1295-ipamorelin'), '20mg (10mg + 10mg)', 94900, 2),
((SELECT id FROM vp_products WHERE slug='ipamorelin'), '5mg', 24900, 1),
((SELECT id FROM vp_products WHERE slug='ipamorelin'), '10mg', 39900, 2),
((SELECT id FROM vp_products WHERE slug='ghrp2'), '5mg', 19900, 1),
((SELECT id FROM vp_products WHERE slug='ghrp2'), '10mg', 34900, 2),
((SELECT id FROM vp_products WHERE slug='ghrp6'), '5mg', 19900, 1),
((SELECT id FROM vp_products WHERE slug='ghrp6'), '10mg', 34900, 2),
((SELECT id FROM vp_products WHERE slug='hexarelin'), '2mg', 19900, 1),
((SELECT id FROM vp_products WHERE slug='hexarelin'), '5mg', 34900, 2),
((SELECT id FROM vp_products WHERE slug='igf1-lr3'), '0.1mg', 29900, 1),
((SELECT id FROM vp_products WHERE slug='igf1-lr3'), '1mg', 89900, 2),
((SELECT id FROM vp_products WHERE slug='sermorelin'), '5mg', 29900, 1),
((SELECT id FROM vp_products WHERE slug='sermorelin'), '10mg', 49900, 2),
((SELECT id FROM vp_products WHERE slug='tesamorelin'), '5mg', 39900, 1),
((SELECT id FROM vp_products WHERE slug='tesamorelin'), '10mg', 69900, 2),
((SELECT id FROM vp_products WHERE slug='ace-031'), '10mg', 149900, 1);

-- ============================================
-- SPECS WITH PRICES — Recovery & Healing
-- ============================================

INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='bpc-157'), '5mg', 29900, 1),
((SELECT id FROM vp_products WHERE slug='bpc-157'), '10mg', 49900, 2),
((SELECT id FROM vp_products WHERE slug='tb500'), '5mg', 34900, 1),
((SELECT id FROM vp_products WHERE slug='tb500'), '10mg', 59900, 2),
((SELECT id FROM vp_products WHERE slug='bpc157-tb500-high'), '20mg (10mg + 10mg)', 99900, 1),
((SELECT id FROM vp_products WHERE slug='bpc157-tb500-standard'), '10mg (5mg + 5mg)', 54900, 1),
((SELECT id FROM vp_products WHERE slug='glow-blend'), '70mg (10mg + 10mg + 50mg)', 139900, 1),
((SELECT id FROM vp_products WHERE slug='klow-blend'), '80mg (10mg + 10mg + 50mg + 10mg)', 169900, 1),
((SELECT id FROM vp_products WHERE slug='ghk-cu'), '50mg', 39900, 1),
((SELECT id FROM vp_products WHERE slug='ghk-cu'), '100mg', 69900, 2),
((SELECT id FROM vp_products WHERE slug='mgf'), '2mg', 29900, 1),
((SELECT id FROM vp_products WHERE slug='peg-mgf'), '2mg', 34900, 1),
((SELECT id FROM vp_products WHERE slug='ara-290'), '10mg', 59900, 1);

-- ============================================
-- SPECS WITH PRICES — Cognitive
-- ============================================

INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='selank'), '5mg', 29900, 1),
((SELECT id FROM vp_products WHERE slug='selank'), '10mg', 49900, 2),
((SELECT id FROM vp_products WHERE slug='semax'), '5mg', 29900, 1),
((SELECT id FROM vp_products WHERE slug='semax'), '10mg', 49900, 2),
((SELECT id FROM vp_products WHERE slug='dsip'), '5mg', 24900, 1),
((SELECT id FROM vp_products WHERE slug='dsip'), '10mg', 39900, 2),
((SELECT id FROM vp_products WHERE slug='dsip'), '15mg', 54900, 3),
((SELECT id FROM vp_products WHERE slug='uridine-choline'), '100mg', 19900, 1),
((SELECT id FROM vp_products WHERE slug='uridine-choline'), '500mg', 49900, 2),
((SELECT id FROM vp_products WHERE slug='melatonin'), '10mg', 14900, 1),
((SELECT id FROM vp_products WHERE slug='oxytocin'), '2mg', 24900, 1),
((SELECT id FROM vp_products WHERE slug='oxytocin'), '5mg', 44900, 2);

-- ============================================
-- SPECS WITH PRICES — Anti-Aging
-- ============================================

INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='epitalon'), '10mg', 39900, 1),
((SELECT id FROM vp_products WHERE slug='epitalon'), '50mg', 149900, 2),
((SELECT id FROM vp_products WHERE slug='foxo4-dri'), '10mg', 299900, 1),
((SELECT id FROM vp_products WHERE slug='nad-plus'), '1000mg', 89900, 1),
((SELECT id FROM vp_products WHERE slug='ss-31'), '10mg', 69900, 1),
((SELECT id FROM vp_products WHERE slug='ss-31'), '50mg', 249900, 2),
((SELECT id FROM vp_products WHERE slug='thymalin'), '10mg', 39900, 1),
((SELECT id FROM vp_products WHERE slug='thymosin-alpha-1'), '5mg', 34900, 1),
((SELECT id FROM vp_products WHERE slug='thymosin-alpha-1'), '10mg', 59900, 2);

-- ============================================
-- SPECS WITH PRICES — Sexual Health
-- ============================================

INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='pt-141'), '10mg', 34900, 1),
((SELECT id FROM vp_products WHERE slug='kisspeptin-10'), '5mg', 29900, 1),
((SELECT id FROM vp_products WHERE slug='kisspeptin-10'), '10mg', 49900, 2),
((SELECT id FROM vp_products WHERE slug='gonadorelin'), '2mg', 19900, 1),
((SELECT id FROM vp_products WHERE slug='hcg'), '5000iu', 34900, 1),
((SELECT id FROM vp_products WHERE slug='hcg'), '10000iu', 59900, 2),
((SELECT id FROM vp_products WHERE slug='hmg'), '75iu', 29900, 1),
((SELECT id FROM vp_products WHERE slug='papaverine'), 'Trimix injection', 49900, 1);

-- ============================================
-- SPECS WITH PRICES — Immune
-- ============================================

INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='kpv'), '10mg', 34900, 1),
((SELECT id FROM vp_products WHERE slug='ll37'), '5mg', 39900, 1),
((SELECT id FROM vp_products WHERE slug='vip'), '10mg', 49900, 1),
((SELECT id FROM vp_products WHERE slug='pnc-27'), '5mg', 59900, 1),
((SELECT id FROM vp_products WHERE slug='pnc-27'), '10mg', 99900, 2),
((SELECT id FROM vp_products WHERE slug='glutathione'), '600mg', 24900, 1),
((SELECT id FROM vp_products WHERE slug='glutathione'), '1500mg', 44900, 2);

-- ============================================
-- SPECS WITH PRICES — Cosmetic
-- ============================================

INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='melanotan-1'), '10mg', 34900, 1),
((SELECT id FROM vp_products WHERE slug='melanotan-2'), '10mg', 24900, 1),
((SELECT id FROM vp_products WHERE slug='snap-8'), '10mg', 29900, 1),
((SELECT id FROM vp_products WHERE slug='botulinum-toxin'), '100iu', 199900, 1),
((SELECT id FROM vp_products WHERE slug='hyaluronic-acid'), '5mg/vial', 29900, 1);

-- ============================================
-- SPECS WITH PRICES — Supplies
-- ============================================

INSERT INTO vp_product_specs (product_id, spec_label, price_pngwin, sort_order) VALUES
((SELECT id FROM vp_products WHERE slug='bacteriostatic-water'), '3ml x 10', 14900, 1),
((SELECT id FROM vp_products WHERE slug='bacteriostatic-water'), '10ml x 10', 24900, 2),
((SELECT id FROM vp_products WHERE slug='acetic-acid-water'), '3ml x 10', 16900, 1);

-- ============================================
-- PRODUCT PAIRINGS (Goes well together with)
-- ============================================

-- Weight management pairings
INSERT INTO vp_product_pairings (product_id, paired_product_id, reason, stack_name) VALUES
-- Semaglutide pairs
((SELECT id FROM vp_products WHERE slug='semaglutide'), (SELECT id FROM vp_products WHERE slug='bpc-157'), 'BPC-157 helps protect the GI tract from nausea side effects common with GLP-1 agonists, while also supporting gut healing.', NULL),
((SELECT id FROM vp_products WHERE slug='semaglutide'), (SELECT id FROM vp_products WHERE slug='l-carnitine'), 'L-Carnitine enhances fat oxidation in mitochondria, complementing semaglutide''s appetite suppression for accelerated fat loss.', NULL),
((SELECT id FROM vp_products WHERE slug='semaglutide'), (SELECT id FROM vp_products WHERE slug='cagrilintide'), 'The CagriSema combination targets both GLP-1 and amylin pathways for superior weight loss (~25% body weight).', 'CagriSema Stack'),
((SELECT id FROM vp_products WHERE slug='semaglutide'), (SELECT id FROM vp_products WHERE slug='mots-c'), 'MOTS-C enhances metabolic flexibility and exercise endurance, countering potential muscle loss during weight management.', NULL),

-- Tirzepatide pairs
((SELECT id FROM vp_products WHERE slug='tirzepatide'), (SELECT id FROM vp_products WHERE slug='bpc-157'), 'BPC-157 provides GI protection against nausea and supports gut health during incretin therapy.', NULL),
((SELECT id FROM vp_products WHERE slug='tirzepatide'), (SELECT id FROM vp_products WHERE slug='l-carnitine'), 'L-Carnitine supports mitochondrial fat burning alongside tirzepatide''s dual-receptor metabolic effects.', NULL),
((SELECT id FROM vp_products WHERE slug='tirzepatide'), (SELECT id FROM vp_products WHERE slug='aod9604'), 'AOD9604 targets fat-specific lipolysis through a different pathway, complementing tirzepatide''s systemic metabolic effects.', NULL),

-- Retatrutide pairs
((SELECT id FROM vp_products WHERE slug='retatrutide'), (SELECT id FROM vp_products WHERE slug='bpc-157'), 'BPC-157 helps mitigate GI side effects common with triple-receptor agonists.', NULL),
((SELECT id FROM vp_products WHERE slug='retatrutide'), (SELECT id FROM vp_products WHERE slug='cagrilintide'), 'Adding amylin pathway to the triple-agonist creates four-receptor metabolic coverage.', 'Quad Stack'),
((SELECT id FROM vp_products WHERE slug='retatrutide'), (SELECT id FROM vp_products WHERE slug='mots-c'), 'MOTS-C supports metabolic flexibility and exercise performance during aggressive weight management.', NULL),

-- BPC-157 pairs
((SELECT id FROM vp_products WHERE slug='bpc-157'), (SELECT id FROM vp_products WHERE slug='tb500'), 'The classic healing stack — BPC-157 drives local repair via growth factors while TB-500 promotes systemic healing through cell migration. Together they work faster than either alone.', 'Wolverine Stack'),
((SELECT id FROM vp_products WHERE slug='bpc-157'), (SELECT id FROM vp_products WHERE slug='ghk-cu'), 'GHK-Cu adds collagen synthesis and tissue remodeling to BPC-157''s growth factor modulation.', 'Glow Stack'),
((SELECT id FROM vp_products WHERE slug='bpc-157'), (SELECT id FROM vp_products WHERE slug='ipamorelin'), 'Ipamorelin-driven GH pulses amplify BPC-157''s tissue repair by providing anabolic support for healing.', NULL),
((SELECT id FROM vp_products WHERE slug='bpc-157'), (SELECT id FROM vp_products WHERE slug='kpv'), 'KPV''s NF-kB anti-inflammatory action pairs perfectly with BPC-157''s tissue repair for injury recovery.', NULL),

-- TB-500 pairs
((SELECT id FROM vp_products WHERE slug='tb500'), (SELECT id FROM vp_products WHERE slug='bpc-157'), 'BPC-157 + TB-500 is the gold standard healing combination, working through complementary repair pathways.', 'Wolverine Stack'),
((SELECT id FROM vp_products WHERE slug='tb500'), (SELECT id FROM vp_products WHERE slug='ghk-cu'), 'GHK-Cu enhances collagen production and tissue remodeling alongside TB-500''s cell migration effects.', 'Glow Stack'),
((SELECT id FROM vp_products WHERE slug='tb500'), (SELECT id FROM vp_products WHERE slug='mgf'), 'MGF activates satellite cells for muscle repair, complementing TB-500''s broader tissue healing.', NULL),

-- GHK-Cu pairs
((SELECT id FROM vp_products WHERE slug='ghk-cu'), (SELECT id FROM vp_products WHERE slug='epitalon'), 'Epitalon''s telomere extension combined with GHK-Cu''s collagen synthesis creates a comprehensive anti-aging protocol.', 'Longevity Stack'),
((SELECT id FROM vp_products WHERE slug='ghk-cu'), (SELECT id FROM vp_products WHERE slug='snap-8'), 'GHK-Cu rebuilds collagen while Snap-8 reduces expression lines — complementary anti-wrinkle approaches.', 'Anti-Wrinkle Stack'),

-- Growth hormone pairings
((SELECT id FROM vp_products WHERE slug='hgh-191aa'), (SELECT id FROM vp_products WHERE slug='bpc-157'), 'BPC-157 upregulates GH receptors, potentially enhancing HGH effectiveness at target tissues.', NULL),
((SELECT id FROM vp_products WHERE slug='hgh-191aa'), (SELECT id FROM vp_products WHERE slug='igf1-lr3'), 'IGF-1 LR3 adds direct muscle hyperplasia to HGH''s hypertrophy effects for maximum anabolic response.', 'Anabolic Stack'),
((SELECT id FROM vp_products WHERE slug='hgh-191aa'), (SELECT id FROM vp_products WHERE slug='tesamorelin'), 'Tesamorelin''s visceral fat reduction complements HGH''s body composition effects.', NULL),

-- CJC-1295 + Ipamorelin pairs
((SELECT id FROM vp_products WHERE slug='cjc1295-ipamorelin'), (SELECT id FROM vp_products WHERE slug='sermorelin'), 'Adding sermorelin provides additional GHRH stimulation through a slightly different receptor interaction.', 'GH Max Stack'),
((SELECT id FROM vp_products WHERE slug='cjc1295-ipamorelin'), (SELECT id FROM vp_products WHERE slug='bpc-157'), 'BPC-157''s GH receptor upregulation enhances the GH pulse produced by CJC/Ipamorelin.', NULL),
((SELECT id FROM vp_products WHERE slug='cjc1295-ipamorelin'), (SELECT id FROM vp_products WHERE slug='dsip'), 'DSIP improves deep sleep quality when the GH pulse from CJC/Ipamorelin is released (before bed).', 'Sleep & Growth Stack'),

-- Ipamorelin pairs
((SELECT id FROM vp_products WHERE slug='ipamorelin'), (SELECT id FROM vp_products WHERE slug='cjc1295-no-dac'), 'The classic synergistic GH stack: GHRH (CJC) amplifies the GH pulse initiated by GHRP (Ipamorelin).', 'GH Synergy Stack'),
((SELECT id FROM vp_products WHERE slug='ipamorelin'), (SELECT id FROM vp_products WHERE slug='sermorelin'), 'Sermorelin provides an alternative GHRH pairing with ipamorelin for pulsatile GH release.', NULL),

-- Cognitive pairings
((SELECT id FROM vp_products WHERE slug='selank'), (SELECT id FROM vp_products WHERE slug='semax'), 'The Russian nootropic duo: Selank for anxiolysis + Semax for cognitive enhancement and BDNF boost.', 'Russian Nootropic Stack'),
((SELECT id FROM vp_products WHERE slug='selank'), (SELECT id FROM vp_products WHERE slug='dsip'), 'Selank reduces anxiety during the day while DSIP optimizes sleep architecture at night.', NULL),

((SELECT id FROM vp_products WHERE slug='semax'), (SELECT id FROM vp_products WHERE slug='selank'), 'Selank''s anxiolytic effects complement Semax''s stimulating cognitive enhancement.', 'Russian Nootropic Stack'),
((SELECT id FROM vp_products WHERE slug='semax'), (SELECT id FROM vp_products WHERE slug='uridine-choline'), 'Uridine/Choline provides phosphatidylcholine building blocks while Semax drives BDNF-mediated neuroplasticity.', 'Neurogenesis Stack'),

-- Anti-aging pairings
((SELECT id FROM vp_products WHERE slug='epitalon'), (SELECT id FROM vp_products WHERE slug='thymalin'), 'Professor Khavinson''s original longevity protocol: Epitalon for telomere extension + Thymalin for immune rejuvenation. Showed 46% mortality reduction.', 'Khavinson Longevity Stack'),
((SELECT id FROM vp_products WHERE slug='epitalon'), (SELECT id FROM vp_products WHERE slug='foxo4-dri'), 'Epitalon extends telomeres while FOXO4-DRI clears senescent cells — addressing two pillars of aging simultaneously.', 'Anti-Aging Power Stack'),
((SELECT id FROM vp_products WHERE slug='epitalon'), (SELECT id FROM vp_products WHERE slug='nad-plus'), 'NAD+ restores cellular energy production while Epitalon maintains telomere length — foundational anti-aging pair.', 'Cellular Rejuvenation Stack'),
((SELECT id FROM vp_products WHERE slug='epitalon'), (SELECT id FROM vp_products WHERE slug='ss-31'), 'SS-31 repairs mitochondria while Epitalon extends cellular lifespan — targeting aging from the energy and replication angles.', NULL),

((SELECT id FROM vp_products WHERE slug='nad-plus'), (SELECT id FROM vp_products WHERE slug='ss-31'), 'NAD+ fuels sirtuin activation while SS-31 stabilizes mitochondrial membranes — comprehensive mitochondrial restoration.', 'Mitochondrial Stack'),
((SELECT id FROM vp_products WHERE slug='nad-plus'), (SELECT id FROM vp_products WHERE slug='glutathione'), 'NAD+ and glutathione are the two master molecules of cellular defense and energy — supporting both simultaneously is foundational.', NULL),

((SELECT id FROM vp_products WHERE slug='foxo4-dri'), (SELECT id FROM vp_products WHERE slug='thymosin-alpha-1'), 'As FOXO4-DRI clears senescent cells, Thymosin Alpha-1 helps the immune system process and remove cellular debris.', NULL),

-- Sexual health pairings
((SELECT id FROM vp_products WHERE slug='pt-141'), (SELECT id FROM vp_products WHERE slug='melanotan-2'), 'MT-2 activates the same melanocortin receptors with tanning effects, and both enhance sexual arousal through MC4R.', NULL),
((SELECT id FROM vp_products WHERE slug='pt-141'), (SELECT id FROM vp_products WHERE slug='kisspeptin-10'), 'Kisspeptin drives HPG axis activation (testosterone) while PT-141 activates central arousal pathways — complementary mechanisms.', NULL),

((SELECT id FROM vp_products WHERE slug='kisspeptin-10'), (SELECT id FROM vp_products WHERE slug='gonadorelin'), 'Kisspeptin triggers GnRH neurons, Gonadorelin IS GnRH — together they can restart a suppressed HPG axis.', 'HPG Restart Stack'),
((SELECT id FROM vp_products WHERE slug='kisspeptin-10'), (SELECT id FROM vp_products WHERE slug='hcg'), 'Kisspeptin works upstream (hypothalamus) while HCG works downstream (Leydig cells) — full-axis testosterone support.', NULL),

((SELECT id FROM vp_products WHERE slug='hcg'), (SELECT id FROM vp_products WHERE slug='gonadorelin'), 'HCG provides direct Leydig cell stimulation while Gonadorelin maintains pituitary responsiveness.', 'TRT Support Stack'),

-- Immune pairings
((SELECT id FROM vp_products WHERE slug='kpv'), (SELECT id FROM vp_products WHERE slug='bpc-157'), 'KPV''s NF-kB inhibition reduces inflammation while BPC-157 repairs the underlying tissue damage.', NULL),
((SELECT id FROM vp_products WHERE slug='kpv'), (SELECT id FROM vp_products WHERE slug='ll37'), 'KPV handles inflammation while LL-37 provides direct antimicrobial defense — complementary immune support.', 'Immune Shield Stack'),

((SELECT id FROM vp_products WHERE slug='thymosin-alpha-1'), (SELECT id FROM vp_products WHERE slug='thymalin'), 'Synthetic thymic peptide (Tα1) combined with natural thymic extract (Thymalin) for comprehensive T-cell immunity restoration.', 'Thymic Rejuvenation Stack'),
((SELECT id FROM vp_products WHERE slug='thymosin-alpha-1'), (SELECT id FROM vp_products WHERE slug='glutathione'), 'Glutathione supports the oxidative burst capacity of immune cells activated by Thymosin Alpha-1.', NULL),

-- Cosmetic pairings
((SELECT id FROM vp_products WHERE slug='melanotan-2'), (SELECT id FROM vp_products WHERE slug='melanotan-1'), 'MT-1 provides steady melanin building while MT-2 accelerates the tanning process — use MT-2 for loading, MT-1 for maintenance.', 'Tan Protocol Stack'),

((SELECT id FROM vp_products WHERE slug='snap-8'), (SELECT id FROM vp_products WHERE slug='ghk-cu'), 'Snap-8 relaxes expression muscles (wrinkle prevention) while GHK-Cu rebuilds collagen (wrinkle repair).', 'Anti-Wrinkle Stack'),
((SELECT id FROM vp_products WHERE slug='snap-8'), (SELECT id FROM vp_products WHERE slug='hyaluronic-acid'), 'Snap-8 reduces dynamic wrinkles while HA provides volume and hydration for static wrinkle improvement.', NULL),

-- Supply pairings
((SELECT id FROM vp_products WHERE slug='bacteriostatic-water'), (SELECT id FROM vp_products WHERE slug='acetic-acid-water'), 'Keep both diluents on hand — most peptides use BAC water, but IGF-1 LR3 and certain others require acetic acid water.', NULL);

COMMIT;
