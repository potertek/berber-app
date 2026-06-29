'use client'

import { format, addDays, isBefore, startOfDay } from 'date-fns'
import { tr } from 'date-fns/locale'
import { generateTimeSlots } from '@/lib/slots'
import type { Shop, StaffMember, WorkingHours } from '@/types'

interface Props {
  shop: Shop
  staff: StaffMember | null
  workingHours: WorkingHours[]
  selected: string
  onSelect: (date: string) => void
}

export function StepDate({ shop, staff, workingHours, selected, onSelect }: Props) {
  const today = startOfDay(new Date())
  const days = Array.from({ length: 30 }, (_, i) => addDays(today, i))
  const accent = shop.theme_accent ?? '#C85A17'
  const dominant = shop.theme_dominant ?? '#111111'

  return (
    <div className="px-4 py-5 animate-slide-up">
      <h3 className="text-base font-black mb-4" style={{ color: dominant }}>Tarih Seç</h3>
      {staff && <p className="text-xs text-gray-400 mb-3">Berber: {staff.name}</p>}

      <div className="grid grid-cols-4 gap-2">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayOfWeek = day.getDay()
          const availableSlots = generateTimeSlots(workingHours, dayOfWeek)
          const isBlocked = availableSlots.length === 0
          const isPast = isBefore(day, today)
          const isSelected = selected === dateStr
          const disabled = isBlocked || isPast

          return (
            <button
              key={dateStr}
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              className="flex flex-col items-center py-3 rounded-2xl border-2 transition-all text-sm"
              style={
                disabled
                  ? { borderColor: '#f3f4f6', backgroundColor: '#f9fafb', opacity: 0.4, cursor: 'not-allowed' }
                  : isSelected
                  ? { borderColor: accent, backgroundColor: accent, color: 'white' }
                  : { borderColor: '#f3f4f6', backgroundColor: 'white', color: dominant }
              }
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
