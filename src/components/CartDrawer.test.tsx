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

const brahmaDuploMalte = productById('brahma-duplo-malte-350')
const johnnieWalker = productById('johnnie-walker-red-1000')

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
      <button type="button" onClick={() => add(brahmaDuploMalte)}>
        adiciona-brahma
      </button>
      <button type="button" onClick={() => add(johnnieWalker)}>
        adiciona-johnnie
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
  return screen.getByRole('dialog', { hidden: true, name: 'Seu pedido' })
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

    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument()
    expect(
      screen.getByText('Escolha suas bebidas no catálogo e monte seu pedido em minutos.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ver catálogo' })).toBeInTheDocument()
    expect(screen.queryByText('Subtotal')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Enviar pedido no WhatsApp$/ }),
    ).not.toBeInTheDocument()
  })

  it('exibe o item com nome, volume e preço qty × unitário e move a quantidade', async () => {
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-brahma' }))

    expect(screen.getByText(brahmaDuploMalte.name)).toBeInTheDocument()
    expect(screen.getByText('Lata 350ml')).toBeInTheDocument()
    expect(within(itemsList()).getByText('R$ 3,57')).toBeInTheDocument()
    expect(within(itemsList()).getByText('1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: `Aumentar quantidade de ${brahmaDuploMalte.name}` }))
    expect(within(itemsList()).getByText('R$ 7,14')).toBeInTheDocument()
    expect(within(itemsList()).getByText('2')).toBeInTheDocument()
    expect(within(itemsList()).queryByText('R$ 3,57')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: `Diminuir quantidade de ${brahmaDuploMalte.name}` }))
    expect(within(itemsList()).getByText('R$ 3,57')).toBeInTheDocument()
  })

  it('remove o item pelo botão de lixeira', async () => {
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-brahma' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-brahma' }))

    await user.click(screen.getByRole('button', { name: `Remover ${brahmaDuploMalte.name}` }))

    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument()
    expect(screen.queryByText(brahmaDuploMalte.name)).not.toBeInTheDocument()
    expect(screen.queryByText('Subtotal')).not.toBeInTheDocument()
  })

  it('diminuir a quantidade em 1 com qty igual a 1 volta ao empty state', async () => {
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-brahma' }))

    await user.click(screen.getByRole('button', { name: `Diminuir quantidade de ${brahmaDuploMalte.name}` }))

    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument()
  })

  it('exibe subtotal, taxa e total quando o subtotal fica abaixo de R$ 80', async () => {
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-brahma' }))

    expect(summaryValue('Subtotal')).toBe('R$ 3,57')
    expect(summaryValue('Taxa de entrega')).toBe('R$ 8,00')
    expect(summaryValue('Total')).toBe('R$ 11,57')
  })

  it('exibe GRÁTIS na taxa quando o subtotal atinge R$ 80', async () => {
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-johnnie' }))

    expect(summaryValue('Subtotal')).toBe('R$ 84,90')
    expect(summaryValue('Taxa de entrega')).toBe('GRÁTIS')
    expect(summaryValue('Total')).toBe('R$ 84,90')
  })

  it('preenche nome e endereço e envia o pedido via window.open', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderDrawer()
    await user.click(screen.getByRole('button', { name: 'abre-carrinho' }))
    await user.click(screen.getByRole('button', { name: 'adiciona-brahma' }))

    await user.type(screen.getByLabelText('Seu nome'), 'Maria Souza')
    await user.type(screen.getByLabelText('Endereço de entrega'), 'Rua das Palmas, 123')

    await user.click(screen.getByRole('button', { name: /Enviar pedido no WhatsApp$/ }))

    expect(openSpy).toHaveBeenCalledTimes(1)
    expect(openSpy.mock.calls[0]?.[1]).toBe('_blank')
    const url = String(openSpy.mock.calls[0]?.[0])
    expect(url.startsWith('https://wa.me/5583998461353?text=')).toBe(true)

    const encodedText = url.slice('https://wa.me/5583998461353?text='.length)
    const decoded = decodeURIComponent(encodedText)
    expect(decoded).toContain('*NOVO PEDIDO — Bebidas Moraes*')
    expect(decoded).toContain('*Cliente:* Maria Souza')
    expect(decoded).toContain('*Endereço:* Rua das Palmas, 123')
    expect(decoded).toContain('• 1x Brahma Duplo Malte — R$ 3,57 (R$ 3,57/un)')
    expect(decoded).toContain('*Subtotal:* R$ 3,57')
    expect(decoded).toContain('*Taxa de entrega:* R$ 8,00')
    expect(decoded).toContain('*TOTAL:* R$ 11,57')
    expect(decoded).toContain('_Pedido enviado pelo catálogo digital. Aguardo confirmação. Obrigado!_')
  })
})
