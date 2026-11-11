import { useMemo, useState } from 'react'
import Icon from './Icon'
import ProductCard from './ProductCard'
import { categories, combos, products, type Combo, type Product } from '../data/products'
import { siteConfig } from '../data/siteConfig'

type CatalogView = 'todas' | (typeof categories)[number]['id']
type SortOption = 'relevancia' | 'menor-preco' | 'maior-preco' | 'a-z'

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'relevancia', label: 'Relevância' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'a-z', label: 'A–Z' },
]

const filterPills: Array<{ id: CatalogView; label: string }> = [
  { id: 'todas', label: 'Todas' },
  ...categories,
]

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export default function Catalog() {
  const [view, setView] = useState<CatalogView>('todas')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('relevancia')

  const visibleItems = useMemo<Array<Product | Combo>>(() => {
    const base =
      view === 'todas'
        ? [...products]
        : view === 'combos'
          ? [...combos]
          : products.filter((product) => product.category === view)

    const search = normalize(query)
    const filtered = search
      ? base.filter((item) =>
          normalize(`${item.name} ${'brand' in item ? item.brand : ''}`).includes(search),
        )
      : base

    switch (sort) {
      case 'menor-preco':
        return filtered.sort((a, b) => a.price - b.price)
      case 'maior-preco':
        return filtered.sort((a, b) => b.price - a.price)
      case 'a-z':
        return filtered.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      default:
        return filtered.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    }
  }, [view, query, sort])

  return (
    <section className="px-margin my-6 flex flex-col gap-space-md" id="catalogo">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-ink">Nosso catálogo</h2>
          <span className="font-label-md text-label-md text-primary font-bold">
            {visibleItems.length} {visibleItems.length === 1 ? 'produto' : 'produtos'}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-ink-soft">
          Selecione suas bebidas e adicione ao carrinho com um clique.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Icon
            name="search"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none"
          />
          <input
            aria-label="Buscar produto ou marca"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface text-ink placeholder:text-ink-soft/70 focus:outline-none focus:border-primary"
            placeholder="Buscar produto ou marca"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="relative sm:w-48">
          <select
            aria-label="Ordenar por"
            className="appearance-none w-full pl-4 pr-9 py-2.5 rounded-lg border border-border bg-surface text-ink text-sm focus:outline-none focus:border-primary cursor-pointer"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon
            name="chevron-down"
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-margin px-margin select-none no-scrollbar">
        {filterPills.map((pill) => (
          <button
            key={pill.id}
            type="button"
            className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
              view === pill.id ? 'bg-primary text-white' : 'bg-surface-alt text-ink hover:bg-border'
            }`}
            onClick={() => setView(pill.id)}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {visibleItems.length === 0 ? (
        <div className="py-12 flex flex-col items-center gap-3 text-center">
          <span className="w-14 h-14 rounded-full bg-surface-alt flex items-center justify-center text-ink-soft">
            <Icon name="search" size={26} />
          </span>
          <p className="font-body-md text-body-md text-ink-soft">
            Nenhum produto encontrado para &ldquo;{query}&rdquo;
          </p>
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-border text-ink hover:bg-surface-alt active:scale-95 transition-all"
            onClick={() => setQuery('')}
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {visibleItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}

      <p className="flex items-start gap-1.5 text-xs text-ink-soft pt-1">
        <Icon name="info" size={14} className="shrink-0 mt-0.5" />
        {siteConfig.legal.prices}
      </p>
    </section>
  )
}
