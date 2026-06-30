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

type Tab = 'profile' | 'hours' | 'instagram' | 'theme'

function shopColor(shop: Shop, key: string, fallback: string): string {
  return (shop as unknown as Record<string, string | null>)[key] ?? fallback
}

export function SettingsView({ shop: initShop, workingHours: initHours }: Props) {
  const [shop, setShop] = useState(initShop)
  const [hours, setHours] = useState(initHours)
  const [tab, setTab] = useState<Tab>('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function saveFields(fields: Partial<Shop>) {
    setSaving(true)
    await supabase.from('shops').update(fields).eq('id', shop.id)
    setShop(s => ({ ...s, ...fields }))
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
        shop_id: shop.id, staff_id: null,
        day_of_week: dayIndex, open_time: '09:00', close_time: '19:00', is_closed: false,
      }).select().single()
      if (data) setHours(prev => [...prev, data])
    }
  }

  async function updateHourTime(id: string, field: 'open_time' | 'close_time', value: string) {
    await supabase.from('working_hours').update({ [field]: value }).eq('id', id)
    setHours(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h))
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'İşletme' },
    { key: 'hours', label: 'Saatler' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'theme', label: 'Tema' },
  ]

  return (
    <div>
      <AdminHeader shop={shop} />
      <AdminNav slug={shop.slug} />

      <div className="flex bg-white border-b border-gray-200 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-shrink-0 flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === t.key ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4">

        {/* ── PROFILE ── */}
        {tab === 'profile' && (
          <div className="space-y-3">
            <Input
              label="Salon Adı"
              value={shop.name}
              onChange={e => setShop(s => ({ ...s, name: e.target.value }))}
              placeholder="Berber"
            />
            <Input
              label="Randevu Sayfasında Görünen Ad"
              value={shop.booking_name ?? ''}
              onChange={e => setShop(s => ({ ...s, booking_name: e.target.value }))}
              placeholder="Müşterinin gördüğü isim"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama</label>
              <textarea
                value={shop.description ?? ''}
                onChange={e => setShop(s => ({ ...s, description: e.target.value }))}
                placeholder="Profesyonel berber hizmetleri"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm resize-none"
              />
            </div>
            <Input label="Telefon" value={shop.phone ?? ''} onChange={e => setShop(s => ({ ...s, phone: e.target.value }))} type="tel" placeholder="05XX XXX XX XX" />
            <Input label="WhatsApp" value={shop.whatsapp ?? ''} onChange={e => setShop(s => ({ ...s, whatsapp: e.target.value }))} type="tel" placeholder="905XXXXXXXXX" />
            <Input label="Adres" value={shop.address ?? ''} onChange={e => setShop(s => ({ ...s, address: e.target.value }))} placeholder="Mahalle, İlçe, Şehir" />
            <Input label="Google Maps URL" value={shop.maps_url ?? ''} onChange={e => setShop(s => ({ ...s, maps_url: e.target.value }))} type="url" placeholder="https://maps.google.com/..." />
            <Input label="Logo URL" value={shop.logo_url ?? ''} onChange={e => setShop(s => ({ ...s, logo_url: e.target.value }))} type="url" placeholder="https://..." />
            <Input label="Banner URL" value={shop.banner_url ?? ''} onChange={e => setShop(s => ({ ...s, banner_url: e.target.value }))} type="url" placeholder="https://..." />
            <Input label="QR Kod URL" value={shop.qr_url ?? ''} onChange={e => setShop(s => ({ ...s, qr_url: e.target.value }))} type="url" placeholder="https://..." />
            <Button
              onClick={() => saveFields({ name: shop.name, booking_name: shop.booking_name, description: shop.description, phone: shop.phone, whatsapp: shop.whatsapp, address: shop.address, maps_url: shop.maps_url, logo_url: shop.logo_url, banner_url: shop.banner_url, qr_url: shop.qr_url })}
              loading={saving}
              className="w-full"
            >
              {saved ? '✓ Kaydedildi' : 'Kaydet'}
            </Button>
          </div>
        )}

        {/* ── WORKING HOURS ── */}
        {tab === 'hours' && (
          <div>
            <p className="text-xs text-gray-400 mb-3">Açık günlerde booking slotları otomatik oluşur.</p>
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => {
                const h = hours.find(x => x.day_of_week === i)
                const isOpen = h ? !h.is_closed : false
                return (
                  <Card key={i} padding={false} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-brand-black">{DAYS_TR[i]}</span>
                      <button
                        onClick={() => toggleDay(i)}
                        className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${isOpen ? 'bg-brand-orange' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isOpen ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    {isOpen && h && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={h.open_time}
                          onChange={e => updateHourTime(h.id, 'open_time', e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm"
                        />
                        <span className="text-gray-400 text-xs">–</span>
                        <input
                          type="time"
                          value={h.close_time}
                          onChange={e => updateHourTime(h.id, 'close_time', e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm"
                        />
                      </div>
                    )}
                    {!isOpen && (
                      <p className="text-xs text-brand-red font-semibold">Kapalı</p>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* ── INSTAGRAM ── */}
        {tab === 'instagram' && (
          <div className="space-y-3">
            <Input
              label="Instagram Profil URL"
              value={shop.instagram_url ?? ''}
              onChange={e => setShop(s => ({ ...s, instagram_url: e.target.value }))}
              placeholder="https://instagram.com/kullaniciadi"
              type="url"
            />
            <Input
              label="Kullanıcı Adı"
              value={shop.instagram_username ?? ''}
              onChange={e => setShop(s => ({ ...s, instagram_username: e.target.value }))}
              placeholder="kullaniciadi (@ olmadan)"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              <textarea
                value={shop.instagram_bio ?? ''}
                onChange={e => setShop(s => ({ ...s, instagram_bio: e.target.value }))}
                placeholder="Kısa açıklama"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm resize-none"
              />
            </div>
            <Input
              label="Profil Fotoğrafı URL"
              value={shop.instagram_photo_url ?? ''}
              onChange={e => setShop(s => ({ ...s, instagram_photo_url: e.target.value }))}
              placeholder="https://..."
              type="url"
            />
            <Input
              label="Buton Yazısı"
              value={shop.instagram_cta_text ?? ''}
              onChange={e => setShop(s => ({ ...s, instagram_cta_text: e.target.value }))}
              placeholder="Instagram'da Takip Et"
            />
            <div className="grid grid-cols-3 gap-2">
              <Input label="Gönderi" type="number" value={shop.instagram_posts ?? ''} onChange={e => setShop(s => ({ ...s, instagram_posts: Number(e.target.value) }))} placeholder="0" />
              <Input label="Takipçi" type="number" value={shop.instagram_followers ?? ''} onChange={e => setShop(s => ({ ...s, instagram_followers: Number(e.target.value) }))} placeholder="0" />
              <Input label="Takip" type="number" value={shop.instagram_following ?? ''} onChange={e => setShop(s => ({ ...s, instagram_following: Number(e.target.value) }))} placeholder="0" />
            </div>
            <Button
              onClick={() => saveFields({ instagram_url: shop.instagram_url, instagram_username: shop.instagram_username, instagram_bio: shop.instagram_bio, instagram_photo_url: shop.instagram_photo_url, instagram_cta_text: shop.instagram_cta_text, instagram_posts: shop.instagram_posts, instagram_followers: shop.instagram_followers, instagram_following: shop.instagram_following })}
              loading={saving}
              className="w-full"
            >
              {saved ? '✓ Kaydedildi' : 'Kaydet'}
            </Button>
          </div>
        )}

        {/* ── THEME ── */}
        {tab === 'theme' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400">Renk değişiklikleri public sayfaya anında yansır.</p>

            <div className="space-y-3">
              {[
                { key: 'theme_dominant', label: 'Ana Renk (Dominant)', default: '#111111' },
                { key: 'theme_accent', label: 'Vurgu Rengi (Accent)', default: '#C85A17' },
                { key: 'theme_button', label: 'Buton Rengi', default: '#C85A17' },
                { key: 'theme_pending', label: 'Bekliyor Rengi', default: '#F97316' },
                { key: 'theme_approved', label: 'Onaylandı Rengi', default: '#1FA34A' },
                { key: 'theme_rejected', label: 'İptal Rengi', default: '#D72638' },
              ].map(({ key, label, default: def }) => (
                <Card key={key}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-brand-black">{label}</p>
                      <p className="text-xs text-gray-400">{shopColor(shop, key, def) ?? def}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-xl border-2 border-gray-200 flex-shrink-0"
                        style={{ backgroundColor: shopColor(shop, key, def) ?? def }}
                      />
                      <input
                        type="color"
                        value={shopColor(shop, key, def) ?? def}
                        onChange={e => setShop(s => ({ ...s, [key]: e.target.value }))}
                        className="w-10 h-10 rounded-xl border-2 border-gray-200 cursor-pointer p-1"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              onClick={() => saveFields({ theme_dominant: shop.theme_dominant, theme_accent: shop.theme_accent, theme_button: shop.theme_button, theme_pending: shop.theme_pending, theme_approved: shop.theme_approved, theme_rejected: shop.theme_rejected })}
              loading={saving}
              className="w-full"
            >
              {saved ? '✓ Kaydedildi' : 'Temayı Kaydet'}
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}
