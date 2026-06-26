import { Card } from '@/components/ui/Card'
import { StarRating } from '@/components/ui/StarRating'
import { formatDateShort } from '@/lib/utils'
import type { Review } from '@/types'

interface Props {
  reviews: Review[]
}

export function ReviewsSection({ reviews }: Props) {
  if (reviews.length === 0) return null

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <section className="px-4 py-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-black text-brand-black">Değerlendirmeler</h2>
        <div className="flex items-center gap-1.5">
          <span className="text-2xl font-black text-brand-orange">{avg.toFixed(1)}</span>
          <div>
            <StarRating rating={Math.round(avg)} size="sm" />
            <p className="text-xs text-gray-400">{reviews.length} yorum</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {reviews.slice(0, 5).map(review => (
          <Card key={review.id}>
            <div className="flex items-start justify-between mb-1">
              <p className="font-bold text-sm text-brand-black">{review.customer_name}</p>
              <span className="text-xs text-gray-400">{formatDateShort(review.created_at)}</span>
            </div>
            <StarRating rating={review.rating} size="sm" />
            {review.comment && (
              <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}
