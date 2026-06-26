'use client'

import { useState } from 'react'
import { AdminHeader } from './AdminHeader'
import { AdminNav } from './AdminNav'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/types'
import { supabase } from '@/lib/supabase'
import type { Shop, Service, ServiceCategory } from '@/types'

interface Props {
  shop: Shop
  services: Service[]
}

type FormData = { name: string; category: ServiceCategory; price: string; duration: string }

export function ServicesView({ shop, services: init }: Props) {
  const [services, setServices] = useState(init)
  const [editing, setEditing] = useState<Service | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<FormData>({ name: '', category: 'hair', price: '', duration: '60' })
  const [loading, setLoading] = useState(false)

  function startAdd() {
    setAdding(true)
    setEditing(null)
    setForm({ name: '', category: 'hair', price: '', duration: '60' })
  }

  function startEdit(s: Service) {
    setEditing(s)
    setAdding(false)
    setForm({ name: s.name, category: s.category, price: String(s.price), duration: String(s.duration) })
  }

  function cancel() {
    setAdding(false)
    setEditing(null)
  }

  async function save() {
    if (!form.name || !form.price) return
    setLoading(true)
    const payload = {
      shop_id: shop.id,
      name: form.name,
      category: form.category,
      price: Number(form.price),
      duration: Number(form.duration),
      is_active: true,
    }
    if (adding) {
      const { data } = await supabase.from('services').insert(payload).select().single()
      if (data) setServices(prev => [...prev, data])
    } else if (editing) {
      await supabase.from('services').update(payload).eq('id', editing.id)
      setServices(prev => prev.map(s => s.id === editing.id ? { ...s, ...payload } : s))
    }
    setLoading(false)
    cancel()
  }

  async function toggleActive(s: Service) {
    const updated = !s.is_active
    await supabase.from('services').update({ is_active: updated }).eq('id', s.id)
    setServices(prev => prev.map(x => x.id === s.id ? { ...x, is_active: updated } : x))
  }

  const categories = [...new Set(services.map(s => s.category))] as ServiceCategory[]

  return (
    <div>
      <AdminHeader shop={shop} />
      <AdminNav slug={shop.slug} />

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-brand-black">Hizmetler</h2>
          <Button size="sm" onClick={startAdd}>+ Ekle</Button>
        </div>

        {(adding || editing) && (
          <Card className="mb-4">
            <h3 className="font-bold text-sm mb-3">{adding ? 'Yeni Hizmet' : 'Düzenle'}</h3>
            <div className="space-y-3">
              <Input label="Hizmet Adı" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Hizmet adı" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as ServiceCategory }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm"
                >
                  {(Object.keys(CATEGORY_LABELS) as ServiceCategory[]).map(c => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Fiyat (₺)" type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
                <Input label="Süre (dk)" type="number" min="15" step="15" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={cancel} className="flex-1">İptal</Button>
                <Button size="sm" onClick={save} loading={loading} className="flex-1">Kaydet</Button>
              </div>
            </div>
          </Card>
        )}

        {categories.map(cat => (
          <div key={cat} className="mb-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">{CATEGORY_LABELS[cat]}</h3>
            <div className="space-y-2">
              {services.filter(s => s.category === cat).map(s => (
                <Card key={s.id} className={!s.is_active ? 'opacity-50' : ''}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.duration} dk</p>
                      <p className="text-sm font-bold text-brand-orange">{formatCurrency(s.price)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(s)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold ${s.is_active ? 'border-gray-200 text-gray-500' : 'border-green-200 text-brand-green'}`}
                      >
                        {s.is_active ? 'Pasif Yap' : 'Aktif Yap'}
                      </button>
                      <button onClick={() => startEdit(s)} className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600">
                        Düzenle
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
