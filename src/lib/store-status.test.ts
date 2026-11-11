import { describe, expect, it } from 'vitest'
import { getStoreStatus } from './store-status'

describe('getStoreStatus', () => {
  it('abre exatamente às 08:00 no fuso da loja', () => {
    const status = getStoreStatus(new Date('2026-11-11T08:00:00-03:00'))
    expect(status.isOpen).toBe(true)
    expect(status.openLabel).toBe('8h às 22h')
  })

  it('às 07:59 ainda está fechado e abre hoje', () => {
    const status = getStoreStatus(new Date('2026-11-11T07:59:00-03:00'))
    expect(status.isOpen).toBe(false)
    expect(status.closedLabel).toBe('Abrimos hoje às 8h')
  })

  it('às 21:59 ainda está aberto', () => {
    expect(getStoreStatus(new Date('2026-11-11T21:59:00-03:00')).isOpen).toBe(true)
  })

  it('às 22:00 em ponto fecha e reabre amanhã', () => {
    const status = getStoreStatus(new Date('2026-11-11T22:00:00-03:00'))
    expect(status.isOpen).toBe(false)
    expect(status.closedLabel).toBe('Abrimos amanhã às 8h')
  })

  it('às 23:00 continua fechado até amanhã', () => {
    const status = getStoreStatus(new Date('2026-11-11T23:00:00-03:00'))
    expect(status.isOpen).toBe(false)
    expect(status.closedLabel).toBe('Abrimos amanhã às 8h')
  })

  it('de madrugada, a abertura de hoje é anunciada como amanhã', () => {
    const status = getStoreStatus(new Date('2026-11-11T02:00:00-03:00'))
    expect(status.isOpen).toBe(false)
    expect(status.closedLabel).toBe('Abrimos amanhã às 8h')
  })

  it('meia-noite no fuso da loja (hora 24 em alguns runtimes) é tratada como hora 0', () => {
    const status = getStoreStatus(new Date('2026-11-12T03:00:00Z'))
    expect(status.isOpen).toBe(false)
    expect(status.closedLabel).toBe('Abrimos amanhã às 8h')
  })

  it('converte de outro fuso: 11:00Z equivale a 08:00 em Fortaleza (aberto)', () => {
    expect(getStoreStatus(new Date('2026-11-11T11:00:00Z')).isOpen).toBe(true)
  })

  it('converte de outro fuso: 01:00Z equivale a 22:00 em Fortaleza (fechado)', () => {
    const status = getStoreStatus(new Date('2026-11-11T01:00:00Z'))
    expect(status.isOpen).toBe(false)
    expect(status.closedLabel).toBe('Abrimos amanhã às 8h')
  })
})
