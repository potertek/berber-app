export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getShopBySlug, getWalkInsByShop, getStaffByShop, getServicesByShop } from '@/lib/db'
import { WalkInView } from '@/components/admin/WalkInView'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function WalkInPage({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) notFound()
  const [walkIns, staff, services] = await Promise.all([
    getWalkInsByShop(shop.id),
    getStaffByShop(shop.id),
    getServicesByShop(shop.id),
  ])
  return <WalkInView shop={shop} walkIns={walkIns} staff={staff} services={services} />
}
