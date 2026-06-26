'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface Props {
  name: string
  phone: string
  onSubmit: (name: string, phone: string) => void
}

export function StepContact({ name: initName, phone: initPhone, onSubmit }: Props) {
  const [name, setName] = useState(initName)
  const [phone, setPhone] = useState(initPhone)
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  function handleSubmit() {
    const errs: typeof errors = {}
    if (!name.trim() || name.trim().length < 2) errs.name = 'Ad soyad giriniz'
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) errs.phone = 'Geçerli bir telefon numarası giriniz'
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit(name.trim(), phone.trim())
  }

  return (
    <div className="px-4 py-5 animate-slide-up">
      <h3 className="text-base font-black text-brand-black mb-1">İletişim Bilgileri</h3>
      <p className="text-xs text-gray-400 mb-5">Randevu onayı için bilgilerinizi girin</p>

      <div className="space-y-4">
        <Input
          label="Ad Soyad"
          placeholder="Ad Soyad"
          value={name}
          onChange={e => setName(e.target.value)}
          error={errors.name}
        />
        <Input
          label="Telefon"
          placeholder="0 5XX XXX XX XX"
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          error={errors.phone}
        />
      </div>

      <Button onClick={handleSubmit} size="lg" className="w-full mt-6">
        Devam Et →
      </Button>
    </div>
  )
}
