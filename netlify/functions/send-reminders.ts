import type { Config } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { sendSms } from '../../lib/netgsm'

const TR_OFFSET_MS = 3 * 60 * 60 * 1000 // Europe/Istanbul, UTC+3 (DST yok)
const WINDOW_BEFORE_MS = 55 * 60 * 1000
const WINDOW_AFTER_MS = 65 * 60 * 1000

function slotToUtcDate(date: string, timeSlot: string): Date {
  const [h, m] = timeSlot.split(':').map(Number)
  const localMs = Date.parse(`${date}T00:00:00.000Z`) + h * 60 * 60 * 1000 + m * 60 * 1000
  return new Date(localMs - TR_OFFSET_MS)
}

export default async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('[send-reminders] Supabase env değişkenleri eksik')
    return
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

  const now = Date.now()
  const today = new Date(now).toISOString().slice(0, 10)
  const tomorrow = new Date(now + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const { data: appts, error } = await admin
    .from('appointments')
    .select('id, customer_name, customer_phone, date, time_slot, status, reminder_sent_at, shop:shops(name)')
    .eq('status', 'approved')
    .is('reminder_sent_at', null)
    .in('date', [today, tomorrow])

  if (error) {
    console.error('[send-reminders] Sorgu hatası', error)
    return
  }

  for (const appt of appts ?? []) {
    const apptTime = slotToUtcDate(appt.date, appt.time_slot).getTime()
    const diff = apptTime - now
    if (diff < WINDOW_BEFORE_MS || diff > WINDOW_AFTER_MS) continue

    const shopName = Array.isArray(appt.shop) ? appt.shop[0]?.name : (appt.shop as { name?: string } | null)?.name

    try {
      await sendSms(
        appt.customer_phone,
        `Sayın ${appt.customer_name}, ${appt.time_slot} saatindeki randevunuza 1 saat kaldı.${shopName ? ` ${shopName}` : ''}`
      )
      await admin.from('appointments').update({ reminder_sent_at: new Date().toISOString() }).eq('id', appt.id)
    } catch (e) {
      console.error(`[send-reminders] SMS gönderilemedi (appt ${appt.id})`, e)
    }
  }
}

export const config: Config = {
  schedule: '*/5 * * * *',
}
