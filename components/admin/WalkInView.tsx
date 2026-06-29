'use client'

import { useState } from 'react'
import { AdminHeader } from './AdminHeader'
import { AdminNav } from './AdminNav'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatDateTR, formatCurrency, getTodayString } from '@/lib/utils'
import { TIME_SLOTS } from '@/types'
import { createWalkIn } from '@/lib/db'
import type { Shop, WalkIn, StaffMember, Service } from '@/types'

interface Props {
  shop: Shop
  walkIns: WalkIn[]
  staff: StaffMember[]
  services: Service[]
}

export function WalkInView({ shop, walkIns: init, staff, services }: Props) {
  const [walkIns, setWalkIns] = useState(init)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    staff_id: staff[0]?.id ?? '',
    service_name: services[0]?.name ?? '',
    amount: '',
    date: getTodayString(),
    time_slot: '09:00',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.customer_name || !form.staff_id || !form.service_name || !form.amount) return
    setLoading(true)
    try {
      await createWalkIn({
        shop_id: shop.id,
        staff_id: form.staff_id,
        customer_name: form.customer_name,
        service_name: form.service_name,
        amount: Number(form.amount),
        date: form.date,
        time_slot: form.time_slot,
      })
      const newWalkIn: WalkIn = {
        id: Math.random().toString(),
        shop_id: shop.id,
        staff_id: form.staff_id,
        customer_name: form.customer_name,
        service_name: form.service_name,
        amount: Number(form.amount),
        date: form.date,
        time_slot: form.time_slot,
        created_at: new Date().toISOString(),
        staff: staff.find(s => s.id === form.staff_id),
      }
      setWalkIns(prev => [newWalkIn, ...prev])
      setShowForm(false)
      setForm(f => ({ ...f, customer_name: '', amount: '' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <AdminHeader shop={shop} />
      <AdminNav slug={shop.slug} />

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-brand-black">Kapıdan Gelen</h2>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'İptal' : '+ Ekle'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-4">
            <h3 className="font-bold text-sm mb-3">Yeni Kayıt</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input label="Müşteri Adı" placeholder="Ad Soyad" value={form.customer_name}
                onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Berber</label>
                <select value={form.staff_id} onChange={e => setForm(f => ({ ...f, staff_id: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm">
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hizmet</label>
                <select value={form.service_name} onChange={e => setForm(f => ({ ...f, service_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm">
                  {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  <option value="Diger">Diğer</option>
                </select>
              </div>
              <Input label="Tutar (TL)" placeholder="0" type="number" min="0" value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tarih</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Saat</label>
                  <select value={form.time_slot} onChange={e => setForm(f => ({ ...f, time_slot: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-orange outline-none text-sm">
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <Button type="submit" loading={loading} className="w-full">Kaydet</Button>
            </form>
          </Card>
        )}

        {walkIns.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">Kayıt bulunmuyor</div>
        ) : (
          <div className="space-y-2">
            {walkIns.map(w => (
              <Card key={w.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">{w.customer_name}</p>
                    <p className="text-xs text-gray-400">{w.service_name} • {w.staff?.name}</p>
                    <p className="text-xs text-gray-400">{formatDateTR(w.date)} {w.time_slot}</p>
                  </div>
                  <p className="font-black text-brand-orange">{formatCurrency(w.amount)}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
