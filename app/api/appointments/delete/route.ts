import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()

  if (!id) {
    return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()

  const { error } = await admin
    .from('appointments')
    .delete()
    .eq('id', id)
    .eq('status', 'cancelled')

  if (error) {
    return NextResponse.json({ error: 'Randevu silinemedi' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
