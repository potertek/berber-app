'use client'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md'
}

export function StarRating({ rating, max = 5, size = 'md' }: StarRatingProps) {
  const sz = size === 'sm' ? 'text-sm' : 'text-base'
  return (
    <div className={`flex gap-0.5 ${sz}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-brand-orange' : 'text-gray-200'}>★</span>
      ))}
    </div>
  )
}
