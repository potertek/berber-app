import { supabase } from './supabase'
import type { Shop, StaffMember, Service, Appointment, WalkIn, Review, BlockedSlot, WorkingHours } from '@/types'

// ─── SHOPS ───────────────────────────────────────────────
export async function getShopBySlug(slug: string): Promise<Shop | null> {
  const { data } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

export async function getAllShops(): Promise<Shop[]> {
  const { data } = await supabase.from('shops').select('*').order('created_at', { ascending: false })
  return data ?? []
}

// ─── STAFF ───────────────────────────────────────────────
export async function getStaffByShop(shopId: string): Promise<StaffMember[]> {
  const { data } = await supabase
    .from('staff')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true)
    .order('name')
  return data ?? []
}

// ─── SERVICES ────────────────────────────────────────────
export async function getServicesByShop(shopId: string): Promise<Service[]> {
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true)
    .order('category')
  return data ?? []
}

// ─── APPOINTMENTS ─────────────────────────────────────────
export async function getAppointmentsByShop(shopId: string): Promise<Appointment[]> {
  const { data } = await supabase
    .from('appointments')
    .select('*, staff:staff(*), service:services(*)')
    .eq('shop_id', shopId)
    .order('date', { ascending: false })
  return (data ?? []) as Appointment[]
}

export async function getAppointmentsByDate(shopId: string, date: string): Promise<Appointment[]> {
  const { data } = await supabase
    .from('appointments')
    .select('*, staff:staff(*), service:services(*)')
    .eq('shop_id', shopId)
    .eq('date', date)
    .in('status', ['pending', 'approved'])
  return (data ?? []) as Appointment[]
}

export async function createAppointment(data: Omit<Appointment, 'id' | 'created_at' | 'staff' | 'service'>): Promise<Appointment | null> {
  const { data: result, error } = await supabase
    .from('appointments')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return result
}

export async function updateAppointmentStatus(id: string, status: string): Promise<void> {
  await supabase.from('appointments').update({ status }).eq('id', id)
}

export async function cancelByCode(phone: string, code: string): Promise<{ success: boolean; message: string }> {
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_phone', phone)
    .eq('booking_code', code.toUpperCase())
    .single()

  if (!data) return { success: false, message: 'Randevu bulunamadı. Telefon numarası veya kod hatalı.' }
  if (data.status === 'cancelled') return { success: false, message: 'Bu randevu zaten iptal edilmiş.' }

  await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', data.id)
  return { success: true, message: 'Randevunuz başarıyla iptal edildi.' }
}

// ─── BLOCKED SLOTS ────────────────────────────────────────
export async function getBlockedSlots(shopId: string, staffId: string, date: string): Promise<BlockedSlot[]> {
  const { data } = await supabase
    .from('blocked_slots')
    .select('*')
    .eq('shop_id', shopId)
    .eq('staff_id', staffId)
    .eq('date', date)
  return data ?? []
}

export async function getBlockedSlotsByDate(shopId: string, date: string): Promise<BlockedSlot[]> {
  const { data } = await supabase
    .from('blocked_slots')
    .select('*')
    .eq('shop_id', shopId)
    .eq('date', date)
  return data ?? []
}

// ─── WORKING HOURS ────────────────────────────────────────
export async function getWorkingHours(shopId: string): Promise<WorkingHours[]> {
  const { data } = await supabase
    .from('working_hours')
    .select('*')
    .eq('shop_id', shopId)
    .is('staff_id', null)
  return data ?? []
}

// ─── WALK-INS ─────────────────────────────────────────────
export async function getWalkInsByShop(shopId: string): Promise<WalkIn[]> {
  const { data } = await supabase
    .from('walk_ins')
    .select('*, staff:staff(*)')
    .eq('shop_id', shopId)
    .order('date', { ascending: false })
  return (data ?? []) as WalkIn[]
}

export async function createWalkIn(data: Omit<WalkIn, 'id' | 'created_at' | 'staff'>): Promise<void> {
  const { error } = await supabase.from('walk_ins').insert(data)
  if (error) throw error
}

// ─── REVIEWS ──────────────────────────────────────────────
export async function getReviewsByShop(shopId: string): Promise<Review[]> {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
  return data ?? []
}
