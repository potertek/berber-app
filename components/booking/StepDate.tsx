'use client'

import { useState } from 'react'
import { WORKING_HOURS } from '@/lib/data'
import { getBlockedDates } from '@/lib/storage'

interface Props {
  selected: string
  onSelect: (date: string) => void
}

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

export default function StepDate({ selected, onSelect }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const blockedDates = getBlockedDates()

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  function isDisabled(day: number): boolean {
    const d = new Date(viewYear, viewMonth, day)
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    if (d < todayMidnight) return true
    const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1
    if (WORKING_HOURS[dayIdx].closed) return true
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    if (blockedDates.includes(dateStr)) return true
    return false
  }

  function toDateStr(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Tarih Seçin</h2>
      <div className="card p-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <p className="font-semibold text-gray-800">{MONTHS[viewMonth]} {viewYear}</p>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-xs font-semibold text-gray-400 py-1">{w}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const disabled = isDisabled(day)
            const dateStr = toDateStr(day)
            const isSelected = selected === dateStr
            const isToday = today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day
            return (
              <button
                key={day}
                disabled={disabled}
                onClick={() => onSelect(dateStr)}
                className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-brand-green text-white'
                    : isToday
                    ? 'border-2 border-brand-green text-brand-green'
                    : disabled
                    ? 'text-gray-200 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
