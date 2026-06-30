'use client'

import { useState } from 'react'
import { StepService } from './StepService'
import { StepStaff } from './StepStaff'
import { StepDate } from './StepDate'
import { StepTime } from './StepTime'
import { StepContact } from './StepContact'
import { StepConfirm } from './StepConfirm'
import type { Service, StaffMember, Shop, WorkingHours } from '@/types'

interface Props {
  shop: Shop
  services: Service[]
  staff: StaffMember[]
  workingHours: WorkingHours[]
  onClose: () => void
}

export interface BookingState {
  service: Service | null
  staff: StaffMember | null
  noPreference: boolean
  date: string
  time: string
  name: string
  phone: string
}

const STEPS = ['Hizmet', 'Berber', 'Tarih', 'Saat', 'Bilgiler', 'Onay']

export function BookingWizard({ shop, services, staff, workingHours, onClose }: Props) {
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState<BookingState>({
    service: null, staff: null, noPreference: false,
    date: '', time: '', name: '', phone: '',
  })

  const update = (patch: Partial<BookingState>) => setBooking(b => ({ ...b, ...patch }))
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const prev = () => setStep(s => Math.max(s - 1, 0))

  const accent = shop.theme_accent ?? '#C85A17'
  const dominant = shop.theme_dominant ?? '#111111'

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-fade-in">
      <div className="text-white px-4 py-4 flex-shrink-0" style={{ backgroundColor: dominant }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-lg">Randevu Al</h2>
          <button onClick={onClose} className="text-white/70 text-2xl leading-none hover:text-white">×</button>
        </div>
        <div className="flex gap-1">
          {STEPS.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="h-1 w-full rounded-full transition-colors" style={{ backgroundColor: i <= step ? accent : 'rgba(255,255,255,0.2)' }} />
              <span className="text-[9px] font-medium" style={{ color: i === step ? accent : 'rgba(255,255,255,0.4)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {step === 0 && <StepService services={services} selected={booking.service} onSelect={s => { update({ service: s }); next() }} shop={shop} />}
        {step === 1 && <StepStaff staff={staff} selected={booking.staff} noPreference={booking.noPreference} onSelect={(s, np) => { update({ staff: s, noPreference: np }); next() }} />}
        {step === 2 && <StepDate shop={shop} staff={booking.staff} workingHours={workingHours} selected={booking.date} onSelect={d => { update({ date: d }); next() }} />}
        {step === 3 && <StepTime shop={shop} staff={booking.staff} date={booking.date} workingHours={workingHours} selected={booking.time} onSelect={t => { update({ time: t }); next() }} />}
        {step === 4 && <StepContact name={booking.name} phone={booking.phone} onSubmit={(n, p) => { update({ name: n, phone: p }); next() }} shop={shop} />}
        {step === 5 && <StepConfirm shop={shop} booking={booking} onClose={onClose} />}
      </div>

      {step > 0 && step < 5 && (
        <div className="flex-shrink-0 px-4 pb-6 pt-2 border-t border-gray-100">
          <button onClick={prev} className="w-full py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            ← Geri
          </button>
        </div>
      )}
    </div>
  )
}
