import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CartDrawer from './CartDrawer'
import { products, type Product } from '../data/products'
import { CartProvider, useCart } from '../lib/cart'

function productById(id: string): Product {
  const product = products.find((item) => item.id === id)
  if (!product) throw new Error(`produto não encontrado: ${id}`)
  return product
}

const duffTributo = productById('duff-tributo-350')

function Controls() {
  const { add, openCart, toggleCart } = useCart()
  return (
    <>
      <button type="button" onClick={openCart}>
        abre-carrinho
      </button>
      <button type="button" onClick={toggleCart}>
        alterna-carrinho
      </button>
      <button type="button" onClick={() => add(duffTributo)}>
        adiciona-duff
      </button>
    </>
  )
}

function renderDrawer() {
  return render(
    <CartProvider>
      <Controls />
      <CartDrawer />
    </CartProvider>,
  )
}

function drawer(): HTMLElement {
  return screen.getByRole('dialog', { hidden: true, name: 'Carrinho de compras devBeer' })
}

function overlay(): HTMLElement {
  const element = document.querySelector<HTMLElement>('.fixed.inset-0')
  if (!element) throw new Error('overlay do carrinho não encontrado')
  return element
}

function itemsList(): HTMLElement {
  const element = document.querySelector<HTMLElement>('.flex-1.overflow-y-auto')
  if (!element) throw new Error('lista de itens não encontrada')
  return element
}

function summaryValue(label: string): string {
  const row = screen.getByText(label).closest('div')
  const value = row?.lastElementChild?.textContent
  if (!row || !value) throw new Error(`linha de resumo não encontrada: ${label}`)
  return value
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('CartDrawer', () => {
  const user = userEvent.setup()

  it('começa fechado, abre com openCart e fecha pelo clique no overlay', async () => {
    renderDrawer()
    expect(drawer().className).toContain('translate-x-full')
    expect(overlay().className).toContain('hidden')

    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    expect(drawer().className).toContain('translate-x-0')
    expect(overlay().className).not.toContain('hidden')

    await user.click(overlay())
    expect(drawer().className).toContain('translate-x-full')
    expect(drawer().className).not.toContain('translate-x-0')
  })

  it('abre e fecha com toggleCart', async () => {
    renderDrawer()

    await user.click(screen.getByRole('button', { name: 'alterna-carrinho' }))
    expect(drawer().className).toContain('translate-x-0')

    await user.click(screen.getByRole('button', { name: 'alterna-carrinho' }))
    expect(drawer().className).toContain('translate-x-full')
  })

  it('mostra o empty state e esconde o footer quando o carrinho está vazio', async () => {
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))

    expect(screen.getByText('O engradado está vazio!')).toBeInTheDocument()
    expect(screen.queryByText('Subtotal bebidas')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Enviar Pedido no WhatsApp$/ })).not.toBeInTheDocument()
  })

  it('exibe o item com preço qty × unitário e move a quantidade pelos botões', async () => {
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-duff' }))

    expect(screen.getByText(duffTributo.name)).toBeInTheDocument()
    expect(within(itemsList()).getByText('R$ 11,90')).toBeInTheDocument()
    expect(within(itemsList()).getByText('1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: `Aumentar quantidade de ${duffTributo.name}` }))
    expect(within(itemsList()).getByText('R$ 23,80')).toBeInTheDocument()
    expect(within(itemsList()).getByText('2')).toBeInTheDocument()
    expect(within(itemsList()).queryByText('R$ 11,90')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: `Diminuir quantidade de ${duffTributo.name}` }))
    expect(within(itemsList()).getByText('R$ 11,90')).toBeInTheDocument()
  })

  it('remove o item pelo botão delete', async () => {
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-duff' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-duff' }))

    await user.click(screen.getByRole('button', { name: 'Remover item' }))

    expect(screen.getByText('O engradado está vazio!')).toBeInTheDocument()
    expect(screen.queryByText(duffTributo.name)).not.toBeInTheDocument()
    expect(screen.queryByText('Subtotal bebidas')).not.toBeInTheDocument()
  })

  it('diminuir a quantidade em 1 com qty igual a 1 volta ao empty state', async () => {
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-duff' }))

    await user.click(screen.getByRole('button', { name: `Diminuir quantidade de ${duffTributo.name}` }))

    expect(screen.getByText('O engradado está vazio!')).toBeInTheDocument()
  })

  it('exibe subtotal, taxa e total quando o subtotal fica abaixo de R$ 80', async () => {
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-duff' }))

    expect(summaryValue('Subtotal bebidas')).toBe('R$ 11,90')
    expect(summaryValue('Taxa de Entrega Springfield')).toBe('R$ 8,00')
    expect(summaryValue('Total Geral')).toBe('R$ 19,90')
  })

  it('exibe GRÁTIS na taxa quando o subtotal atinge R$ 80', async () => {
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    const adicionar = screen.getByRole('button', { name: 'adiciona-duff' })
    for (let index = 0; index < 7; index += 1) {
      await user.click(adicionar)
    }

    expect(summaryValue('Subtotal bebidas')).toBe('R$ 83,30')
    expect(summaryValue('Taxa de Entrega Springfield')).toBe('GRÁTIS (Acima R$80)')
    expect(summaryValue('Total Geral')).toBe('R$ 83,30')
  })

  it('preenche nome e endereço e envia o pedido via window.open', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-duff' }))

    await user.type(screen.getByLabelText('Nome de quem vai brindar'), 'Homer J. Simpson')
    await user.type(screen.getByLabelText('Endereço de Entrega'), 'Rua Evergreen Terrace, 742')

    await user.click(screen.getByRole('button', { name: /Enviar Pedido no WhatsApp$/ }))

    expect(openSpy).toHaveBeenCalledTimes(1)
    expect(openSpy.mock.calls[0]?.[1]).toBe('_blank')
    const url = String(openSpy.mock.calls[0]?.[0])
    expect(url.startsWith('https://wa.me/5511999999999?text=')).toBe(true)

    const encodedText = url.slice('https://wa.me/5511999999999?text='.length)
    const decoded = decodeURIComponent(encodedText)
    expect(decoded).toContain('🍺 *NOVO PEDIDO - devBeer Springfield Pub*')
    expect(decoded).toContain('👤 *Cliente:* Homer J. Simpson')
    expect(decoded).toContain('📍 *Endereço:* Rua Evergreen Terrace, 742')
    expect(decoded).toContain('• 1x Duff Beer Tributo Lata 350ml — R$ 11,90')
    expect(decoded).toContain('💵 *Subtotal:* R$ 11,90')
    expect(decoded).toContain('🛵 *Taxa de Entrega:* R$ 8,00')
    expect(decoded).toContain('⭐ *TOTAL GERAL:* R$ 19,90')
  })
})