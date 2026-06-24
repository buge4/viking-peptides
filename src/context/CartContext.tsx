import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { products, categories, type Product, type Category } from '../data/products'

export interface CartItem {
  productSlug: string
  specLabel: string
  quantity: number
  unitPrice: number
}

export interface DiscountTier {
  minQty: number
  pct: number
  label: string
}

const DISCOUNT_TIERS: DiscountTier[] = [
  { minQty: 3, pct: 5, label: 'Buy 3+ items, save 5%' },
  { minQty: 5, pct: 10, label: 'Buy 5+ items, save 10%' },
  { minQty: 10, pct: 20, label: 'Buy 10+ items, save 20%' },
]

// Prices per spec (PNGWIN) — mirrors the DB seed data
const SPEC_PRICES: Record<string, Record<string, number>> = {
  semaglutide: { '5mg': 29900, '10mg': 49900, '15mg': 69900, '20mg': 89900, '30mg': 119900, '80mg': 279900 },
  tirzepatide: { '10mg': 54900, '15mg': 74900, '20mg': 94900, '30mg': 129900, '40mg': 164900, '50mg': 194900, '60mg': 224900, '80mg': 289900, '120mg': 399900 },
  retatrutide: { '5mg': 39900, '10mg': 69900, '20mg': 119900, '30mg': 169900, '40mg': 209900, '60mg': 299900, '80mg': 379900, '100mg': 449900 },
  cagrilintide: { '5mg': 39900, '10mg': 69900 },
  'retatrutide-cagrilintide': { '10mg (5mg + 5mg)': 79900 },
  'cagrilintide-semaglutide': { '10mg (5mg + 5mg)': 69900 },
  aod9604: { '2mg': 19900, '5mg': 34900, '10mg': 54900 },
  '5-amino-1mq': { '10mg x 10 vials': 89900 },
  'mots-c': { '10mg': 49900, '40mg': 149900 },
  'l-carnitine': { '600mg x 10ml': 24900 },
  'lipo-c': { '10ml': 29900 },
  maritide: { '1g (bulk)': 1999900 },
  vk2735: { '1g (bulk)': 1499900 },
  eloralintide: { '10g (bulk)': 4999900 },
  petrelintide: { '1g (bulk)': 1299900 },
  'mk-0616': { '100g (bulk)': 9999900 },
  'hgh-191aa': { '10iu': 29900, '16iu': 44900, '24iu': 59900, '36iu': 79900 },
  'cjc1295-dac': { '5mg': 34900, '10mg': 59900 },
  'cjc1295-no-dac': { '5mg': 29900, '10mg': 49900 },
  'cjc1295-ipamorelin': { '10mg (5mg + 5mg)': 54900, '20mg (10mg + 10mg)': 94900 },
  ipamorelin: { '5mg': 24900, '10mg': 39900 },
  ghrp2: { '5mg': 19900, '10mg': 34900 },
  ghrp6: { '5mg': 19900, '10mg': 34900 },
  hexarelin: { '2mg': 19900, '5mg': 34900 },
  'igf1-lr3': { '0.1mg': 29900, '1mg': 89900 },
  sermorelin: { '5mg': 29900, '10mg': 49900 },
  tesamorelin: { '5mg': 39900, '10mg': 69900 },
  'ace-031': { '10mg': 149900 },
  'bpc-157': { '5mg': 29900, '10mg': 49900 },
  tb500: { '5mg': 34900, '10mg': 59900 },
  'bpc157-tb500-high': { '20mg (10mg + 10mg)': 99900 },
  'bpc157-tb500-standard': { '10mg (5mg + 5mg)': 54900 },
  'glow-blend': { '70mg (10mg + 10mg + 50mg)': 139900 },
  'klow-blend': { '80mg (10mg + 10mg + 50mg + 10mg)': 169900 },
  'ghk-cu': { '50mg': 39900, '100mg': 69900 },
  mgf: { '2mg': 29900 },
  'peg-mgf': { '2mg': 34900 },
  'ara-290': { '10mg': 59900 },
  selank: { '5mg': 29900, '10mg': 49900 },
  semax: { '5mg': 29900, '10mg': 49900 },
  dsip: { '5mg': 24900, '10mg': 39900, '15mg': 54900 },
  'uridine-choline': { '100mg': 19900, '500mg': 49900 },
  melatonin: { '10mg': 14900 },
  oxytocin: { '2mg': 24900, '5mg': 44900 },
  epitalon: { '10mg': 39900, '50mg': 149900 },
  'foxo4-dri': { '10mg': 299900 },
  'nad-plus': { '1000mg': 89900 },
  'ss-31': { '10mg': 69900, '50mg': 249900 },
  thymalin: { '10mg': 39900 },
  'thymosin-alpha-1': { '5mg': 34900, '10mg': 59900 },
  'pt-141': { '10mg': 34900 },
  'kisspeptin-10': { '5mg': 29900, '10mg': 49900 },
  gonadorelin: { '2mg': 19900 },
  hcg: { '5000iu': 34900, '10000iu': 59900 },
  hmg: { '75iu': 29900 },
  papaverine: { 'Trimix injection': 49900 },
  kpv: { '10mg': 34900 },
  ll37: { '5mg': 39900 },
  vip: { '10mg': 49900 },
  'pnc-27': { '5mg': 59900, '10mg': 99900 },
  glutathione: { '600mg': 24900, '1500mg': 44900 },
  'melanotan-1': { '10mg': 34900 },
  'melanotan-2': { '10mg': 24900 },
  'snap-8': { '10mg': 29900 },
  'botulinum-toxin': { '100iu': 199900 },
  'hyaluronic-acid': { '5mg/vial': 29900 },
  'bacteriostatic-water': { '3ml x 10': 14900, '10ml x 10': 24900 },
  'acetic-acid-water': { '3ml x 10': 16900 },
}

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface CartContextType {
  items: CartItem[]
  addItem: (productSlug: string, specLabel: string) => void
  removeItem: (productSlug: string, specLabel: string) => void
  updateQuantity: (productSlug: string, specLabel: string, qty: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  discount: DiscountTier | null
  discountAmount: number
  total: number
  nextTier: DiscountTier | null
  getPrice: (productSlug: string, specLabel: string) => number
  getProductBySlug: (slug: string) => Product | undefined
  getCategoryBySlug: (slug: string) => { id: Category; name: string; tagline: string; icon: string } | undefined
  discountTiers: DiscountTier[]
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const getPrice = useCallback((productSlug: string, specLabel: string): number => {
    return SPEC_PRICES[productSlug]?.[specLabel] ?? 0
  }, [])

  const addItem = useCallback((productSlug: string, specLabel: string) => {
    const price = getPrice(productSlug, specLabel)
    setItems(prev => {
      const existing = prev.find(i => i.productSlug === productSlug && i.specLabel === specLabel)
      if (existing) {
        return prev.map(i =>
          i.productSlug === productSlug && i.specLabel === specLabel
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { productSlug, specLabel, quantity: 1, unitPrice: price }]
    })
  }, [getPrice])

  const removeItem = useCallback((productSlug: string, specLabel: string) => {
    setItems(prev => prev.filter(i => !(i.productSlug === productSlug && i.specLabel === specLabel)))
  }, [])

  const updateQuantity = useCallback((productSlug: string, specLabel: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productSlug, specLabel)
      return
    }
    setItems(prev => prev.map(i =>
      i.productSlug === productSlug && i.specLabel === specLabel ? { ...i, quantity: qty } : i
    ))
  }, [removeItem])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  const discount = DISCOUNT_TIERS.slice().reverse().find(t => totalItems >= t.minQty) ?? null
  const discountAmount = discount ? Math.floor(subtotal * discount.pct / 100) : 0
  const total = subtotal - discountAmount

  const nextTier = DISCOUNT_TIERS.find(t => totalItems < t.minQty) ?? null

  const getProductBySlug = useCallback((slug: string) => {
    return products.find(p => slugify(p.name) === slug)
  }, [])

  const getCategoryBySlug = useCallback((slug: string) => {
    return categories.find(c => c.id === slug)
  }, [])

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, subtotal, discount, discountAmount, total, nextTier,
      getPrice, getProductBySlug, getCategoryBySlug, discountTiers: DISCOUNT_TIERS,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
