export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getShopBySlug, getServicesByShop, getStaffByShop, getWorkingHours } from '@/lib/db'
import { DuzenleView } from '@/components/admin/DuzenleView'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function DuzenlePage({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) notFound()

  const [services, staff, workingHours] = await Promise.all([
    getServicesByShop(shop.id),
    getStaffByShop(shop.id),
    getWorkingHours(shop.id),
  ])

  return (
    <DuzenleView
      shop={shop}
      services={services}
      staff={staff}
      workingHours={workingHours}
    />
  )
}
