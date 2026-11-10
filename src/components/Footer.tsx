import { siteConfig } from '../data/siteConfig'
import { useCart } from '../lib/cart'

export default function Footer() {
  const { showToast } = useCart()

  const shareSite = async () => {
    const url = window.location.href
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: siteConfig.brand.name, url })
      } catch {
        // usuário cancelou o diálogo de compartilhamento
      }
      return
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        showToast('Link copiado!')
      } catch {
        // clipboard bloqueado pelo navegador
      }
    }
  }

  return (
    <footer className="mt-8 pt-8 pb-12 px-margin bg-surface-container-lowest text-on-surface flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="material-symbols-outlined text-primary text-[32px]">sports_bar</span>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary leading-none">{siteConfig.brand.name}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Depósito Springfield de Bebidas LTDA</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Compartilhar devBeer"
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
            onClick={shareSite}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">share</span>
          </button>
          <button
            type="button"
            aria-label="Favoritar devBeer"
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
            onClick={() => showToast('Obrigado pelo amor! ❤️')}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">favorite</span>
          </button>
          <a
            aria-label="Ver opções de entrega"
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
            href="#entrega"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">location_on</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
        <div className="flex flex-col gap-2">
          <span className="font-label-md text-label-md uppercase text-secondary font-bold">Navegação</span>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface" href="#catalogo">Todas Bebidas</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface" href="#catalogo">Cervejas Duff</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface" href="#catalogo">Growlers Artesanais</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface" href="#combos">Combos da Rodada</a>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-label-md text-label-md uppercase text-secondary font-bold">Ajuda & Delivery</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Rastreamento de Motoboy</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Taxas & Localidades</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Política de Trocas</span>
        </div>
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-2">
          <span className="font-label-md text-label-md uppercase text-secondary font-bold">Aviso Obrigatório +18</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{siteConfig.legal.footer}</p>
        </div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant">
        <span className="font-label-sm text-label-sm">© 2025 {siteConfig.brand.name} {siteConfig.brand.tagline} — Todos os direitos reservados.</span>
        <span className="font-label-sm text-label-sm">Inspirado na cultura pop cervejeira.</span>
      </div>
    </footer>
  )
}
