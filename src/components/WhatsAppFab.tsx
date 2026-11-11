import Icon from './Icon'
import { whatsappOrderLink } from '../lib/whatsapp'

export default function WhatsAppFab() {
  return (
    <aside className="fixed right-4 bottom-24 z-40">
      <a
        aria-label="Pedir no WhatsApp"
        className="flex items-center gap-2 px-4 h-12 rounded-full bg-whatsapp hover:bg-whatsapp-hover text-white shadow-[0_4px_12px_rgba(29,168,81,0.35)] active:scale-95 transition-transform"
        href={whatsappOrderLink('Olá! Quero fazer um pedido na Bebidas Moraes!')}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Icon name="whatsapp" size={22} />
        <span className="font-label-md text-label-md hidden xs:inline">Pedir no WhatsApp</span>
      </a>
    </aside>
  )
}
