'use client'

import { useState } from 'react'
import { BookingWizard } from '@/components/booking/BookingWizard'
import type { Shop, Service, StaffMember, WorkingHours } from '@/types'

interface Props {
  shop: Shop
  services: Service[]
  staff: StaffMember[]
  workingHours: WorkingHours[]
}

export function StickyBookingBar({ shop, services, staff, workingHours }: Props) {
  const [open, setOpen] = useState(false)
  const buttonColor = shop.theme_button ?? shop.theme_accent ?? '#C85A17'

  return (
    <>
      <div className="sticky bottom-0 z-40 px-4 pb-6 pt-3 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
        <button
          onClick={() => setOpen(true)}
          className="pointer-events-auto w-full text-white font-black text-base py-4 rounded-2xl shadow-premium transition-all"
          style={{ backgroundColor: buttonColor }}
        >
          Randevu Al
        </button>
      </div>
      {open && (
        <BookingWizard
          shop={shop}
          services={services}
          staff={staff}
          workingHours={workingHours}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
