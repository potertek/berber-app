'use client'

import { useState } from 'react'
import { SERVICES, Service } from '@/lib/data'
import Link from 'next/link'

const CATEGORIES = [
  { key: 'hair', label: 'Saç Hizmetleri' },
  { key: 'makeup', label: 'Makyaj Hizmetleri' },
  { key: 'skin', label: 'Cilt Bakımı Hizmetleri' },
] as const

export default function ServicesSection() {
  const [openCategories, setOpenCategories] = useState<string[]>(['hair'])

  function toggle(key: string) {
    setOpenCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const popularServices = SERVICES.filter((s) =>
    ['sac-kesimi', 'fon', 'sakal-tirasi'].includes(s.id)
  )

  return (
    <div>
      {/* Popular / Quick book */}
      <div className="mb-6">
        <h2 className="section-title">Sık Kullanılan Hizmetler</h2>
        <div className="space-y-2">
          {popularServices.map((s) => (
            <ServiceRow key={s.id} service={s} />
          ))}
        </div>
      </div>

      {/* Category accordion */}
      <div className="space-y-3">
        {CATEGORIES.map(({ key, label }) => {
          const services = SERVICES.filter((s) => s.category === key)
          const isOpen = openCategories.includes(key)
          return (
            <div key={key} className="card overflow-hidden">
              <button
                onClick={() => toggle(key)}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-brand-green text-white font-semibold text-sm"
              >
                {label}
                <svg
                  className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="divide-y divide-gray-50">
                  {services.map((s) => (
                    <ServiceRow key={s.id} service={s} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ServiceRow({ service }: { service: Service }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white">
      <div>
        <p className="text-sm font-medium text-gray-900">{service.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{service.duration} dk • ₺{service.price}</p>
      </div>
      <Link
        href={`/randevu?service=${service.id}`}
        className="bg-brand-green text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-green-light transition-colors whitespace-nowrap"
      >
        Randevu Al
      </Link>
    </div>
  )
}
