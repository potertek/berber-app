'use client'

import { useState, useEffect } from 'react'
import { format, addDays, parseISO, isBefore, startOfDay } from 'date-fns'
import { tr } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import type { Shop, StaffMember } from '@/types'

interface Props {
  shop: Shop
  staff: StaffMember | null
  selected: string
  onSelect: (date: string) => void
}

export function StepDate({ shop, staff, selected, onSelect }: Props) {
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const today = startOfDay(new Date())
  const days = Array.from({ length: 30 }, (_, i) => addDays(today, i))

  useEffect(() => {
    supabase
      .from('working_hours')
      .select('day_of_week, is_closed')
      .eq('shop_id', shop.id)
      .is('staff_id', null)
      .then(({ data }) => {
        const closedDays = (data ?? []).filter(d => d.is_closed).map(d => d.day_of_week)
        const blocked = days
          .filter(d => closedDays.includes(d.getDay()))
          .map(d => format(d, 'yyyy-MM-dd'))
        setBlockedDates(blocked)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shop.id])

  return (
    <div className="px-4 py-5 animate-slide-up">
      <h3 className="text-base font-black text-brand-black mb-4">Tarih Seç</h3>
      {staff && <p className="text-xs text-gray-400 mb-3">Berber: {staff.name}</p>}

      <div className="grid grid-cols-4 gap-2">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const isBlocked = blockedDates.includes(dateStr)
          const isPast = isBefore(day, today)
          const isSelected = selected === dateStr
          const disabled = isBlocked || isPast

          return (
            <button
              key={dateStr}
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              className={`flex flex-col items-center py-3 rounded-2xl border-2 transition-all text-sm ${
                disabled
                  ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                  : isSelected
                  ? 'border-brand-orange bg-brand-orange text-white'
                  : 'border-gray-100 hover:border-brand-orange/50 bg-white'
              }`}
            >
              <span className="text-xs font-medium">{format(day, 'EEE', { locale: tr })}</span>
              <span className="font-black text-base leading-none mt-0.5">{format(day, 'd')}</span>
              <span className="text-xs">{format(day, 'MMM', { locale: tr })}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
