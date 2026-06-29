'use client'

import { useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { isShopAuthed } from '@/lib/auth'

interface Props {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default function PanelLayout({ children, params }: Props) {
  const { slug } = use(params)
  const router = useRouter()

  useEffect(() => {
    if (!isShopAuthed(slug)) {
      router.replace(`/${slug}`)
    }
  }, [slug, router])

  return <div className="min-h-screen bg-gray-50">{children}</div>
}
