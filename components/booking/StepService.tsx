import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import type { Service, ServiceCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types'

interface Props {
  services: Service[]
  selected: Service | null
  onSelect: (s: Service) => void
}

export function StepService({ services, selected, onSelect }: Props) {
  const categories = [...new Set(services.map(s => s.category))] as ServiceCategory[]
  const [filter, setFilter] = useState<ServiceCategory | 'all'>('all')

  const filtered = filter === 'all' ? services : services.filter(s => s.category === filter)

  return (
    <div className="px-4 py-5 animate-slide-up">
      <h3 className="text-base font-black text-brand-black mb-4">Hizmet Seç</h3>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4">
        <button
          onClick={() => setFilter('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === 'all' ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          Tümü
        </button>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === c ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-600'}`}
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
            className={`w-full text-left bg-white rounded-2xl border-2 px-4 py-3.5 transition-all ${
              selected?.id === service.id ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-brand-black">{service.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{CATEGORY_LABELS[service.category]} • {service.duration} dk</p>
              </div>
              <p className="font-black text-brand-orange">{formatCurrency(service.price)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
