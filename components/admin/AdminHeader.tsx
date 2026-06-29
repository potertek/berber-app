import Link from 'next/link'
import type { Shop } from '@/types'

interface Props {
  shop: Shop
}

export function AdminHeader({ shop }: Props) {
  return (
    <div className="bg-brand-black text-white px-4 py-4 flex items-center justify-between">
      <div>
        <h1 className="font-black text-lg leading-tight">{shop.name}</h1>
        <p className="text-xs text-white/50">Admin Panel</p>
      </div>
      <Link
        href={`/${shop.slug}`}
        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-medium transition-colors"
      >
        Sayfayı Gör →
      </Link>
    </div>
  )
}
