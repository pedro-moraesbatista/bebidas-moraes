import { badgeToneClasses, combos } from '../data/products'
import { useCart } from '../lib/cart'
import { formatBRL } from '../lib/format'

export default function CombosSection() {
  const { add } = useCart()

  return (
    <section className="px-margin my-6 flex flex-col gap-space-md" id="combos">
      <div className="flex flex-col">
        <span className="font-label-sm text-label-sm text-primary font-bold uppercase">Mais Economia</span>
        <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Combos da Rodada</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {combos.map((combo) => (
          <div key={combo.id} className="p-space-md rounded-xl bg-surface-container flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${badgeToneClasses[combo.tag.tone]}`}
                >
                  {combo.tag.text}
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-black">{formatBRL(combo.price)}</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1">{combo.name}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">{combo.description}</p>
            </div>
            <button
              type="button"
              className="w-full py-2.5 rounded-lg bg-surface-container-highest hover:bg-surface-variant text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 active:scale-95 transition-all"
              onClick={() => add(combo)}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              <span>Adicionar Combo</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
