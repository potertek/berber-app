'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format, addDays, startOfDay, isBefore } from 'date-fns'
import { tr } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import { generateTimeSlots } from '@/lib/slots'
import { formatDateTR, formatCurrency } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/types'
import type { Shop, Service, StaffMember, WorkingHours, Review, ServiceCategory } from '@/types'

interface Props {
  shop: Shop
  services: Service[]
  staff: StaffMember[]
  workingHours: WorkingHours[]
  reviews: Review[]
}

type Step = 'service' | 'staff' | 'date' | 'time' | 'contact' | 'confirm' | 'done'

interface BookingSummary {
  service: Service | null
  staff: StaffMember | null
  noPreference: boolean
  date: string
  time: string
  name: string
  phone: string
  code: string
}

export function RandevuPage({ shop, services, staff, workingHours, reviews }: Props) {
  const accent = shop.theme_accent ?? '#C85A17'
  const dominant = shop.theme_dominant ?? '#111111'
  const displayName = shop.booking_name ?? shop.name

  const [step, setStep] = useState<Step>('service')
  const [booking, setBooking] = useState<BookingSummary>({
    service: null, staff: null, noPreference: false,
    date: '', time: '', name: '', phone: '', code: '',
  })
  const [takenSlots, setTakenSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [nameErr, setNameErr] = useState('')
  const [phoneErr, setPhoneErr] = useState('')
  const [showTerms, setShowTerms] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)


  const today = startOfDay(new Date())
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i))

  async function selectDate(dateStr: string) {
    setBooking(b => ({ ...b, date: dateStr, time: '' }))
    setLoadingSlots(true)
    const staffId = booking.noPreference ? null : booking.staff?.id
    const q = supabase.from('appointments').select('time_slot').eq('shop_id', shop.id).eq('date', dateStr).in('status', ['pending', 'approved'])
    if (staffId) q.eq('staff_id', staffId)
    const bq = supabase.from('blocked_slots').select('time_slot').eq('shop_id', shop.id).eq('date', dateStr)
    if (staffId) bq.eq('staff_id', staffId)
    const [a, b2] = await Promise.all([q, bq])
    setTakenSlots([...(a.data ?? []).map(x => x.time_slot), ...(b2.data ?? []).map(x => x.time_slot)])
    setLoadingSlots(false)
    setStep('time')
  }

  async function submitBooking() {
    let ne = '', pe = ''
    if (!booking.name.trim() || booking.name.trim().length < 2) ne = 'Ad soyad giriniz'
    if (!booking.phone.trim() || booking.phone.replace(/\D/g, '').length < 10) pe = 'Geçerli telefon giriniz'
    setNameErr(ne); setPhoneErr(pe)
    if (ne || pe) return

    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: shop.id,
          staffId: booking.staff?.id ?? null,
          noPreference: booking.noPreference,
          serviceId: booking.service!.id,
          date: booking.date,
          timeSlot: booking.time,
          customerName: booking.name,
          customerPhone: booking.phone,
          status: 'approved',
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Randevu oluşturulamadı. Tekrar deneyin.'); setSubmitting(false); return }
      setBooking(b => ({ ...b, code: data.bookingCode }))
      setStep('done')
    } catch { setError('Randevu oluşturulamadı. Tekrar deneyin.') }
    setSubmitting(false)
  }

  const dayOfWeek = booking.date ? new Date(booking.date + 'T12:00:00').getDay() : 0
  const availableSlots = booking.date ? generateTimeSlots(workingHours, dayOfWeek) : []

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HİZMET ŞARTLARI POPUP */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 animate-fade-in px-0 sm:px-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
            <div className="px-5 pt-5 pb-2 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900">Hizmet Şartları</h3>
              <p className="text-xs text-gray-400 mt-0.5">Randevu oluşturmadan önce lütfen okuyun</p>
            </div>
            <div className="px-5 py-4 max-h-64 overflow-y-auto text-sm text-gray-600 space-y-3">
              <p><strong className="text-gray-900">1. Randevu Saati</strong><br />Randevu saatinize 10 dakika erken gelmenizi rica ederiz. Geç kalınması durumunda randevunuz iptal edilebilir.</p>
              <p><strong className="text-gray-900">2. İptal Politikası</strong><br />Randevunuzu en az 2 saat öncesinden iptal etmenizi rica ederiz. İptal için randevu kodunuz ve telefon numaranız gereklidir.</p>
              <p><strong className="text-gray-900">3. Kişisel Veriler</strong><br />Girdiğiniz ad ve telefon bilgileri yalnızca randevu yönetimi amacıyla kullanılır, üçüncü şahıslarla paylaşılmaz.</p>
              <p><strong className="text-gray-900">4. Hizmet Değişikliği</strong><br />Salon, önceden haber vermeksizin hizmet fiyatlarını değiştirme hakkını saklı tutar.</p>
              <p><strong className="text-gray-900">5. Sağlık</strong><br />Bulaşıcı hastalık belirtisi olan müşterilere hizmet verilmeyebilir.</p>
            </div>
            <div className="px-5 py-4 border-t border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded accent-orange-500 flex-shrink-0"
                />
                <span className="text-sm text-gray-700">Hizmet şartlarını okudum ve kabul ediyorum.</span>
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowTerms(false); setTermsAccepted(false) }}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-500"
                >
                  İptal
                </button>
                <button
                  onClick={() => { if (termsAccepted) { setShowTerms(false); submitBooking() } }}
                  disabled={!termsAccepted}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-black disabled:opacity-40 transition-all"
                  style={{ backgroundColor: accent }}
                >
                  Onayla →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP NAV */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: dominant }}>
              {shop.logo_url
                ? <Image src={shop.logo_url} alt={displayName} width={36} height={36} className="object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-white font-black text-sm">{displayName[0]}</div>
              }
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">{displayName}</p>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-xs">★</span>
                  <span className="text-xs text-gray-500">{avgRating.toFixed(1)} ({reviews.length} yorum)</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <a href="#yorumlar" className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 font-medium hidden sm:block">
              💬 Yorumlar ({reviews.length})
            </a>
            {shop.address && (
              <a href={shop.maps_url ?? '#'} target="_blank" rel="noreferrer" className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 font-medium hidden sm:block">
                📍 Adres
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* HERO */}
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-6" style={{ backgroundColor: dominant }}>
          {shop.banner_url
            ? <Image src={shop.banner_url} alt={displayName} fill className="object-cover opacity-80" priority />
            : <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${dominant} 0%, ${accent}66 100%)` }} />
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h1 className="text-2xl font-black text-white">{displayName}</h1>
            {shop.description && <p className="text-sm text-white/80 mt-0.5">{shop.description}</p>}
            {shop.address && <p className="text-xs text-white/60 mt-1">📍 {shop.address}</p>}
          </div>
        </div>

        {step === 'done' ? (
          <SuccessScreen booking={booking} shop={shop} accent={accent} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT — Steps */}
            <div className="lg:col-span-2 space-y-4">

              {/* STEP 1 — HİZMET */}
              <StepCard
                num={1} title="Hizmet Seçimi"
                done={!!booking.service}
                summary={booking.service?.name}
                accent={accent}
                onEdit={() => setStep('service')}
                active={step === 'service'}
              >
                <ServicePicker services={services} selected={booking.service} accent={accent}
                  onSelect={s => { setBooking(b => ({ ...b, service: s })); setStep('staff') }} />
              </StepCard>

              {/* STEP 2 — PERSONEL */}
              <StepCard
                num={2} title="Personel Seçimi"
                done={!!booking.service && (!!booking.staff || booking.noPreference)}
                summary={booking.noPreference ? 'Fark etmez' : booking.staff?.name}
                accent={accent}
                onEdit={() => { if (booking.service) setStep('staff') }}
                active={step === 'staff'}
                locked={!booking.service}
              >
                <StaffPicker staff={staff} selected={booking.staff} noPreference={booking.noPreference} accent={accent}
                  onSelect={(s, np) => { setBooking(b => ({ ...b, staff: s, noPreference: np })); setStep('date') }} />
              </StepCard>

              {/* STEP 3 — TARİH */}
              <StepCard
                num={3} title="Tarih Seçimi"
                done={!!booking.date}
                summary={booking.date ? formatDateTR(booking.date) : undefined}
                accent={accent}
                onEdit={() => { if (booking.service && (booking.staff || booking.noPreference)) setStep('date') }}
                active={step === 'date'}
                locked={!booking.service || (!booking.staff && !booking.noPreference)}
              >
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {days.map(day => {
                    const ds = format(day, 'yyyy-MM-dd')
                    const dow = day.getDay()
                    const slots = generateTimeSlots(workingHours, dow)
                    const disabled = slots.length === 0 || isBefore(day, today)
                    const isSelected = booking.date === ds
                    return (
                      <button key={ds} disabled={disabled} onClick={() => selectDate(ds)}
                        className="flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl border-2 text-sm transition-all min-w-[70px]"
                        style={disabled ? { borderColor: '#f3f4f6', backgroundColor: '#fafafa', opacity: 0.4, cursor: 'not-allowed' }
                          : isSelected ? { borderColor: accent, backgroundColor: accent, color: 'white' }
                          : { borderColor: '#e5e7eb', backgroundColor: 'white' }}
                      >
                        <span className="text-xs font-medium">{format(day, 'EEE', { locale: tr })}</span>
                        <span className="font-black text-lg leading-none">{format(day, 'd')}</span>
                        <span className="text-xs">{format(day, 'MMM', { locale: tr })}</span>
                      </button>
                    )
                  })}
                </div>
              </StepCard>

              {/* STEP 4 — SAAT */}
              <StepCard
                num={4} title="Saat Seçimi"
                done={!!booking.time}
                summary={booking.time || undefined}
                accent={accent}
                onEdit={() => { if (booking.date) setStep('time') }}
                active={step === 'time'}
                locked={!booking.date}
              >
                {loadingSlots ? (
                  <p className="text-sm text-gray-400 py-4 text-center">Yükleniyor...</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">Bu gün için saat yok.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map(slot => {
                      const taken = takenSlots.includes(slot)
                      const isSelected = booking.time === slot
                      return (
                        <button key={slot} disabled={taken} onClick={() => { setBooking(b => ({ ...b, time: slot })); setStep('contact') }}
                          className="px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                          style={taken ? { borderColor: '#fce7e7', backgroundColor: '#fef2f2', color: '#fca5a5', cursor: 'not-allowed' }
                            : isSelected ? { borderColor: accent, backgroundColor: accent, color: 'white' }
                            : { borderColor: '#d1fae5', backgroundColor: '#ecfdf5', color: '#059669' }}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                )}
              </StepCard>

              {/* STEP 5 — BİLGİLER + ONAYLA */}
              <StepCard
                num={5} title="Bilgileriniz"
                done={false}
                accent={accent}
                active={step === 'contact' || step === 'confirm'}
                locked={!booking.time}
              >
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      value={booking.name}
                      onChange={e => { setBooking(b => ({ ...b, name: e.target.value })); setNameErr('') }}
                      placeholder="Adınız Soyadınız"
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none text-sm ${nameErr ? 'border-red-300' : 'border-gray-200 focus:border-gray-400'}`}
                    />
                    {nameErr && <p className="text-xs text-red-500 mt-1">{nameErr}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Telefon Numarası</label>
                    <input
                      type="tel"
                      value={booking.phone}
                      onChange={e => { setBooking(b => ({ ...b, phone: e.target.value })); setPhoneErr('') }}
                      placeholder="0 5XX XXX XX XX"
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none text-sm ${phoneErr ? 'border-red-300' : 'border-gray-200 focus:border-gray-400'}`}
                    />
                    {phoneErr && <p className="text-xs text-red-500 mt-1">{phoneErr}</p>}
                  </div>

                  {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                  <button
                    onClick={() => setShowTerms(true)}
                    disabled={submitting || !booking.time}
                    className="w-full py-3.5 rounded-xl text-white font-black text-base disabled:opacity-50 transition-all"
                    style={{ backgroundColor: accent }}
                  >
                    {submitting ? 'İşleniyor...' : 'Randevuyu Onayla →'}
                  </button>
                </div>
              </StepCard>


              {/* INSTAGRAM */}
              {(shop.instagram_url || shop.instagram_username) && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                  {/* Üst gradient şerit */}
                  <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5 flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                          {shop.instagram_photo_url
                            ? <Image src={shop.instagram_photo_url} alt="ig" width={56} height={56} className="rounded-full object-cover" />
                            : <span className="text-2xl">📷</span>}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        {shop.instagram_username && (
                          <p className="font-bold text-sm text-gray-900">@{shop.instagram_username}</p>
                        )}
                        {shop.instagram_bio && (
                          <p className="text-xs text-gray-500 mt-0.5">{shop.instagram_bio}</p>
                        )}
                      </div>
                    </div>

                    {/* İstatistikler */}
                    {(shop.instagram_posts != null || shop.instagram_followers != null || shop.instagram_following != null) && (
                      <div className="flex justify-around border border-gray-100 rounded-xl py-2.5 mb-3">
                        {shop.instagram_posts != null && (
                          <div className="text-center">
                            <p className="font-black text-sm text-gray-900">{shop.instagram_posts}</p>
                            <p className="text-xs text-gray-400">Gönderi</p>
                          </div>
                        )}
                        {shop.instagram_followers != null && (
                          <div className="text-center">
                            <p className="font-black text-sm text-gray-900">{shop.instagram_followers.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">Takipçi</p>
                          </div>
                        )}
                        {shop.instagram_following != null && (
                          <div className="text-center">
                            <p className="font-black text-sm text-gray-900">{shop.instagram_following}</p>
                            <p className="text-xs text-gray-400">Takip</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Takip Et butonu */}
                    <a
                      href={shop.instagram_url ?? `https://instagram.com/${shop.instagram_username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 transition-opacity"
                    >
                      {shop.instagram_cta_text ?? "Instagram'da Takip Et"}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — Summary */}
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100" style={{ backgroundColor: dominant }}>
                    <h3 className="font-black text-white text-center">— Randevu Özeti —</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    <SummaryRow label="Salon" value={displayName} />
                    <SummaryRow label="Hizmet" value={booking.service?.name} />
                    <SummaryRow label="Personel" value={booking.noPreference ? 'Fark etmez' : booking.staff?.name} />
                    <SummaryRow label="Tarih" value={booking.date ? formatDateTR(booking.date) : undefined} />
                    <SummaryRow label="Saat" value={booking.time || undefined} />
                    {booking.service && (
                      <div className="pt-3 border-t border-gray-100 flex justify-between">
                        <span className="text-sm font-semibold text-gray-600">Toplam</span>
                        <span className="font-black" style={{ color: accent }}>{formatCurrency(booking.service.price)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Working hours */}
                <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-card p-4">
                  <h4 className="font-bold text-sm text-gray-900 mb-3">Çalışma Saatleri</h4>
                  {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day, i) => {
                    const h = workingHours.find(x => x.day_of_week === i)
                    const isToday = new Date().getDay() === i
                    return (
                      <div key={i} className={`flex justify-between text-xs py-1 ${isToday ? 'font-bold' : ''}`}>
                        <span className={isToday ? 'text-gray-900' : 'text-gray-500'}>{day}</span>
                        <span className={!h || h.is_closed ? 'text-red-400' : 'text-gray-700'}>
                          {!h || h.is_closed ? 'Kapalı' : `${h.open_time} – ${h.close_time}`}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE SUMMARY BAR */}
      {step !== 'done' && (booking.service || booking.date || booking.time) && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-20">
          <div className="flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              {booking.service && <p className="font-semibold text-gray-900">{booking.service.name}</p>}
              {booking.date && booking.time && <p className="text-gray-500">{formatDateTR(booking.date)} • {booking.time}</p>}
            </div>
            {booking.service && <p className="font-black text-base" style={{ color: accent }}>{formatCurrency(booking.service.price)}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

// ── SUB COMPONENTS ────────────────────────────────────────

function StepCard({ num, title, done, summary, accent, onEdit, active, locked, children }: {
  num: number; title: string; done?: boolean; summary?: string; accent: string
  onEdit?: () => void; active: boolean; locked?: boolean; children?: React.ReactNode
}) {
  return (
    <div className={`bg-white rounded-2xl border-2 shadow-soft transition-all ${active ? 'border-gray-300' : done ? 'border-gray-100' : 'border-gray-100'} ${locked ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
            style={{ backgroundColor: done ? '#1FA34A' : active ? accent : '#d1d5db' }}>
            {done ? '✓' : num}
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">{title}</p>
            {done && summary && <p className="text-xs text-gray-500">{summary}</p>}
          </div>
        </div>
        {done && onEdit && (
          <button onClick={onEdit} className="text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200 text-gray-600">
            Değiştir
          </button>
        )}
      </div>
      {active && !locked && children && (
        <div className="px-5 pb-5 border-t border-gray-50 pt-4">{children}</div>
      )}
    </div>
  )
}

function ServicePicker({ services, selected, accent, onSelect }: { services: Service[]; selected: Service | null; accent: string; onSelect: (s: Service) => void }) {
  const [filter, setFilter] = useState<ServiceCategory | 'all'>('all')
  const cats = [...new Set(services.map(s => s.category))] as ServiceCategory[]
  const filtered = filter === 'all' ? services : services.filter(s => s.category === filter)

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        <FilterBtn label="Tümü" active={filter === 'all'} accent={accent} onClick={() => setFilter('all')} />
        {cats.map(c => <FilterBtn key={c} label={CATEGORY_LABELS[c]} active={filter === c} accent={accent} onClick={() => setFilter(c)} />)}
      </div>
      <div className="space-y-2">
        {filtered.map(s => (
          <button key={s.id} onClick={() => onSelect(s)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all"
            style={selected?.id === s.id ? { borderColor: accent, backgroundColor: `${accent}08` } : { borderColor: '#f3f4f6', backgroundColor: 'white' }}>
            <div>
              <p className="font-semibold text-sm text-gray-900">{s.name}</p>
              <p className="text-xs text-gray-400">{CATEGORY_LABELS[s.category]}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-sm" style={{ color: accent }}>{formatCurrency(s.price)}</p>
              <span className="text-xs px-2 py-1 rounded-lg text-white mt-0.5 inline-block" style={{ backgroundColor: accent }}>
                Randevu al
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function StaffPicker({ staff, selected, noPreference, accent, onSelect }: { staff: StaffMember[]; selected: StaffMember | null; noPreference: boolean; accent: string; onSelect: (s: StaffMember | null, np: boolean) => void }) {
  return (
    <div className="space-y-2">
      <button onClick={() => onSelect(null, true)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all"
        style={noPreference ? { borderColor: accent, backgroundColor: `${accent}08` } : { borderColor: '#f3f4f6' }}>
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">🎲</div>
        <div>
          <p className="font-semibold text-sm text-gray-900">Fark etmez</p>
          <p className="text-xs text-gray-400">En uygun personel atansın</p>
        </div>
      </button>
      {staff.map(s => (
        <button key={s.id} onClick={() => onSelect(s, false)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all"
          style={selected?.id === s.id && !noPreference ? { borderColor: accent, backgroundColor: `${accent}08` } : { borderColor: '#f3f4f6' }}>
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-black text-gray-600 flex-shrink-0">
            {s.photo_url ? <Image src={s.photo_url} alt={s.name} width={40} height={40} className="rounded-full object-cover" /> : s.name[0]}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{s.name}</p>
            {s.title && <p className="text-xs text-gray-400">{s.title}</p>}
          </div>
        </button>
      ))}
    </div>
  )
}

function FilterBtn({ label, active, accent, onClick }: { label: string; active: boolean; accent: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
      style={active ? { backgroundColor: accent, color: 'white' } : { backgroundColor: '#f3f4f6', color: '#6b7280' }}>
      {label}
    </button>
  )
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900 text-right max-w-[60%]">{value ?? '—'}</span>
    </div>
  )
}

function SuccessScreen({ booking, shop, accent }: { booking: BookingSummary; shop: Shop; accent: string }) {
  const approvedColor = shop.theme_approved ?? '#1FA34A'
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
          style={{ backgroundColor: `${approvedColor}20`, color: approvedColor }}>✓</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Randevu Alındı!</h2>
        <p className="text-sm text-gray-500 mb-6">Randevunuz onaylandı! Kodunuzu saklayın, iptal için gerekli.</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-xs text-gray-400 mb-1">Randevu Kodunuz</p>
          <p className="text-3xl font-black tracking-widest" style={{ color: accent }}>{booking.code}</p>
        </div>
        <div className="space-y-2 text-left mb-6">
          {[
            ['Hizmet', booking.service?.name ?? ''],
            ['Tarih', formatDateTR(booking.date)],
            ['Saat', booking.time],
            ['Toplam', formatCurrency(booking.service?.price ?? 0)],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between text-sm">
              <span className="text-gray-500">{l}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <Link href={`/${shop.slug}/randevu/cancel`} className="text-xs text-gray-400 underline">
          Randevuyu iptal etmek için tıklayın
        </Link>
      </div>
    </div>
  )
}
