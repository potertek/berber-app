'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SERVICES, STAFF, WORKING_HOURS, Service } from '@/lib/data'
import { saveAppointment, isSlotTaken } from '@/lib/storage'
import { generateTimeSlots, getDayIndex, formatDate } from '@/lib/utils'
import StepService from './StepService'
import StepStaff from './StepStaff'
import StepDate from './StepDate'
import StepTime from './StepTime'
import StepContact from './StepContact'
import StepConfirm from './StepConfirm'

export type BookingState = {
  service: Service | null
  staffId: string
  staffName: string
  date: string
  time: string
  name: string
  phone: string
}

const STEPS = ['Hizmet', 'Personel', 'Tarih', 'Saat', 'İletişim', 'Onay']

export default function BookingWizard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState<BookingState>({
    service: null,
    staffId: '',
    staffName: '',
    date: '',
    time: '',
    name: '',
    phone: '',
  })
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const sid = searchParams.get('service')
    if (sid) {
      const s = SERVICES.find((s) => s.id === sid)
      if (s) {
        setBooking((b) => ({ ...b, service: s }))
        setStep(1)
      }
    }
  }, [searchParams])

  function next() { setStep((s) => Math.min(s + 1, STEPS.length - 1)) }
  function prev() { setStep((s) => Math.max(s - 1, 0)) }

  function getAvailableSlots() {
    if (!booking.date) return []
    const dayIdx = getDayIndex(booking.date)
    const hours = WORKING_HOURS[dayIdx]
    if (hours.closed) return []
    const slots = generateTimeSlots(hours.open, hours.close)
    return slots.filter((t) => !isSlotTaken(booking.date, t, booking.staffId))
  }

  function handleConfirm() {
    if (!booking.service) return
    saveAppointment({
      serviceId: booking.service.id,
      serviceName: booking.service.name,
      staffId: booking.staffId,
      staffName: booking.staffName,
      date: booking.date,
      time: booking.time,
      customerName: booking.name,
      customerPhone: booking.phone,
    })
    setConfirmed(true)
  }

  if (confirmed) {
    return <BookingSuccess booking={booking} onHome={() => router.push('/')} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={() => (step === 0 ? router.push('/') : prev())}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-gray-900">Randevu Al</h1>
          <p className="text-xs text-gray-400">{STEPS[step]} — Adım {step + 1}/{STEPS.length}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-brand-green transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {step === 0 && (
          <StepService
            selected={booking.service}
            onSelect={(s) => { setBooking((b) => ({ ...b, service: s })); next() }}
          />
        )}
        {step === 1 && (
          <StepStaff
            selected={booking.staffId}
            onSelect={(id, name) => { setBooking((b) => ({ ...b, staffId: id, staffName: name })); next() }}
          />
        )}
        {step === 2 && (
          <StepDate
            selected={booking.date}
            onSelect={(d) => { setBooking((b) => ({ ...b, date: d, time: '' })); next() }}
          />
        )}
        {step === 3 && (
          <StepTime
            slots={getAvailableSlots()}
            selected={booking.time}
            date={booking.date}
            onSelect={(t) => { setBooking((b) => ({ ...b, time: t })); next() }}
          />
        )}
        {step === 4 && (
          <StepContact
            name={booking.name}
            phone={booking.phone}
            onChange={(name, phone) => setBooking((b) => ({ ...b, name, phone }))}
            onNext={next}
          />
        )}
        {step === 5 && (
          <StepConfirm booking={booking} onConfirm={handleConfirm} onEdit={prev} />
        )}
      </div>
    </div>
  )
}

function BookingSuccess({ booking, onHome }: { booking: BookingState; onHome: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Randevunuz Alındı!</h2>
      <p className="text-gray-500 mb-6">Sizi bekliyoruz.</p>
      <div className="card w-full p-4 text-left space-y-2 mb-6">
        <Row label="Hizmet" value={booking.service?.name ?? ''} />
        <Row label="Personel" value={booking.staffName} />
        <Row label="Tarih" value={formatDate(booking.date)} />
        <Row label="Saat" value={booking.time} />
        <Row label="Ad Soyad" value={booking.name} />
        <Row label="Telefon" value={booking.phone} />
      </div>
      <button
        onClick={onHome}
        className="w-full bg-brand-green text-white font-bold py-3.5 rounded-2xl text-base"
      >
        Ana Sayfaya Dön
      </button>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  )
}
