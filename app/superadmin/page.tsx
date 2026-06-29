'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { superAdminLogin, isSuperAdminAuthed, superAdminLogout } from '@/lib/auth'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Shop } from '@/types'
import Link from 'next/link'

export default function SuperAdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [shops, setShops] = useState<Shop[]>([])
  const [tab, setTab] = useState<'shops' | 'create'>('shops')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState('')

  const [form, setForm] = useState({
    name: '', slug: '', booking_name: '', phone: '', address: '',
    instagram_url: '', username: '', userpass: '',
  })

  useEffect(() => {
    if (isSuperAdminAuthed()) {
      setAuthed(true)
      loadShops()
    }
  }, [])

  async function loadShops() {
    const { data } = await supabase.from('shops').select('*').order('created_at', { ascending: false })
    setShops(data ?? [])
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (superAdminLogin(password)) { setAuthed(true); loadShops() }
    else alert('Hatalı şifre')
  }

  async function createShop(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.slug || !form.username || !form.userpass) {
      alert('Salon adı, URL, kullanıcı adı ve şifre zorunlu')
      return
    }
    setLoading(true)
    try {
      const { data: shop, error } = await supabase.from('shops').insert({
        name: form.name,
        slug: form.slug.toLowerCase().replace(/\s+/g, '-'),
        booking_name: form.booking_name || form.name,
        phone: form.phone || null,
        address: form.address || null,
        instagram_url: form.instagram_url || null,
        is_active: true,
        owner_id: '00000000-0000-0000-0000-000000000000',
        description: 'Profesyonel berber hizmetleri',
      }).select().single()

      if (error) throw error

      await supabase.from('shop_users').insert({
        shop_id: shop.id,
        username: form.username,
        password_hash: form.userpass,
        role: 'owner',
      })

      // Default working hours (Pzt-Cmt açık, Pazar kapalı)
      const hoursPayload = Array.from({ length: 7 }, (_, i) => ({
        shop_id: shop.id, staff_id: null, day_of_week: i,
        open_time: '09:00', close_time: '19:00', is_closed: i === 0,
      }))
      await supabase.from('working_hours').insert(hoursPayload)

      setSaved(`✓ "${form.name}" oluşturuldu! Link: /${form.slug}/randevu`)
      setForm({ name: '', slug: '', booking_name: '', phone: '', address: '', instagram_url: '', username: '', userpass: '' })
      setTab('shops')
      loadShops()
    } catch (err: unknown) {
      alert('Hata: ' + (err instanceof Error ? err.message : String(err)))
    }
    setLoading(false)
  }

  async function toggleShop(shop: Shop) {
    const updated = !shop.is_active
    await supabase.from('shops').update({ is_active: updated }).eq('id', shop.id)
    setShops(prev => prev.map(s => s.id === shop.id ? { ...s, is_active: updated } : s))
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center text-3xl mx-auto mb-4">👑</div>
            <h1 className="text-2xl font-black text-white">Super Admin</h1>
          </div>
          <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-brand-orange text-sm"
              />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-xl bg-brand-orange text-white font-black text-base">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-black text-lg text-white">Super Admin</h1>
          <p className="text-xs text-white/40">{shops.length} salon</p>
        </div>
        <button
          onClick={() => { superAdminLogout(); setAuthed(false) }}
          className="text-xs bg-white/10 text-white/60 px-3 py-1.5 rounded-lg"
        >
          Çıkış
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-900 border-b border-white/10">
        {[{ key: 'shops', label: '🏪 Salonlar' }, { key: 'create', label: '➕ Yeni Salon' }].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === t.key ? 'border-brand-orange text-brand-orange' : 'border-transparent text-white/40'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4">
        {saved && (
          <div className="mb-4 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm font-semibold">
            {saved}
          </div>
        )}

        {/* SHOPS LIST */}
        {tab === 'shops' && (
          <div className="space-y-3">
            {shops.length === 0 && (
              <div className="text-center py-12 text-white/30 text-sm">Henüz salon yok. Yeni Salon ekle.</div>
            )}
            {shops.map(s => (
              <div key={s.id} className="bg-gray-900 border border-white/10 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-white truncate">{s.booking_name ?? s.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${s.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {s.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <p className="text-xs text-white/40">/{s.slug}/randevu</p>
                    {s.address && <p className="text-xs text-white/30 truncate mt-0.5">{s.address}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <Link
                      href={`/${s.slug}/panel`}
                      className="text-xs bg-brand-orange text-white px-3 py-1.5 rounded-lg font-semibold text-center"
                    >
                      Panel
                    </Link>
                    <Link
                      href={`/${s.slug}/randevu`}
                      target="_blank"
                      className="text-xs border border-white/20 text-white/60 px-3 py-1.5 rounded-lg font-semibold text-center"
                    >
                      Sayfa
                    </Link>
                    <button
                      onClick={() => toggleShop(s)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${s.is_active ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
                    >
                      {s.is_active ? 'Durdur' : 'Aktif Et'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE SHOP */}
        {tab === 'create' && (
          <form onSubmit={createShop} className="space-y-3">
            <p className="text-xs text-white/40 mb-2">Tüm alanlar daha sonra admin panelinden düzenlenebilir.</p>

            <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Salon Bilgileri</p>
              <DarkInput label="Salon Adı *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v, slug: v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), booking_name: v }))} placeholder="Ahmet Berber" />
              <DarkInput label="URL Slug *" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} placeholder="ahmetberber" />
              <DarkInput label="Randevu Sayfasında Görünen Ad" value={form.booking_name} onChange={v => setForm(f => ({ ...f, booking_name: v }))} placeholder="Ahmet Usta" />
              <DarkInput label="Telefon" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="05XX XXX XX XX" />
              <DarkInput label="Adres" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} placeholder="İlçe, Şehir" />
              <DarkInput label="Instagram URL" value={form.instagram_url} onChange={v => setForm(f => ({ ...f, instagram_url: v }))} placeholder="https://instagram.com/..." />
            </div>

            <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Admin Girişi</p>
              <DarkInput label="Kullanıcı Adı *" value={form.username} onChange={v => setForm(f => ({ ...f, username: v }))} placeholder="ahmet123" />
              <DarkInput label="Şifre *" value={form.userpass} onChange={v => setForm(f => ({ ...f, userpass: v }))} placeholder="güçlü şifre" type="password" />
              <p className="text-xs text-white/30">Bu bilgileri berbere ver. Giriş linki: <span className="text-brand-orange">/{form.slug || 'slug'}</span></p>
            </div>

            {form.slug && (
              <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-xl px-4 py-3">
                <p className="text-xs text-brand-orange font-semibold">Bio linki olacak:</p>
                <p className="text-sm font-black text-white mt-0.5">siteadin.com/{form.slug}/randevu</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-brand-orange text-white font-black text-base disabled:opacity-50"
            >
              {loading ? 'Oluşturuluyor...' : 'Salonu Oluştur'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function DarkInput({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-brand-orange text-sm"
      />
    </div>
  )
}
