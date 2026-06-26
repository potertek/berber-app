import { SALON_INFO, REVIEWS } from '@/lib/data'
import StarRating from './StarRating'

export default function ReviewsSection() {
  return (
    <div>
      <h2 className="section-title">Müşteri Yorumları</h2>

      {/* Summary */}
      <div className="card p-4 mb-4 flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{SALON_INFO.rating}</p>
          <StarRating rating={SALON_INFO.rating} size="md" />
          <p className="text-xs text-gray-500 mt-1">{SALON_INFO.reviewCount} yorum</p>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = star === 5 ? 46 : star === 4 ? 2 : 0
            const pct = (count / SALON_INFO.reviewCount) * 100
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-gray-500">{star}</span>
                <svg className="w-3 h-3 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-gray-400 w-4">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-3">
        {REVIEWS.map((review) => (
          <div key={review.id} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-800 truncate">{review.username}</p>
                  <p className="text-xs text-gray-400 flex-shrink-0">{review.date}</p>
                </div>
                <StarRating rating={review.stars} size="sm" />
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">{SALON_INFO.totalScore} Puanlama</p>
    </div>
  )
}
