export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { getShopBySlug, getWorkingHours } from '@/lib/db'
import { SettingsView } from '@/components/admin/SettingsView'

interface Props { params: Promise<{ slug: string }> }

export default async function SettingsPage({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) notFound()
  const workingHours = await getWorkingHours(shop.id)
  return <SettingsView shop={shop} workingHours={workingHours} />
}
