import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { generateBookingCode } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { shopId, staffId, serviceId, date, timeSlot, customerName, customerPhone } = body

  if (!shopId || !staffId || !serviceId || !date || !timeSlot || !customerName?.trim() || !customerPhone?.trim()) {
    return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()
  const bookingCode = generateBookingCode()

  const { data, error } = await admin
    .from('appointments')
    .insert({
      shop_id: shopId,
      staff_id: staffId,
      service_id: serviceId,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      date,
      time_slot: timeSlot,
      status: 'approved',
      booking_code: bookingCode,
      notes: 'Manuel eklendi',
    })
    .select('*, staff:staff(*), service:services(*)')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Randevu oluşturulamadı' }, { status: 500 })
  }

  return NextResponse.json({ success: true, appointment: data })
}
