'use client'

import { useState } from 'react'
import { use } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cancelByCode } from '@/lib/db'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export default function CancelPage({ params }: Props) {
  const { slug } = use(params)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await cancelByCode(phone, code)
    setResult(res)
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white px-4 py-8">
      <div className="mb-6">
        <Link href={`/${slug}`} className="text-sm text-brand-orange font-semibold">← Geri Dön</Link>
      </div>

      <h1 className="text-2xl font-black text-brand-black mb-2">Randevu İptal</h1>
      <p className="text-sm text-gray-500 mb-6">Randevunuzu iptal etmek için telefon numaranızı ve randevu kodunuzu girin.</p>

      {result ? (
        <div className={`p-4 rounded-2xl text-sm font-medium ${result.success ? 'bg-green-50 text-brand-green' : 'bg-red-50 text-brand-red'}`}>
          {result.message}
          {result.success && (
            <div className="mt-3">
              <Link href={`/${slug}`} className="text-brand-orange font-bold">Ana Sayfaya Dön →</Link>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleCancel} className="space-y-4">
          <Input
            label="Telefon Numarası"
            type="tel"
            placeholder="0 5XX XXX XX XX"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
          <Input
            label="Randevu Kodu"
            placeholder="Örn: ABC12345"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            required
            className="uppercase tracking-widest font-bold"
          />
          <Button type="submit" loading={loading} variant="danger" size="lg" className="w-full">
            Randevuyu İptal Et
          </Button>
        </form>
      )}
    </div>
  )
}
