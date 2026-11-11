import { useCallback, useState } from 'react'
import BottomNav from './components/BottomNav'
import CartDrawer from './components/CartDrawer'
import Catalog from './components/Catalog'
import CombosSection from './components/CombosSection'
import ComboHighlight from './components/ComboHighlight'
import ComoFunciona from './components/ComoFunciona'
import DeliverySection from './components/DeliverySection'
import Footer from './components/Footer'
import Header, { SideMenu } from './components/Header'
import Hero from './components/Hero'
import Icon from './components/Icon'
import WhatsAppFab from './components/WhatsAppFab'
import { CartProvider, useCart } from './lib/cart'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <CartProvider>
      <AppShell menuOpen={menuOpen} onOpenMenu={openMenu} />
      <SideMenu open={menuOpen} onClose={closeMenu} />
      <CartDrawer />
      <WhatsAppFab />
      <BottomNav />
      <CartToast />
    </CartProvider>
  )
}

interface AppShellProps {
  menuOpen: boolean
  onOpenMenu: () => void
}

function AppShell({ menuOpen, onOpenMenu }: AppShellProps) {
  const { isOpen: cartOpen } = useCart()

  return (
    <div id="app-shell" inert={cartOpen || menuOpen}>
      <Header onOpenMenu={onOpenMenu} />
      <main className="flex flex-col relative w-full pt-20 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full relative overflow-x-hidden">
          <Hero />
          <ComboHighlight />
          <ComoFunciona />
          <Catalog />
          <CombosSection />
          <DeliverySection />
        </div>
      </main>
      <Footer />
    </div>
  )
}

function CartToast() {
  const { toast } = useCart()

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-ink text-white font-label-md text-label-md shadow-lg flex items-center gap-2 pointer-events-none transition-all duration-300 ${
        toast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <Icon className="text-whatsapp" name="check" size={18} />
      <span>{toast}</span>
    </div>
  )
}
