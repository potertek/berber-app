import { SALON_INFO } from '@/lib/data'

export default function ContactSection() {
  return (
    <div>
      <h2 className="section-title">Adres</h2>
      <div className="card p-4 space-y-3">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-700">{SALON_INFO.address}</p>
            <a
              href={SALON_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 mt-1 inline-block"
            >
              Haritada göster →
            </a>
          </div>
        </div>

        <div className="border-t border-gray-50 pt-3 flex gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-700">{SALON_INFO.phone}</p>
            <div className="flex gap-3 mt-1">
              <a href={`tel:${SALON_INFO.phone}`} className="text-xs text-blue-600">Ara</a>
              <a
                href={`https://wa.me/${SALON_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
