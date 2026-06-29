import { supabase } from './supabase'

const SUPER_ADMIN_PASSWORD = 'super2025'
const SUPER_ADMIN_SESSION_KEY = 'sa_session'
const SHOP_SESSION_PREFIX = 'shop_session_'

// ── SUPER ADMIN ──────────────────────────────────────────
export function superAdminLogin(password: string): boolean {
  if (password !== SUPER_ADMIN_PASSWORD) return false
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SUPER_ADMIN_SESSION_KEY, '1')
  }
  return true
}

export function isSuperAdminAuthed(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(SUPER_ADMIN_SESSION_KEY) === '1'
}

export function superAdminLogout() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SUPER_ADMIN_SESSION_KEY)
  }
}

// ── SHOP ADMIN ───────────────────────────────────────────
export async function shopLogin(slug: string, username: string, password: string): Promise<boolean> {
  const { data } = await supabase
    .from('shop_users')
    .select('id, password_hash, shop_id')
    .eq('username', username)
    .single()

  if (!data) return false
  if (data.password_hash !== password) return false

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(
      `${SHOP_SESSION_PREFIX}${slug}`,
      JSON.stringify({ userId: data.id, shopId: data.shop_id, username })
    )
  }
  return true
}

export function getShopSession(slug: string): { userId: string; shopId: string; username: string } | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(`${SHOP_SESSION_PREFIX}${slug}`)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function shopLogout(slug: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(`${SHOP_SESSION_PREFIX}${slug}`)
  }
}

export function isShopAuthed(slug: string): boolean {
  return getShopSession(slug) !== null
}
