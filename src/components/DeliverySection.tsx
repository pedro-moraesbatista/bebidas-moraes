import { siteConfig } from '../data/siteConfig'
import { formatBRL } from '../lib/format'
import { whatsappOrderLink } from '../lib/whatsapp'

export default function DeliverySection() {
  return (
    <section className="px-margin my-6" id="entrega">
      <div className="w-full rounded-2xl p-space-lg bg-surface-container text-on-surface shadow-md flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
            <span aria-hidden="true" className="material-symbols-outlined text-[28px]">sports_bar</span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">MATOU A SEDE? CHAMA A DEVBEER!</h3>
            <span className="font-label-sm text-label-sm text-secondary font-bold">Depósito Express em Springfield & Arredores</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2">
          <div className="flex items-start gap-2.5 p-space-sm rounded-lg bg-surface-container-low">
            <span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">explore</span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md">Raio de Cobertura</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{siteConfig.delivery.radius}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-space-sm rounded-lg bg-surface-container-low">
            <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[20px]">schedule</span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md">Horário de Plantão</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{siteConfig.delivery.schedule}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-space-sm rounded-lg bg-surface-container-low">
            <span aria-hidden="true" className="material-symbols-outlined text-tertiary text-[20px]">timer</span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md">Tempo Estimado</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {siteConfig.delivery.etaRange} para a cerveja chegar suando
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-space-sm rounded-lg bg-surface-container-low">
            <span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">savings</span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md">Frete Grátis</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Pedidos acima de {formatBRL(siteConfig.delivery.freeAbove)} possuem taxa zerada
              </span>
            </div>
          </div>
        </div>

        {/* Quick WhatsApp Contact Box */}
        <div className="mt-2 p-space-md rounded-xl bg-secondary-container text-on-secondary-container flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="material-symbols-outlined text-[24px]">call</span>
            <div>
              <span className="font-label-sm text-label-sm uppercase block font-bold">Central de Pedidos WhatsApp</span>
              <span className="font-headline-sm text-headline-sm">{siteConfig.whatsapp.display}</span>
            </div>
          </div>
          <a
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 active:scale-95 shadow-sm transition-transform"
            href={whatsappOrderLink('Oi, quero um despacho de cerveja rápido!')}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">chat</span>
            <span>Chamar Bartender</span>
          </a>
        </div>
      </div>
    </section>
  )
}
