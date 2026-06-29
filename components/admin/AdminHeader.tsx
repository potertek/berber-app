import Link from 'next/link'
import type { Shop } from '@/types'

interface Props { shop: Shop }

export function AdminHeader({ shop }: Props) {
  const dominant = shop.theme_dominant ?? '#111111'
  const displayName = shop.booking_name ?? shop.name

  return (
    <div className="text-white px-4 py-4" style={{ backgroundColor: dominant }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-black text-lg leading-tight">{displayName}</h1>
          <p className="text-xs text-white/50 mt-0.5">Admin Panel</p>
        </div>
        <Link
          href={`/${shop.slug}/randevu`}
          target="_blank"
          className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          Randevu Linki →
        </Link>
      </div>
      <div className="mt-2 bg-white/10 rounded-lg px-3 py-2 flex items-center justify-between">
        <p className="text-xs text-white/60">Bio linki:</p>
        <p className="text-xs font-bold text-white/90 truncate ml-2">/randevu</p>
      </div>
    </div>
  )
}
