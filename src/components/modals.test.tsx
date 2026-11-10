import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CartDrawer from './CartDrawer'
import { SideMenu } from './Header'
import { CartProvider, useCart } from '../lib/cart'

beforeEach(() => {
  window.localStorage.clear()
})

function CartHarness() {
  const { toggleCart, isOpen } = useCart()
  return (
    <>
      <button type="button" aria-label="Abrir carrinho" onClick={toggleCart}>
        icone-carrinho
      </button>
      <p data-testid="cart-is-open">{String(isOpen)}</p>
      <CartDrawer />
    </>
  )
}

function modalOverlay(): HTMLElement {
  const element = document.querySelector<HTMLElement>('.fixed.inset-0')
  if (!element) throw new Error('overlay do modal não encontrado')
  return element
}

describe('Fechamento de modais com ESC', () => {
  it('CartDrawer: ESC no window fecha o drawer aberto pelo botão do header', async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <CartHarness />
      </CartProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Abrir carrinho' }))

    expect(screen.getByTestId('cart-is-open')).toHaveTextContent('true')
    expect(modalOverlay().className).not.toContain('hidden')

    fireEvent.keyDown(window, { key: 'Enter' })
    expect(screen.getByTestId('cart-is-open')).toHaveTextContent('true')

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.getByTestId('cart-is-open')).toHaveTextContent('false')
    expect(modalOverlay().className).toContain('hidden')
  })

  it('CartDrawer: ao abrir, o container do dialog recebe o foco', async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <CartHarness />
      </CartProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Abrir carrinho' }))

    const drawer = screen.getByRole('dialog', { hidden: true, name: 'Carrinho de compras devBeer' })
    expect(drawer).toHaveFocus()
    expect(document.activeElement).toBe(drawer)
  })

  it('SideMenu: ESC no window chama onClose e open=false esconde o menu', () => {
    const onClose = vi.fn()
    const { rerender } = render(<SideMenu open={false} onClose={onClose} />)

    const menu = screen.getByRole('dialog', { hidden: true, name: 'Menu do Bar' })
    expect(menu.className).toContain('-translate-x-full')
    expect(modalOverlay().className).toContain('hidden')

    rerender(<SideMenu open onClose={onClose} />)
    expect(menu.className).toContain('translate-x-0')
    expect(menu).toHaveFocus()
    expect(modalOverlay().className).not.toContain('hidden')

    fireEvent.keyDown(window, { key: 'Enter' })
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)

    rerender(<SideMenu open={false} onClose={onClose} />)
    expect(menu.className).toContain('-translate-x-full')
    expect(menu.className).not.toContain('translate-x-0')
    expect(modalOverlay().className).toContain('hidden')
  })
})
