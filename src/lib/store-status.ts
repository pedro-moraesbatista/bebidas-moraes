import { siteConfig } from '../data/siteConfig'

export interface StoreStatus {
  isOpen: boolean
  openLabel: string
  closedLabel: string
}

const { openHour, closeHour, timeZone } = siteConfig.delivery.storeHours

// De madrugada (antes das 6h) a próxima abertura — hoje às 8h — é dita como "amanhã":
// é o visitante da noite falando, para quem a manhã seguinte ainda é "amanhã".
const MADRUGADA_END_HOUR = 6

export function getStoreStatus(now?: Date): StoreStatus {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    timeZone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now ?? new Date())

  const hour = normalizeHour(Number(parts.find((part) => part.type === 'hour')?.value))
  const minute = Number(parts.find((part) => part.type === 'minute')?.value)
  const minutesOfDay = hour * 60 + minute

  const isOpen = minutesOfDay >= openHour * 60 && minutesOfDay < closeHour * 60
  const reopensToday = minutesOfDay < openHour * 60 && hour >= MADRUGADA_END_HOUR

  return {
    isOpen,
    openLabel: `${openHour}h às ${closeHour}h`,
    closedLabel: reopensToday
      ? `Abrimos hoje às ${openHour}h`
      : `Abrimos amanhã às ${openHour}h`,
  }
}

function normalizeHour(hour: number): number {
  return hour === 24 ? 0 : hour
}
