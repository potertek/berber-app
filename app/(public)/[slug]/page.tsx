export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getShopBySlug, getServicesByShop, getStaffByShop, getWorkingHours, getReviewsByShop } from '@/lib/db'
import { HeroSection } from '@/components/public/HeroSection'
import { ServicesSection } from '@/components/public/ServicesSection'
import { StaffSection } from '@/components/public/StaffSection'
import { WorkingHoursSection } from '@/components/public/WorkingHoursSection'
import { ReviewsSection } from '@/components/public/ReviewsSection'
import { InstagramSection } from '@/components/public/InstagramSection'
import { AddressSection } from '@/components/public/AddressSection'
import { StickyBookingBar } from '@/components/public/StickyBookingBar'
import { getShopThemeVars } from '@/lib/slots'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ShopPage({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) notFound()

  const [services, staff, workingHours, reviews] = await Promise.all([
    getServicesByShop(shop.id),
    getStaffByShop(shop.id),
    getWorkingHours(shop.id),
    getReviewsByShop(shop.id),
  ])

  const themeVars = getShopThemeVars(shop)

  return (
    <div style={themeVars} className="max-w-md mx-auto bg-white min-h-screen relative pb-28">
      <HeroSection shop={shop} />
      <ServicesSection services={services} />
      <StaffSection staff={staff} />
      <WorkingHoursSection hours={workingHours} />
      <AddressSection shop={shop} />
      <ReviewsSection reviews={reviews} />
      <InstagramSection shop={shop} />
      <StickyBookingBar shop={shop} services={services} staff={staff} workingHours={workingHours} />
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) return {}
  return {
    title: `${shop.name} — Randevu Al`,
    description: shop.description ?? `${shop.name} için online randevu alın`,
  }
}
