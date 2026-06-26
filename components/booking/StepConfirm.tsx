import { BookingState } from './BookingWizard'
import { formatDate } from '@/lib/utils'

interface Props {
  booking: BookingState
  onConfirm: () => void
  onEdit: () => void
}

export default function StepConfirm({ booking, onConfirm, onEdit }: Props) {
  const rows = [
    { label: 'Hizmet', value: booking.service?.name ?? '' },
    { label: 'Süre', value: `${booking.service?.duration} dakika` },
    { label: 'Ücret', value: `₺${booking.service?.price}` },
    { label: 'Personel', value: booking.staffName },
    { label: 'Tarih', value: formatDate(booking.date) },
    { label: 'Saat', value: booking.time },
    { label: 'Ad Soyad', value: booking.name },
    { label: 'Telefon', value: booking.phone },
  ]

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-bold text-gray-900 mb-2">Randevu Özeti</h2>
      <p className="text-sm text-gray-400 mb-5">Bilgilerinizi kontrol edin ve onaylayın.</p>

      <div className="card divide-y divide-gray-50 mb-6">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center px-4 py-3.5 text-sm">
            <span className="text-gray-400">{label}</span>
            <span className="font-semibold text-gray-800">{value}</span>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-3 flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 border-2 border-brand-green text-brand-green font-bold py-3.5 rounded-2xl text-sm hover:bg-green-50 transition-colors"
        >
          Düzenle
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-brand-green text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-brand-green-light transition-colors"
        >
          Onayla
        </button>
      </div>
    </div>
  )
}
