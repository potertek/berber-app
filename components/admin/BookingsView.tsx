'use client'

import { useState } from 'react'
import { AdminHeader } from './AdminHeader'
import { AdminNav } from './AdminNav'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatDateTR, formatCurrency, getTodayString } from '@/lib/utils'
import { STATUS_LABELS, STATUS_COLORS, TIME_SLOTS } from '@/types'
import type { Shop, Appointment, BookingStatus, Service, StaffMember } from '@/types'
import { supabase } from '@/lib/supabase'

type FilterStatus = 'all' | BookingStatus

interface Props {
  shop: Shop
  appointments: Appointment[]
  services: Service[]
  staff: StaffMember[]
}

export function BookingsView({ shop, appointments: init, services, staff }: Props) {
  const [appts, setAppts] = useState(init)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    service_id: services[0]?.id ?? '',
    staff_id: staff[0]?.id ?? '',
    date: getTodayString(),
    time_slot: '09:00',
  })

  const filtered = appts
    .filter(a => filter === 'all' || a.status === filter)
    .sort((a, b) => `${b.date} ${b.time_slot}`.localeCompare(`${a.date} ${a.time_slot}`))

  async function updateStatus(id: string, status: string) {
    await supabase.from('appointments').update({ status }).eq('id', id)
    setAppts(prev => prev.map(a => a.id === id ? { ...a, status: status as BookingStatus } : a))
  }

  async function deleteAppointment(id: string) {
    if (!confirm('Bu randevuyu silmek istediğinize emin misiniz?')) return
    await fetch('/api/appointments/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setAppts(prev => prev.filter(a => a.id !== id))
  }

  async function addManual(e: React.FormEvent) {
    e.preventDefault()
    if (!form.customer_name || !form.customer_phone || !form.service_id || !form.staff_id) return
    setSaving(true)
    const res = await fetch('/api/appointments/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopId: shop.id,
        staffId: form.staff_id,
        serviceId: form.service_id,
        date: form.date,
        timeSlot: form.time_slot,
        customerName: form.customer_name,
        customerPhone: form.customer_phone,
      }),
    })
    const data = await res.json()

    if (res.ok && data.appointment) {
      setAppts(prev => [data.appointment as Appointment, ...prev])
      setForm({ customer_name: '', customer_phone: '', service_id: services[0]?.id ?? '', staff_id: staff[0]?.id ?? '', date: getTodayString(), time_slot: '09:00' })
      setShowForm(false)
    }
    setSaving(false)
  }

  const accent = shop.theme_accent ?? '#C85A17'

  return (
    <div>
      <AdminHeader shop={shop} />
      <AdminNav slug={shop.slug} />

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-gray-900">Randevular</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs text-white font-bold px-3 py-2 rounded-xl"
            style={{ backgroundColor: accent }}
          >
            {showForm ? 'İptal' : '+ Manuel Ekle'}
          </button>
        </div>

        {/* Manuel randevu formu */}
        {showForm && (
          <Card className="mb-4">
            <h3 className="font-bold text-sm mb-3 text-gray-900">Telefon Randevusu Ekle</h3>
            <form onSubmit={addManual} className="space-y-3">
              <Input
                label="Müşteri Adı *"
                placeholder="Ad Soyad"
                value={form.customer_name}
                onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                required
              />
              <Input
                label="Telefon *"
                placeholder="05XX XXX XX XX"
                type="tel"
                value={form.customer_phone}
                onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hizmet *</label>
                <select
                  value={form.service_id}
                  onChange={e => setForm(f => ({ ...f, service_id: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} — {s.price}₺</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Berber *</label>
                <select
                  value={form.staff_id}
                  onChange={e => setForm(f => ({ ...f, staff_id: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm"
                >
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tarih *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Saat *</label>
                  <select
                    value={form.time_slot}
                    onChange={e => setForm(f => ({ ...f, time_slot: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm"
                  >
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <Button type="submit" loading={saving} className="w-full">Randevuyu Kaydet</Button>
            </form>
          </Card>
        )}

        {/* Filtre */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {(['all', 'approved', 'pending', 'cancelled'] as FilterStatus[]).map(f => {
            const labels: Record<FilterStatus, string> = { all: 'Tümü', approved: 'Onaylı', pending: 'Bekleyen', cancelled: 'İptal' }
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={filter === f ? { backgroundColor: accent, color: 'white' } : { backgroundColor: '#f3f4f6', color: '#6b7280' }}
              >
                {labels[f]}
              </button>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">Randevu bulunamadı</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => (
              <Card key={a.id}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${STATUS_COLORS[a.status]}`}>
                    {STATUS_LABELS[a.status]}
                  </span>
                  <span className="text-xs text-gray-300">{a.booking_code}</span>
                </div>
                <p className="font-bold text-sm text-gray-900">{a.customer_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.service?.name} • {a.staff?.name}</p>
                <p className="text-xs text-gray-400">{formatDateTR(a.date)} • {a.time_slot}</p>
                <p className="text-xs text-gray-400">{a.customer_phone}</p>
                {a.service && (
                  <p className="text-xs font-bold mt-1" style={{ color: accent }}>{formatCurrency(a.service.price)}</p>
                )}
                <div className="flex gap-2 mt-3">
                  {a.status === 'pending' && (
                    <button onClick={() => updateStatus(a.id, 'approved')}
                      className="flex-1 text-xs text-white py-2 rounded-lg font-semibold"
                      style={{ backgroundColor: shop.theme_approved ?? '#1FA34A' }}>
                      Onayla
                    </button>
                  )}
                  {(a.status === 'approved' || a.status === 'pending') && (
                    <button onClick={() => updateStatus(a.id, 'cancelled')}
                      className="flex-1 text-xs py-2 rounded-lg font-semibold border border-gray-200 text-gray-400">
                      İptal Et
                    </button>
                  )}
                  {a.status === 'cancelled' && (
                    <button onClick={() => deleteAppointment(a.id)}
                      className="flex-1 text-xs py-2 rounded-lg font-semibold border border-red-200 text-red-400">
                      Sil
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
