import { Card } from '@/components/ui/Card'
import type { Shop } from '@/types'

interface Props {
  shop: Shop
}

export function InstagramSection({ shop }: Props) {
  if (!shop.instagram_username) return null

  return (
    <section className="px-4 py-5">
      <h2 className="text-lg font-black text-brand-black mb-3">Instagram</h2>
      <Card>
        <a
          href={`https://instagram.com/${shop.instagram_username}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white text-xl flex-shrink-0">
            📷
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-brand-black">@{shop.instagram_username}</p>
            {shop.instagram_bio && (
              <p className="text-xs text-gray-500 truncate">{shop.instagram_bio}</p>
            )}
            <div className="flex gap-3 mt-1">
              {shop.instagram_posts != null && (
                <span className="text-xs text-gray-500"><strong className="text-brand-black">{shop.instagram_posts}</strong> gönderi</span>
              )}
              {shop.instagram_followers != null && (
                <span className="text-xs text-gray-500"><strong className="text-brand-black">{shop.instagram_followers?.toLocaleString()}</strong> takipçi</span>
              )}
              {shop.instagram_following != null && (
                <span className="text-xs text-gray-500"><strong className="text-brand-black">{shop.instagram_following}</strong> takip</span>
              )}
            </div>
          </div>
          <span className="text-gray-400 text-sm">→</span>
        </a>
      </Card>
    </section>
  )
}
