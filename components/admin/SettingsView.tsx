'use client'

import { useState } from 'react'
import { AdminHeader } from './AdminHeader'
import { AdminNav } from './AdminNav'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { DAYS_TR } from '@/types'
import { supabase } from '@/lib/supabase'
import type { Shop, WorkingHours } from '@/types'

interface Props {
  shop: Shop
  workingHours: WorkingHours[]
}

export function SettingsView({ shop: initShop, workingHours: initHours }: Props) {
  const [shop, setShop] = useState(initShop)
  const [hours, setHours] = useState(initHours)
  const [tab, setTab] = useState<'profile' | 'hours' | 'instagram'>('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function saveProfile() {
    setSaving(true)
    await supabase.from('shops').update({
      name: shop.name,
      phone: shop.phone,
      whatsapp: shop.whatsapp,
      address: shop.address,
      maps_url: shop.maps_url,
    }).eq('id', shop.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function saveInstagram() {
    setSaving(true)
    await supabase.from('shops').update({
      instagram_username: shop.instagram_username,
      instagram_bio: shop.instagram_bio,
      instagram_followers: shop.instagram_followers,
      instagram_following: shop.instagram_following,
      instagram_posts: shop.instagram_posts,
    }).eq('id', shop.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function toggleDay(dayIndex: number) {
    const existing = hours.find(h => h.day_of_week === dayIndex)
    if (existing) {
      const updated = { ...existing, is_closed: !existing.is_closed }
      await supabase.from('working_hours').update({ is_closed: updated.is_closed }).eq('id', existing.id)
      setHours(prev => prev.map(h => h.day_of_week === dayIndex ? updated : h))
    } else {
      const { data } = await supabase.from('working_hours').insert({
        shop_id: shop.id,
        staff_id: null,
        day_of_week: dayIndex,
        open_time: '09:00',
        close_time: '19:00',
        is_closed: false,
      }).select().single()
      if (data) setHours(prev => [...prev, data])
    }
  }

  return (
    <div>
      <AdminHeader shop={shop} />
      <AdminNav slug={shop.slug} />

      <div className="flex bg-white border-b border-gray-200">
        {(['profile', 'hours', 'instagram'] as const).map(t => {
          const labels = { profile: 'Profil', hours: 'Saatler', instagram: 'Instagram' }
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                tab === t ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-400'
              }`}
            >
              {labels[t]}
            </button>
          )
        })}
      </div>

      <div className="px-4 py-4">
        {tab === 'profile' && (
          <div className="space-y-3">
            <Input label="Salon Adı" value={shop.name} onChange={e => setShop(s => ({ ...s, name: e.target.value }))} />
            <Input label="Telefon" value={shop.phone ?? ''} onChange={e => setShop(s => ({ ...s, phone: e.target.value }))} type="tel" />
            <Input label="WhatsApp" value={shop.whatsapp ?? ''} onChange={e => setShop(s => ({ ...s, whatsapp: e.target.value }))} type="tel" />
            <Input label="Adres" value={shop.address ?? ''} onChange={e => setShop(s => ({ ...s, address: e.target.value }))} />
            <Input label="Google Maps URL" value={shop.maps_url ?? ''} onChange={e => setShop(s => ({ ...s, maps_url: e.target.value }))} type="url" />
            <Button onClick={saveProfile} loading={saving} className="w-full">
              {saved ? '✓ Kaydedildi' : 'Kaydet'}
            </Button>
          </div>
        )}

        {tab === 'hours' && (
          <div>
            <h3 className="font-bold text-sm mb-3 text-brand-black">Çalışma Günleri</h3>
            <div className="space-y-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const h = hours.find(x => x.day_of_week === i)
                const isOpen = h ? !h.is_closed : false
                return (
                  <Card key={i}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{DAYS_TR[i]}</span>
                      <div className="flex items-center gap-3">
                        {isOpen && h && (
                          <span className="text-xs text-gray-500">{h.open_time} – {h.close_time}</span>
                        )}
                        <button
                          onClick={() => toggleDay(i)}
                          className={`w-12 h-6 rounded-full transition-colors relative ${isOpen ? 'bg-brand-orange' : 'bg-gray-200'}`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isOpen ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'instagram' && (
          <div className="space-y-3">
            <Input label="Instagram Kullanıcı Adı" value={shop.instagram_username ?? ''} onChange={e => setShop(s => ({ ...s, instagram_username: e.target.value }))} placeholder="@kullaniciadi" />
            <Input label="Bio" value={shop.instagram_bio ?? ''} onChange={e => setShop(s => ({ ...s, instagram_bio: e.target.value }))} placeholder="Açıklama" />
            <div className="grid grid-cols-3 gap-2">
              <Input label="Gönderi" type="number" value={shop.instagram_posts ?? ''} onChange={e => setShop(s => ({ ...s, instagram_posts: Number(e.target.value) }))} />
              <Input label="Takipçi" type="number" value={shop.instagram_followers ?? ''} onChange={e => setShop(s => ({ ...s, instagram_followers: Number(e.target.value) }))} />
              <Input label="Takip" type="number" value={shop.instagram_following ?? ''} onChange={e => setShop(s => ({ ...s, instagram_following: Number(e.target.value) }))} />
            </div>
            <Button onClick={saveInstagram} loading={saving} className="w-full">
              {saved ? '✓ Kaydedildi' : 'Kaydet'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
