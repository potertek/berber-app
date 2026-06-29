'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { generateTimeSlots } from '@/lib/slots'
import { formatDateTR } from '@/lib/utils'
import type { Shop, StaffMember, WorkingHours } from '@/types'

interface Props {
  shop: Shop
  staff: StaffMember | null
  date: string
  workingHours: WorkingHours[]
  selected: string
  onSelect: (time: string) => void
}

export function StepTime({ shop, staff, date, workingHours, selected, onSelect }: Props) {
  const [takenSlots, setTakenSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const dayOfWeek = new Date(date + 'T12:00:00').getDay()
  const slots = generateTimeSlots(workingHours, dayOfWeek)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const apptQuery = supabase
        .from('appointments')
        .select('time_slot')
        .eq('shop_id', shop.id)
        .eq('date', date)
        .in('status', ['pending', 'approved'])

      if (staff) apptQuery.eq('staff_id', staff.id)

      const blockedQuery = supabase
        .from('blocked_slots')
        .select('time_slot')
        .eq('shop_id', shop.id)
        .eq('date', date)

      if (staff) blockedQuery.eq('staff_id', staff.id)

      const [apptResult, blockedResult] = await Promise.all([apptQuery, blockedQuery])

      setTakenSlots([
        ...(apptResult.data ?? []).map(a => a.time_slot),
        ...(blockedResult.data ?? []).map(b => b.time_slot),
      ])
      setLoading(false)
    }
    load()
  }, [shop.id, date, staff])

  if (slots.length === 0) {
    return (
      <div className="px-4 py-5">
        <h3 className="text-base font-black mb-1" style={{ color: 'var(--theme-dominant,#111)' }}>Saat Seç</h3>
        <p className="text-xs text-gray-400 mb-4">{formatDateTR(date)}</p>
        <div className="text-center py-8 text-gray-400 text-sm">Bu gün için çalışma saati tanımlanmamış.</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-5 animate-slide-up">
      <h3 className="text-base font-black mb-1" style={{ color: 'var(--theme-dominant,#111)' }}>Saat Seç</h3>
      <p className="text-xs text-gray-400 mb-4">{formatDateTR(date)}</p>

      {loading ? (
        <div className="text-center py-8 text-sm text-gray-400">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {slots.map(slot => {
            const isTaken = takenSlots.includes(slot)
            const isSelected = selected === slot
            return (
              <button
                key={slot}
                disabled={isTaken}
                onClick={() => onSelect(slot)}
                className="py-3.5 rounded-2xl border-2 text-sm font-bold transition-all"
                style={
                  isTaken
                    ? { borderColor: '#e5e7eb', backgroundColor: '#f9fafb', color: '#d1d5db', cursor: 'not-allowed', textDecoration: 'line-through' }
                    : isSelected
                    ? { borderColor: 'var(--theme-accent,#C85A17)', backgroundColor: 'var(--theme-accent,#C85A17)', color: 'white' }
                    : { borderColor: '#f3f4f6', backgroundColor: 'white', color: 'var(--theme-dominant,#111)' }
                }
              >
                {slot}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
