import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ozan Cin Hair Art Studio',
  description: 'Premium erkek kuaförü — online randevu sistemi',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen relative">
          {children}
        </div>
      </body>
    </html>
  )
}
