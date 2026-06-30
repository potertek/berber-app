export type Role = 'superadmin' | 'owner' | 'staff'
export type BookingStatus = 'pending' | 'approved' | 'cancelled'
export type ServiceCategory = 'hair' | 'beard' | 'makeup' | 'skin'

export interface Shop {
  id: string
  slug: string
  name: string
  description: string | null
  logo_url: string | null
  banner_url: string | null
  phone: string | null
  whatsapp: string | null
  address: string | null
  maps_url: string | null
  qr_url: string | null
  instagram_url: string | null
  instagram_username: string | null
  instagram_bio: string | null
  instagram_followers: number | null
  instagram_following: number | null
  instagram_posts: number | null
  instagram_photo_url: string | null
  instagram_cta_text: string | null
  theme_dominant: string | null
  theme_accent: string | null
  theme_button: string | null
  theme_pending: string | null
  theme_approved: string | null
  theme_rejected: string | null
  booking_name: string | null
  booking_slug: string | null
  is_active: boolean
  owner_id: string
  created_at: string
}

export interface StaffMember {
  id: string
  shop_id: string
  user_id: string | null
  name: string
  title: string | null
  photo_url: string | null
  phone: string | null
  is_active: boolean
  created_at: string
}

export interface Service {
  id: string
  shop_id: string
  name: string
  category: ServiceCategory
  price: number
  duration: number
  is_active: boolean
  created_at: string
}

export interface WorkingHours {
  id: string
  shop_id: string
  staff_id: string | null
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

export interface BlockedSlot {
  id: string
  shop_id: string
  staff_id: string
  date: string
  time_slot: string
  reason: string | null
  created_at: string
}

export interface Appointment {
  id: string
  shop_id: string
  staff_id: string
  service_id: string
  customer_name: string
  customer_phone: string
  date: string
  time_slot: string
  status: BookingStatus
  booking_code: string
  notes: string | null
  created_at: string
  staff?: StaffMember
  service?: Service
}

export interface WalkIn {
  id: string
  shop_id: string
  staff_id: string
  customer_name: string
  service_name: string
  amount: number
  date: string
  time_slot: string
  created_at: string
  staff?: StaffMember
}

export interface Review {
  id: string
  shop_id: string
  customer_name: string
  rating: number
  comment: string | null
  is_visible: boolean
  created_at: string
}

export interface Revenue {
  date: string
  total: number
  appointments_total: number
  walkin_total: number
  staff_breakdown: { staff_id: string; name: string; total: number }[]
}

export interface ShopUser {
  id: string
  shop_id: string
  username: string
  password_hash: string
  role: 'owner' | 'staff'
  created_at: string
}

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
]

export const DAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  hair: 'Saç',
  beard: 'Sakal',
  makeup: 'Makyaj',
  skin: 'Cilt Bakımı',
}

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Bekliyor',
  approved: 'Onaylandı',
  cancelled: 'İptal Edildi',
}

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-orange-100 text-orange-700 border-orange-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-600 border-red-200',
}
