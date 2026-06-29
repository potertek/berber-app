'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { shopLogout } from '@/lib/auth'

interface Props { slug: string }

const NAV_ITEMS = [
  { href: '', label: 'Panel', icon: '📊' },
  { href: '/bookings', label: 'Randevular', icon: '📅' },
  { href: '/walkin', label: 'Kapıdan', icon: '🚶' },
  { href: '/services', label: 'Hizmetler', icon: '✂️' },
  { href: '/staff', label: 'Ekip', icon: '👥' },
  { href: '/revenue', label: 'Gelir', icon: '💰' },
  { href: '/settings', label: 'Düzenle', icon: '✏️' },
]

export function AdminNav({ slug }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const base = `/${slug}/panel`

  function handleLogout() {
    shopLogout(slug)
    router.push(`/${slug}`)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex overflow-x-auto scrollbar-hide">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const fullHref = base + href
          const isActive = href === '' ? pathname === base : pathname.startsWith(fullHref)
          return (
            <Link
              key={href}
              href={fullHref}
              className={cn(
                'flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors',
                isActive ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-400 hover:text-gray-600'
              )}
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-gray-300 hover:text-red-400 transition-colors ml-auto"
        >
          <span className="text-base">🚪</span>
          <span>Çıkış</span>
        </button>
      </div>
    </nav>
  )
}
