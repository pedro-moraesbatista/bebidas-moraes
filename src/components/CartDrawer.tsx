import { useEffect, useRef, useState } from 'react'
import { useCart } from '../lib/cart'
import { formatBRL } from '../lib/format'
import { buildOrderMessage, whatsappOrderLink } from '../lib/whatsapp'

export default function CartDrawer() {
  const { items, subtotal, fee, total, count, isOpen, closeCart, changeQty, remove } = useCart()
  const [customerName, setCustomerName] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    drawerRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
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
    window.open(whatsappOrderLink(message), '_blank')
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-inverse-surface/60 z-50 backdrop-blur-xs transition-opacity duration-300 ${isOpen ? '' : 'hidden'}`}
        onClick={closeCart}
      ></div>
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras devBeer"
        tabIndex={-1}
        inert={!isOpen}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface z-50 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header Drawer */}
        <div className="p-space-md bg-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="material-symbols-outlined text-primary text-[24px]">sports_bar</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Seu Engradado</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-bold">{count}</span>
          </div>
          <button
            type="button"
            aria-label="Fechar carrinho"
            className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface active:scale-95 transition-transform"
            onClick={closeCart}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-space-lg text-center gap-3">
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
              <span aria-hidden="true" className="material-symbols-outlined text-[40px]">liquor</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface">O engradado está vazio!</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
              Não deixe o Homer chateado. Escolha algumas geladas no catálogo para começar seu pedido.
            </p>
            <button
              type="button"
              className="mt-2 py-2 px-5 rounded-lg bg-primary text-on-primary font-label-md text-label-md active:scale-95 transition-transform"
              onClick={closeCart}
            >
              Ver Bebidas Geladas
            </button>
          </div>
        ) : (
          <>
            {/* Items List Body */}
            <div className="flex-1 overflow-y-auto p-space-md flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low shadow-2xs gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded bg-surface-container-high shrink-0 overflow-hidden flex items-center justify-center">
                      {item.product.img ? (
                        <img alt={item.product.name} className="w-full h-full object-cover" src={item.product.img} />
                      ) : (
                        <span aria-hidden="true" className="material-symbols-outlined text-[22px] text-primary">sports_bar</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-md text-label-md text-on-surface truncate">{item.product.name}</span>
                      <span className="font-body-sm text-body-sm text-primary font-bold">
                        {formatBRL(item.product.price * item.qty)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      aria-label={`Diminuir quantidade de ${item.product.name}`}
                      className="w-7 h-7 rounded bg-surface-container hover:bg-surface-variant text-on-surface flex items-center justify-center active:scale-95"
                      onClick={() => changeQty(item.product.id, -1)}
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="font-label-sm text-label-sm font-bold w-5 text-center">{item.qty}</span>
                    <button
                      type="button"
                      aria-label={`Aumentar quantidade de ${item.product.name}`}
                      className="w-7 h-7 rounded bg-surface-container hover:bg-surface-variant text-on-surface flex items-center justify-center active:scale-95"
                      onClick={() => changeQty(item.product.id, 1)}
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                    <button
                      type="button"
                      aria-label="Remover item"
                      className="w-7 h-7 rounded text-error hover:bg-error-container/40 flex items-center justify-center active:scale-95 ml-1"
                      onClick={() => remove(item.product.id)}
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Checkout Form & Summary */}
            <div className="p-space-md bg-surface-container-low flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold" htmlFor="cart-customer-name">
                  Nome de quem vai brindar
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-surface text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:bg-surface-container-highest"
                  id="cart-customer-name"
                  placeholder="Ex: Homer J. Simpson"
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                />
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold" htmlFor="cart-customer-address">
                  Endereço de Entrega
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-surface text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:bg-surface-container-highest"
                  id="cart-customer-address"
                  placeholder="Ex: Rua Evergreen Terrace, 742"
                  type="text"
                  value={customerAddress}
                  onChange={(event) => setCustomerAddress(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1 pt-2">
                <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-body-sm">
                  <span>Subtotal bebidas</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-body-sm">
                  <span>Taxa de Entrega Springfield</span>
                  <span>{fee === 0 ? 'GRÁTIS (Acima R$80)' : formatBRL(fee)}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface font-headline-sm text-headline-sm pt-1">
                  <span>Total Geral</span>
                  <span className="text-primary font-black">{formatBRL(total)}</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3.5 px-4 rounded-xl bg-tertiary hover:bg-tertiary-container text-on-tertiary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                onClick={dispatchWhatsApp}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[22px]">send</span>
                <span>Enviar Pedido no WhatsApp</span>
              </button>
              <span className="text-center font-label-sm text-label-sm text-on-surface-variant">
                Você será transferido para o chat com o pedido pronto formatado.
              </span>
            </div>
          </>
        )}
      </div>
    </>
  )
}
