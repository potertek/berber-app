import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import type { Shop } from '@/types'

interface Props {
  shop: Shop
}

export function InstagramSection({ shop }: Props) {
  if (!shop.instagram_username && !shop.instagram_url) return null

  const href = shop.instagram_url ?? (shop.instagram_username ? `https://instagram.com/${shop.instagram_username}` : '#')
  const ctaText = shop.instagram_cta_text ?? "Instagram'da Takip Et"

  return (
    <section className="px-4 py-5">
      <h2 className="text-lg font-black mb-3" style={{ color: 'var(--theme-dominant, #111111)' }}>Instagram</h2>
      <Card>
        <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white text-2xl">
            {shop.instagram_photo_url ? (
              <Image src={shop.instagram_photo_url} alt="Instagram" width={56} height={56} className="object-cover rounded-full" />
            ) : (
              <span>📷</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {shop.instagram_username && (
              <p className="font-bold text-sm" style={{ color: 'var(--theme-dominant, #111111)' }}>@{shop.instagram_username}</p>
            )}
            {shop.instagram_bio && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{shop.instagram_bio}</p>
            )}
            <div className="flex gap-3 mt-1.5">
              {shop.instagram_posts != null && (
                <span className="text-xs text-gray-500"><strong className="text-gray-800">{shop.instagram_posts}</strong> gönderi</span>
              )}
              {shop.instagram_followers != null && (
                <span className="text-xs text-gray-500"><strong className="text-gray-800">{shop.instagram_followers.toLocaleString()}</strong> takipçi</span>
              )}
              {shop.instagram_following != null && (
                <span className="text-xs text-gray-500"><strong className="text-gray-800">{shop.instagram_following}</strong> takip</span>
              )}
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-400 flex-shrink-0">→</span>
        </a>
        {ctaText && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-3 w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
          >
            {ctaText}
          </a>
        )}
      </Card>
    </section>
  )
}
