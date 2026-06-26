import { formatDate } from '@/lib/utils'

interface Props {
  slots: string[]
  selected: string
  date: string
  onSelect: (time: string) => void
}

export default function StepTime({ slots, selected, date, onSelect }: Props) {
  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Saat Seçin</h2>
      {date && <p className="text-sm text-gray-400 mb-4">{formatDate(date)}</p>}
      {slots.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">Bu tarih için uygun saat yok</p>
          <p className="text-xs mt-1">Lütfen farklı bir tarih seçin</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => onSelect(slot)}
              className={`py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
                selected === slot
                  ? 'border-brand-green bg-brand-green text-white'
                  : 'border-gray-100 bg-white text-gray-700 hover:border-brand-green/40'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
