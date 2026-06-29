export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getShopBySlug, getServicesByShop, getStaffByShop, getWorkingHours, getReviewsByShop } from '@/lib/db'
import { RandevuPage } from '@/components/randevu/RandevuPage'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) notFound()

  const [services, staff, workingHours, reviews] = await Promise.all([
    getServicesByShop(shop.id),
    getStaffByShop(shop.id),
    getWorkingHours(shop.id),
    getReviewsByShop(shop.id),
  ])

  return (
    <RandevuPage
      shop={shop}
      services={services}
      staff={staff}
      workingHours={workingHours}
      reviews={reviews}
    />
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) return {}
  const name = shop.booking_name ?? shop.name
  return {
    title: `${name} — Randevu Al`,
    description: shop.description ?? `${name} için online randevu alın`,
  }
}
