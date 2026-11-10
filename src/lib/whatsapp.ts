import { siteConfig } from '../data/siteConfig'
import type { CartItem } from './cart'
import { formatBRL } from './format'

export interface OrderCustomer {
  name: string
  address: string
}

export interface OrderMessageInput {
  customer: OrderCustomer
  items: CartItem[]
  subtotal: number
  fee: number
  total: number
}

const DEFAULT_CUSTOMER_NAME = 'Cliente Springfield'
const DEFAULT_CUSTOMER_ADDRESS = 'Retirada no Balcão ou a Combinar'

export function buildOrderMessage({ customer, items, subtotal, fee, total }: OrderMessageInput): string {
  const name = customer.name.trim() || DEFAULT_CUSTOMER_NAME
  const address = customer.address.trim() || DEFAULT_CUSTOMER_ADDRESS

  const lines = [
    '🍺 *NOVO PEDIDO - devBeer Springfield Pub*',
    '',
    `👤 *Cliente:* ${name}`,
    `📍 *Endereço:* ${address}`,
    '',
    '📋 *ITENS NO ENGRADADO:*',
    ...items.map((item) => `• ${item.qty}x ${item.product.name} — ${formatBRL(item.product.price * item.qty)}`),
    '',
    `💵 *Subtotal:* ${formatBRL(subtotal)}`,
    `🛵 *Taxa de Entrega:* ${fee === 0 ? 'GRÁTIS' : formatBRL(fee)}`,
    `⭐ *TOTAL GERAL:* ${formatBRL(total)}`,
    '',
    '_Favor confirmar se o chope está trincando de gelado!_',
  ]

  return lines.join('\n')
}

export function whatsappOrderLink(text: string): string {
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(text)}`
}
