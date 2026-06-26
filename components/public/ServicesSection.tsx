'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import type { Service, ServiceCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types'

interface Props {
  services: Service[]
}

export function ServicesSection({ services }: Props) {
  const categories = [...new Set(services.map(s => s.category))] as ServiceCategory[]
  const [open, setOpen] = useState<ServiceCategory | null>(categories[0] ?? null)

  if (services.length === 0) return null

  return (
    <section className="px-4 py-5">
      <h2 className="text-lg font-black text-brand-black mb-3">Hizmetler</h2>
      <div className="space-y-2">
        {categories.map(cat => {
          const items = services.filter(s => s.category === cat)
          const isOpen = open === cat
          return (
            <Card key={cat} padding={false}>
              <button
                onClick={() => setOpen(isOpen ? null : cat)}
                className="w-full flex items-center justify-between px-4 py-3.5"
              >
                <span className="font-bold text-sm text-brand-black">{CATEGORY_LABELS[cat]}</span>
                <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-gray-100">
                  {items.map(service => (
                    <div key={service.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-800">{service.name}</span>
                      <div className="text-right">
                        <p className="text-sm font-bold text-brand-orange">{formatCurrency(service.price)}</p>
                        <p className="text-xs text-gray-400">{service.duration} dk</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </section>
  )
}
