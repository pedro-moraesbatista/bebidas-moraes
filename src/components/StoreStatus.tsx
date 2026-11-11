import { useEffect, useState } from 'react'
import { getStoreStatus, type StoreStatus as StoreStatusSnapshot } from '../lib/store-status'
import { siteConfig } from '../data/siteConfig'

function useStoreStatus(): StoreStatusSnapshot {
  const [status, setStatus] = useState<StoreStatusSnapshot>(() => getStoreStatus())

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getStoreStatus()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return status
}

function SwingingSign({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      className="animate-sign-swing shrink-0 text-ink"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d="M12 2v4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <rect height="14" rx="3" stroke="currentColor" strokeWidth="2" width="16" x="4" y="6" />
      <path
        d="m9.5 10.5 5 5m0-5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

export default function StoreStatus() {
  const status = useStoreStatus()
  const { closeHour } = siteConfig.delivery.storeHours

  if (status.isOpen) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border">
        <span aria-hidden="true" className="w-2 h-2 rounded-full bg-whatsapp animate-pulse shrink-0" />
        <span aria-live="polite" className="flex items-baseline gap-1.5">
          <span className="font-label-md text-label-md text-ink">Aberto agora</span>
          <span className="text-xs text-ink-soft max-sm:hidden">até as {closeHour}h</span>
        </span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border">
      <span aria-hidden="true" className="w-2 h-2 rounded-full bg-accent shrink-0" />
      <SwingingSign size={14} />
      <span aria-live="polite" className="flex items-baseline gap-1.5">
        <span className="font-label-md text-label-md text-ink">Fechado agora</span>
        <span className="text-xs text-accent font-semibold max-sm:hidden">{status.closedLabel}</span>
      </span>
    </span>
  )
}

export function ClosedBanner() {
  const status = useStoreStatus()

  if (status.isOpen) return null

  return (
    <div className="w-full bg-surface-alt border-b border-border px-margin py-3 mt-10 sm:mt-0 flex items-center justify-center gap-3">
      <SwingingSign size={28} />
      <p className="text-sm text-ink-soft text-center">
        Estamos fechados agora —{' '}
        <span className="text-ink font-semibold">{status.closedLabel}</span>. Monte seu pedido no
        catálogo e envie quando abrirmos.
      </p>
    </div>
  )
}
