'use client'

import { useState } from 'react'
import { AdminHeader } from './AdminHeader'
import { AdminNav } from './AdminNav'
import { Card } from '@/components/ui/Card'
import { formatDateTR, formatCurrency } from '@/lib/utils'
import { STATUS_LABELS, STATUS_COLORS } from '@/types'
import type { Shop, Appointment, BookingStatus } from '@/types'
import { supabase } from '@/lib/supabase'

type FilterStatus = 'all' | BookingStatus
type ViewMode = 'list' | 'calendar'

interface Props {
  shop: Shop
  appointments: Appointment[]
}

export function BookingsView({ shop, appointments: init }: Props) {
  const [appts, setAppts] = useState(init)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [view, setView] = useState<ViewMode>('list')

  const filtered = appts.filter(a => filter === 'all' || a.status === filter)
    .sort((a, b) => `${b.date} ${b.time_slot}`.localeCompare(`${a.date} ${a.time_slot}`))

  async function updateStatus(id: string, status: string) {
    await supabase.from('appointments').update({ status }).eq('id', id)
    setAppts(prev => prev.map(a => a.id === id ? { ...a, status: status as BookingStatus } : a))
  }

  return (
    <div>
      <AdminHeader shop={shop} />
      <AdminNav slug={shop.slug} />

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-brand-black">Randevular</h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {(['list', 'calendar'] as ViewMode[]).map(m => (
              <button
                key={m}
                onClick={() => setView(m)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${view === m ? 'bg-white text-brand-black shadow-sm' : 'text-gray-400'}`}
              >
                {m === 'list' ? '≡ Liste' : '🗓 Takvim'}
              </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {(['all', 'pending', 'approved', 'rejected', 'cancelled'] as FilterStatus[]).map(f => {
            const labels = { all: 'Tümü', ...STATUS_LABELS }
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filter === f ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-500'
                }`}
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
                  <span className="text-xs text-gray-400">{a.booking_code}</span>
                </div>
                <p className="font-bold text-sm text-brand-black">{a.customer_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.service?.name} • {a.staff?.name}</p>
                <p className="text-xs text-gray-400">{formatDateTR(a.date)} {a.time_slot}</p>
                <p className="text-xs text-gray-400">{a.customer_phone}</p>
                {a.service && (
                  <p className="text-xs font-bold text-brand-orange mt-1">{formatCurrency(a.service.price)}</p>
                )}
                {a.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => updateStatus(a.id, 'approved')}
                      className="flex-1 text-xs bg-brand-green text-white py-2 rounded-lg font-semibold"
                    >
                      Onayla
                    </button>
                    <button
                      onClick={() => updateStatus(a.id, 'rejected')}
                      className="flex-1 text-xs bg-gray-100 text-brand-red py-2 rounded-lg font-semibold"
                    >
                      Reddet
                    </button>
                  </div>
                )}
                {a.status === 'approved' && (
                  <button
                    onClick={() => updateStatus(a.id, 'cancelled')}
                    className="w-full mt-2 text-xs text-gray-400 border border-gray-200 py-1.5 rounded-lg"
                  >
                    İptal Et
                  </button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
