'use client'

import { useState } from 'react'
import { AdminHeader } from './AdminHeader'
import { AdminNav } from './AdminNav'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { CATEGORY_LABELS, DAYS_TR } from '@/types'
import { formatCurrency } from '@/lib/utils'
import type { Shop, Service, StaffMember, WorkingHours, ServiceCategory } from '@/types'

interface Props {
  shop: Shop
  services: Service[]
  staff: StaffMember[]
  workingHours: WorkingHours[]
}

type Tab = 'saatler' | 'hizmetler' | 'personel'

export function DuzenleView({ shop, services: initServices, staff: initStaff, workingHours: initHours }: Props) {
  const [tab, setTab] = useState<Tab>('saatler')
  const [services, setServices] = useState(initServices)
  const [staff, setStaff] = useState(initStaff)
  const [hours, setHours] = useState(initHours)

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'saatler', label: 'Çalışma Saatleri', icon: '🕐' },
    { key: 'hizmetler', label: 'Hizmetler', icon: '✂️' },
    { key: 'personel', label: 'Personel', icon: '👥' },
  ]

  return (
    <div>
      <AdminHeader shop={shop} />
      <AdminNav slug={shop.slug} />

      <div className="px-4 pt-4 pb-2">
        <h2 className="font-black text-lg text-gray-900 mb-1">Randevu Sayfasını Düzenle</h2>
        <p className="text-xs text-gray-400 mb-4">Yaptığın değişiklikler randevu sayfasına anında yansır.</p>
      </div>

      {/* Tab seçici */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
              tab === t.key
                ? 'bg-brand-orange text-white border-brand-orange'
                : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-8">
        {tab === 'saatler' && (
          <SaatlerTab hours={hours} setHours={setHours} shopId={shop.id} />
        )}
        {tab === 'hizmetler' && (
          <HizmetlerTab services={services} setServices={setServices} shopId={shop.id} />
        )}
        {tab === 'personel' && (
          <PersonelTab staff={staff} setStaff={setStaff} shopId={shop.id} />
        )}
      </div>
    </div>
  )
}

// ── SAATLER ──────────────────────────────────────────────

function SaatlerTab({ hours, setHours, shopId }: {
  hours: WorkingHours[]
  setHours: React.Dispatch<React.SetStateAction<WorkingHours[]>>
  shopId: string
}) {
  async function toggleDay(dayIndex: number) {
    const existing = hours.find(h => h.day_of_week === dayIndex)
    if (existing) {
      const updated = { ...existing, is_closed: !existing.is_closed }
      await supabase.from('working_hours').update({ is_closed: updated.is_closed }).eq('id', existing.id)
      setHours(prev => prev.map(h => h.day_of_week === dayIndex ? updated : h))
    } else {
      const { data } = await supabase.from('working_hours').insert({
        shop_id: shopId, staff_id: null,
        day_of_week: dayIndex, open_time: '09:00', close_time: '19:00', is_closed: false,
      }).select().single()
      if (data) setHours(prev => [...prev, data])
    }
  }

  async function updateTime(id: string, field: 'open_time' | 'close_time', value: string) {
    await supabase.from('working_hours').update({ [field]: value }).eq('id', id)
    setHours(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h))
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400">Açık günlerde booking saatleri otomatik oluşur.</p>
      {Array.from({ length: 7 }).map((_, i) => {
        const h = hours.find(x => x.day_of_week === i)
        const isOpen = h ? !h.is_closed : false
        return (
          <Card key={i} padding={false} className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-gray-900">{DAYS_TR[i]}</span>
              <button
                onClick={() => toggleDay(i)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isOpen ? 'bg-brand-orange' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isOpen ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {isOpen && h ? (
              <div className="flex items-center gap-2">
                <input type="time" value={h.open_time}
                  onChange={e => updateTime(h.id, 'open_time', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm" />
                <span className="text-gray-400 text-xs font-bold">–</span>
                <input type="time" value={h.close_time}
                  onChange={e => updateTime(h.id, 'close_time', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm" />
              </div>
            ) : (
              <p className="text-xs text-red-400 font-semibold">Kapalı</p>
            )}
          </Card>
        )
      })}
    </div>
  )
}

// ── HİZMETLER ────────────────────────────────────────────

function HizmetlerTab({ services, setServices, shopId }: {
  services: Service[]
  setServices: React.Dispatch<React.SetStateAction<Service[]>>
  shopId: string
}) {
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState({ name: '', category: 'hair' as ServiceCategory, price: '', duration: '60' })
  const [saving, setSaving] = useState(false)

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

  function cancel() { setAdding(false); setEditing(null) }

  async function save() {
    if (!form.name || !form.price) return
    setSaving(true)
    const payload = { shop_id: shopId, name: form.name, category: form.category, price: Number(form.price), duration: Number(form.duration), is_active: true }
    if (adding) {
      const { data } = await supabase.from('services').insert(payload).select().single()
      if (data) setServices(prev => [...prev, data])
    } else if (editing) {
      await supabase.from('services').update(payload).eq('id', editing.id)
      setServices(prev => prev.map(s => s.id === editing.id ? { ...s, ...payload } : s))
    }
    setSaving(false)
    cancel()
  }

  async function remove(id: string) {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return
    await supabase.from('services').update({ is_active: false }).eq('id', id)
    setServices(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-gray-700">{services.length} hizmet</p>
        <Button size="sm" onClick={startAdd}>+ Hizmet Ekle</Button>
      </div>

      {(adding || editing) && (
        <Card className="mb-4">
          <h3 className="font-bold text-sm mb-3">{adding ? 'Yeni Hizmet' : 'Hizmeti Düzenle'}</h3>
          <div className="space-y-3">
            <Input label="Hizmet Adı" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Saç Kesimi" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ServiceCategory }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm">
                {(Object.keys(CATEGORY_LABELS) as ServiceCategory[]).map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Fiyat (TL)" type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="150" />
              <Input label="Süre (dk)" type="number" min="15" step="15" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <button onClick={cancel} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-500">İptal</button>
              <Button size="sm" onClick={save} loading={saving} className="flex-1">Kaydet</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {services.map(s => (
          <Card key={s.id}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{s.name}</p>
                <p className="text-xs text-gray-400">{CATEGORY_LABELS[s.category]} • {s.duration} dk</p>
                <p className="text-sm font-black text-brand-orange">{formatCurrency(s.price)}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(s)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-semibold">
                  Düzenle
                </button>
                <button onClick={() => remove(s.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 font-semibold">
                  Sil
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ── PERSONEL ──────────────────────────────────────────────

function PersonelTab({ staff, setStaff, shopId }: {
  staff: StaffMember[]
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>
  shopId: string
}) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', title: '', phone: '' })
  const [saving, setSaving] = useState(false)

  async function addStaff(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) return
    setSaving(true)
    const { data } = await supabase.from('staff').insert({
      shop_id: shopId, name: form.name, title: form.title || null,
      phone: form.phone || null, is_active: true, user_id: null, photo_url: null,
    }).select().single()
    if (data) setStaff(prev => [...prev, data])
    setForm({ name: '', title: '', phone: '' })
    setAdding(false)
    setSaving(false)
  }

  async function removeStaff(id: string) {
    if (!confirm('Bu personeli kaldırmak istediğinizden emin misiniz?')) return
    await supabase.from('staff').update({ is_active: false }).eq('id', id)
    setStaff(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-gray-700">{staff.length} personel</p>
        <Button size="sm" onClick={() => setAdding(!adding)}>
          {adding ? 'İptal' : '+ Personel Ekle'}
        </Button>
      </div>

      {adding && (
        <Card className="mb-4">
          <h3 className="font-bold text-sm mb-3">Yeni Personel</h3>
          <form onSubmit={addStaff} className="space-y-3">
            <Input label="Ad Soyad *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ahmet Yılmaz" required />
            <Input label="Unvan" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Berber, Usta..." />
            <Input label="Telefon" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="05XX XXX XX XX" type="tel" />
            <Button type="submit" loading={saving} className="w-full">Ekle</Button>
          </form>
        </Card>
      )}

      <div className="space-y-2">
        {staff.map(s => (
          <Card key={s.id}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-black text-lg flex-shrink-0">
                {s.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{s.name}</p>
                {s.title && <p className="text-xs text-gray-400">{s.title}</p>}
                {s.phone && <p className="text-xs text-gray-400">{s.phone}</p>}
              </div>
              <button onClick={() => removeStaff(s.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 font-semibold flex-shrink-0">
                Kaldır
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
