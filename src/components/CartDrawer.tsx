import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { useCart } from '../lib/cart'
import { formatBRL } from '../lib/format'
import { buildOrderMessage, whatsappOrderLink } from '../lib/whatsapp'

export default function CartDrawer() {
  const { items, subtotal, fee, total, count, isOpen, closeCart, changeQty, remove } = useCart()
  const [customerName, setCustomerName] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const drawerRef = useRef<HTMLDivElement>(null)
  const lastActiveElement = useRef<Element | null>(null)

  useEffect(() => {
    if (!isOpen) return
    lastActiveElement.current = document.activeElement
    document.body.style.overflow = 'hidden'
    drawerRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      const element = lastActiveElement.current
      if (element instanceof HTMLElement && document.contains(element)) element.focus()
    }
  }, [isOpen, closeCart])

  const dispatchWhatsApp = () => {
    if (items.length === 0) return
    const message = buildOrderMessage({
      customer: { name: customerName, address: customerAddress },
      items,
      subtotal,
      fee,
      total,
    })
    window.open(whatsappOrderLink(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/60 z-[55] backdrop-blur-xs transition-opacity duration-300 ${isOpen ? '' : 'hidden'}`}
        onClick={closeCart}
      ></div>
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Seu pedido"
        tabIndex={-1}
        inert={!isOpen}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface z-[60] shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-space-md bg-surface-alt border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary flex">
              <Icon name="cart" size={22} />
            </span>
            <h3 className="font-headline-sm text-headline-sm text-ink">Seu pedido</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary text-white font-label-sm text-label-sm font-bold">
              {count}
            </span>
          </div>
          <button
            type="button"
            aria-label="Fechar carrinho"
            className="w-10 h-10 rounded-full bg-surface hover:bg-border flex items-center justify-center text-ink active:scale-95 transition-transform"
            onClick={closeCart}
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-space-lg text-center gap-3">
            <div className="w-20 h-20 rounded-full bg-surface-alt flex items-center justify-center text-ink-soft">
              <Icon name="cart" size={36} />
            </div>
            <h4 className="font-headline-sm text-headline-sm text-ink">Seu carrinho está vazio</h4>
            <p className="font-body-sm text-body-sm text-ink-soft max-w-xs">
              Escolha suas bebidas no catálogo e monte seu pedido em minutos.
            </p>
            <button
              type="button"
              className="mt-2 py-2 px-5 rounded-lg bg-primary hover:bg-primary-hover text-white font-label-md text-label-md active:scale-95 transition-all"
              onClick={closeCart}
            >
              Ver catálogo
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-space-md flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-alt gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-surface shrink-0 overflow-hidden">
                      <img
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        decoding="async"
                        loading="lazy"
                        src={item.product.img}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-sm text-ink truncate">{item.product.name}</span>
                      {item.product.volume && (
                        <span className="text-xs text-ink-soft">{item.product.volume}</span>
                      )}
                      <span className="text-sm font-semibold text-primary">
                        {formatBRL(item.product.price * item.qty)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      aria-label={`Diminuir quantidade de ${item.product.name}`}
                      className="w-7 h-7 rounded bg-surface hover:bg-border text-ink flex items-center justify-center active:scale-95 transition-colors"
                      onClick={() => changeQty(item.product.id, -1)}
                    >
                      <Icon name="remove" size={16} />
                    </button>
                    <span className="font-label-sm text-label-sm font-bold w-5 text-center text-ink">{item.qty}</span>
                    <button
                      type="button"
                      aria-label={`Aumentar quantidade de ${item.product.name}`}
                      className="w-7 h-7 rounded bg-surface hover:bg-border text-ink flex items-center justify-center active:scale-95 transition-colors"
                      onClick={() => changeQty(item.product.id, 1)}
                    >
                      <Icon name="add" size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remover ${item.product.name}`}
                      className="w-7 h-7 rounded text-red-600 hover:bg-red-50 flex items-center justify-center active:scale-95 transition-colors ml-1"
                      onClick={() => remove(item.product.id)}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-space-md bg-surface-alt border-t border-border flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label
                  className="font-label-sm text-label-sm text-ink-soft uppercase font-bold"
                  htmlFor="cart-customer-name"
                >
                  Seu nome
                </label>
                <input
                  autoComplete="name"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-ink text-sm placeholder:text-ink-soft/70 focus:outline-none focus:border-primary"
                  id="cart-customer-name"
                  maxLength={120}
                  placeholder="Como podemos te chamar?"
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                />
                <label
                  className="font-label-sm text-label-sm text-ink-soft uppercase font-bold"
                  htmlFor="cart-customer-address"
                >
                  Endereço de entrega
                </label>
                <input
                  autoComplete="street-address"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-ink text-sm placeholder:text-ink-soft/70 focus:outline-none focus:border-primary"
                  id="cart-customer-address"
                  maxLength={120}
                  placeholder="Rua, número, bairro — ou retire no local"
                  type="text"
                  value={customerAddress}
                  onChange={(event) => setCustomerAddress(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1 pt-2">
                <div className="flex justify-between items-center text-ink-soft text-sm">
                  <span>Subtotal</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-ink-soft text-sm">
                  <span>Taxa de entrega</span>
                  <span className={fee === 0 ? 'text-whatsapp font-semibold' : undefined}>
                    {fee === 0 ? 'GRÁTIS' : formatBRL(fee)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-ink pt-2 mt-1 border-t border-border">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">{formatBRL(total)}</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3.5 px-4 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-white font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                onClick={dispatchWhatsApp}
              >
                <Icon name="send" size={20} />
                <span>Enviar pedido no WhatsApp</span>
              </button>
              <span className="text-center font-label-sm text-label-sm text-ink-soft">
                Você será direcionado ao WhatsApp com o pedido pronto.
              </span>
            </div>
          </>
        )}
      </div>
    </>
  )
}
