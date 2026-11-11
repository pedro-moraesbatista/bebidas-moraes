import { describe, expect, it } from 'vitest'
import { products, type Product } from '../data/products'
import { siteConfig } from '../data/siteConfig'
import type { CartItem } from './cart'
import { formatBRL } from './format'
import { buildOrderMessage, whatsappOrderLink } from './whatsapp'

function productById(id: string): Product {
  const product = products.find((item) => item.id === id)
  if (!product) throw new Error(`produto não encontrado: ${id}`)
  return product
}

const brahmaDuploMalte = productById('brahma-duplo-malte-350')
const cocaColaLata = productById('coca-cola-350')

const customer = { name: 'Maria Souza', address: 'Rua das Palmas, 123' }
const items: CartItem[] = [
  { product: brahmaDuploMalte, qty: 2 },
  { product: cocaColaLata, qty: 1 },
]
const itemsSubtotal = brahmaDuploMalte.price * 2 + cocaColaLata.price

describe('buildOrderMessage', () => {
  it('monta a mensagem com título, cliente e endereço', () => {
    const message = buildOrderMessage({
      customer,
      items,
      subtotal: itemsSubtotal,
      fee: 8,
      total: itemsSubtotal + 8,
    })

    expect(message).toContain('*NOVO PEDIDO — Bebidas Moraes*')
    expect(message).toContain('*Cliente:* Maria Souza')
    expect(message).toContain('*Endereço:* Rua das Palmas, 123')
  })

  it('usa defaults quando nome e endereço ficam em branco', () => {
    const message = buildOrderMessage({
      customer: { name: '   ', address: '' },
      items,
      subtotal: itemsSubtotal,
      fee: 8,
      total: itemsSubtotal + 8,
    })

    expect(message).toContain('*Cliente:* Cliente')
    expect(message).toContain('*Endereço:* Retirada no local')
  })

  it('lista cada item com total da linha e preço unitário', () => {
    const message = buildOrderMessage({
      customer,
      items,
      subtotal: itemsSubtotal,
      fee: 8,
      total: itemsSubtotal + 8,
    })

    expect(message).toContain('• 2x Brahma Duplo Malte — R$ 7,14 (R$ 3,57/un)')
    expect(message).toContain(`• 2x ${brahmaDuploMalte.name} — ${formatBRL(brahmaDuploMalte.price * 2)} (${formatBRL(brahmaDuploMalte.price)}/un)`)
    expect(message).toContain('• 1x Coca-Cola Original — R$ 3,99 (R$ 3,99/un)')
    expect(message).toContain(`• 1x ${cocaColaLata.name} — ${formatBRL(cocaColaLata.price)} (${formatBRL(cocaColaLata.price)}/un)`)
  })

  it('marca a taxa de entrega como GRÁTIS quando fee é 0', () => {
    const message = buildOrderMessage({
      customer,
      items,
      subtotal: itemsSubtotal,
      fee: 0,
      total: itemsSubtotal,
    })

    expect(message).toContain('*Taxa de entrega:* GRÁTIS')
  })

  it('formata a taxa, o subtotal e o total quando fee é maior que 0', () => {
    const message = buildOrderMessage({
      customer,
      items,
      subtotal: itemsSubtotal,
      fee: 8,
      total: itemsSubtotal + 8,
    })

    expect(message).toContain('*Taxa de entrega:* R$ 8,00')
    expect(message).toContain(`*Subtotal:* ${formatBRL(itemsSubtotal)}`)
    expect(message).toContain(`*TOTAL:* ${formatBRL(itemsSubtotal + 8)}`)
  })

  it('fecha com o rodapé de confirmação do catálogo digital', () => {
    const message = buildOrderMessage({
      customer,
      items,
      subtotal: itemsSubtotal,
      fee: 8,
      total: itemsSubtotal + 8,
    })

    expect(message).toContain('_Pedido enviado pelo catálogo digital. Aguardo confirmação. Obrigado!_')
  })
})

describe('whatsappOrderLink', () => {
  it('monta o link wa.me com o número do cliente e o texto codificado', () => {
    const text = 'mensagem com acentos: não, coração, ção'
    const link = whatsappOrderLink(text)

    expect(link.startsWith('https://wa.me/5583998461353?text=')).toBe(true)
    expect(link).toBe(`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(text)}`)
  })

  it('mantém a mensagem do pedido íntegra após decodificar o link', () => {
    const message = buildOrderMessage({
      customer,
      items,
      subtotal: itemsSubtotal,
      fee: 8,
      total: itemsSubtotal + 8,
    })
    const link = whatsappOrderLink(message)
    const rawText = link.slice('https://wa.me/5583998461353?text='.length)

    expect(link).toBe(`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`)
    expect(decodeURIComponent(rawText)).toBe(message)
    expect(decodeURIComponent(rawText)).toContain('• 2x Brahma Duplo Malte — R$ 7,14 (R$ 3,57/un)')
    expect(decodeURIComponent(rawText)).toContain(`*TOTAL:* ${formatBRL(itemsSubtotal + 8)}`)
  })
})
