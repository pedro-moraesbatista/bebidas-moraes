import Icon, { type IconName } from './Icon'
import { useCart } from '../lib/cart'
import { whatsappOrderLink } from '../lib/whatsapp'

interface BottomNavItem {
  id: string
  label: string
  icon: IconName
  href?: string
  external?: boolean
}

const navItems: BottomNavItem[] = [
  { id: 'inicio', label: 'Início', icon: 'bottle', href: '#hero' },
  { id: 'busca', label: 'Busca', icon: 'search', href: '#catalogo' },
  { id: 'combos', label: 'Combos', icon: 'bottle', href: '#combos' },
  { id: 'pedido', label: 'Pedido', icon: 'cart' },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'whatsapp',
    href: whatsappOrderLink('Olá! Quero fazer um pedido na Bebidas Moraes!'),
    external: true,
  },
]

export default function BottomNav() {
  const { openCart } = useCart()

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 w-full z-50 pb-safe bg-surface/95 backdrop-blur-xl border-t border-border shadow-[0_-2px_12px_rgba(0,0,0,0.04)]"
    >
      <div className="flex justify-around items-center h-16 px-space-xs">
        {navItems.map((item) => {
          const className =
            'flex flex-col items-center justify-center gap-1 w-14 h-12 text-ink-soft hover:text-ink transition-colors'

          if (!item.href) {
            return (
              <button key={item.id} type="button" className={className} onClick={openCart}>
                <Icon name={item.icon} size={24} />
                <span className="font-label-sm text-label-sm">{item.label}</span>
              </button>
            )
          }

          return (
            <a
              key={item.id}
              className={className}
              href={item.href}
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <Icon name={item.icon} size={24} />
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
