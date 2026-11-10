import { describe, expect, it } from 'vitest'
import { formatBRL } from './format'

describe('formatBRL', () => {
  it('formata valores inteiros com duas casas fixas', () => {
    expect(formatBRL(119)).toBe('R$ 119,00')
    expect(formatBRL(80)).toBe('R$ 80,00')
  })

  it('formata valores com centavos', () => {
    expect(formatBRL(11.9)).toBe('R$ 11,90')
    expect(formatBRL(7.5)).toBe('R$ 7,50')
    expect(formatBRL(0.05)).toBe('R$ 0,05')
  })

  it('formata zero', () => {
    expect(formatBRL(0)).toBe('R$ 0,00')
  })

  it('formata valores altos sem agrupamento de milhares', () => {
    expect(formatBRL(1190)).toBe('R$ 1190,00')
    expect(formatBRL(87.4)).toBe('R$ 87,40')
  })

  it('arredonda para duas casas decimais', () => {
    expect(formatBRL(83.299)).toBe('R$ 83,30')
  })
})