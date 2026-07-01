'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AdminHeader } from './AdminHeader'
import { AdminNav } from './AdminNav'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { DAYS_TR } from '@/types'
import type { Shop, StaffMember, WorkingHours } from '@/types'

interface Props {
  shop: Shop
  staff: StaffMember[]
  workingHours: WorkingHours[]
}

export function StaffView({ shop, staff: init, workingHours: initHours }: Props) {
  const [staff, setStaff] = useState(init)
  const [hours, setHours] = useState(initHours)
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', title: '', phone: '' })
  const [openHours, setOpenHours] = useState<string | null>(null) // staff id

  const accent = shop.theme_accent ?? '#C85A17'

  async function addStaff(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) return
    setLoading(true)
    const payload = { shop_id: shop.id, name: form.name, title: form.title || null, phone: form.phone || null, is_active: true, user_id: null, photo_url: null }
    const { data } = await supabase.from('staff').insert(payload).select().single()
    if (data) setStaff(prev => [...prev, data])
    setForm({ name: '', title: '', phone: '' })
    setAdding(false)
    setLoading(false)
  }

  async function toggleActive(s: StaffMember) {
    const updated = !s.is_active
    await supabase.from('staff').update({ is_active: updated }).eq('id', s.id)
    setStaff(prev => prev.map(x => x.id === s.id ? { ...x, is_active: updated } : x))
  }

  function staffHours(staffId: string) {
    return hours.filter(h => h.staff_id === staffId)
  }

  async function toggleDay(staffId: string, dayIndex: number) {
    const existing = hours.find(h => h.staff_id === staffId && h.day_of_week === dayIndex)
    if (existing) {
      const updated = { ...existing, is_closed: !existing.is_closed }
      await supabase.from('working_hours').update({ is_closed: updated.is_closed }).eq('id', existing.id)
      setHours(prev => prev.map(h => h.id === existing.id ? updated : h))
    } else {
      const { data } = await supabase.from('working_hours').insert({
        shop_id: shop.id, staff_id: staffId,
        day_of_week: dayIndex, open_time: '09:00', close_time: '19:00', is_closed: false,
      }).select().single()
      if (data) setHours(prev => [...prev, data])
    }
  }

  async function updateHourTime(id: string, field: 'open_time' | 'close_time', value: string) {
    await supabase.from('working_hours').update({ [field]: value }).eq('id', id)
    setHours(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h))
  }

  async function initStaffHours(staffId: string) {
    // Eğer hiç saat kaydı yoksa mağaza saatlerini kopyala
    const existing = hours.filter(h => h.staff_id === staffId)
    if (existing.length > 0) return
    const shopHours = hours.filter(h => h.staff_id === null)
    if (shopHours.length === 0) {
      const payload = Array.from({ length: 7 }, (_, i) => ({
        shop_id: shop.id, staff_id: staffId,
        day_of_week: i, open_time: '09:00', close_time: '19:00', is_closed: i === 0,
      }))
      const { data, error } = await supabase.from('working_hours').insert(payload).select()
      if (error) { alert('Çalışma saatleri kaydedilemedi, tekrar deneyin.'); return }
      if (data) setHours(prev => [...prev, ...data])
    } else {
      const payload = shopHours.map(h => ({
        shop_id: shop.id, staff_id: staffId,
        day_of_week: h.day_of_week, open_time: h.open_time, close_time: h.close_time, is_closed: h.is_closed,
      }))
      const { data, error } = await supabase.from('working_hours').insert(payload).select()
      if (error) { alert('Çalışma saatleri kaydedilemedi, tekrar deneyin.'); return }
      if (data) setHours(prev => [...prev, ...data])
    }
  }

  async function handleOpenHours(staffId: string) {
    if (openHours === staffId) { setOpenHours(null); return }
    await initStaffHours(staffId)
    setOpenHours(staffId)
  }

  return (
    <div>
      <AdminHeader shop={shop} />
      <AdminNav slug={shop.slug} />

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-brand-black">Ekip</h2>
          <Button size="sm" onClick={() => setAdding(!adding)}>
            {adding ? 'İptal' : '+ Ekle'}
          </Button>
        </div>

        {adding && (
          <Card className="mb-4">
            <h3 className="font-bold text-sm mb-3">Yeni Çalışan</h3>
            <form onSubmit={addStaff} className="space-y-3">
              <Input label="Ad Soyad" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ad Soyad" required />
              <Input label="Unvan" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ör: Berber, Usta" />
              <Input label="Telefon" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0 5XX XXX XX XX" type="tel" />
              <Button type="submit" loading={loading} className="w-full">Ekle</Button>
            </form>
          </Card>
        )}

        <div className="space-y-3">
          {staff.map(s => {
            const sh = staffHours(s.id)
            const isExpanded = openHours === s.id
            return (
              <Card key={s.id} padding={false} className={!s.is_active ? 'opacity-50' : ''}>
                {/* Personel satırı */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {s.photo_url ? (
                      <Image src={s.photo_url} alt={s.name} width={48} height={48} className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-brand-black flex items-center justify-center text-white font-black">
                        {s.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{s.name}</p>
                    {s.title && <p className="text-xs text-gray-400">{s.title}</p>}
                    {s.phone && <p className="text-xs text-gray-400">{s.phone}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleOpenHours(s.id)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold border-gray-200 text-gray-500"
                    >
                      {isExpanded ? 'Kapat' : 'Saatler'}
                    </button>
                    <button
                      onClick={() => toggleActive(s)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold ${
                        s.is_active ? 'border-red-200 text-brand-red' : 'border-green-200 text-brand-green'
                      }`}
                    >
                      {s.is_active ? 'Pasif' : 'Aktif'}
                    </button>
                  </div>
                </div>

                {/* Çalışma saatleri paneli */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-3">
                    <p className="text-xs font-bold text-gray-500 mb-3">Çalışma Saatleri — {s.name}</p>
                    <div className="space-y-2">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const h = sh.find(x => x.day_of_week === i)
                        const isOpen = h ? !h.is_closed : false
                        // Bugünün randevularını göster: yeşil=boş, kırmızı=dolu
                        return (
                          <div key={i} className="bg-gray-50 rounded-xl px-3 py-2.5">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-bold text-gray-800">{DAYS_TR[i]}</span>
                              <button
                                onClick={() => toggleDay(s.id, i)}
                                className={`w-11 h-5 rounded-full transition-colors relative flex-shrink-0 ${isOpen ? 'bg-green-500' : 'bg-gray-300'}`}
                              >
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isOpen ? 'translate-x-6' : 'translate-x-0.5'}`} />
                              </button>
                            </div>
                            {isOpen && h ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={h.open_time}
                                  onChange={e => updateHourTime(h.id, 'open_time', e.target.value)}
                                  className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 outline-none text-xs"
                                />
                                <span className="text-gray-400 text-xs">–</span>
                                <input
                                  type="time"
                                  value={h.close_time}
                                  onChange={e => updateHourTime(h.id, 'close_time', e.target.value)}
                                  className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 outline-none text-xs"
                                />
                              </div>
                            ) : (
                              <p className="text-xs text-red-400 font-semibold">Kapalı — müşteri alamaz</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Yeşil = müşteri alabilir · Kırmızı = kapalı
                    </p>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
