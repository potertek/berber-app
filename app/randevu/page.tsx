'use client'

import { Suspense } from 'react'
import BookingWizard from '@/components/booking/BookingWizard'

export default function RandevuPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Yükleniyor...</div>}>
      <BookingWizard />
    </Suspense>
  )
}
