import { useCallback, useEffect, useState } from 'react'
import Wordmark from './Wordmark'
import { siteConfig } from '../data/siteConfig'
import { prefersReducedMotion } from '../lib/reduced-motion'

const AUTO_CLOSE_MS = 1600
const EXIT_MS = 500

type OverlayPhase = 'visible' | 'exiting' | 'gone'

export default function OpeningOverlay() {
  const [phase, setPhase] = useState<OverlayPhase>('visible')
  const reducedMotion = prefersReducedMotion()

  useEffect(() => {
    if (reducedMotion || phase !== 'visible') return
    const timer = window.setTimeout(() => setPhase('exiting'), AUTO_CLOSE_MS)
    return () => window.clearTimeout(timer)
  }, [phase, reducedMotion])

  useEffect(() => {
    if (phase !== 'exiting') return
    const timer = window.setTimeout(() => setPhase('gone'), EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  const close = useCallback(() => setPhase('exiting'), [])

  useEffect(() => {
    if (reducedMotion || phase === 'gone') return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [close, phase, reducedMotion])

  if (reducedMotion || phase === 'gone') return null

  return (
    <div
      id="opening-overlay"
      className={`fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center select-none transition-opacity duration-500 ${
        phase === 'visible' ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={close}
    >
      <FillingGlass />
      <div className="mt-6 animate-fade-up">
        <Wordmark size="large" />
      </div>
      <p className="mt-2 font-body-md text-body-md text-ink-soft animate-fade-up [animation-delay:150ms]">
        {siteConfig.brand.slogan}
      </p>
      <div className="mt-8 w-40 h-1 rounded-full bg-surface-alt overflow-hidden">
        <div className="h-full rounded-full bg-primary animate-progress-fill" />
      </div>
      <button
        type="button"
        className="absolute bottom-6 right-6 text-sm text-ink-soft hover:text-ink underline underline-offset-4 decoration-border hover:decoration-ink transition-colors"
        onClick={close}
      >
        Pular
      </button>
    </div>
  )
}

function FillingGlass() {
  return (
    <svg aria-hidden="true" className="shrink-0" fill="none" height="72" viewBox="0 0 52 72" width="52">
      <defs>
        <clipPath id="opening-glass-clip">
          <path d="M8 6h36l-3.4 51.4A8 8 0 0 1 32.6 65h-13.2a8 8 0 0 1-8-7.6Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#opening-glass-clip)">
        <rect className="animate-liquid-fill fill-primary" height="52" width="44" x="4" y="13" />
        <circle className="animate-pulse" cx="19" cy="56" fill="white" opacity="0.6" r="2" />
        <circle className="animate-pulse [animation-delay:0.5s]" cx="27" cy="60" fill="white" opacity="0.45" r="1.5" />
        <circle className="animate-pulse [animation-delay:1s]" cx="33" cy="54" fill="white" opacity="0.55" r="1.2" />
      </g>
      <path
        className="stroke-ink"
        d="M8 6h36l-3.4 51.4A8 8 0 0 1 32.6 65h-13.2a8 8 0 0 1-8-7.6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
