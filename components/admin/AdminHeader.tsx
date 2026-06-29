'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Shop } from '@/types'

interface Props { shop: Shop }

export function AdminHeader({ shop }: Props) {
  const dominant = shop.theme_dominant ?? '#111111'
  const displayName = shop.booking_name ?? shop.name
  const [copied, setCopied] = useState(false)

  function copyLink() {
    const link = `${window.location.origin}/${shop.slug}/randevu`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="text-white px-4 py-4" style={{ backgroundColor: dominant }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-black text-lg leading-tight">{displayName}</h1>
          <p className="text-xs text-white/50">Admin Panel</p>
        </div>
        <Link
          href={`/${shop.slug}/panel/settings`}
          className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          ⚙️ Ayarlar
        </Link>
      </div>

      {/* Randevu Sayfasını Düzenle — büyük ve belirgin */}
      <Link
        href={`/${shop.slug}/panel/settings`}
        className="block w-full bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl px-4 py-3 mb-3 transition-all text-center font-bold text-sm"
      >
        ✏️ Randevu Sayfasını Düzenle
      </Link>

      {/* Bio Linki */}
      <div className="bg-white/10 rounded-xl px-3 py-2.5">
        <p className="text-xs text-white/50 mb-1.5">📲 Instagram Bio Linki</p>
        <div className="flex items-center gap-2">
          <a
            href={`/${shop.slug}/randevu`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 min-w-0 text-sm font-bold text-blue-300 underline underline-offset-2 hover:text-blue-200 truncate"
          >
            {typeof window !== 'undefined' ? window.location.origin : 'https://barberappeasy.netlify.app'}/{shop.slug}/randevu
          </a>
          <button
            onClick={copyLink}
            className="flex-shrink-0 text-xs font-black px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
            style={{ backgroundColor: copied ? '#1FA34A' : 'rgba(255,255,255,0.25)' }}
          >
            {copied ? '✓ Kopyalandı' : 'Kopyala'}
          </button>
        </div>
      </div>
    </div>
  )
}
