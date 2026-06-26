import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import type { Shop } from '@/types'

interface Props {
  shop: Shop
}

export function AddressSection({ shop }: Props) {
  if (!shop.address && !shop.maps_url) return null

  return (
    <section className="px-4 py-5">
      <h2 className="text-lg font-black text-brand-black mb-3">Konum</h2>
      <Card>
        <div className="flex items-start gap-3">
          <div className="text-xl mt-0.5">📍</div>
          <div className="flex-1">
            {shop.address && (
              <p className="text-sm text-gray-700 mb-2">{shop.address}</p>
            )}
            {shop.maps_url && (
              <a
                href={shop.maps_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange"
              >
                Haritada Gör →
              </a>
            )}
          </div>
          {shop.qr_url && (
            <div className="w-16 h-16 flex-shrink-0">
              <Image src={shop.qr_url} alt="QR" width={64} height={64} className="rounded-lg" />
            </div>
          )}
        </div>
      </Card>
    </section>
  )
}
