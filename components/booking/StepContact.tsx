'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import type { Shop } from '@/types'

interface Props {
  name: string
  phone: string
  onSubmit: (name: string, phone: string) => void
  shop: Shop
}

export function StepContact({ name: initName, phone: initPhone, onSubmit, shop }: Props) {
  const [name, setName] = useState(initName)
  const [phone, setPhone] = useState(initPhone)
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const accent = shop.theme_accent ?? '#C85A17'

  const [codeSent, setCodeSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [code, setCode] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)

  async function sendCode() {
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrors({ phone: 'Geçerli bir telefon numarası giriniz' })
      return
    }
    setErrors({})
    setOtpError('')
    setSending(true)
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCodeSent(true)
      setDevCode(data.devCode ?? null)
      if (data.devCode) setCode(data.devCode)
    } catch (e) {
      setOtpError(e instanceof Error ? e.message : 'Kod gönderilemedi')
    }
    setSending(false)
  }

  async function verifyCode() {
    if (code.trim().length !== 6) {
      setOtpError('6 haneli kodu giriniz')
      return
    }
    setVerifying(true)
    setOtpError('')
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), code: code.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setVerified(true)
    } catch (e) {
      setOtpError(e instanceof Error ? e.message : 'Kod doğrulanamadı')
    }
    setVerifying(false)
  }

  function handleSubmit() {
    const errs: typeof errors = {}
    if (!name.trim() || name.trim().length < 2) errs.name = 'Ad soyad giriniz'
    if (Object.keys(errs).length) { setErrors(errs); return }
    if (!verified) { setOtpError('Devam etmek için telefon numaranızı doğrulayın'); return }
    onSubmit(name.trim(), phone.trim())
  }

  return (
    <div className="px-4 py-5 animate-slide-up">
      <h3 className="text-base font-black mb-1" style={{ color: shop.theme_dominant ?? '#111111' }}>İletişim Bilgileri</h3>
      <p className="text-xs text-gray-400 mb-5">Randevu onayı için bilgilerinizi girin</p>
      <div className="space-y-4">
        <Input label="Ad Soyad" placeholder="Ad Soyad" value={name} onChange={e => setName(e.target.value)} error={errors.name} />
        <div>
          <Input
            label="Telefon"
            placeholder="0 5XX XXX XX XX"
            type="tel"
            value={phone}
            onChange={e => { setPhone(e.target.value); setCodeSent(false); setVerified(false); setCode(''); setDevCode(null) }}
            error={errors.phone}
            disabled={verified}
          />
          {!verified && (
            <button
              onClick={sendCode}
              disabled={sending}
              className="mt-2 text-xs font-bold px-3 py-2 rounded-lg border-2 disabled:opacity-50"
              style={{ borderColor: accent, color: accent }}
            >
              {sending ? 'Gönderiliyor...' : codeSent ? 'Kodu Tekrar Gönder' : 'Kod Gönder'}
            </button>
          )}
          {verified && (
            <p className="mt-2 text-xs font-bold text-green-600">✓ Telefon doğrulandı</p>
          )}
        </div>

        {codeSent && !verified && (
          <div>
            {devCode && (
              <p className="mb-2 text-xs font-bold px-3 py-2 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200">
                Demo modu — doğrulama kodu: {devCode} (SMS sağlayıcı bağlanınca bu mesaj kalkar)
              </p>
            )}
            <Input
              label="Doğrulama Kodu"
              placeholder="6 haneli kod"
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            <button
              onClick={verifyCode}
              disabled={verifying}
              className="mt-2 w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-50"
              style={{ backgroundColor: accent }}
            >
              {verifying ? 'Doğrulanıyor...' : 'Kodu Doğrula'}
            </button>
          </div>
        )}

        {otpError && <p className="text-xs text-red-500">{otpError}</p>}
      </div>
      <button
        onClick={handleSubmit}
        className="w-full mt-6 py-4 rounded-2xl text-white font-black text-base shadow-sm disabled:opacity-50"
        style={{ backgroundColor: accent }}
        disabled={!verified}
      >
        Devam Et →
      </button>
    </div>
  )
}
