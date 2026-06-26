'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import type { Shop } from '@/types'
import Link from 'next/link'

export default function SuperAdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [shops, setShops] = useState<Shop[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', phone: '', address: '' })

  useEffect(() => {
    if (!authed) return
    supabase.from('shops').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setShops(data ?? [])
    })
  }, [authed])

  function login(e: React.FormEvent) {
    e.preventDefault()
    if (password === 'super2025') setAuthed(true)
    else alert('Hatalı şifre')
  }

  async function createShop(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.slug) return
    setLoading(true)
    const { data, error } = await supabase.from('shops').insert({
      name: form.name,
      slug: form.slug.toLowerCase().replace(/\s+/g, '-'),
      phone: form.phone || null,
      address: form.address || null,
      is_active: true,
      owner_id: '00000000-0000-0000-0000-000000000000',
      logo_url: null,
      banner_url: null,
      whatsapp: null,
      maps_url: null,
      qr_url: null,
      instagram_username: null,
      instagram_bio: null,
      instagram_followers: null,
      instagram_following: null,
      instagram_posts: null,
    }).select().single()
    if (data) {
      setShops(prev => [data, ...prev])
      setForm({ name: '', slug: '', phone: '', address: '' })
      setShowForm(false)
    }
    if (error) alert(error.message)
    setLoading(false)
  }

  async function toggleShop(shop: Shop) {
    const updated = !shop.is_active
    await supabase.from('shops').update({ is_active: updated }).eq('id', shop.id)
    setShops(prev => prev.map(s => s.id === shop.id ? { ...s, is_active: updated } : s))
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-black px-6">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">✂️</div>
            <h1 className="text-xl font-black text-brand-black">Super Admin</h1>
          </div>
          <form onSubmit={login} className="space-y-4">
            <Input type="password" label="Şifre" value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" />
            <Button type="submit" size="lg" className="w-full">Giriş</Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-black text-white px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-black text-lg">Super Admin</h1>
          <p className="text-xs text-white/50">{shops.length} salon</p>
        </div>
        <button onClick={() => setAuthed(false)} className="text-xs bg-white/10 px-3 py-1.5 rounded-lg">Çıkış</button>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-brand-black">Salonlar</h2>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'İptal' : '+ Yeni Salon'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-4">
            <h3 className="font-bold text-sm mb-3">Yeni Salon Ekle</h3>
            <form onSubmit={createShop} className="space-y-3">
              <Input label="Salon Adı" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })) }} placeholder="Salon Adı" required />
              <Input label="URL (slug)" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="salon-adi" />
              <Input label="Telefon" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="tel" />
              <Input label="Adres" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              <Button type="submit" loading={loading} className="w-full">Oluştur</Button>
            </form>
          </Card>
        )}

        <div className="space-y-3">
          {shops.map(s => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-sm truncate">{s.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.is_active ? 'bg-green-100 text-brand-green' : 'bg-gray-100 text-gray-400'}`}>
                      {s.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">/{s.slug}</p>
                  {s.address && <p className="text-xs text-gray-400 truncate">{s.address}</p>}
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <Link href={`/admin/${s.slug}`} className="text-xs bg-brand-orange text-white px-2.5 py-1.5 rounded-lg font-semibold text-center">
                    Admin
                  </Link>
                  <Link href={`/${s.slug}`} className="text-xs border border-gray-200 text-gray-600 px-2.5 py-1.5 rounded-lg font-semibold text-center">
                    Sayfa
                  </Link>
                  <button
                    onClick={() => toggleShop(s)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold ${s.is_active ? 'bg-red-50 text-brand-red' : 'bg-green-50 text-brand-green'}`}
                  >
                    {s.is_active ? 'Deaktif' : 'Aktif Et'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
