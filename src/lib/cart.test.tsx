import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ReactNode } from 'react'
import { comboDuffCraft, products, type Product } from '../data/products'
import { CartProvider, useCart } from './cart'

const STORAGE_KEY = 'devbeer-cart-v1'

function productById(id: string): Product {
  const product = products.find((item) => item.id === id)
  if (!product) throw new Error(`produto não encontrado: ${id}`)
  return product
}

const duffTributo = productById('duff-tributo-350')
const buzzCola = productById('buzz-cola-350')

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>

beforeEach(() => {
  window.localStorage.clear()
})

describe('useCart', () => {
  it('começa com carrinho vazio: sem itens, sem taxa e sem toast', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.items).toEqual([])
    expect(result.current.count).toBe(0)
    expect(result.current.subtotal).toBe(0)
    expect(result.current.fee).toBe(0)
    expect(result.current.total).toBe(0)
    expect(result.current.toast).toBe('')
  })

  it('add incrementa a quantidade e dispara o toast com o nome do produto', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(duffTributo))

    expect(result.current.toast).toBe('Adicionado: Duff Beer Tributo Lata 350ml')
    expect(result.current.items).toEqual([{ product: duffTributo, qty: 1 }])
    expect(result.current.count).toBe(1)
  })

  it('add duas vezes no mesmo produto agrupa na mesma entrada', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(duffTributo))
    act(() => result.current.add(duffTributo))

    expect(result.current.items).toEqual([{ product: duffTributo, qty: 2 }])
    expect(result.current.count).toBe(2)
  })

  it('count soma as quantidades de itens diferentes', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(duffTributo))
    act(() => result.current.add(duffTributo))
    act(() => result.current.add(buzzCola))

    expect(result.current.items).toHaveLength(2)
    expect(result.current.count).toBe(3)
  })

  it('changeQty com +1 e -1 ajusta a quantidade do item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(duffTributo))
    act(() => result.current.changeQty(duffTributo.id, 1))
    expect(result.current.items).toEqual([{ product: duffTributo, qty: 2 }])

    act(() => result.current.changeQty(duffTributo.id, -1))
    expect(result.current.items).toEqual([{ product: duffTributo, qty: 1 }])
    expect(result.current.count).toBe(1)
  })

  it('changeQty com -1 em item com qty 1 remove o item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(duffTributo))
    act(() => result.current.changeQty(duffTributo.id, -1))

    expect(result.current.items).toEqual([])
    expect(result.current.count).toBe(0)
    expect(result.current.total).toBe(0)
  })

  it('remove elimina o item do carrinho', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(duffTributo))
    act(() => result.current.add(buzzCola))
    act(() => result.current.remove(duffTributo.id))

    expect(result.current.items).toEqual([{ product: buzzCola, qty: 1 }])
    expect(result.current.count).toBe(1)
  })

  it('subtotal abaixo de R$ 80 cobra a taxa de R$ 8,00', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(duffTributo))

    expect(result.current.subtotal).toBeCloseTo(11.9)
    expect(result.current.fee).toBe(8)
    expect(result.current.total).toBeCloseTo(19.9)
  })

  it('subtotal a partir de R$ 80 recebe frete grátis e total igual ao subtotal', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(comboDuffCraft))
    act(() => result.current.add(buzzCola))

    expect(result.current.subtotal).toBeCloseTo(87.4)
    expect(result.current.fee).toBe(0)
    expect(result.current.total).toBeCloseTo(87.4)
  })

  it('persistência: add grava o carrinho em devbeer-cart-v1', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(duffTributo))

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify({ 'duff-tributo-350': 1 }))
  })

  it('remontagem do provider restaura os itens salvos', () => {
    const first = renderHook(() => useCart(), { wrapper })
    act(() => first.result.current.add(duffTributo))
    act(() => first.result.current.changeQty(duffTributo.id, 1))
    first.unmount()

    const second = renderHook(() => useCart(), { wrapper })

    expect(second.result.current.items).toEqual([{ product: duffTributo, qty: 2 }])
    expect(second.result.current.count).toBe(2)
    expect(second.result.current.subtotal).toBeCloseTo(23.8)
  })
})