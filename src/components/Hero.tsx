import { useState } from 'react'
import { siteConfig } from '../data/siteConfig'
import { prefersReducedMotion } from '../lib/reduced-motion'
import { whatsappOrderLink } from '../lib/whatsapp'

interface HeroProps {
  onReplay: () => void
}

export default function Hero({ onReplay }: HeroProps) {
  const [reducedMotion] = useState(prefersReducedMotion)
  return (
    <section
      className="relative w-full px-margin pt-4 pb-8 overflow-hidden bg-gradient-to-b from-secondary-container/20 via-surface-container-low to-surface"
      id="hero"
    >
      {/* Bubble floating particles layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-3 h-3 rounded-full bg-secondary-fixed/40 animate-bounce" style={{ left: '15%', top: '20%', animationDuration: '3.2s' }}></div>
        <div className="absolute w-2 h-2 rounded-full bg-secondary-fixed/50 animate-bounce" style={{ left: '80%', top: '35%', animationDuration: '2.4s' }}></div>
        <div className="absolute w-4 h-4 rounded-full bg-secondary-fixed/30 animate-pulse" style={{ left: '60%', top: '60%' }}></div>
        <div className="absolute w-2.5 h-2.5 rounded-full bg-primary-fixed/40 animate-bounce" style={{ left: '25%', top: '75%', animationDuration: '3.8s' }}></div>
      </div>

      {/* Animated Clinking Beer Mugs Banner */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* Vintage Springfield Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary shadow-sm transform -rotate-1 active:rotate-0 transition-transform">
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] animate-spin" style={{ animationDuration: '8s' }}>stars</span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider">O Sabor Lendário de Springfield</span>
        </div>

        {/* Animated Clinking Beer Mugs Banner */}
        <button
          type="button"
          className="relative w-full h-36 my-2 flex items-center justify-center overflow-visible select-none cursor-pointer"
          onClick={onReplay}
          title="Clique para rever o brinde!"
        >
          {/* Golden Splash explosion circle behind */}
          <div className="absolute w-28 h-28 rounded-full bg-secondary-container/70 filter blur-md transform scale-125 transition-all duration-700 animate-pulse" id="splash-effect"></div>

          {/* Left Stein (slides in from left to center) */}
          <div
            className="absolute left-1/2 -translate-x-20 z-10 transition-transform duration-500 hover:scale-105 active:-translate-x-14"
            style={{ filter: 'drop-shadow(3px 3px 0px #1b1c1c)' }}
          >
            <div className="relative w-16 h-20 bg-secondary-container rounded-b-xl rounded-t-sm flex flex-col items-center justify-end overflow-visible">
              <div className="absolute -top-3 w-18 -left-1 -right-1 h-5 bg-surface-container-lowest rounded-full shadow-sm flex items-center justify-around px-1">
                <span className="w-3 h-3 rounded-full bg-surface-container-lowest -mt-1"></span>
                <span className="w-4 h-4 rounded-full bg-surface-container-lowest -mt-2"></span>
                <span className="w-3 h-3 rounded-full bg-surface-container-lowest -mt-1"></span>
              </div>
              <div className="w-full h-14 bg-secondary flex items-center justify-center">
                <span className="font-headline-sm text-headline-sm text-surface-container-lowest opacity-90 font-black">D</span>
              </div>
              <div className="absolute -left-3 top-4 w-4 h-10 rounded-l-lg bg-transparent shadow-[inset_4px_0_0_0_#eae7e7]"></div>
            </div>
          </div>

          {/* Clink Flash Word */}
          <div className="relative z-30 px-3 py-1 rounded-md bg-secondary-container text-on-secondary-container shadow-md transform rotate-3 animate-pulse">
            <span className="font-headline-md text-headline-md tracking-wider">CLINK!</span>
          </div>

          {/* Right Stein (slides in from right to center) */}
          <div
            className="absolute left-1/2 translate-x-4 z-10 transition-transform duration-500 hover:scale-105 active:translate-x-0"
            style={{ filter: 'drop-shadow(3px 3px 0px #1b1c1c)' }}
          >
            <div className="relative w-16 h-20 bg-secondary-container rounded-b-xl rounded-t-sm flex flex-col items-center justify-end overflow-visible">
              <div className="absolute -top-3 w-18 -left-1 -right-1 h-5 bg-surface-container-lowest rounded-full shadow-sm flex items-center justify-around px-1">
                <span className="w-3 h-3 rounded-full bg-surface-container-lowest -mt-1"></span>
                <span className="w-4 h-4 rounded-full bg-surface-container-lowest -mt-2"></span>
                <span className="w-3 h-3 rounded-full bg-surface-container-lowest -mt-1"></span>
              </div>
              <div className="w-full h-14 bg-primary-container flex items-center justify-center">
                <span className="font-headline-sm text-headline-sm text-on-primary font-black">dev</span>
              </div>
              <div className="absolute -right-3 top-4 w-4 h-10 rounded-r-lg bg-transparent shadow-[inset_-4px_0_0_0_#eae7e7]"></div>
            </div>
          </div>
        </button>

        {/* Replay Toast Button */}
        {!reducedMotion && (
          <button
            type="button"
            className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest hover:bg-surface-variant text-on-surface border border-outline-variant/60 shadow-xs active:scale-95 transition-all text-xs font-label-md"
            onClick={onReplay}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">replay</span>
            <span>🍻 Rever Brinde de Abertura</span>
          </button>
        )}

        {/* Main Catchphrase Title */}
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase tracking-tight mt-1 mb-2">
          SE A VIDA TE DER LIMÕES,
          <br />
          <span className="text-primary-container underline decoration-secondary-container decoration-4 underline-offset-4">PEÇA UMA DUFF!</span>
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-5">
          Seu depósito de bebidas favorito de Springfield chegou para deixar qualquer rodada de chope muito mais
          divertida e trincando de gelada.
        </p>

        {/* Dual Call to Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-space-sm items-stretch">
          <a
            className="flex-1 py-3 px-4 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            href="#catalogo"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">sports_bar</span>
            <span>Explorar Bebidas</span>
          </a>
          <a
            className="flex-1 py-3 px-4 rounded-lg bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            href={whatsappOrderLink('Olá Moe! Vim pelo app devBeer e quero abastecer a geladeira!')}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-tertiary">chat</span>
            <span>Pedir no WhatsApp</span>
          </a>
        </div>

        {/* Responsible drinking warning */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-on-surface-variant/80">
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-error">warning</span>
          <span className="font-label-sm text-label-sm">{siteConfig.legal.plus18}</span>
        </div>
      </div>
    </section>
  )
}
