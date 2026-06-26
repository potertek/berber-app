'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TIME_SLOTS } from '@/types'
import { formatDateTR } from '@/lib/utils'
import type { Shop, StaffMember } from '@/types'

interface Props {
  shop: Shop
  staff: StaffMember | null
  date: string
  selected: string
  onSelect: (time: string) => void
}

export function StepTime({ shop, staff, date, selected, onSelect }: Props) {
  const [takenSlots, setTakenSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const query = supabase
        .from('appointments')
        .select('time_slot')
        .eq('shop_id', shop.id)
        .eq('date', date)
        .in('status', ['pending', 'approved'])

      if (staff) query.eq('staff_id', staff.id)

      const [apptResult, blockedResult] = await Promise.all([
        query,
        supabase
          .from('blocked_slots')
          .select('time_slot')
          .eq('shop_id', shop.id)
          .eq('date', date)
          .match(staff ? { staff_id: staff.id } : {}),
      ])

      const taken = [
        ...(apptResult.data ?? []).map(a => a.time_slot),
        ...(blockedResult.data ?? []).map(b => b.time_slot),
      ]
      setTakenSlots(taken)
      setLoading(false)
    }
    load()
  }, [shop.id, date, staff])

  return (
    <div className="px-4 py-5 animate-slide-up">
      <h3 className="text-base font-black text-brand-black mb-1">Saat Seç</h3>
      <p className="text-xs text-gray-400 mb-4">{formatDateTR(date)}</p>

      {loading ? (
        <div className="text-center py-8 text-sm text-gray-400">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map(slot => {
            const isTaken = takenSlots.includes(slot)
            const isSelected = selected === slot
            return (
              <button
                key={slot}
                disabled={isTaken}
                onClick={() => onSelect(slot)}
                className={`py-3.5 rounded-2xl border-2 text-sm font-bold transition-all ${
                  isTaken
                    ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                    : isSelected
                    ? 'border-brand-orange bg-brand-orange text-white'
                    : 'border-gray-100 hover:border-brand-orange/50 bg-white text-brand-black'
                }`}
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
