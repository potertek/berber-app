'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { shopLogin } from '@/lib/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface Props {
  params: Promise<{ slug: string }>
}

export default function ShopLoginPage({ params }: Props) {
  const { slug } = use(params)
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const ok = await shopLogin(slug, username, password)
    if (ok) {
      router.push(`/${slug}/panel`)
    } else {
      setError('Kullanıcı adı veya şifre hatalı.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center text-3xl mx-auto mb-4">✂️</div>
          <h1 className="text-2xl font-black text-white">Admin Girişi</h1>
          <p className="text-sm text-white/40 mt-1">{slug}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="kullaniciadi"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-brand-orange text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-brand-orange text-sm"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-orange text-white font-black text-base disabled:opacity-50 transition-all hover:bg-brand-orange-light"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Randevu almak için <a href={`/${slug}/randevu`} className="text-brand-orange underline">buraya tıklayın</a>
        </p>
      </div>
    </div>
  )
}
