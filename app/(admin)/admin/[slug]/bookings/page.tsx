export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getShopBySlug, getAppointmentsByShop } from '@/lib/db'
import { BookingsView } from '@/components/admin/BookingsView'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BookingsPage({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) notFound()
  const appointments = await getAppointmentsByShop(shop.id)
  return <BookingsView shop={shop} appointments={appointments} />
}
