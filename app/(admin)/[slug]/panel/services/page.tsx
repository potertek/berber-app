export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { getShopBySlug, getServicesByShop } from '@/lib/db'
import { ServicesView } from '@/components/admin/ServicesView'

interface Props { params: Promise<{ slug: string }> }

export default async function ServicesPage({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) notFound()
  const services = await getServicesByShop(shop.id)
  return <ServicesView shop={shop} services={services} />
}
