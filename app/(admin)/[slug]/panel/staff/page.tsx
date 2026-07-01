export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { getShopBySlug, getStaffByShop, getAllWorkingHours } from '@/lib/db'
import { StaffView } from '@/components/admin/StaffView'

interface Props { params: Promise<{ slug: string }> }

export default async function StaffPage({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) notFound()
  const [staff, workingHours] = await Promise.all([
    getStaffByShop(shop.id),
    getAllWorkingHours(shop.id),
  ])
  return <StaffView shop={shop} staff={staff} workingHours={workingHours} />
}
