import { badgeToneClasses, type Product } from '../data/products'
import { useCart } from '../lib/cart'
import { formatBRL } from '../lib/format'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart()

  return (
    <div className="product-card flex flex-col justify-between p-space-md rounded-xl bg-surface-container shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-surface-container-high mb-3 flex items-center justify-center">
          <img alt={product.alt} className="w-full h-full object-cover" decoding="async" loading="lazy" src={product.img} />
          {product.badge && (
            <span
              className={`absolute top-2 left-2 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${badgeToneClasses[product.badge.tone]}`}
            >
              {product.badge.text}
            </span>
          )}
          {product.coldChip && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface font-label-sm text-label-sm flex items-center gap-1">
              <span aria-hidden="true" className="material-symbols-outlined text-[14px] text-tertiary">ac_unit</span> {product.coldChip}
            </span>
          )}
        </div>
        {(product.metaLabel || product.specs || product.metaNote) && (
          <div className="flex items-center justify-between mb-1">
            {product.metaLabel && (
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">{product.metaLabel}</span>
            )}
            {product.specs && (
              <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                <span>ABV {product.specs.abv}</span>
                <span>•</span>
                <span>IBU {product.specs.ibu}</span>
              </div>
            )}
            {product.metaNote && (
              <span
                className={
                  product.metaNote.tone === 'tertiary'
                    ? 'font-label-sm text-label-sm text-tertiary font-bold'
                    : 'font-label-sm text-label-sm text-on-surface-variant'
                }
              >
                {product.metaNote.text}
              </span>
            )}
          </div>
        )}
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{product.name}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">{product.description}</p>
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-on-surface-variant">{product.unitLabel}</span>
          <span className="font-headline-sm text-headline-sm text-primary font-black">{formatBRL(product.price)}</span>
        </div>
        <button
          type="button"
          className="py-2 px-3.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1.5 active:scale-95 transition-transform shadow-xs"
          onClick={() => add(product)}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">add</span>
          <span>Adicionar</span>
        </button>
      </div>
    </div>
  )
}
