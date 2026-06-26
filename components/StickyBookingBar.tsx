import Link from 'next/link'

export default function StickyBookingBar() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-3 z-50 shadow-2xl">
      <Link
        href="/randevu"
        className="block w-full text-center bg-brand-green text-white font-bold py-3.5 rounded-2xl text-base hover:bg-brand-green-light active:bg-brand-green-dark transition-all duration-200 shadow-lg"
      >
        Randevu Al
      </Link>
    </div>
  )
}
