'use client'

import { useState } from 'react'
import { BookingWizard } from '@/components/booking/BookingWizard'
import type { Shop, Service, StaffMember } from '@/types'

interface Props {
  shop: Shop
  services: Service[]
  staff: StaffMember[]
}

export function StickyBookingBar({ shop, services, staff }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="sticky bottom-0 z-40 px-4 pb-6 pt-3 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
        <button
          onClick={() => setOpen(true)}
          className="pointer-events-auto w-full bg-brand-orange text-white font-black text-base py-4 rounded-2xl shadow-premium hover:bg-brand-orange-light active:bg-brand-orange-dark transition-all"
        >
          Randevu Al
        </button>
      </div>

      {open && (
        <BookingWizard
          shop={shop}
          services={services}
          staff={staff}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
