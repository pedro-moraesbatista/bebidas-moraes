import { useMemo, useState } from 'react'
import { siteConfig } from '../data/siteConfig'
import {
  categories,
  comboDuffCraft,
  combos,
  products,
} from '../data/products'
import ProductCard from './ProductCard'
import type { CategoryId, Product } from '../data/products'

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('todos')

  const visibleProducts = useMemo<Product[]>(() => {
    if (activeCategory === 'todos') return products
    if (activeCategory === 'combos') return [comboDuffCraft, ...combos]
    return products.filter((product) => product.category === activeCategory)
  }, [activeCategory])

  return (
    <section className="px-margin my-4 flex flex-col gap-space-md" id="catalogo">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Cardápio do Depósito</h2>
          <span className="font-label-sm text-label-sm text-primary font-bold">{products.length} ITENS DISPONÍVEIS</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Selecione suas opções geladas e adicione ao carrinho com um clique.</p>
      </div>

      {/* Filtros de Categoria (Pill Tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-margin px-margin select-none no-scrollbar">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-variant'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Nota de aviso Legal Estilizada */}
      <div className="p-space-sm rounded-lg bg-surface-container-low text-on-surface-variant flex items-start gap-2 mt-2">
        <span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] shrink-0">info</span>
        <p className="font-body-sm text-body-sm">
          <strong>Nota de Tributo:</strong> {siteConfig.legal.tribute}
        </p>
      </div>
    </section>
  )
}
