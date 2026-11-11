import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import OpeningOverlay from './OpeningOverlay'

function stubMatchMedia(reducedMotion: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: reducedMotion && query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )
}

function overlayRoot(): HTMLElement | null {
  return document.getElementById('opening-overlay')
}

async function advance(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms)
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  stubMatchMedia(false)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('OpeningOverlay', () => {
  it('renderiza overlay com wordmark, slogan e botão Pular', () => {
    render(<OpeningOverlay />)

    const overlay = overlayRoot()
    expect(overlay).not.toBeNull()
    expect(overlay?.className).toContain('opacity-100')
    expect(screen.getByText('Bebidas')).toBeInTheDocument()
    expect(screen.getByText('Moraes')).toBeInTheDocument()
    expect(screen.getByText('Seu depósito de bebidas, agora online.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pular' })).toBeInTheDocument()
  })

  it('auto-close: opacidade zerada aos 1600ms e sai do DOM 500ms depois', async () => {
    render(<OpeningOverlay />)

    await advance(1599)
    expect(overlayRoot()?.className).toContain('opacity-100')

    await advance(1)
    expect(overlayRoot()?.className).toContain('opacity-0')

    await advance(499)
    expect(overlayRoot()).not.toBeNull()

    await advance(1)
    expect(overlayRoot()).toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('botão Pular fecha imediato e cancela o timer de auto-fechamento', async () => {
    render(<OpeningOverlay />)
    expect(vi.getTimerCount()).toBe(1)

    fireEvent.click(screen.getByRole('button', { name: 'Pular' }))
    expect(overlayRoot()?.className).toContain('opacity-0')

    await advance(500)
    expect(overlayRoot()).toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('ESC fecha o overlay imediatamente', () => {
    render(<OpeningOverlay />)

    fireEvent.keyDown(window, { key: 'Enter' })
    expect(overlayRoot()?.className).toContain('opacity-100')

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(overlayRoot()?.className).toContain('opacity-0')
  })

  it('clique no overlay inteiro fecha imediatamente', () => {
    render(<OpeningOverlay />)

    fireEvent.click(overlayRoot()!)

    expect(overlayRoot()?.className).toContain('opacity-0')
  })

  it('prefers-reduced-motion: não renderiza nada e nenhum timer roda', () => {
    stubMatchMedia(true)
    render(<OpeningOverlay />)

    expect(overlayRoot()).toBeNull()
    expect(screen.queryByRole('button', { name: 'Pular' })).not.toBeInTheDocument()
    expect(vi.getTimerCount()).toBe(0)
  })
})
