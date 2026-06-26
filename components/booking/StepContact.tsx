'use client'

import { useState } from 'react'

interface Props {
  name: string
  phone: string
  onChange: (name: string, phone: string) => void
  onNext: () => void
}

export default function StepContact({ name, phone, onChange, onNext }: Props) {
  const [errors, setErrors] = useState({ name: '', phone: '' })

  function validate() {
    const e = { name: '', phone: '' }
    if (!name.trim() || name.trim().length < 2) e.name = 'Ad Soyad en az 2 karakter olmalı'
    if (!/^[0-9+\s]{10,15}$/.test(phone.trim())) e.phone = 'Geçerli bir telefon numarası girin'
    setErrors(e)
    return !e.name && !e.phone
  }

  function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()
    if (validate()) onNext()
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">İletişim Bilgileri</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Soyad</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { onChange(e.target.value, phone); setErrors((er) => ({ ...er, name: '' })) }}
            placeholder="Adınızı giriniz"
            className={`w-full px-4 py-3.5 rounded-xl border-2 text-sm outline-none transition-colors ${
              errors.name ? 'border-red-400' : 'border-gray-200 focus:border-brand-green'
            }`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => { onChange(name, e.target.value); setErrors((er) => ({ ...er, phone: '' })) }}
            placeholder="05xx xxx xx xx"
            className={`w-full px-4 py-3.5 rounded-xl border-2 text-sm outline-none transition-colors ${
              errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-brand-green'
            }`}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-3">
          <button
            type="submit"
            className="w-full bg-brand-green text-white font-bold py-3.5 rounded-2xl text-base hover:bg-brand-green-light transition-colors"
          >
            Devam Et
          </button>
        </div>
      </form>
    </div>
  )
}
