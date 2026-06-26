import { SERVICES, Service } from '@/lib/data'

const CATEGORIES = [
  { key: 'hair', label: 'Saç Hizmetleri' },
  { key: 'makeup', label: 'Makyaj Hizmetleri' },
  { key: 'skin', label: 'Cilt Bakımı' },
] as const

interface Props {
  selected: Service | null
  onSelect: (s: Service) => void
}

export default function StepService({ selected, onSelect }: Props) {
  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Hizmet Seçin</h2>
      {CATEGORIES.map(({ key, label }) => (
        <div key={key} className="mb-5">
          <h3 className="text-sm font-semibold text-brand-green mb-2 uppercase tracking-wide">{label}</h3>
          <div className="space-y-2">
            {SERVICES.filter((s) => s.category === key).map((service) => (
              <button
                key={service.id}
                onClick={() => onSelect(service)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all ${
                  selected?.id === service.id
                    ? 'border-brand-green bg-green-50'
                    : 'border-gray-100 bg-white hover:border-brand-green/40'
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{service.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{service.duration} dakika</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-green">₺{service.price}</p>
                  {selected?.id === service.id && (
                    <svg className="w-4 h-4 text-brand-green ml-auto mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
