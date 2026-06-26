'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatDateTR, formatCurrency, generateBookingCode } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Shop, StaffMember } from '@/types'
import type { BookingState } from './BookingWizard'

interface Props {
  shop: Shop
  booking: BookingState
  staff: StaffMember[]
  onClose: () => void
}

export function StepConfirm({ shop, booking, staff: allStaff, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setLoading(true)
    setError(null)
    try {
      let selectedStaff = booking.staff

      if (booking.noPreference) {
        const { data: appointments } = await supabase
          .from('appointments')
          .select('staff_id')
          .eq('shop_id', shop.id)
          .eq('date', booking.date)
          .in('status', ['pending', 'approved'])

        const busyCounts: Record<string, number> = {}
        allStaff.forEach(s => { busyCounts[s.id] = 0 })
        appointments?.forEach(a => { busyCounts[a.staff_id] = (busyCounts[a.staff_id] ?? 0) + 1 })

        const leastBusy = allStaff.sort((a, b) => (busyCounts[a.id] ?? 0) - (busyCounts[b.id] ?? 0))[0]
        selectedStaff = leastBusy ?? allStaff[0]
      }

      if (!selectedStaff) throw new Error('Berber seçilemedi')

      const { data: conflict } = await supabase
        .from('appointments')
        .select('id')
        .eq('shop_id', shop.id)
        .eq('staff_id', selectedStaff.id)
        .eq('date', booking.date)
        .eq('time_slot', booking.time)
        .in('status', ['pending', 'approved'])
        .limit(1)

      if (conflict && conflict.length > 0) {
        setError('Bu saat dolu. Lütfen başka bir saat seçin.')
        setLoading(false)
        return
      }

      const bookingCode = generateBookingCode()
      const { error: insertError } = await supabase.from('appointments').insert({
        shop_id: shop.id,
        staff_id: selectedStaff.id,
        service_id: booking.service!.id,
        customer_name: booking.name,
        customer_phone: booking.phone,
        date: booking.date,
        time_slot: booking.time,
        status: 'pending',
        booking_code: bookingCode,
        notes: null,
      })

      if (insertError) throw insertError
      setCode(bookingCode)
    } catch {
      setError('Randevu oluşturulamadı. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  if (code) {
    return (
      <div className="px-4 py-8 flex flex-col items-center animate-slide-up">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mb-4">✓</div>
        <h3 className="text-xl font-black text-brand-black mb-2">Randevu Alındı!</h3>
        <p className="text-sm text-gray-500 text-center mb-6">Randevunuz onay bekliyor. Randevu kodunuzu saklayın.</p>
        <Card className="w-full text-center mb-6">
          <p className="text-xs text-gray-400 mb-1">Randevu Kodu</p>
          <p className="text-3xl font-black text-brand-orange tracking-widest">{code}</p>
        </Card>
        <Card className="w-full mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Hizmet</span>
            <span className="font-semibold">{booking.service?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tarih</span>
            <span className="font-semibold">{formatDateTR(booking.date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Saat</span>
            <span className="font-semibold">{booking.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Ücret</span>
            <span className="font-bold text-brand-orange">{formatCurrency(booking.service?.price ?? 0)}</span>
          </div>
        </Card>
        <Button onClick={onClose} variant="outline" className="w-full">Kapat</Button>
      </div>
    )
  }

  return (
    <div className="px-4 py-5 animate-slide-up">
      <h3 className="text-base font-black text-brand-black mb-4">Randevuyu Onayla</h3>

      <Card className="mb-4 space-y-3">
        <Row label="Hizmet" value={booking.service?.name ?? ''} />
        <Row label="Berber" value={booking.noPreference ? 'Fark etmez' : booking.staff?.name ?? ''} />
        <Row label="Tarih" value={formatDateTR(booking.date)} />
        <Row label="Saat" value={booking.time} />
        <Row label="Ad Soyad" value={booking.name} />
        <Row label="Telefon" value={booking.phone} />
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-sm font-bold text-gray-700">Toplam</span>
          <span className="text-lg font-black text-brand-orange">{formatCurrency(booking.service?.price ?? 0)}</span>
        </div>
      </Card>

      {error && <p className="text-sm text-brand-red bg-red-50 px-4 py-3 rounded-xl mb-4">{error}</p>}

      <Button onClick={confirm} loading={loading} size="lg" className="w-full">
        Randevuyu Onayla
      </Button>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-right max-w-[60%] truncate">{value}</span>
    </div>
  )
}
