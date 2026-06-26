import { STAFF } from '@/lib/data'

interface Props {
  selected: string
  onSelect: (id: string, name: string) => void
}

export default function StepStaff({ selected, onSelect }: Props) {
  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Personel Seçin</h2>
      <div className="space-y-3">
        {STAFF.map((staff) => (
          <button
            key={staff.id}
            onClick={() => staff.available && onSelect(staff.id, staff.name)}
            disabled={!staff.available}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
              selected === staff.id
                ? 'border-brand-green bg-green-50'
                : staff.available
                ? 'border-gray-100 bg-white hover:border-brand-green/40'
                : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-green to-brand-green-light flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">{staff.name[0]}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{staff.name}</p>
              <p className="text-xs text-gray-400">{staff.role}</p>
              {!staff.available && <p className="text-xs text-red-400 mt-0.5">Müsait değil</p>}
            </div>
            {selected === staff.id && (
              <svg className="w-5 h-5 text-brand-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
