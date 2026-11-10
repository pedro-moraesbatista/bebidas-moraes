import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCallback, useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SplashOverlay from './SplashOverlay'

const AUTO_CLOSE_MS = 2300
const CLOSE_ANIMATION_MS = 700

// O asyncWrapper do RTL drena microtasks com um timer de 0ms e só o ticka se
// `jestFakeTimersAreEnabled()` for true: em Vitest não existe global `jest`,
// e o timer fake (que tem `.clock`) nunca dispara sozinho, travando todo
// `await user.click(...)` sob vi.useFakeTimers(). O shim abaixo delega ao `vi`
// e é inerte quando os timers são reais (a checagem exige `setTimeout.clock`).
const jestGlobal = globalThis as typeof globalThis & {
  jest?: { advanceTimersByTime: (ms: number) => void }
}
jestGlobal.jest ??= { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) }

const originalMatchMedia = window.matchMedia

function stubMatchMediaPrefersReduced() {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function restoreMatchMedia() {
  if (originalMatchMedia === undefined) {
    delete (window as unknown as { matchMedia?: unknown }).matchMedia
    return
  }
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: originalMatchMedia,
  })
}

function SplashHarness() {
  const [open, setOpen] = useState(true)
  const [session, setSession] = useState(0)
  const onClose = useCallback(() => setOpen(false), [])
  const replay = useCallback(() => {
    setSession((value) => value + 1)
    setOpen(true)
  }, [])

  return (
    <>
      <SplashOverlay key={session} open={open} onClose={onClose} />
      <button type="button" onClick={replay}>replay-splash</button>
    </>
  )
}

function SkipHarness({ onSkip }: { onSkip: () => void }) {
  const [open, setOpen] = useState(true)
  const onClose = useCallback(() => {
    setOpen(false)
    onSkip()
  }, [onSkip])
  return <SplashOverlay key="skip" open={open} onClose={onClose} />
}

describe('SplashOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    restoreMatchMedia()
    vi.useRealTimers()
  })

  it('renderiza o splash-screen com botão Pular e badge CLINK! quando open', () => {
    render(<SplashOverlay open onClose={() => {}} />)

    expect(document.getElementById('splash-screen')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Pular/ })).toBeInTheDocument()
    expect(document.getElementById('splash-clink-badge')).toHaveTextContent('CLINK!')
  })

  it('auto-close: chama onClose uma única vez após 2300ms', () => {
    const onClose = vi.fn()
    render(<SplashOverlay open onClose={onClose} />)

    act(() => vi.advanceTimersByTime(AUTO_CLOSE_MS - 1))
    expect(onClose).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1))
    expect(onClose).toHaveBeenCalledTimes(1)

    act(() => vi.advanceTimersByTime(AUTO_CLOSE_MS))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clicar em Pular chama onClose imediatamente e cancela o auto-close', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onSkip = vi.fn()
    render(<SkipHarness onSkip={onSkip} />)

    await user.click(screen.getByRole('button', { name: /Pular/ }))

    expect(onSkip).toHaveBeenCalledTimes(1)

    act(() => vi.advanceTimersByTime(CLOSE_ANIMATION_MS - 1))
    expect(document.getElementById('splash-screen')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1))
    expect(document.getElementById('splash-screen')).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(AUTO_CLOSE_MS))
    expect(onSkip).toHaveBeenCalledTimes(1)
  })

  it('com prefers-reduced-motion: reduce não renderiza nada e encerra o splash', () => {
    stubMatchMediaPrefersReduced()
    const onClose = vi.fn()
    const { container } = render(<SplashOverlay open onClose={onClose} />)

    expect(container).toBeEmptyDOMElement()
    expect(document.getElementById('splash-screen')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Pular/ })).not.toBeInTheDocument()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('ao fechar (open=false) sai do DOM após a animação de ~700ms', () => {
    const { rerender } = render(<SplashOverlay open onClose={() => {}} />)

    rerender(<SplashOverlay open={false} onClose={() => {}} />)
    const splash = document.getElementById('splash-screen')
    expect(splash).toBeInTheDocument()
    expect(splash?.className).toContain('opacity-0')

    act(() => vi.advanceTimersByTime(CLOSE_ANIMATION_MS - 1))
    expect(document.getElementById('splash-screen')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1))
    expect(document.getElementById('splash-screen')).not.toBeInTheDocument()
  })

  it('remontagem com key diferente reagenda o ciclo completo de auto-close', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SplashHarness />)

    act(() => vi.advanceTimersByTime(AUTO_CLOSE_MS))
    act(() => vi.advanceTimersByTime(CLOSE_ANIMATION_MS))
    expect(document.getElementById('splash-screen')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'replay-splash' }))
    expect(screen.getByRole('button', { name: /Pular/ })).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(AUTO_CLOSE_MS - 1))
    expect(screen.getByRole('button', { name: /Pular/ })).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1))
    expect(document.getElementById('splash-screen')).toBeInTheDocument()
    expect(document.getElementById('splash-screen')?.className).toContain('opacity-0')

    act(() => vi.advanceTimersByTime(CLOSE_ANIMATION_MS))
    expect(document.getElementById('splash-screen')).not.toBeInTheDocument()
  })
})
