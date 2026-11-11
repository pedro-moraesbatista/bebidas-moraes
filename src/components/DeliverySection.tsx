import Icon, { type IconName } from './Icon'
import { siteConfig } from '../data/siteConfig'
import { whatsappOrderLink } from '../lib/whatsapp'

const WHATSAPP_GREETING = 'Olá! Quero fazer um pedido na Bebidas Moraes!'

const deliveryCards: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: 'truck', title: 'Entrega no mesmo dia', text: 'Pedidos confirmados saem para entrega rapidamente.' },
  { icon: 'clock', title: 'Horário', text: siteConfig.delivery.hours },
  { icon: 'map-pin', title: 'Cobertura', text: siteConfig.delivery.coverage },
  { icon: 'shield-check', title: 'Pagamento na entrega', text: 'A combinar diretamente com o atendente.' },
]

export default function DeliverySection() {
  return (
    <section className="px-margin my-6" id="entrega">
      <div className="flex flex-col gap-space-md">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-ink">Receba no mesmo dia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {deliveryCards.map((card) => (
            <div key={card.title} className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border">
              <span className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center text-primary shrink-0">
                <Icon name={card.icon} size={20} />
              </span>
              <div className="flex flex-col gap-0.5">
                <h3 className="font-semibold text-ink">{card.title}</h3>
                <p className="font-body-sm text-body-sm text-ink-soft">{card.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-surface-alt p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-full bg-whatsapp flex items-center justify-center text-white shrink-0">
              <Icon name="whatsapp" size={24} />
            </span>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-headline-sm text-ink">Pedidos pelo WhatsApp</h3>
              <span className="font-body-md text-body-md text-ink-soft">{siteConfig.whatsapp.display}</span>
            </div>
          </div>
          <a
            className="w-full sm:w-auto px-5 py-3 rounded-lg bg-whatsapp hover:bg-whatsapp-hover text-white font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            href={whatsappOrderLink(WHATSAPP_GREETING)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon name="whatsapp" size={20} />
            <span>Chamar no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  )
}
