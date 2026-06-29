import { format, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDateTR(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'd MMMM yyyy', { locale: tr })
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd.MM.yyyy')
  } catch {
    return dateStr
  }
}

export function generateBookingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getWeekDates(): string[] {
  const today = new Date()
  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push(format(d, 'yyyy-MM-dd'))
  }
  return dates
}
