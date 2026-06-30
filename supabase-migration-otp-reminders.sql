-- ============================================================
-- MIGRATION: OTP doğrulama + randevu hatırlatma
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- OTP CODES
create table if not exists otp_codes (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code text not null,
  purpose text not null default 'booking',
  verified boolean default false,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create index if not exists idx_otp_codes_phone on otp_codes(phone, created_at desc);

-- RLS kapalı: yalnızca server-side (service role) erişir, public policy eklenmez
alter table otp_codes enable row level security;

-- REMINDER TRACKING
alter table appointments add column if not exists reminder_sent_at timestamptz;

-- RANDEVU OLUŞTURMAYI SADECE SERVER-SIDE'A (service role) KAPAT
-- Telefon OTP doğrulaması artık server route'unda (app/api/appointments/create)
-- zorunlu kılınıyor; public anon key ile doğrudan insert artık kapalı.
-- Not: policy adı projeye göre "appointments_public_insert" veya "appointments_insert" olabilir.
drop policy if exists "appointments_public_insert" on appointments;
drop policy if exists "appointments_insert" on appointments;
