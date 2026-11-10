import { comboDuffCraft } from '../data/products'
import { useCart } from '../lib/cart'
import { formatBRL } from '../lib/format'

export default function ComboHighlight() {
  const { add } = useCart()
  const discountPercent = Math.round((1 - comboDuffCraft.price / (comboDuffCraft.priceFrom ?? comboDuffCraft.price)) * 100)

  return (
    <section className="px-margin my-4" id="combo-destaque">
      <div className="relative w-full rounded-xl overflow-hidden bg-surface-container shadow-md p-space-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase font-bold">DESTAQUE DO MOE</span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">-{discountPercent}% OFF</span>
          </div>
          <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span> RESTAM 7 CRATES
          </span>
        </div>
        <div className="relative w-full h-44 rounded-lg overflow-hidden bg-surface-container-high">
          <img alt={comboDuffCraft.alt} className="w-full h-full object-cover" src={comboDuffCraft.img} />
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-inverse-surface/80 text-inverse-on-surface font-label-sm text-label-sm backdrop-blur-sm">
            Crate Madeira + 6 Latas Sortidas + Petisco
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">{comboDuffCraft.name}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{comboDuffCraft.description}</p>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant line-through">De {formatBRL(comboDuffCraft.priceFrom ?? comboDuffCraft.price)}</span>
            <span className="font-headline-md text-headline-md text-primary font-black">{formatBRL(comboDuffCraft.price)}</span>
          </div>
          <button
            type="button"
            className="py-2.5 px-4 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center gap-2 active:scale-95 shadow-sm transition-transform"
            onClick={() => add(comboDuffCraft)}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            <span>Adicionar Combo</span>
          </button>
        </div>
      </div>
    </section>
  )
}
