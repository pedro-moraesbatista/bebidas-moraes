import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  catalogItems,
  type CartProduct,
  type Combo,
  type Product,
} from '../data/products'
import { siteConfig } from '../data/siteConfig'

const STORAGE_KEY = 'bebidas-moraes-cart-v1'
const TOAST_VISIBLE_MS = 2200

export interface CartItem {
  product: CartProduct
  qty: number
}

export interface CartContextValue {
  items: CartItem[]
  add: (item: Product | Combo) => void
  remove: (id: string) => void
  changeQty: (id: string, delta: number) => void
  subtotal: number
  fee: number
  total: number
  count: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  toast: string
  showToast: (message: string) => void
}

const catalogById = new Map(catalogItems.map((product) => [product.id, product]))

function loadQuantities(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    const quantities: Record<string, number> = {}
    for (const [id, qty] of Object.entries(parsed)) {
      if (typeof qty === 'number' && Number.isInteger(qty) && qty > 0) {
        quantities[id] = qty
      }
    }
    return quantities
  } catch {
    return {}
  }
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantities, setQuantities] = useState<Record<string, number>>(loadQuantities)
  const [isOpen, setIsOpen] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities))
    } catch {
      // storage pode estar indisponível (modo privado); o carrinho funciona só em memória
    }
  }, [quantities])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), TOAST_VISIBLE_MS)
  }, [])

  const add = useCallback(
    (item: Product | Combo) => {
      setQuantities((prev) => ({ ...prev, [item.id]: (prev[item.id] ?? 0) + 1 }))
      showToast(`Adicionado: ${item.name}`)
    },
    [showToast],
  )

  const remove = useCallback((id: string) => {
    setQuantities((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const changeQty = useCallback((id: string, delta: number) => {
    setQuantities((prev) => {
      const next = (prev[id] ?? 0) + delta
      if (next <= 0) {
        const rest = { ...prev }
        delete rest[id]
        return rest
      }
      return { ...prev, [id]: next }
    })
  }, [])

  const items = useMemo<CartItem[]>(
    () =>
      Object.entries(quantities).flatMap(([id, qty]) => {
        const product = catalogById.get(id)
        return product ? [{ product, qty }] : []
      }),
    [quantities],
  )

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.product.price * item.qty, 0),
    [items],
  )

  const fee =
    items.length === 0 || subtotal >= siteConfig.delivery.freeAbove ? 0 : siteConfig.delivery.fee

  const count = useMemo(() => items.reduce((acc, item) => acc + item.qty, 0), [items])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((open) => !open), [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      add,
      remove,
      changeQty,
      subtotal,
      fee,
      total: subtotal + fee,
      count,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      toast,
      showToast,
    }),
    [items, add, remove, changeQty, subtotal, fee, count, isOpen, openCart, closeCart, toggleCart, toast, showToast],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider')
  }
  return context
}
