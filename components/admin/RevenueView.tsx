'use client'

import { useState } from 'react'
import { format, startOfWeek, startOfMonth, startOfYear, parseISO } from 'date-fns'
import { AdminHeader } from './AdminHeader'
import { AdminNav } from './AdminNav'
import { Card } from '@/components/ui/Card'
import { formatCurrency, getTodayString } from '@/lib/utils'
import type { Shop, Appointment, WalkIn, StaffMember } from '@/types'

type Period = 'today' | 'week' | 'month' | 'year'

interface Props {
  shop: Shop
  appointments: Appointment[]
  walkIns: WalkIn[]
  staff: StaffMember[]
}

export function RevenueView({ shop, appointments, walkIns, staff }: Props) {
  const [period, setPeriod] = useState<Period>('today')
  const today = getTodayString()

  function getStart(p: Period): string {
    const d = new Date()
    switch (p) {
      case 'today': return today
      case 'week': return format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd')
      case 'month': return format(startOfMonth(d), 'yyyy-MM-dd')
      case 'year': return format(startOfYear(d), 'yyyy-MM-dd')
    }
  }

  const start = getStart(period)

  const filteredAppts = appointments.filter(a =>
    a.status === 'approved' && a.date >= start && a.date <= today
  )
  const filteredWalkIns = walkIns.filter(w => w.date >= start && w.date <= today)

  const apptRevenue = filteredAppts.reduce((s, a) => s + (a.service?.price ?? 0), 0)
  const walkInRevenue = filteredWalkIns.reduce((s, w) => s + w.amount, 0)
  const total = apptRevenue + walkInRevenue

  const staffBreakdown = staff.map(s => {
    const apptTotal = filteredAppts.filter(a => a.staff_id === s.id).reduce((sum, a) => sum + (a.service?.price ?? 0), 0)
    const walkInTotal = filteredWalkIns.filter(w => w.staff_id === s.id).reduce((sum, w) => sum + w.amount, 0)
    return { staff: s, total: apptTotal + walkInTotal }
  }).filter(x => x.total > 0).sort((a, b) => b.total - a.total)

  const periodLabels: Record<Period, string> = { today: 'Bugün', week: 'Bu Hafta', month: 'Bu Ay', year: 'Bu Yıl' }

  return (
    <div>
      <AdminHeader shop={shop} />
      <AdminNav slug={shop.slug} />

      <div className="px-4 py-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {(Object.keys(periodLabels) as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                period === p ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>

        {/* Total */}
        <Card className="mb-4 text-center py-5">
          <p className="text-xs text-gray-400 mb-1">{periodLabels[period]} Toplam Gelir</p>
          <p className="text-4xl font-black text-brand-orange">{formatCurrency(total)}</p>
        </Card>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="text-center">
            <p className="text-xs text-gray-400 mb-1">Randevu</p>
            <p className="text-xl font-black text-brand-black">{formatCurrency(apptRevenue)}</p>
            <p className="text-xs text-gray-400">{filteredAppts.length} randevu</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-gray-400 mb-1">Walk-in</p>
            <p className="text-xl font-black text-brand-black">{formatCurrency(walkInRevenue)}</p>
            <p className="text-xs text-gray-400">{filteredWalkIns.length} kayıt</p>
          </Card>
        </div>

        {/* Per Staff */}
        {staffBreakdown.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-brand-black mb-3">Berbere Göre</h3>
            <div className="space-y-2">
              {staffBreakdown.map(({ staff: s, total: t }) => (
                <Card key={s.id}>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm">{s.name}</p>
                    <p className="font-black text-brand-orange">{formatCurrency(t)}</p>
                  </div>
                  <div className="mt-2 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-brand-orange rounded-full h-1.5 transition-all"
                      style={{ width: total > 0 ? `${(t / total) * 100}%` : '0%' }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
