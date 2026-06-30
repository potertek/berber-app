import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendSms, isSmsConfigured } from '@/lib/netgsm'

const OTP_TTL_MS = 5 * 60 * 1000
const RESEND_COOLDOWN_MS = 60 * 1000

export async function POST(req: NextRequest) {
  const { phone } = await req.json()

  if (!phone || typeof phone !== 'string' || phone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: 'Geçerli bir telefon numarası giriniz' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()

  const { data: recent } = await admin
    .from('otp_codes')
    .select('created_at')
    .eq('phone', phone)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (recent && Date.now() - new Date(recent.created_at).getTime() < RESEND_COOLDOWN_MS) {
    return NextResponse.json({ error: 'Lütfen tekrar denemeden önce biraz bekleyin' }, { status: 429 })
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString()

  const { error } = await admin.from('otp_codes').insert({ phone, code, expires_at: expiresAt })
  if (error) {
    return NextResponse.json({ error: 'Kod oluşturulamadı' }, { status: 500 })
  }

  try {
    await sendSms(phone, `Doğrulama kodunuz: ${code}. Kod 5 dakika geçerlidir.`)
  } catch {
    return NextResponse.json({ error: 'SMS gönderilemedi' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    ...(isSmsConfigured() ? {} : { devCode: code }),
  })
}
