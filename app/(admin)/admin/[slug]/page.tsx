export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getShopBySlug, getAppointmentsByShop, getWalkInsByShop, getStaffByShop } from '@/lib/db'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AdminPage({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) notFound()

  const [appointments, walkIns, staff] = await Promise.all([
    getAppointmentsByShop(shop.id),
    getWalkInsByShop(shop.id),
    getStaffByShop(shop.id),
  ])

  return <AdminDashboard shop={shop} appointments={appointments} walkIns={walkIns} staff={staff} />
}
