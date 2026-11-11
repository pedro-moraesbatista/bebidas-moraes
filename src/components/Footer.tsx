import Wordmark from './Wordmark'
import { siteConfig } from '../data/siteConfig'
import { whatsappOrderLink } from '../lib/whatsapp'

const MORAES_MESSAGE =
  'Olá! Vi o catálogo da Bebidas Moraes e quero um catálogo digital para a minha empresa.'

const navLinks = [
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#combos', label: 'Combos' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#entrega', label: 'Entrega' },
]

const helpLinks = ['Taxas de entrega', 'Política de trocas', 'Atendimento 8h–22h']

const copyrightYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="mt-8 pt-10 pb-12 px-margin bg-surface-alt text-ink flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <Wordmark />
        <span className="font-body-sm text-body-sm text-ink-soft">{siteConfig.brand.slogan}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <span className="font-label-md text-label-md uppercase text-ink-soft font-bold">Navegação</span>
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="font-body-sm text-body-sm text-ink-soft hover:text-ink transition-colors"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-label-md text-label-md uppercase text-ink-soft font-bold">Ajuda</span>
          {helpLinks.map((label) => (
            <span key={label} className="font-body-sm text-body-sm text-ink-soft">
              {label}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-label-md text-label-md uppercase text-ink-soft font-bold">Institucional</span>
          <span className="text-xs text-ink-soft">{siteConfig.moraes.tagline}</span>
          <a
            className="font-body-sm text-body-sm text-primary font-semibold hover:underline"
            href={whatsappOrderLink(MORAES_MESSAGE)}
            rel="noopener noreferrer"
            target="_blank"
          >
            {siteConfig.moraes.cta}
          </a>
        </div>
      </div>

      <div className="border-t border-border pt-6 flex flex-col gap-1">
        <p className="text-xs text-ink-soft">{siteConfig.legal.plus18}</p>
        <p className="text-xs text-ink-soft">{siteConfig.legal.prices}</p>
        <p className="text-xs text-ink-soft">
          © {copyrightYear} {siteConfig.brand.name}
        </p>
      </div>
    </footer>
  )
}
