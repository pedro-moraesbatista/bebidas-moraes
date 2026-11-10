import { useEffect, useState } from 'react'
import { siteConfig } from '../data/siteConfig'
import { prefersReducedMotion } from '../lib/reduced-motion'

interface SplashOverlayProps {
  open: boolean
  onClose: () => void
}

const AUTO_CLOSE_MS = 2300
const PROGRESS_START_DELAY_MS = 50
const CLOSE_ANIMATION_MS = 700

export default function SplashOverlay({ open, onClose }: SplashOverlayProps) {
  const [reducedMotion] = useState(prefersReducedMotion)
  const [hidden, setHidden] = useState(() => reducedMotion || !open)
  const [progressOn, setProgressOn] = useState(false)

  useEffect(() => {
    if (!open || reducedMotion) {
      if (open && reducedMotion) onClose()
      return
    }
    const progressTimer = window.setTimeout(() => setProgressOn(true), PROGRESS_START_DELAY_MS)
    const autoCloseTimer = window.setTimeout(onClose, AUTO_CLOSE_MS)
    return () => {
      window.clearTimeout(progressTimer)
      window.clearTimeout(autoCloseTimer)
    }
  }, [open, reducedMotion, onClose])

  useEffect(() => {
    if (open || hidden) return
    const hideTimer = window.setTimeout(() => setHidden(true), CLOSE_ANIMATION_MS)
    return () => window.clearTimeout(hideTimer)
  }, [open, hidden])

  if (reducedMotion || hidden) return null

  return (
    <aside
      aria-label="Animação de Abertura devBeer"
      id="splash-screen"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 select-none overflow-hidden transition-all duration-700 bg-gradient-to-b from-[#2a1705] via-[#4a1c0d] to-[#1a0802] ${
        !open ? 'opacity-0 pointer-events-none -translate-y-8' : ''
      }`}
    >
      {/* Ambient Light & Golden Vignette Rings */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,_#fed80c_0%,_transparent_70%)]"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/30 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>

      {/* Floating Beer Bubbles Canvas Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" id="splash-bubbles">
        <div className="beer-bubble w-3 h-3" style={{ left: '10%', animationDuration: '4.2s', animationDelay: '0.1s' }}></div>
        <div className="beer-bubble w-5 h-5" style={{ left: '25%', animationDuration: '3.5s', animationDelay: '0.6s' }}></div>
        <div className="beer-bubble w-2 h-2" style={{ left: '45%', animationDuration: '5.1s', animationDelay: '0.2s' }}></div>
        <div className="beer-bubble w-4 h-4" style={{ left: '65%', animationDuration: '3.8s', animationDelay: '0.8s' }}></div>
        <div className="beer-bubble w-6 h-6" style={{ left: '80%', animationDuration: '4.6s', animationDelay: '0.3s' }}></div>
        <div className="beer-bubble w-3 h-3" style={{ left: '90%', animationDuration: '3.2s', animationDelay: '0.9s' }}></div>
      </div>

      {/* Skip Splash Button (Top Bar) */}
      <div className="relative z-20 w-full flex items-center justify-between pt-safe">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/10 backdrop-blur-md border border-white/10 text-white/90">
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary-container animate-pulse">local_bar</span>
          <span className="font-label-sm text-label-sm tracking-wider uppercase">{siteConfig.brand.subtitle}</span>
        </div>
        <button
          type="button"
          className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white font-label-md text-label-md flex items-center gap-1.5 backdrop-blur-md border border-white/20 shadow-md transition-all"
          onClick={onClose}
        >
          <span>Pular</span>
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">fast_forward</span>
        </button>
      </div>

      {/* Central Cinematic Toast Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-sm">
        {/* Shockwave expanding rings */}
        <div className="absolute w-44 h-44 rounded-full border-4 border-secondary-container/80 animate-shockwave pointer-events-none" id="splash-shockwave"></div>
        <div className="absolute w-60 h-60 rounded-full border-2 border-primary/50 animate-shockwave pointer-events-none" id="splash-shockwave-2" style={{ animationDelay: '0.08s' }}></div>

        {/* Splash droplets burst layer */}
        <div className="absolute z-40 animate-splash pointer-events-none flex items-center justify-center" id="splash-drops">
          <div className="absolute -top-16 -left-12 w-4 h-4 rounded-full bg-secondary-fixed shadow-[0_0_8px_#ffe166] transform -rotate-12"></div>
          <div className="absolute -top-20 left-0 w-5 h-6 rounded-full bg-white shadow-sm"></div>
          <div className="absolute -top-14 right-10 w-4 h-5 rounded-full bg-secondary-container shadow-[0_0_8px_#fed80c]"></div>
          <div className="absolute -top-8 -right-14 w-3 h-3 rounded-full bg-white"></div>
          <div className="absolute -top-24 left-6 w-3 h-4 rounded-full bg-secondary-fixed"></div>
          <div className="absolute -top-10 -left-16 w-3 h-3 rounded-full bg-secondary-container"></div>
        </div>

        {/* Comic Pop Badge "CLINK!" */}
        <div className="absolute z-50 animate-clink-pop -top-12 flex flex-col items-center pointer-events-none" id="splash-clink-badge">
          <div className="relative px-5 py-2 rounded-2xl bg-secondary-container text-on-secondary-container border-4 border-surface shadow-[0_8px_24px_rgba(0,0,0,0.4)] transform rotate-[-4deg]">
            <span className="font-headline-lg text-headline-lg tracking-wider font-black flex items-center gap-1.5 text-on-secondary-container">
              💥 CLINK! 🍻
            </span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary-container border-r-4 border-b-4 border-surface transform rotate-45"></div>
          </div>
        </div>

        {/* The Two Clinking Steins Animation Stage */}
        <div className="relative w-full h-56 flex items-center justify-center overflow-visible">
          {/* LEFT STEIN (Duff Red / Gold) */}
          <div className="absolute animate-mug-left origin-bottom-right" id="left-stein">
            <div className="relative w-24 h-36 bg-gradient-to-br from-secondary-container via-[#f3c200] to-secondary rounded-b-2xl rounded-t-sm border-4 border-[#1b1c1c] shadow-[4px_6px_0px_#000000] flex flex-col justify-between overflow-visible">
              <div className="absolute -top-6 -left-3 -right-3 h-10 bg-white rounded-full border-4 border-[#1b1c1c] shadow-sm flex items-center justify-around px-2 z-20">
                <span className="w-5 h-6 rounded-full bg-white -mt-3 border-t-2 border-[#1b1c1c]"></span>
                <span className="w-7 h-8 rounded-full bg-white -mt-4 border-t-2 border-[#1b1c1c]"></span>
                <span className="w-6 h-6 rounded-full bg-white -mt-2 border-t-2 border-[#1b1c1c]"></span>
              </div>
              <div className="absolute top-3 right-1 w-2.5 h-8 bg-white rounded-b-full border-r-2 border-b-2 border-[#1b1c1c] z-20"></div>
              <div className="w-full h-full pt-6 px-2 flex flex-col items-center justify-center relative">
                <div className="w-12 h-12 rounded-full bg-primary border-2 border-white/60 flex items-center justify-center shadow-inner">
                  <span className="font-headline-sm text-headline-sm text-white font-black tracking-tighter">dev</span>
                </div>
                <div className="absolute inset-x-2 bottom-3 flex justify-between opacity-30 pointer-events-none">
                  <span className="w-1 h-14 bg-white rounded-full"></span>
                  <span className="w-1 h-14 bg-black rounded-full"></span>
                  <span className="w-1 h-14 bg-white rounded-full"></span>
                </div>
              </div>
              <div className="absolute -left-6 top-8 w-6 h-18 rounded-l-2xl border-4 border-r-0 border-[#1b1c1c] bg-transparent shadow-[-2px_2px_0px_rgba(0,0,0,0.3)]"></div>
            </div>
          </div>

          {/* RIGHT STEIN (Craft Dark Amber / Tavern) */}
          <div className="absolute animate-mug-right origin-bottom-left" id="right-stein">
            <div className="relative w-24 h-36 bg-gradient-to-bl from-primary-container via-primary to-[#78000c] rounded-b-2xl rounded-t-sm border-4 border-[#1b1c1c] shadow-[-4px_6px_0px_#000000] flex flex-col justify-between overflow-visible">
              <div className="absolute -top-6 -left-3 -right-3 h-10 bg-white rounded-full border-4 border-[#1b1c1c] shadow-sm flex items-center justify-around px-2 z-20">
                <span className="w-6 h-7 rounded-full bg-white -mt-3 border-t-2 border-[#1b1c1c]"></span>
                <span className="w-8 h-9 rounded-full bg-white -mt-4 border-t-2 border-[#1b1c1c]"></span>
                <span className="w-5 h-6 rounded-full bg-white -mt-2 border-t-2 border-[#1b1c1c]"></span>
              </div>
              <div className="absolute top-4 left-1 w-2.5 h-7 bg-white rounded-b-full border-l-2 border-b-2 border-[#1b1c1c] z-20"></div>
              <div className="w-full h-full pt-6 px-2 flex flex-col items-center justify-center relative">
                <div className="w-12 h-12 rounded-full bg-secondary-container border-2 border-[#1b1c1c] flex items-center justify-center shadow-inner">
                  <span className="font-headline-sm text-headline-sm text-on-secondary-container font-black">Beer</span>
                </div>
                <div className="absolute inset-x-2 bottom-3 flex justify-between opacity-30 pointer-events-none">
                  <span className="w-1 h-14 bg-white rounded-full"></span>
                  <span className="w-1 h-14 bg-black rounded-full"></span>
                  <span className="w-1 h-14 bg-white rounded-full"></span>
                </div>
              </div>
              <div className="absolute -right-6 top-8 w-6 h-18 rounded-r-2xl border-4 border-l-0 border-[#1b1c1c] bg-transparent shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"></div>
            </div>
          </div>
        </div>

        {/* Branding & Catchphrase Reveal */}
        <div className="mt-4 flex flex-col items-center text-center gap-1">
          <div className="flex items-center gap-2">
            <img alt="devBeer Logo" className="h-10 w-auto object-contain drop-shadow-md" src="/logo.jpg" />
            <span className="font-headline-lg text-headline-lg text-white font-black tracking-tight drop-shadow-md">{siteConfig.brand.name}</span>
          </div>
          <p className="font-body-md text-body-md text-[#fed80c] font-semibold">Taverna aberta & chope trincando de gelado!</p>
        </div>
      </div>

      {/* Bottom Status / Auto-enter note */}
      <div className="relative z-20 pb-safe w-full flex flex-col items-center gap-2">
        <div className="w-36 h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full bg-secondary-container transition-all duration-[2200ms] ease-linear w-0"
            id="splash-progress"
            style={progressOn ? { width: '100%' } : undefined}
          ></div>
        </div>
        <span className="font-label-sm text-label-sm text-white/70">Carregando o depósito...</span>
      </div>
    </aside>
  )
}
