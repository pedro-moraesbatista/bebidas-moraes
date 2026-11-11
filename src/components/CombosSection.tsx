import Icon from './Icon'
import ComboCollage from './ComboCollage'
import { combos } from '../data/products'
import { useCart } from '../lib/cart'
import { formatBRL } from '../lib/format'

export default function CombosSection() {
  const { add } = useCart()

  return (
    <section className="px-margin my-6 flex flex-col gap-space-md" id="combos">
      <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-ink">Combos que valem a pena</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className="rounded-xl bg-surface border border-border p-3 flex flex-col gap-2"
          >
            <div className="aspect-square rounded-lg bg-surface-alt p-3">
              <ComboCollage itemIds={combo.items} />
            </div>
            <span className="self-start px-2 py-0.5 rounded-full bg-ink text-white font-label-sm text-label-sm font-bold uppercase tracking-wider">
              Combo
            </span>
            <h3 className="font-semibold text-ink leading-snug">{combo.name}</h3>
            <p className="text-xs text-ink-soft line-clamp-2">{combo.description}</p>
            <div className="flex items-baseline gap-2 flex-wrap pt-1 mt-auto">
              <span className="text-lg font-bold text-primary">{formatBRL(combo.price)}</span>
              <span className="text-xs text-ink-soft line-through">De {formatBRL(combo.priceFrom)}</span>
            </div>
            <button
              type="button"
              className="w-full py-2.5 rounded-lg bg-surface-alt hover:bg-border text-ink text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              onClick={() => add(combo)}
            >
              <Icon name="add" size={18} />
              <span>Adicionar</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
