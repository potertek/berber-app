import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-black text-white px-6">
      <div className="text-center">
        <div className="text-5xl mb-4">✂️</div>
        <h1 className="text-3xl font-black mb-2">Barber SaaS</h1>
        <p className="text-white/60 mb-8">Premium berber randevu platformu</p>
        <div className="space-y-3">
          <Link
            href="/superadmin"
            className="block w-full bg-brand-orange text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-orange-light transition-colors"
          >
            Super Admin
          </Link>
        </div>
      </div>
    </div>
  )
}
