import { useCart } from '../lib/cart'

interface BottomNavItem {
  id: string
  label: string
  icon: string
  href?: string
}

const navItems: BottomNavItem[] = [
  { id: 'taverna', label: 'Taverna', icon: 'liquor', href: '#hero' },
  { id: 'chopes', label: 'Chopes', icon: 'local_drink', href: '#catalogo' },
  { id: 'combos', label: 'Combos', icon: 'local_fire_department', href: '#combos' },
  { id: 'pedidos', label: 'Pedidos', icon: 'receipt_long' },
  { id: 'fidelidade', label: 'Fidelidade', icon: 'stars', href: '#storytelling' },
]

export default function BottomNav() {
  const { openCart } = useCart()

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-space-xs">
        {navItems.map((item) =>
          item.href ? (
            <a
              key={item.id}
              className="flex flex-col items-center justify-center gap-1 w-14 h-12 text-on-surface-variant hover:text-on-surface transition-colors"
              href={item.href}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[24px]">{item.icon}</span>
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </a>
          ) : (
            <button
              key={item.id}
              type="button"
              className="flex flex-col items-center justify-center gap-1 w-14 h-12 text-on-surface-variant hover:text-on-surface transition-colors"
              onClick={openCart}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[24px]">{item.icon}</span>
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </button>
          ),
        )}
      </div>
    </nav>
  )
}
