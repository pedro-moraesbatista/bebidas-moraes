import Icon from './Icon'
import { productById } from '../data/products'
import { whatsappOrderLink } from '../lib/whatsapp'

const WHATSAPP_GREETING = 'Olá! Quero fazer um pedido na Bebidas Moraes!'

const heroImageIds = ['heineken-330', 'coca-cola-2l', 'red-bull-250']

const trustSeals = [
  { icon: 'truck', label: 'Entrega no mesmo dia' },
  { icon: 'shield-check', label: 'Compra segura +18' },
  { icon: 'clock', label: '8h às 22h' },
] as const

export default function Hero() {
  const heroProducts = heroImageIds
    .map((id) => productById(id))
    .filter((product) => product !== undefined)

  return (
    <section
      className="relative w-full px-margin py-8 md:py-12 bg-gradient-to-b from-surface-alt to-surface overflow-hidden"
      id="hero"
    >
      <div className="mx-auto w-full max-w-6xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border">
            <Icon name="whatsapp" size={16} className="text-whatsapp" />
            <span className="font-label-md text-label-md text-ink">Catálogo digital com pedido pelo WhatsApp</span>
          </span>
          <h1 className="text-display-hero-mobile md:text-display-hero uppercase tracking-tight text-ink">
            As melhores bebidas,
            <br />
            <span className="text-accent">a um clique de você.</span>
          </h1>
          <p className="font-body-md text-body-md text-ink-soft max-w-md">
            Encontre suas marcas favoritas, confira os preços e monte seu pedido sem complicação.
          </p>
          <div className="w-full flex flex-col sm:flex-row gap-space-sm items-stretch">
            <a
              className="flex-1 py-3 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              href="#catalogo"
            >
              <Icon name="cart" size={20} />
              <span>Explorar catálogo</span>
            </a>
            <a
              className="flex-1 py-3 px-4 rounded-lg bg-whatsapp hover:bg-whatsapp-hover text-white font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              href={whatsappOrderLink(WHATSAPP_GREETING)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="whatsapp" size={20} />
              <span>Fazer pedido pelo WhatsApp</span>
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
            {trustSeals.map((seal) => (
              <span key={seal.label} className="flex items-center gap-1.5">
                <Icon name={seal.icon} size={18} className="text-primary" />
                <span className="font-label-md text-label-md text-ink-soft">{seal.label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-md mx-auto">
          <div className="grid grid-cols-5 gap-3 items-center">
            <div className="col-span-3 aspect-square rounded-xl bg-surface border border-border shadow-lg p-5 md:p-8 animate-float">
              {heroProducts[0] && (
                <img
                  alt={heroProducts[0].name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  decoding="async"
                  fetchPriority="high"
                  src={heroProducts[0].img}
                />
              )}
            </div>
            <div className="col-span-2 flex flex-col gap-3">
              <div className="aspect-square rounded-xl bg-surface border border-border shadow-lg p-3 animate-float-delayed -ml-3 md:-ml-6">
                {heroProducts[1] && (
                  <img
                    alt={heroProducts[1].name}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    decoding="async"
                    loading="lazy"
                    src={heroProducts[1].img}
                  />
                )}
              </div>
              <div className="aspect-square rounded-xl bg-surface border border-border shadow-lg p-3 animate-float [animation-delay:1s] -ml-6 md:-ml-12">
                {heroProducts[2] && (
                  <img
                    alt={heroProducts[2].name}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    decoding="async"
                    loading="lazy"
                    src={heroProducts[2].img}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
