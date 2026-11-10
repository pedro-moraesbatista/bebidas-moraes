import { whatsappOrderLink } from '../lib/whatsapp'

export default function WhatsAppFab() {
  return (
    <aside className="fixed right-4 bottom-24 z-40">
      <a
        aria-label="Pedir via Zap Tavern"
        className="flex items-center gap-2 px-4 h-12 rounded-full bg-tertiary hover:bg-tertiary-container text-on-tertiary shadow-[0_4px_12px_rgba(48,98,64,0.35)] active:scale-95 transition-transform"
        href={whatsappOrderLink('Olá! Quero fazer um pedido na devBeer!')}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="material-symbols-outlined text-[22px]">chat</span>
        <span className="font-label-md text-label-md hidden xs:inline">Zap do Moe</span>
      </a>
    </aside>
  )
}
