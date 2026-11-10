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

const duffTributo = productById('duff-tributo-350')
const buzzCola = productById('buzz-cola-350')

const customer = { name: 'Homer J. Simpson', address: 'Rua Evergreen Terrace, 742' }
const items: CartItem[] = [
  { product: duffTributo, qty: 2 },
  { product: buzzCola, qty: 1 },
]

describe('buildOrderMessage', () => {
  it('monta a mensagem com título, cliente e endereço', () => {
    const message = buildOrderMessage({
      customer,
      items,
      subtotal: duffTributo.price * 2 + buzzCola.price,
      fee: 8,
      total: duffTributo.price * 2 + buzzCola.price + 8,
    })

    expect(message).toContain('🍺 *NOVO PEDIDO - devBeer Springfield Pub*')
    expect(message).toContain('👤 *Cliente:* Homer J. Simpson')
    expect(message).toContain('📍 *Endereço:* Rua Evergreen Terrace, 742')
  })

  it('usa defaults quando nome e endereço ficam em branco', () => {
    const message = buildOrderMessage({
      customer: { name: '   ', address: '' },
      items,
      subtotal: 31.3,
      fee: 8,
      total: 39.3,
    })

    expect(message).toContain('👤 *Cliente:* Cliente Springfield')
    expect(message).toContain('📍 *Endereço:* Retirada no Balcão ou a Combinar')
  })

  it('lista cada item como quantidade × nome — subtotal da linha', () => {
    const message = buildOrderMessage({
      customer,
      items,
      subtotal: duffTributo.price * 2 + buzzCola.price,
      fee: 8,
      total: duffTributo.price * 2 + buzzCola.price + 8,
    })

    expect(message).toContain('• 2x Duff Beer Tributo Lata 350ml — R$ 23,80')
    expect(message).toContain(`• 2x ${duffTributo.name} — R$ 23,80`)
    expect(message).toContain('• 1x Buzz Cola Lata Vintage 350ml — R$ 7,50')
    expect(message).toContain(`• 1x ${buzzCola.name} — ${formatBRL(buzzCola.price)}`)
  })

  it('marca a taxa de entrega como GRÁTIS quando fee é 0', () => {
    const message = buildOrderMessage({
      customer,
      items,
      subtotal: duffTributo.price * 2 + buzzCola.price,
      fee: 0,
      total: duffTributo.price * 2 + buzzCola.price,
    })

    expect(message).toContain('🛵 *Taxa de Entrega:* GRÁTIS')
  })

  it('formata a taxa, o subtotal e o total quando fee é maior que 0', () => {
    const message = buildOrderMessage({
      customer,
      items,
      subtotal: 23.8,
      fee: 8,
      total: 31.8,
    })

    expect(message).toContain('🛵 *Taxa de Entrega:* R$ 8,00')
    expect(message).toContain('💵 *Subtotal:* R$ 23,80')
    expect(message).toContain('⭐ *TOTAL GERAL:* R$ 31,80')
  })
})

describe('whatsappOrderLink', () => {
  it('monta o link wa.me com o número placeholder e o texto codificado', () => {
    const text = 'mensagem com acentos: não, coração, ção'
    const link = whatsappOrderLink(text)

    expect(link.startsWith('https://wa.me/5511999999999?text=')).toBe(true)
    expect(link).toBe(`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(text)}`)
  })

  it('mantém a mensagem do pedido íntegra após decodificar o link', () => {
    const message = buildOrderMessage({
      customer,
      items,
      subtotal: duffTributo.price * 2 + buzzCola.price,
      fee: 8,
      total: duffTributo.price * 2 + buzzCola.price + 8,
    })
    const link = whatsappOrderLink(message)
    const rawText = link.slice('https://wa.me/5511999999999?text='.length)
    const decoded = decodeURIComponent(rawText)

    expect(link).toBe(`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`)
    expect(decodeURIComponent(rawText)).toBe(message)
    expect(decoded).toContain('• 2x Duff Beer Tributo Lata 350ml — R$ 23,80')
    expect(decoded).toContain('⭐ *TOTAL GERAL:* R$ 39,30')
  })
})