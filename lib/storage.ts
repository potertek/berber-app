export type Appointment = {
  id: string
  serviceId: string
  serviceName: string
  staffId: string
  staffName: string
  date: string
  time: string
  customerName: string
  customerPhone: string
  createdAt: string
  status: 'confirmed' | 'cancelled'
}

const KEY = 'berber_appointments'

export function getAppointments(): Appointment[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveAppointment(appt: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Appointment {
  const appointments = getAppointments()
  const newAppt: Appointment = {
    ...appt,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'confirmed',
  }
  appointments.push(newAppt)
  localStorage.setItem(KEY, JSON.stringify(appointments))
  return newAppt
}

export function cancelAppointment(id: string): void {
  const appointments = getAppointments()
  const updated = appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a))
  localStorage.setItem(KEY, JSON.stringify(updated))
}

export function isSlotTaken(date: string, time: string, staffId: string): boolean {
  const appointments = getAppointments()
  return appointments.some(
    (a) => a.date === date && a.time === time && a.staffId === staffId && a.status === 'confirmed'
  )
}

const SERVICES_KEY = 'berber_services'
const HOURS_KEY = 'berber_hours'
const BLOCKED_KEY = 'berber_blocked'

export function getCustomServices() {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem(SERVICES_KEY)
    return v ? JSON.parse(v) : null
  } catch { return null }
}

export function saveCustomServices(services: unknown[]) {
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services))
}

export function getCustomHours() {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem(HOURS_KEY)
    return v ? JSON.parse(v) : null
  } catch { return null }
}

export function saveCustomHours(hours: unknown[]) {
  localStorage.setItem(HOURS_KEY, JSON.stringify(hours))
}

export function getBlockedDates(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(BLOCKED_KEY) || '[]')
  } catch { return [] }
}

export function saveBlockedDates(dates: string[]) {
  localStorage.setItem(BLOCKED_KEY, JSON.stringify(dates))
}
