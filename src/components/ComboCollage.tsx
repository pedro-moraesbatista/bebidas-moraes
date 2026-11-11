import { productById, type Product } from '../data/products'

interface ComboCollageProps {
  itemIds: string[]
  className?: string
}

export default function ComboCollage({ itemIds, className = '' }: ComboCollageProps) {
  const images = itemIds
    .map((id) => productById(id))
    .filter((product): product is Product => product !== undefined)
  if (images.length === 0) return null

  const single = images.length <= 2
  const shown = single ? images.slice(0, 1) : images

  return (
    <div className={`grid ${single ? 'grid-cols-1' : 'grid-cols-2'} gap-2 h-full w-full ${className}`}>
      {shown.map((product) => (
        <div
          key={product.id}
          className="aspect-square rounded-lg bg-surface p-2 flex items-center justify-center overflow-hidden"
        >
          <img
            alt=""
            className="w-full h-full object-contain"
            decoding="async"
            loading="lazy"
            src={product.img}
          />
        </div>
      ))}
    </div>
  )
}
