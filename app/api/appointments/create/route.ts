import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { generateBookingCode } from '@/lib/utils'

interface CreateBody {
  shopId: string
  staffId: string | null
  noPreference: boolean
  serviceId: string
  date: string
  timeSlot: string
  customerName: string
  customerPhone: string
  status: 'pending' | 'approved'
}

export async function POST(req: NextRequest) {
  const body: CreateBody = await req.json()
  const { shopId, staffId, noPreference, serviceId, date, timeSlot, customerName, customerPhone, status } = body

  if (!shopId || !serviceId || !date || !timeSlot || !customerName?.trim() || !customerPhone?.trim()) {
    return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 })
  }
  if (status !== 'pending' && status !== 'approved') {
    return NextResponse.json({ error: 'Geçersiz durum' }, { status: 400 })
  }
  if (!noPreference && !staffId) {
    return NextResponse.json({ error: 'Berber seçilmedi' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()

  let selectedStaffId = staffId

  if (noPreference) {
    const { data: staffList, error: staffErr } = await admin.from('staff').select('id').eq('shop_id', shopId).eq('is_active', true)
    if (staffErr) return NextResponse.json({ error: 'Personel listesi alınamadı' }, { status: 500 })
    const { data: busy } = await admin
      .from('appointments')
      .select('staff_id')
      .eq('shop_id', shopId)
      .eq('date', date)
      .in('status', ['pending', 'approved'])

    const counts: Record<string, number> = {}
    staffList?.forEach(s => { counts[s.id] = 0 })
    busy?.forEach(a => { counts[a.staff_id] = (counts[a.staff_id] ?? 0) + 1 })
    selectedStaffId = [...(staffList ?? [])].sort((a, b) => (counts[a.id] ?? 0) - (counts[b.id] ?? 0))[0]?.id ?? null
  }

  if (!selectedStaffId) {
    return NextResponse.json({ error: 'Berber bulunamadı' }, { status: 400 })
  }

  const { data: conflict } = await admin
    .from('appointments')
    .select('id')
    .eq('shop_id', shopId)
    .eq('staff_id', selectedStaffId)
    .eq('date', date)
    .eq('time_slot', timeSlot)
    .in('status', ['pending', 'approved'])
    .limit(1)

  if (conflict && conflict.length > 0) {
    return NextResponse.json({ error: 'Bu saat dolu. Lütfen başka bir saat seçin.' }, { status: 409 })
  }

  const bookingCode = generateBookingCode()
  const { error: insertError } = await admin.from('appointments').insert({
    shop_id: shopId,
    staff_id: selectedStaffId,
    service_id: serviceId,
    customer_name: customerName.trim(),
    customer_phone: customerPhone.trim(),
    date,
    time_slot: timeSlot,
    status,
    booking_code: bookingCode,
    notes: null,
  })

  if (insertError) {
    return NextResponse.json({ error: 'Randevu oluşturulamadı' }, { status: 500 })
  }

  return NextResponse.json({ success: true, bookingCode })
}
