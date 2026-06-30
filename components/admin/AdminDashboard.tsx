'use client'

import { useState } from 'react'
import { AdminHeader } from './AdminHeader'
import { AdminNav } from './AdminNav'
import { Card } from '@/components/ui/Card'
import { formatDateTR, formatCurrency, getTodayString } from '@/lib/utils'
import { STATUS_LABELS } from '@/types'
import type { Shop, Appointment, WalkIn, StaffMember, BookingStatus } from '@/types'
import { supabase } from '@/lib/supabase'

interface Props {
  shop: Shop
  appointments: Appointment[]
  walkIns: WalkIn[]
  staff: StaffMember[]
}

export function AdminDashboard({ shop, appointments, walkIns, staff }: Props) {
  const [appts, setAppts] = useState(appointments)
  const today = getTodayString()

  const accent = shop.theme_accent ?? '#C85A17'
  const approvedColor = shop.theme_approved ?? '#1FA34A'
  const cancelledColor = shop.theme_rejected ?? '#D72638'
  const pendingColor = shop.theme_pending ?? '#F97316'

  const todayAppts = appts.filter(a => a.date === today && a.status !== 'cancelled')
  const pendingCount = appts.filter(a => a.status === 'pending').length
  const todayWalkIns = walkIns.filter(w => w.date === today)
  const todayRevenue = todayWalkIns.reduce((s, w) => s + w.amount, 0)

  async function updateStatus(id: string, status: string) {
    await supabase.from('appointments').update({ status }).eq('id', id)
    setAppts(prev => prev.map(a => a.id === id ? { ...a, status: status as BookingStatus } : a))
  }

  const pendingAppts = appts.filter(a => a.status === 'pending').sort((a, b) => a.date.localeCompare(b.date))

  function statusStyle(status: BookingStatus) {
    const map: Record<BookingStatus, { bg: string; color: string }> = {
      pending:   { bg: `${pendingColor}20`,   color: pendingColor },
      approved:  { bg: `${approvedColor}20`,  color: approvedColor },
      cancelled: { bg: `${cancelledColor}15`, color: cancelledColor },
    }
    return map[status]
  }

  return (
    <div>
      <AdminHeader shop={shop} />
      <AdminNav slug={shop.slug} />

      <div className="px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <p className="text-3xl font-black" style={{ color: accent }}>{todayAppts.length}</p>
            <p className="text-xs text-gray-400 mt-1">Bugünkü Randevu</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-black" style={{ color: pendingColor }}>{pendingCount}</p>
            <p className="text-xs text-gray-400 mt-1">Bekleyen</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-black" style={{ color: approvedColor }}>{formatCurrency(todayRevenue)}</p>
            <p className="text-xs text-gray-400 mt-1">Bugün Walk-in</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-black text-gray-800">{staff.length}</p>
            <p className="text-xs text-gray-400 mt-1">Aktif Berber</p>
          </Card>
        </div>

        {/* Pending approvals */}
        {pendingAppts.length > 0 && (
          <div>
            <h2 className="text-sm font-black text-gray-800 mb-3">⏳ Bekleyen Onaylar</h2>
            <div className="space-y-2">
              {pendingAppts.map(a => (
                <Card key={a.id}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{a.customer_name}</p>
                      <p className="text-xs text-gray-500">{a.service?.name} • {formatDateTR(a.date)} {a.time_slot}</p>
                      <p className="text-xs text-gray-400">{a.staff?.name} • {a.customer_phone}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => updateStatus(a.id, 'approved')}
                        className="text-xs text-white px-2.5 py-1.5 rounded-lg font-semibold"
                        style={{ backgroundColor: approvedColor }}
                      >
                        Onayla
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Today's schedule */}
        <div>
          <h2 className="text-sm font-black text-gray-800 mb-3">📅 Bugünkü Program</h2>
          {todayAppts.length === 0 ? (
            <Card className="text-center py-6 text-gray-400 text-sm">Bugün randevu yok</Card>
          ) : (
            <div className="space-y-2">
              {todayAppts.sort((a, b) => a.time_slot.localeCompare(b.time_slot)).map(a => {
                const s = statusStyle(a.status)
                return (
                  <Card key={a.id}>
                    <div className="flex items-center gap-3">
                      <div className="text-center flex-shrink-0 w-12">
                        <p className="font-black text-sm" style={{ color: accent }}>{a.time_slot}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{a.customer_name}</p>
                        <p className="text-xs text-gray-400">{a.service?.name} • {a.staff?.name}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
                        {STATUS_LABELS[a.status]}
                      </span>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
