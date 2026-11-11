import Icon from './Icon'
import ComboCollage from './ComboCollage'
import type { Combo, Product } from '../data/products'
import { useCart } from '../lib/cart'
import { formatBRL } from '../lib/format'

interface ProductCardProps {
  product: Product | Combo
}

function discountPercent(price: number, priceFrom: number): number {
  return Math.round((1 - price / priceFrom) * 100)
}

export default function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart()
  const isCombo = 'items' in product
  const promoDiscount = product.priceFrom ? discountPercent(product.price, product.priceFrom) : undefined

  return (
    <div className="flex flex-col rounded-xl bg-surface border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative aspect-square bg-surface-alt p-3">
        {isCombo ? (
          <ComboCollage itemIds={product.items} />
        ) : (
          <img
            alt={product.name}
            className="w-full h-full object-contain"
            decoding="async"
            loading="lazy"
            src={product.img}
          />
        )}
        {product.featured && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-white font-label-sm text-label-sm font-bold uppercase">
            Destaque
          </span>
        )}
        {promoDiscount !== undefined && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent text-white font-label-sm text-label-sm font-bold">
            -{promoDiscount}%
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 gap-1 p-3 pt-2">
        <span className="text-xs uppercase tracking-wider text-ink-soft font-medium">
          {isCombo ? 'Combo' : product.brand}
        </span>
        <h3 className="text-sm font-semibold text-ink leading-snug line-clamp-2">{product.name}</h3>
        <span className="text-xs text-ink-soft">
          {isCombo ? `${product.items.length} itens` : product.volume}
        </span>
        <div className="flex items-baseline gap-2 flex-wrap pt-1">
          <span className="text-lg font-bold text-primary">{formatBRL(product.price)}</span>
          {product.priceFrom && (
            <span className="text-xs text-ink-soft line-through">De {formatBRL(product.priceFrom)}</span>
          )}
        </div>
      </div>
      <div className="p-3 pt-0">
        <button
          type="button"
          className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          onClick={() => add(product)}
        >
          <Icon name="add" size={18} />
          <span>Adicionar</span>
        </button>
      </div>
    </div>
  )
}
