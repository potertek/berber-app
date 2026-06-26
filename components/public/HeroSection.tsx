import Image from 'next/image'
import type { Shop } from '@/types'

interface Props {
  shop: Shop
}

export function HeroSection({ shop }: Props) {
  return (
    <div className="relative">
      <div className="relative h-56 bg-brand-black overflow-hidden">
        {shop.banner_url ? (
          <Image
            src={shop.banner_url}
            alt={shop.name}
            fill
            className="object-cover opacity-70"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-gray-900 to-brand-orange/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-end gap-4 -mt-10 relative z-10">
          <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden bg-gray-100 shadow-premium flex-shrink-0">
            {shop.logo_url ? (
              <Image src={shop.logo_url} alt={shop.name} width={80} height={80} className="object-cover" />
            ) : (
              <div className="w-full h-full bg-brand-black flex items-center justify-center text-2xl font-black text-white">
                {shop.name[0]}
              </div>
            )}
          </div>
          <div className="pb-1">
            <h1 className="text-xl font-black text-white drop-shadow-lg leading-tight">{shop.name}</h1>
            {shop.address && (
              <p className="text-xs text-white/80 mt-0.5">{shop.address}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          {shop.phone && (
            <a
              href={`tel:${shop.phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-black text-white text-sm font-semibold py-2.5 rounded-xl"
            >
              <span>📞</span> Ara
            </a>
          )}
          {shop.whatsapp && (
            <a
              href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl"
            >
              <span>💬</span> WhatsApp
            </a>
          )}
          {shop.instagram_username && (
            <a
              href={`https://instagram.com/${shop.instagram_username}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold py-2.5 rounded-xl"
            >
              <span>📷</span> Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
