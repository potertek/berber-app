'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { formatDateTR, formatCurrency } from '@/lib/utils'
import type { Shop } from '@/types'
import type { BookingState } from './BookingWizard'

interface Props {
  shop: Shop
  booking: BookingState
  onClose: () => void
}

export function StepConfirm({ shop, booking, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const accent = shop.theme_accent ?? '#C85A17'
  const dominant = shop.theme_dominant ?? '#111111'
  const approvedColor = shop.theme_approved ?? '#1FA34A'

  async function confirm() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: shop.id,
          staffId: booking.staff?.id ?? null,
          noPreference: booking.noPreference,
          serviceId: booking.service!.id,
          date: booking.date,
          timeSlot: booking.time,
          customerName: booking.name,
          customerPhone: booking.phone,
          status: 'pending',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Randevu oluşturulamadı. Lütfen tekrar deneyin.')
        setLoading(false)
        return
      }
      setCode(data.bookingCode)
    } catch {
      setError('Randevu oluşturulamadı. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  if (code) {
    return (
      <div className="px-4 py-8 flex flex-col items-center animate-slide-up">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-4" style={{ backgroundColor: `${approvedColor}20` }}>
          <span style={{ color: approvedColor }}>✓</span>
        </div>
        <h3 className="text-xl font-black mb-2" style={{ color: dominant }}>Randevu Alındı!</h3>
        <p className="text-sm text-gray-500 text-center mb-6">Randevunuz onay bekliyor. Kodu saklayın, iptal için gerekli.</p>

        <Card className="w-full text-center mb-4 py-5">
          <p className="text-xs text-gray-400 mb-2">Randevu Kodunuz</p>
          <p className="text-3xl font-black tracking-widest" style={{ color: accent }}>{code}</p>
        </Card>

        <Card className="w-full mb-6">
          <div className="space-y-2.5">
            <Row label="Hizmet" value={booking.service?.name ?? ''} />
            <Row label="Berber" value={booking.noPreference ? 'Atandı' : booking.staff?.name ?? ''} />
            <Row label="Tarih" value={formatDateTR(booking.date)} />
            <Row label="Saat" value={booking.time} />
            <Row label="Ad Soyad" value={booking.name} />
            <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700">Toplam</span>
              <span className="text-lg font-black" style={{ color: accent }}>{formatCurrency(booking.service?.price ?? 0)}</span>
            </div>
          </div>
        </Card>

        <p className="text-xs text-gray-400 text-center mb-4">
          Randevunuzu iptal etmek için <strong>/{shop.slug}/cancel</strong> sayfasını ziyaret edin.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-600"
        >
          Kapat
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-5 animate-slide-up">
      <h3 className="text-base font-black mb-4" style={{ color: dominant }}>Randevuyu Onayla</h3>

      <Card className="mb-4">
        <div className="space-y-2.5">
          <Row label="Hizmet" value={booking.service?.name ?? ''} />
          <Row label="Berber" value={booking.noPreference ? 'Fark etmez (otomatik atanır)' : booking.staff?.name ?? ''} />
          <Row label="Tarih" value={formatDateTR(booking.date)} />
          <Row label="Saat" value={booking.time} />
          <Row label="Ad Soyad" value={booking.name} />
          <Row label="Telefon" value={booking.phone} />
          <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-700">Toplam</span>
            <span className="text-lg font-black" style={{ color: accent }}>{formatCurrency(booking.service?.price ?? 0)}</span>
          </div>
        </div>
      </Card>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#FEF2F2', color: shop.theme_rejected ?? '#D72638' }}>
          {error}
        </div>
      )}

      <button
        onClick={confirm}
        disabled={loading}
        className="w-full py-4 rounded-2xl text-white font-black text-base shadow-sm disabled:opacity-50 transition-all"
        style={{ backgroundColor: accent }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            İşleniyor...
          </span>
        ) : 'Randevuyu Onayla'}
      </button>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm gap-2">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span className="font-semibold text-right truncate">{value}</span>
    </div>
  )
}
