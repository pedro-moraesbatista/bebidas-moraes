import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ReactNode } from 'react'
import { combos, products, type Combo, type Product } from '../data/products'
import { CartProvider, useCart } from './cart'

const STORAGE_KEY = 'bebidas-moraes-cart-v1'

function productById(id: string): Product {
  const product = products.find((item) => item.id === id)
  if (!product) throw new Error(`produto não encontrado: ${id}`)
  return product
}

function comboById(id: string): Combo {
  const combo = combos.find((item) => item.id === id)
  if (!combo) throw new Error(`combo não encontrado: ${id}`)
  return combo
}

const brahmaDuploMalte = productById('brahma-duplo-malte-350')
const cocaColaLata = productById('coca-cola-350')
const johnnieWalker = productById('johnnie-walker-red-1000')
const comboChurrasco = comboById('combo-churrasco')

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

    act(() => result.current.add(brahmaDuploMalte))

    expect(result.current.toast).toBe('Adicionado: Brahma Duplo Malte')
    expect(result.current.items).toEqual([{ product: brahmaDuploMalte, qty: 1 }])
    expect(result.current.count).toBe(1)
  })

  it('add aceita combo e resolve a imagem do primeiro item para o drawer', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(comboChurrasco))

    expect(result.current.toast).toBe('Adicionado: Combo Churrasco')
    expect(result.current.items).toEqual([
      {
        product: {
          id: 'combo-churrasco',
          name: 'Combo Churrasco',
          price: 59.9,
          img: brahmaDuploMalte.img,
        },
        qty: 1,
      },
    ])
  })

  it('add duas vezes no mesmo produto agrupa na mesma entrada', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(brahmaDuploMalte))
    act(() => result.current.add(brahmaDuploMalte))

    expect(result.current.items).toEqual([{ product: brahmaDuploMalte, qty: 2 }])
    expect(result.current.count).toBe(2)
  })

  it('count soma as quantidades de itens diferentes', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(brahmaDuploMalte))
    act(() => result.current.add(brahmaDuploMalte))
    act(() => result.current.add(cocaColaLata))

    expect(result.current.items).toHaveLength(2)
    expect(result.current.count).toBe(3)
  })

  it('changeQty com +1 e -1 ajusta a quantidade do item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(brahmaDuploMalte))
    act(() => result.current.changeQty(brahmaDuploMalte.id, 1))
    expect(result.current.items).toEqual([{ product: brahmaDuploMalte, qty: 2 }])

    act(() => result.current.changeQty(brahmaDuploMalte.id, -1))
    expect(result.current.items).toEqual([{ product: brahmaDuploMalte, qty: 1 }])
    expect(result.current.count).toBe(1)
  })

  it('changeQty com -1 em item com qty 1 remove o item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(brahmaDuploMalte))
    act(() => result.current.changeQty(brahmaDuploMalte.id, -1))

    expect(result.current.items).toEqual([])
    expect(result.current.count).toBe(0)
    expect(result.current.total).toBe(0)
  })

  it('remove elimina o item do carrinho', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(brahmaDuploMalte))
    act(() => result.current.add(cocaColaLata))
    act(() => result.current.remove(brahmaDuploMalte.id))

    expect(result.current.items).toEqual([{ product: cocaColaLata, qty: 1 }])
    expect(result.current.count).toBe(1)
  })

  it('subtotal abaixo de R$ 80 cobra a taxa de R$ 8,00', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(brahmaDuploMalte))

    expect(result.current.subtotal).toBeCloseTo(3.57)
    expect(result.current.fee).toBe(8)
    expect(result.current.total).toBeCloseTo(11.57)
  })

  it('subtotal a partir de R$ 80 recebe frete grátis e total igual ao subtotal', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(johnnieWalker))
    act(() => result.current.add(cocaColaLata))

    expect(result.current.subtotal).toBeCloseTo(88.89)
    expect(result.current.fee).toBe(0)
    expect(result.current.total).toBeCloseTo(88.89)
  })

  it('persistência: add grava o carrinho em bebidas-moraes-cart-v1', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.add(brahmaDuploMalte))

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(
      JSON.stringify({ 'brahma-duplo-malte-350': 1 }),
    )
  })

  it('remontagem do provider restaura os itens salvos', () => {
    const first = renderHook(() => useCart(), { wrapper })
    act(() => first.result.current.add(brahmaDuploMalte))
    act(() => first.result.current.changeQty(brahmaDuploMalte.id, 1))
    first.unmount()

    const second = renderHook(() => useCart(), { wrapper })

    expect(second.result.current.items).toEqual([{ product: brahmaDuploMalte, qty: 2 }])
    expect(second.result.current.count).toBe(2)
    expect(second.result.current.subtotal).toBeCloseTo(7.14)
  })
})

describe('useCart com localStorage corrompido', () => {
  const payloadsInvalidos = [
    ['JSON inválido (parse quebra no catch)', 'garbage'],
    ['array no lugar do objeto', '[1,2]'],
    ['quantidade negativa', '{"brahma-duplo-malte-350":-2}'],
    ['quantidade zero', '{"brahma-duplo-malte-350":0}'],
    ['quantidade fracionária', '{"brahma-duplo-malte-350":2.5}'],
    ['quantidade como string', '{"brahma-duplo-malte-350":"3"}'],
    ['quantidade Infinity (1e999)', '{"brahma-duplo-malte-350":1e999}'],
    ['quantidade NaN (JSON inválido)', '{"brahma-duplo-malte-350":NaN}'],
  ] as ReadonlyArray<readonly [string, string]>

  it.each(payloadsInvalidos)('descarta storage com %s e monta com carrinho vazio', (_motivo, raw) => {
    window.localStorage.setItem(STORAGE_KEY, raw)

    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.items).toEqual([])
    expect(result.current.count).toBe(0)
    expect(result.current.subtotal).toBe(0)
    expect(result.current.fee).toBe(0)
  })

  it('não renderiza itens com id que não existe no catálogo (produto-removido)', () => {
    window.localStorage.setItem(STORAGE_KEY, '{"produto-removido":5}')

    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.items).toEqual([])
    expect(result.current.count).toBe(0)
    expect(result.current.subtotal).toBe(0)
    expect(result.current.total).toBe(0)
  })
})
