import Image from 'next/image'
import type { Shop } from '@/types'

interface Props {
  shop: Shop
}

export function HeroSection({ shop }: Props) {
  const dominant = shop.theme_dominant ?? '#111111'
  const accent = shop.theme_accent ?? '#C85A17'

  return (
    <div className="relative">
      <div className="relative h-56 overflow-hidden" style={{ backgroundColor: dominant }}>
        {shop.banner_url ? (
          <Image src={shop.banner_url} alt={shop.name} fill className="object-cover opacity-70" priority />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${dominant}, ${accent}33)` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-end gap-4 -mt-10 relative z-10">
          <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden shadow-premium flex-shrink-0" style={{ backgroundColor: dominant }}>
            {shop.logo_url ? (
              <Image src={shop.logo_url} alt={shop.name} width={80} height={80} className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white">
                {shop.name[0]}
              </div>
            )}
          </div>
          <div className="pb-1">
            <h1 className="text-xl font-black text-white drop-shadow-lg leading-tight">{shop.name}</h1>
            {shop.description && <p className="text-xs text-white/80 mt-0.5">{shop.description}</p>}
            {shop.address && <p className="text-xs text-white/70 mt-0.5">{shop.address}</p>}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          {shop.phone && (
            <a href={`tel:${shop.phone}`} className="flex-1 flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 rounded-xl" style={{ backgroundColor: dominant }}>
              <span>📞</span> Ara
            </a>
          )}
          {shop.whatsapp && (
            <a href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl">
              <span>💬</span> WhatsApp
            </a>
          )}
          {shop.instagram_url && (
            <a href={shop.instagram_url} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold py-2.5 rounded-xl">
              <span>📷</span> Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
