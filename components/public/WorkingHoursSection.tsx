import { Card } from '@/components/ui/Card'
import { DAYS_TR } from '@/types'
import type { WorkingHours } from '@/types'

interface Props {
  hours: WorkingHours[]
}

export function WorkingHoursSection({ hours }: Props) {
  const todayIndex = new Date().getDay()

  const sorted = [...Array(7)].map((_, i) => {
    const found = hours.find(h => h.day_of_week === i)
    return { day: i, data: found }
  })

  return (
    <section className="px-4 py-5">
      <h2 className="text-lg font-black text-brand-black mb-3">Çalışma Saatleri</h2>
      <Card padding={false}>
        {sorted.map(({ day, data }) => {
          const isToday = day === todayIndex
          return (
            <div
              key={day}
              className={`flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0 ${isToday ? 'bg-brand-orange/5' : ''}`}
            >
              <span className={`text-sm ${isToday ? 'font-bold text-brand-orange' : 'text-gray-700'}`}>
                {DAYS_TR[day]}
                {isToday && <span className="ml-1 text-xs">(Bugün)</span>}
              </span>
              <span className={`text-sm font-medium ${data?.is_closed ? 'text-brand-red' : 'text-gray-800'}`}>
                {!data || data.is_closed
                  ? 'Kapalı'
                  : `${data.open_time} – ${data.close_time}`}
              </span>
            </div>
          )
        })}
      </Card>
    </section>
  )
}
