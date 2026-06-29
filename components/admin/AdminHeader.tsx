'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Shop } from '@/types'

interface Props { shop: Shop }

export function AdminHeader({ shop }: Props) {
  const dominant = shop.theme_dominant ?? '#111111'
  const displayName = shop.booking_name ?? shop.name
  const [copied, setCopied] = useState(false)

  const randevuLink = typeof window !== 'undefined'
    ? `${window.location.origin}/${shop.slug}/randevu`
    : `/${shop.slug}/randevu`

  function copyLink() {
    const link = `${window.location.origin}/${shop.slug}/randevu`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="text-white px-4 py-4" style={{ backgroundColor: dominant }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="font-black text-lg leading-tight">{displayName}</h1>
          <p className="text-xs text-white/50">Admin Panel</p>
        </div>
        <Link href={`/${shop.slug}/randevu`} target="_blank"
          className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-medium transition-colors">
          Sayfayı Gör →
        </Link>
      </div>

      {/* Link Al */}
      <div className="bg-white/10 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/50 mb-0.5">Bio Linki (kopyala, Instagram&apos;a yapıştır)</p>
          <p className="text-xs font-bold text-white/90 truncate">/{shop.slug}/randevu</p>
        </div>
        <button
          onClick={copyLink}
          className="flex-shrink-0 text-xs font-black px-3 py-1.5 rounded-lg transition-all"
          style={{ backgroundColor: copied ? '#1FA34A' : 'rgba(255,255,255,0.2)' }}
        >
          {copied ? '✓ Kopyalandı' : '🔗 Link Al'}
        </button>
      </div>
    </div>
  )
}
