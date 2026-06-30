import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json()

  if (!phone || !code) {
    return NextResponse.json({ error: 'Telefon ve kod gerekli' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()

  const { data } = await admin
    .from('otp_codes')
    .select('id, code, expires_at, verified')
    .eq('phone', phone)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data || data.code !== code) {
    return NextResponse.json({ error: 'Kod hatalı' }, { status: 400 })
  }

  if (new Date(data.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'Kodun süresi doldu' }, { status: 400 })
  }

  await admin.from('otp_codes').update({ verified: true }).eq('id', data.id)

  return NextResponse.json({ success: true })
}
