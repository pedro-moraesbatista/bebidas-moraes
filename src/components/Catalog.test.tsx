import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { catalogItems, categories, combos, products, type Product } from '../data/products'
import { CartProvider, useCart } from '../lib/cart'
import Catalog from './Catalog'

function productById(id: string): Product {
  const product = products.find((item) => item.id === id)
  if (!product) throw new Error(`produto não encontrado: ${id}`)
  return product
}

const cervejas = products.filter((product) => product.category === 'cervejas')
const destilados = products.filter((product) => product.category === 'destilados')

function ToastProbe() {
  const { toast } = useCart()
  return <p data-testid="toast">{toast}</p>
}

function CountProbe() {
  const { count } = useCart()
  return <p data-testid="count">{count}</p>
}

function renderCatalog() {
  return render(
    <CartProvider>
      <Catalog />
      <ToastProbe />
      <CountProbe />
    </CartProvider>,
  )
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('Catalog', () => {
  it('exibe os 24 produtos do catálogo com o contador de produtos', () => {
    renderCatalog()

    expect(screen.getByRole('heading', { name: 'Nosso catálogo' })).toBeInTheDocument()
    expect(screen.getByText('24 produtos')).toBeInTheDocument()
    for (const product of products) {
      expect(screen.getAllByText(product.name)).not.toHaveLength(0)
    }
    expect(screen.getAllByRole('button', { name: /Adicionar$/ })).toHaveLength(products.length)
  })

  it('filtra para só cervejas ao clicar no pill Cervejas', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.click(screen.getByRole('button', { name: 'Cervejas' }))

    expect(screen.getByText(`${cervejas.length} produtos`)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Adicionar$/ })).toHaveLength(cervejas.length)
    for (const product of cervejas) {
      expect(screen.getAllByText(product.name)).not.toHaveLength(0)
    }
    for (const product of destilados) {
      expect(screen.queryByText(product.name)).not.toBeInTheDocument()
    }
  })

  it('marca o pill ativo com bg-primary e os inativos com bg-surface-alt', async () => {
    const user = userEvent.setup()
    renderCatalog()

    const todas = screen.getByRole('button', { name: 'Todas' })
    const cervejasPill = screen.getByRole('button', { name: 'Cervejas' })
    const destiladosPill = screen.getByRole('button', { name: 'Destilados' })

    expect(todas).toHaveClass('bg-primary')
    expect(cervejasPill).toHaveClass('bg-surface-alt')
    expect(destiladosPill).toHaveClass('bg-surface-alt')

    await user.click(cervejasPill)
    expect(cervejasPill).toHaveClass('bg-primary')
    expect(todas).toHaveClass('bg-surface-alt')
    expect(destiladosPill).toHaveClass('bg-surface-alt')
  })

  it('prioriza produtos em destaque na ordenação por relevância', () => {
    renderCatalog()

    const adicionarButtons = screen.getAllByRole('button', { name: /Adicionar$/ })
    const featuredFirst = products.filter((product) => product.featured)

    for (const [index, product] of featuredFirst.entries()) {
      const card = adicionarButtons[index].closest('div.rounded-xl')
      expect(card).toHaveTextContent(product.name)
    }
  })

  it('busca por nome exibe apenas o produto correspondente', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.type(screen.getByPlaceholderText('Buscar produto ou marca'), 'heineken')

    expect(screen.getByText('1 produto')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Adicionar$/ })).toHaveLength(1)
    expect(screen.getAllByText('Heineken')).not.toHaveLength(0)
    expect(screen.queryByText('Brahma Duplo Malte')).not.toBeInTheDocument()
  })

  it('busca por marca exibe os produtos da marca', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.type(screen.getByPlaceholderText('Buscar produto ou marca'), 'budweiser')

    expect(screen.getAllByRole('button', { name: /Adicionar$/ })).toHaveLength(1)
    expect(screen.getAllByText('Budweiser American Lager')).not.toHaveLength(0)
  })

  it('busca sem resultados exibe estado vazio com botão de limpar', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.type(screen.getByPlaceholderText('Buscar produto ou marca'), 'zzz')

    expect(screen.getByText('0 produtos')).toBeInTheDocument()
    expect(screen.getByText('Nenhum produto encontrado para “zzz”')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Limpar busca' }))

    expect(screen.getByText('24 produtos')).toBeInTheDocument()
    expect(screen.queryByText('Nenhum produto encontrado para “zzz”')).not.toBeInTheDocument()
  })

  it('ordena por menor preço ao selecionar no select', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Ordenar por' }), 'menor-preco')

    const adicionarButtons = screen.getAllByRole('button', { name: /Adicionar$/ })
    const cheapest = products.reduce((min, product) => (product.price < min.price ? product : min))
    expect(adicionarButtons[0].closest('div.rounded-xl')).toHaveTextContent(cheapest.name)
  })

  it('clicar em Adicionar dispara o toast e soma no contador do carrinho', async () => {
    const user = userEvent.setup()
    renderCatalog()
    const heineken = productById('heineken-330')

    const adicionar = screen.getAllByRole('button', { name: /Adicionar$/ })[0]
    await user.click(adicionar)

    expect(screen.getByTestId('toast')).toHaveTextContent(`Adicionado: ${heineken.name}`)
    expect(screen.getByTestId('count')).toHaveTextContent('1')

    await user.click(adicionar)
    expect(screen.getByTestId('count')).toHaveTextContent('2')
  })

  it('usa imagens locais em /assets em todos os cards', () => {
    renderCatalog()
    const imagens = screen.getAllByRole('img')

    expect(imagens).toHaveLength(products.length)
    for (const product of products) {
      const byAlt = screen.getAllByAltText(product.name)
      expect(byAlt.map((image) => image.getAttribute('src'))).toContain(product.img)
    }
    for (const image of imagens) {
      expect(image.getAttribute('src')).toMatch(/^\/assets\//)
      expect(image.getAttribute('src')).not.toMatch(/^https?:/i)
    }
  })

  it('catalogItems exporta os 24 produtos + os 4 combos', () => {
    expect(catalogItems).toHaveLength(products.length + combos.length)
    expect(categories.map((category) => category.id)).toEqual([
      'cervejas',
      'destilados',
      'refrigerantes',
      'energeticos',
      'aguas',
      'combos',
    ])
  })
})

describe('Filtro de combos no catálogo', () => {
  it('pill Combos mostra os 4 combos e nenhum produto de bebida', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.click(screen.getByRole('button', { name: 'Combos' }))

    expect(screen.getByText(`${combos.length} produtos`)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Adicionar$/ })).toHaveLength(combos.length)
    for (const combo of combos) {
      expect(screen.getByText(combo.name)).toBeInTheDocument()
    }
    for (const product of products) {
      expect(screen.queryByText(product.name)).not.toBeInTheDocument()
    }
  })

  it('todos os combos referenciam produtos existentes do catálogo', () => {
    for (const combo of combos) {
      for (const id of combo.items) {
        expect(products.some((product) => product.id === id)).toBe(true)
      }
    }
  })

  it('voltar para Todas restaura os 24 produtos sem os combos', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.click(screen.getByRole('button', { name: 'Combos' }))
    await user.click(screen.getByRole('button', { name: 'Todas' }))

    expect(screen.getByText('24 produtos')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Adicionar$/ })).toHaveLength(products.length)
    for (const product of products) {
      expect(screen.getAllByText(product.name)).not.toHaveLength(0)
    }
    for (const combo of combos) {
      expect(screen.queryByText(combo.name)).not.toBeInTheDocument()
    }
  })
})
