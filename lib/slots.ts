import type { WorkingHours } from '@/types'

export function generateTimeSlots(hours: WorkingHours[], dayOfWeek: number): string[] {
  const dayHours = hours.find(h => h.day_of_week === dayOfWeek)
  if (!dayHours || dayHours.is_closed) return []

  const [openH, openM] = dayHours.open_time.split(':').map(Number)
  const [closeH, closeM] = dayHours.close_time.split(':').map(Number)

  const slots: string[] = []
  let h = openH
  let m = openM

  while (h < closeH || (h === closeH && m < closeM)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    m += 60
    if (m >= 60) { h += Math.floor(m / 60); m = m % 60 }
  }

  return slots
}

export function getShopThemeVars(shop: { theme_dominant?: string | null; theme_accent?: string | null; theme_button?: string | null; theme_pending?: string | null; theme_approved?: string | null; theme_rejected?: string | null }) {
  return {
    '--theme-dominant': shop.theme_dominant ?? '#111111',
    '--theme-accent': shop.theme_accent ?? '#C85A17',
    '--theme-button': shop.theme_button ?? '#C85A17',
    '--theme-pending': shop.theme_pending ?? '#F97316',
    '--theme-approved': shop.theme_approved ?? '#1FA34A',
    '--theme-rejected': shop.theme_rejected ?? '#D72638',
  } as React.CSSProperties
}
