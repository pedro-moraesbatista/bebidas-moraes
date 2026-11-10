import { useCallback, useState } from 'react'
import BottomNav from './components/BottomNav'
import CartDrawer from './components/CartDrawer'
import Catalog from './components/Catalog'
import CombosSection from './components/CombosSection'
import ComboHighlight from './components/ComboHighlight'
import DeliverySection from './components/DeliverySection'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import SplashOverlay from './components/SplashOverlay'
import Storytelling from './components/Storytelling'
import WhatsAppFab from './components/WhatsAppFab'
import { CartProvider, useCart } from './lib/cart'

export default function App() {
  const [splashOpen, setSplashOpen] = useState(true)
  const [splashSession, setSplashSession] = useState(0)

  const closeSplash = useCallback(() => setSplashOpen(false), [])
  const replaySplash = useCallback(() => {
    setSplashSession((session) => session + 1)
    setSplashOpen(true)
  }, [])

  return (
    <CartProvider>
      <SplashOverlay key={splashSession} open={splashOpen} onClose={closeSplash} />
      <Header />
      <main className="flex flex-col relative w-full pt-20 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full relative overflow-x-hidden">
          <Hero onReplay={replaySplash} />
          <ComboHighlight />
          <Storytelling />
          <Catalog />
          <CombosSection />
          <DeliverySection />
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFab />
      <BottomNav />
      <CartToast />
    </CartProvider>
  )
}

function CartToast() {
  const { toast } = useCart()

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md shadow-lg flex items-center gap-2 pointer-events-none transition-all duration-300 ${
        toast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <span className="material-symbols-outlined text-[18px] text-secondary-container">check_circle</span>
      <span>{toast || 'Bebida colocada no gelo!'}</span>
    </div>
  )
}
