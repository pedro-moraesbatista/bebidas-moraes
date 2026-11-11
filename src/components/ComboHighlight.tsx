import Icon from './Icon'
import ComboCollage from './ComboCollage'
import { combos, type Combo } from '../data/products'
import { useCart } from '../lib/cart'
import { formatBRL } from '../lib/format'

export default function ComboHighlight() {
  const { add } = useCart()
  const featuredCombo: Combo | undefined = combos.find((combo) => combo.featured) ?? combos[0]

  if (!featuredCombo) return null

  return (
    <section className="px-margin my-6" id="combo-destaque">
      <div className="w-full rounded-xl bg-surface border border-border shadow-sm p-space-md md:p-space-lg grid md:grid-cols-2 gap-6 items-center">
        <ComboCollage
          className="aspect-square bg-surface-alt p-4 rounded-lg"
          itemIds={featuredCombo.items}
        />
        <div className="flex flex-col gap-3">
          <span className="self-start px-3 py-1 rounded-full bg-accent text-white font-label-sm text-label-sm uppercase font-bold tracking-wider">
            Promoção da semana
          </span>
          <h2 className="font-headline-md text-headline-md text-ink leading-tight">{featuredCombo.name}</h2>
          <p className="font-body-sm text-body-sm text-ink-soft">{featuredCombo.description}</p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-body-sm text-body-sm text-ink-soft line-through">
              De {formatBRL(featuredCombo.priceFrom)}
            </span>
            <span className="text-headline-md font-extrabold text-primary">
              {formatBRL(featuredCombo.price)}
            </span>
          </div>
          <button
            type="button"
            className="self-start px-5 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-label-lg text-label-lg flex items-center gap-2 shadow-sm active:scale-95 transition-all"
            onClick={() => add(featuredCombo)}
          >
            <Icon name="add" size={20} />
            <span>Adicionar combo</span>
          </button>
        </div>
      </div>
    </section>
  )
}
