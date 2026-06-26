'use client'

import { useState, useEffect } from 'react'
import {
  getAppointments,
  cancelAppointment,
  getCustomServices,
  saveCustomServices,
  getBlockedDates,
  saveBlockedDates,
  Appointment,
} from '@/lib/storage'
import { SERVICES, Service } from '@/lib/data'
import { formatDate } from '@/lib/utils'

type Tab = 'appointments' | 'services' | 'blocked'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState<Tab>('appointments')

  function login(e: React.FormEvent) {
    e.preventDefault()
    if (password === 'admin1234') setAuthed(true)
    else alert('Hatalı şifre')
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
        <div className="card w-full max-w-sm p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Paneli</h1>
          <p className="text-sm text-gray-400 mb-5">Ozan Cin Hair Art Studio</p>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green outline-none text-sm"
            />
            <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 rounded-xl">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-green text-white px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">Admin Paneli</h1>
          <p className="text-xs text-green-200">Ozan Cin Hair Art Studio</p>
        </div>
        <button onClick={() => setAuthed(false)} className="text-xs bg-white/20 px-3 py-1.5 rounded-lg">
          Çıkış
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-200">
        {(['appointments', 'services', 'blocked'] as Tab[]).map((t) => {
          const labels: Record<Tab, string> = { appointments: 'Randevular', services: 'Hizmetler', blocked: 'Bloke Günler' }
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${
                tab === t ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-400'
              }`}
            >
              {labels[t]}
            </button>
          )
        })}
      </div>

      <div className="px-4 py-4">
        {tab === 'appointments' && <AppointmentsTab />}
        {tab === 'services' && <ServicesTab />}
        {tab === 'blocked' && <BlockedTab />}
      </div>
    </div>
  )
}

function AppointmentsTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all')

  useEffect(() => { setAppointments(getAppointments()) }, [])

  function handleCancel(id: string) {
    if (!confirm('Bu randevuyu iptal etmek istediğinizden emin misiniz?')) return
    cancelAppointment(id)
    setAppointments(getAppointments())
  }

  const filtered = appointments
    .filter((a) => filter === 'all' || a.status === filter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(['all', 'confirmed', 'cancelled'] as const).map((f) => {
          const labels = { all: 'Tümü', confirmed: 'Aktif', cancelled: 'İptal' }
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === f ? 'bg-brand-green text-white' : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {labels[f]}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">Randevu bulunamadı</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      a.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {a.status === 'confirmed' ? 'Aktif' : 'İptal'}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{a.serviceName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.staffName} • {formatDate(a.date)} • {a.time}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.customerName} — {a.customerPhone}</p>
                </div>
                {a.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(a.id)}
                    className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                  >
                    İptal
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ServicesTab() {
  const [services, setServices] = useState<Service[]>(() => getCustomServices() ?? SERVICES)
  const [editing, setEditing] = useState<Service | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<Partial<Service>>({})

  function save() {
    saveCustomServices(services)
    alert('Kaydedildi')
  }

  function deleteService(id: string) {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return
    const updated = services.filter((s) => s.id !== id)
    setServices(updated)
    saveCustomServices(updated)
  }

  function handleSaveEdit() {
    if (!form.name || !form.duration || !form.price) return alert('Tüm alanları doldurun')
    if (adding) {
      const newService: Service = {
        id: form.name!.toLowerCase().replace(/\s+/g, '-'),
        name: form.name!,
        category: (form.category as Service['category']) ?? 'hair',
        duration: Number(form.duration),
        price: Number(form.price),
      }
      const updated = [...services, newService]
      setServices(updated)
      saveCustomServices(updated)
    } else if (editing) {
      const updated = services.map((s) =>
        s.id === editing.id ? { ...s, ...form, duration: Number(form.duration), price: Number(form.price) } : s
      )
      setServices(updated)
      saveCustomServices(updated)
    }
    setEditing(null)
    setAdding(false)
    setForm({})
  }

  if (editing || adding) {
    return (
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">{adding ? 'Yeni Hizmet' : 'Hizmet Düzenle'}</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Hizmet adı"
            value={form.name ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green outline-none text-sm"
          />
          <select
            value={form.category ?? 'hair'}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Service['category'] }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green outline-none text-sm"
          >
            <option value="hair">Saç Hizmetleri</option>
            <option value="makeup">Makyaj Hizmetleri</option>
            <option value="skin">Cilt Bakımı</option>
          </select>
          <input
            type="number"
            placeholder="Süre (dakika)"
            value={form.duration ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green outline-none text-sm"
          />
          <input
            type="number"
            placeholder="Fiyat (₺)"
            value={form.price ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green outline-none text-sm"
          />
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setEditing(null); setAdding(false); setForm({}) }}
              className="flex-1 border-2 border-gray-200 text-gray-500 py-3 rounded-xl text-sm font-semibold"
            >
              İptal
            </button>
            <button
              onClick={handleSaveEdit}
              className="flex-1 bg-brand-green text-white py-3 rounded-xl text-sm font-semibold"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold text-gray-900">Hizmetler</h2>
        <button
          onClick={() => { setAdding(true); setForm({ category: 'hair' }) }}
          className="text-sm bg-brand-green text-white px-3 py-1.5 rounded-lg font-semibold"
        >
          + Ekle
        </button>
      </div>
      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.id} className="card p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">{s.name}</p>
              <p className="text-xs text-gray-400">{s.duration} dk • ₺{s.price}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing(s); setForm({ ...s }) }}
                className="text-xs text-blue-500 border border-blue-200 px-2.5 py-1.5 rounded-lg"
              >
                Düzenle
              </button>
              <button
                onClick={() => deleteService(s.id)}
                className="text-xs text-red-500 border border-red-200 px-2.5 py-1.5 rounded-lg"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BlockedTab() {
  const [blockedDates, setBlockedDates] = useState<string[]>(() => getBlockedDates())
  const [newDate, setNewDate] = useState('')

  function addDate() {
    if (!newDate || blockedDates.includes(newDate)) return
    const updated = [...blockedDates, newDate].sort()
    setBlockedDates(updated)
    saveBlockedDates(updated)
    setNewDate('')
  }

  function removeDate(d: string) {
    const updated = blockedDates.filter((bd) => bd !== d)
    setBlockedDates(updated)
    saveBlockedDates(updated)
  }

  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 mb-4">Bloke Günler</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green outline-none text-sm"
        />
        <button
          onClick={addDate}
          className="bg-brand-green text-white px-4 py-3 rounded-xl text-sm font-semibold"
        >
          Ekle
        </button>
      </div>
      {blockedDates.length === 0 ? (
        <p className="text-center py-8 text-gray-400 text-sm">Bloke gün yok</p>
      ) : (
        <div className="space-y-2">
          {blockedDates.map((d) => (
            <div key={d} className="card p-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">{formatDate(d)}</p>
              <button
                onClick={() => removeDate(d)}
                className="text-xs text-red-500 border border-red-200 px-2.5 py-1.5 rounded-lg"
              >
                Kaldır
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
