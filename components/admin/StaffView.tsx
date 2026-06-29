'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AdminHeader } from './AdminHeader'
import { AdminNav } from './AdminNav'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import type { Shop, StaffMember } from '@/types'

interface Props {
  shop: Shop
  staff: StaffMember[]
}

export function StaffView({ shop, staff: init }: Props) {
  const [staff, setStaff] = useState(init)
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', title: '', phone: '' })

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
          {staff.map(s => (
            <Card key={s.id} className={!s.is_active ? 'opacity-50' : ''}>
              <div className="flex items-center gap-3">
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
                <button
                  onClick={() => toggleActive(s)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex-shrink-0 ${
                    s.is_active ? 'border-red-200 text-brand-red' : 'border-green-200 text-brand-green'
                  }`}
                >
                  {s.is_active ? 'Pasif Yap' : 'Aktif Yap'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
