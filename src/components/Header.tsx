import { useEffect, useRef } from 'react'
import Icon, { type IconName } from './Icon'
import Wordmark from './Wordmark'
import { siteConfig } from '../data/siteConfig'
import { useCart } from '../lib/cart'
import { whatsappOrderLink } from '../lib/whatsapp'

const WHATSAPP_GREETING = 'Olá! Quero fazer um pedido na Bebidas Moraes!'

const menuLinks: Array<{ href: string; label: string; icon: IconName }> = [
  { href: '#hero', label: 'Início', icon: 'bottle' },
  { href: '#catalogo', label: 'Catálogo', icon: 'search' },
  { href: '#combos', label: 'Combos', icon: 'star' },
  { href: '#entrega', label: 'Entrega', icon: 'truck' },
]

interface HeaderProps {
  onOpenMenu: () => void
}

export default function Header({ onOpenMenu }: HeaderProps) {
  const { count, toggleCart } = useCart()

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 px-margin flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm min-w-0">
          <button
            type="button"
            aria-label="Abrir menu"
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-surface-alt hover:bg-border text-ink active:scale-95 transition-transform"
            onClick={onOpenMenu}
          >
            <Icon name="menu" size={24} />
          </button>
          <div className="flex flex-col gap-1 min-w-0">
            <Wordmark />
            <span className="font-label-sm text-label-sm text-ink-soft hidden xs:block truncate">
              {siteConfig.brand.slogan}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-xs">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-ink-soft">
            <Icon name="clock" size={16} className="text-whatsapp" />
            <span className="font-label-md text-label-md">8h–22h • Todos os dias</span>
          </div>
          <button
            type="button"
            aria-label="Abrir carrinho"
            className="relative w-11 h-11 flex items-center justify-center rounded-lg bg-surface-alt hover:bg-border text-ink active:scale-95 transition-transform"
            onClick={toggleCart}
          >
            <Icon name="cart" size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-accent text-white font-label-sm text-label-sm flex items-center justify-center shadow-sm">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="px-margin pb-2 flex items-center justify-between sm:hidden">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-alt text-ink">
          <Icon name="clock" size={14} className="text-whatsapp" />
          <span className="font-label-sm text-label-sm">8h–22h • Todos os dias</span>
        </span>
        <a
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-whatsapp text-white"
          href={whatsappOrderLink(WHATSAPP_GREETING)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon name="whatsapp" size={14} />
          <span className="font-label-sm text-label-sm">Pedidos pelo WhatsApp</span>
        </a>
      </div>
    </header>
  )
}

interface SideMenuProps {
  open: boolean
  onClose: () => void
}

export function SideMenu({ open, onClose }: SideMenuProps) {
  const menuRef = useRef<HTMLElement>(null)
  const lastActiveElement = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return
    lastActiveElement.current = document.activeElement
    document.body.style.overflow = 'hidden'
    menuRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      const element = lastActiveElement.current
      if (element instanceof HTMLElement && document.contains(element)) element.focus()
    }
  }, [open, onClose])

  return (
    <>
      <div
        className={`fixed inset-0 z-[55] bg-ink/60 backdrop-blur-xs ${open ? '' : 'hidden'}`}
        onClick={onClose}
      ></div>
      <aside
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        tabIndex={-1}
        className={`fixed top-0 left-0 h-full w-72 max-w-[85%] bg-surface z-[60] shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-space-md bg-surface-alt border-b border-border flex items-center justify-between">
          <div className="flex flex-col gap-1 min-w-0">
            <Wordmark />
            <span className="font-label-sm text-label-sm text-ink-soft truncate">
              {siteConfig.brand.legalName}
            </span>
          </div>
          <button
            type="button"
            aria-label="Fechar menu"
            className="w-10 h-10 rounded-full bg-surface hover:bg-border flex items-center justify-center text-ink active:scale-95 transition-transform"
            onClick={onClose}
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <nav aria-label="Menu do site" className="flex flex-col p-space-sm">
          {menuLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-ink hover:bg-surface-alt transition-colors"
              onClick={() => onClose()}
            >
              <Icon name={link.icon} size={20} className="text-primary" />
              <span className="font-label-md text-label-md">{link.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  )
}
