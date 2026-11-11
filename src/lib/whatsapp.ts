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

const DEFAULT_CUSTOMER_NAME = 'Cliente'
const DEFAULT_CUSTOMER_ADDRESS = 'Retirada no local'

export function buildOrderMessage({ customer, items, subtotal, fee, total }: OrderMessageInput): string {
  const name = customer.name.trim() || DEFAULT_CUSTOMER_NAME
  const address = customer.address.trim() || DEFAULT_CUSTOMER_ADDRESS

  const lines = [
    `*NOVO PEDIDO — ${siteConfig.brand.name}*`,
    '',
    `*Cliente:* ${name}`,
    `*Endereço:* ${address}`,
    '',
    '*ITENS DO PEDIDO:*',
    ...items.map(
      (item) =>
        `• ${item.qty}x ${item.product.name} — ${formatBRL(item.product.price * item.qty)} (${formatBRL(item.product.price)}/un)`,
    ),
    '',
    `*Subtotal:* ${formatBRL(subtotal)}`,
    `*Taxa de entrega:* ${fee === 0 ? 'GRÁTIS' : formatBRL(fee)}`,
    `*TOTAL:* ${formatBRL(total)}`,
    '',
    '_Pedido enviado pelo catálogo digital. Aguardo confirmação. Obrigado!_',
  ]

  return lines.join('\n')
}

export function whatsappOrderLink(text: string): string {
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(text)}`
}
