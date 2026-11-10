import { useEffect, useState } from 'react'
import { siteConfig } from '../data/siteConfig'
import { useCart } from '../lib/cart'

const menuLinks = [
  { href: '#hero', label: 'Início', icon: 'home' },
  { href: '#combo-destaque', label: 'Combo Destaque', icon: 'star' },
  { href: '#catalogo', label: 'Cardápio', icon: 'menu_book' },
  { href: '#combos', label: 'Combos', icon: 'local_fire_department' },
  { href: '#entrega', label: 'Delivery', icon: 'sports_bar' },
]

export default function Header() {
  const { count, toggleCart, showToast } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <>
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 px-margin flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <button
              type="button"
              aria-label="Abrir Menu do Bar"
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface active:scale-95 transition-transform"
              onClick={() => setMenuOpen(true)}
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <div className="flex items-center gap-2">
              <img alt="devBeer Logo" className="h-8 w-auto object-contain" src="/logo.jpg" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none">{siteConfig.brand.name}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{siteConfig.brand.tagline}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <span className="material-symbols-outlined text-[16px] animate-pulse">bolt</span>
              <span className="font-label-sm text-label-sm">{siteConfig.delivery.etaLabel}</span>
            </div>
            <button
              type="button"
              aria-label="Abrir carrinho"
              className="relative w-11 h-11 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface active:scale-95 transition-transform"
              onClick={toggleCart}
            >
              <span className="material-symbols-outlined text-[22px]">sports_bar</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm flex items-center justify-center shadow-sm">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              aria-label="Área do cliente"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
              onClick={() => showToast('Área do cliente em breve!')}
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </button>
          </div>
        </div>
        <div className="px-margin pb-2 flex items-center justify-between sm:hidden">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined text-[14px] text-secondary">moped</span>
            <span className="font-label-sm text-label-sm">
              Entrega em Springfield: <strong>{siteConfig.delivery.etaLabel}</strong>
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-bold">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>TORNEIRAS ABERTAS
          </span>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[55] bg-inverse-surface/60 backdrop-blur-xs ${menuOpen ? '' : 'hidden'}`}
        onClick={() => setMenuOpen(false)}
      ></div>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu do Bar"
        inert={!menuOpen}
        className={`fixed top-0 left-0 h-full w-72 max-w-[85%] bg-surface z-[60] shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-space-md bg-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img alt="devBeer Logo" className="h-8 w-auto object-contain" src="/logo.jpg" />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none">{siteConfig.brand.name}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{siteConfig.brand.tagline}</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Fechar Menu do Bar"
            className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface active:scale-95 transition-transform"
            onClick={() => setMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <nav className="flex flex-col p-space-sm">
          {menuLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px] text-primary">{link.icon}</span>
              <span className="font-label-md text-label-md">{link.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  )
}
