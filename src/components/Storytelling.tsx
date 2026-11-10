import { siteConfig } from '../data/siteConfig'

export default function Storytelling() {
  return (
    <section className="px-margin my-6" id="storytelling">
      <div className="w-full rounded-xl p-space-lg bg-surface-container-highest shadow-sm relative overflow-hidden">
        {/* Springfield Neon simulation bar sign */}
        <div className="flex items-center justify-between pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">nightlife</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Taverna do Moe Atmosphere</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">OPEN LATE</span>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">SPRINGFIELD FICA MAIS PERTO DO QUE VOCÊ IMAGINA.</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
          Aqui no {siteConfig.brand.name} nós tratamos cerveja com o respeito sagrado de quem já teve sede no domingo à
          tarde. Confira os nossos três mandamentos de balcão:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
          <div className="p-space-sm rounded-lg bg-surface flex flex-col gap-1 shadow-xs">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[18px]">ac_unit</span>
              <span className="font-label-md text-label-md">1. Ponto de Gelo</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Latas e growlers mantidos estritamente a -2°C para consumo imediato.</span>
          </div>
          <div className="p-space-sm rounded-lg bg-surface flex flex-col gap-1 shadow-xs">
            <div className="flex items-center gap-1.5 text-secondary">
              <span className="material-symbols-outlined text-[18px]">electric_moped</span>
              <span className="font-label-md text-label-md">2. Antes do 2º Gol</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Média de entrega em 30 min em todo o raio metropolitano.</span>
          </div>
          <div className="p-space-sm rounded-lg bg-surface flex flex-col gap-1 shadow-xs">
            <div className="flex items-center gap-1.5 text-tertiary">
              <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              <span className="font-label-md text-label-md">3. Simpatia de Bar</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Atendimento direto pelo Zap sem robôs chatos de triagem.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
