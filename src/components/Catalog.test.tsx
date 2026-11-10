import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { catalogItems, comboDuffCraft, combos, products, type Product } from '../data/products'
import { CartProvider, useCart } from '../lib/cart'
import Catalog from './Catalog'

function productById(id: string): Product {
  const product = products.find((item) => item.id === id)
  if (!product) throw new Error(`produto não encontrado: ${id}`)
  return product
}

const cervejas = ['duff-tributo-350', 'duff-lite-355', 'duff-dry-500'].map(productById)
const foraDeCervejas = ['fudd-dark-500', 'growler-ipa-1l', 'flaming-moe-mix', 'buzz-cola-350', 'red-homer-473'].map(productById)

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
  it('exibe os 8 produtos do catálogo com o contador de itens disponíveis', () => {
    renderCatalog()

    expect(screen.getByRole('heading', { name: 'Cardápio do Depósito' })).toBeInTheDocument()
    expect(screen.getByText('8 ITENS DISPONÍVEIS')).toBeInTheDocument()
    for (const product of products) {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    }
    expect(screen.getAllByRole('button', { name: /Adicionar$/ })).toHaveLength(products.length)
  })

  it('filtra para só cervejas ao clicar no pill Cervejas & Latas', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.click(screen.getByRole('button', { name: 'Cervejas & Latas' }))

    expect(screen.getAllByRole('button', { name: /Adicionar$/ })).toHaveLength(cervejas.length)
    for (const product of cervejas) {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    }
    for (const product of foraDeCervejas) {
      expect(screen.queryByText(product.name)).not.toBeInTheDocument()
    }
  })

  it('marca o pill ativo com bg-primary e os inativos com bg-surface-container', async () => {
    const user = userEvent.setup()
    renderCatalog()

    const todas = screen.getByRole('button', { name: 'Todas' })
    const cervejasPill = screen.getByRole('button', { name: 'Cervejas & Latas' })
    const artesanais = screen.getByRole('button', { name: 'Artesanais & Growlers' })

    expect(todas).toHaveClass('bg-primary')
    expect(cervejasPill).toHaveClass('bg-surface-container')
    expect(artesanais).toHaveClass('bg-surface-container')

    await user.click(cervejasPill)
    expect(cervejasPill).toHaveClass('bg-primary')
    expect(todas).toHaveClass('bg-surface-container')
    expect(artesanais).toHaveClass('bg-surface-container')
  })

  it('clicar em Adicionar dispara o toast e soma no contador do carrinho', async () => {
    const user = userEvent.setup()
    renderCatalog()
    const duffTributo = productById('duff-tributo-350')
    const adicionar = screen.getAllByRole('button', { name: /Adicionar$/ })[0]

    await user.click(adicionar)

    expect(screen.getByTestId('toast')).toHaveTextContent(`Adicionado: ${duffTributo.name}`)
    expect(screen.getByTestId('count')).toHaveTextContent('1')

    await user.click(adicionar)
    expect(screen.getByTestId('count')).toHaveTextContent('2')
  })

  it('usa imagens locais em /assets em todos os cards', () => {
    renderCatalog()
    const imagens = screen.getAllByRole('img')

    expect(imagens).toHaveLength(products.length)
    for (const product of products) {
      const image = screen.getByAltText(product.alt)
      expect(image).toHaveAttribute('src', product.img)
      expect(image.getAttribute('src')).toMatch(/^\/assets\//)
    }
    for (const image of imagens) {
      expect(image.getAttribute('src')).not.toMatch(/^https?:/i)
      expect(image.getAttribute('src')).not.toContain('lh3.googleusercontent')
    }
  })
})

const combosDisponiveis = [comboDuffCraft, ...combos]

describe('Filtros das demais categorias do cardápio', () => {
  it('pill Combos mostra os 3 combos e nenhum produto de bebida', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.click(screen.getByRole('button', { name: 'Combos' }))

    expect(screen.getAllByRole('button', { name: /Adicionar$/ })).toHaveLength(3)
    for (const combo of combosDisponiveis) {
      expect(screen.getByText(combo.name)).toBeInTheDocument()
    }
    for (const product of products) {
      expect(screen.queryByText(product.name)).not.toBeInTheDocument()
    }
  })

  it('pill Refris & Não Alcoólicos mostra Flaming Moe, Buzz Cola e Red Homer', async () => {
    const user = userEvent.setup()
    const naoAlcoolicos = ['flaming-moe-mix', 'buzz-cola-350', 'red-homer-473'].map(productById)
    renderCatalog()

    await user.click(screen.getByRole('button', { name: 'Refris & Não Alcoólicos' }))

    expect(screen.getAllByRole('button', { name: /Adicionar$/ })).toHaveLength(3)
    for (const product of naoAlcoolicos) {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    }
    for (const product of products.filter(({ category }) => category !== 'sem-alcool')) {
      expect(screen.queryByText(product.name)).not.toBeInTheDocument()
    }
  })

  it('pill Artesanais & Growlers mostra Fudd Beer e Chopp Dev IPA', async () => {
    const user = userEvent.setup()
    const artesanais = ['fudd-dark-500', 'growler-ipa-1l'].map(productById)
    renderCatalog()

    await user.click(screen.getByRole('button', { name: 'Artesanais & Growlers' }))

    expect(screen.getAllByRole('button', { name: /Adicionar$/ })).toHaveLength(2)
    for (const product of artesanais) {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    }
    for (const product of products.filter(({ category }) => category !== 'artesanais')) {
      expect(screen.queryByText(product.name)).not.toBeInTheDocument()
    }
  })

  it('catalogItems exporta os 8 produtos + os 3 combos', () => {
    expect(catalogItems).toHaveLength(products.length + combosDisponiveis.length)
  })

  it('voltar para Todas restaura os 8 produtos do cardápio sem os combos', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.click(screen.getByRole('button', { name: 'Combos' }))
    await user.click(screen.getByRole('button', { name: 'Todas' }))

    expect(screen.getByText('8 ITENS DISPONÍVEIS')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Adicionar$/ })).toHaveLength(products.length)
    for (const product of products) {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    }
    for (const combo of combosDisponiveis) {
      expect(screen.queryByText(combo.name)).not.toBeInTheDocument()
    }
  })
})