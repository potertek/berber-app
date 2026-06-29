export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { getShopBySlug, getAppointmentsByShop, getServicesByShop, getStaffByShop } from '@/lib/db'
import { BookingsView } from '@/components/admin/BookingsView'

interface Props { params: Promise<{ slug: string }> }

export default async function BookingsPage({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) notFound()
  const [appointments, services, staff] = await Promise.all([
    getAppointmentsByShop(shop.id),
    getServicesByShop(shop.id),
    getStaffByShop(shop.id),
  ])
  return <BookingsView shop={shop} appointments={appointments} services={services} staff={staff} />
}
