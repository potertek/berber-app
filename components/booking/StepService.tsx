import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import type { Service, ServiceCategory, Shop } from '@/types'
import { CATEGORY_LABELS } from '@/types'

interface Props {
  services: Service[]
  selected: Service | null
  onSelect: (s: Service) => void
  shop: Shop
}

export function StepService({ services, selected, onSelect, shop }: Props) {
  const categories = [...new Set(services.map(s => s.category))] as ServiceCategory[]
  const [filter, setFilter] = useState<ServiceCategory | 'all'>('all')
  const filtered = filter === 'all' ? services : services.filter(s => s.category === filter)
  const accent = shop.theme_accent ?? '#C85A17'
  const dominant = shop.theme_dominant ?? '#111111'

  return (
    <div className="px-4 py-5 animate-slide-up">
      <h3 className="text-base font-black mb-4" style={{ color: dominant }}>Hizmet Seç</h3>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4">
        <button
          onClick={() => setFilter('all')}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
          style={filter === 'all' ? { backgroundColor: accent, color: 'white' } : { backgroundColor: '#f3f4f6', color: '#4b5563' }}
        >
          Tümü
        </button>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={filter === c ? { backgroundColor: accent, color: 'white' } : { backgroundColor: '#f3f4f6', color: '#4b5563' }}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(service => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className="w-full text-left bg-white rounded-2xl border-2 px-4 py-3.5 transition-all"
            style={selected?.id === service.id ? { borderColor: accent, backgroundColor: `${accent}10` } : { borderColor: '#f3f4f6' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm" style={{ color: dominant }}>{service.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{CATEGORY_LABELS[service.category]} • {service.duration} dk</p>
              </div>
              <p className="font-black" style={{ color: accent }}>{formatCurrency(service.price)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
