-- ============================================================
-- BARBER SAAS — SUPABASE SCHEMA
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- SHOPS
create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  logo_url text,
  banner_url text,
  phone text,
  whatsapp text,
  address text,
  maps_url text,
  qr_url text,
  instagram_username text,
  instagram_bio text,
  instagram_followers integer,
  instagram_following integer,
  instagram_posts integer,
  is_active boolean default true,
  owner_id uuid not null default '00000000-0000-0000-0000-000000000000',
  created_at timestamptz default now()
);

-- STAFF
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  user_id uuid,
  name text not null,
  title text,
  photo_url text,
  phone text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- SERVICES
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  name text not null,
  category text not null check (category in ('hair','beard','makeup','skin')),
  price numeric(10,2) not null default 0,
  duration integer not null default 60,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- WORKING HOURS
create table if not exists working_hours (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  staff_id uuid references staff(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  open_time text not null default '09:00',
  close_time text not null default '19:00',
  is_closed boolean default false
);

-- BLOCKED SLOTS
create table if not exists blocked_slots (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  staff_id uuid references staff(id) on delete cascade not null,
  date date not null,
  time_slot text not null,
  reason text,
  created_at timestamptz default now()
);

-- APPOINTMENTS
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  staff_id uuid references staff(id) on delete cascade not null,
  service_id uuid references services(id) on delete cascade not null,
  customer_name text not null,
  customer_phone text not null,
  date date not null,
  time_slot text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled')),
  booking_code text not null,
  notes text,
  created_at timestamptz default now()
);

-- WALK INS
create table if not exists walk_ins (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  staff_id uuid references staff(id) on delete cascade not null,
  customer_name text not null,
  service_name text not null,
  amount numeric(10,2) not null default 0,
  date date not null,
  time_slot text not null,
  created_at timestamptz default now()
);

-- REVIEWS
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_visible boolean default true,
  created_at timestamptz default now()
);

-- INDEXES
create index if not exists idx_appointments_shop_date on appointments(shop_id, date);
create index if not exists idx_appointments_staff_date on appointments(staff_id, date);
create index if not exists idx_walk_ins_shop_date on walk_ins(shop_id, date);
create index if not exists idx_blocked_slots_shop_date on blocked_slots(shop_id, date);

-- ROW LEVEL SECURITY (open for now — tighten after auth integration)
alter table shops enable row level security;
alter table staff enable row level security;
alter table services enable row level security;
alter table working_hours enable row level security;
alter table blocked_slots enable row level security;
alter table appointments enable row level security;
alter table walk_ins enable row level security;
alter table reviews enable row level security;

-- Public read policies
create policy "shops_public_read" on shops for select using (is_active = true);
create policy "staff_public_read" on staff for select using (is_active = true);
create policy "services_public_read" on services for select using (is_active = true);
create policy "working_hours_public_read" on working_hours for select using (true);
create policy "reviews_public_read" on reviews for select using (is_visible = true);
create policy "appointments_public_insert" on appointments for insert with check (true);
create policy "appointments_public_read" on appointments for select using (true);
create policy "blocked_slots_public_read" on blocked_slots for select using (true);
create policy "walk_ins_all" on walk_ins for all using (true);
create policy "appointments_update" on appointments for update using (true);
create policy "services_all" on services for all using (true);
create policy "staff_all" on staff for all using (true);
create policy "shops_all" on shops for all using (true);
create policy "working_hours_all" on working_hours for all using (true);

-- SAMPLE DATA (one shop)
insert into shops (slug, name, phone, whatsapp, address, instagram_username, instagram_bio, instagram_followers, instagram_following, instagram_posts, is_active)
values ('ozancinhairart', 'Ozan Cin Hair Art Studio', '05321234567', '905321234567', 'Bağcılar, İstanbul', 'ozancinhairart', 'Premium erkek kuaförü', 1420, 312, 87, true)
on conflict (slug) do nothing;

-- Insert sample services
with shop as (select id from shops where slug = 'ozancinhairart')
insert into services (shop_id, name, category, price, duration, is_active)
select shop.id, s.name, s.category::text, s.price, s.duration, true
from shop,
(values
  ('Saç Kesimi', 'hair', 150, 60),
  ('Saç + Sakal', 'hair', 200, 60),
  ('Sakal Tıraşı', 'beard', 100, 60),
  ('Kaş Düzeltme', 'hair', 75, 60),
  ('Cilt Bakımı', 'skin', 250, 60),
  ('Makyaj', 'makeup', 300, 60)
) as s(name, category, price, duration)
on conflict do nothing;

-- Insert sample staff
with shop as (select id from shops where slug = 'ozancinhairart')
insert into staff (shop_id, name, title, is_active)
select shop.id, s.name, s.title, true
from shop,
(values
  ('Ozan Cin', 'Baş Stilist'),
  ('Mehmet Ay', 'Berber'),
  ('Ali Yıldız', 'Berber')
) as s(name, title)
on conflict do nothing;

-- Working hours (Mon-Sat open, Sun closed)
with shop as (select id from shops where slug = 'ozancinhairart')
insert into working_hours (shop_id, staff_id, day_of_week, open_time, close_time, is_closed)
select shop.id, null, d.day, '09:00', '19:00', d.closed
from shop,
(values (0,true),(1,false),(2,false),(3,false),(4,false),(5,false),(6,false)) as d(day, closed)
on conflict do nothing;

-- Sample reviews
with shop as (select id from shops where slug = 'ozancinhairart')
insert into reviews (shop_id, customer_name, rating, comment, is_visible)
select shop.id, r.name, r.rating, r.comment, true
from shop,
(values
  ('Ahmet Y.', 5, 'Harika bir deneyimdi. Kesinlikle tavsiye ederim!'),
  ('Emre K.', 5, 'Ozan usta elinden çıkan her şey mükemmel.'),
  ('Burak T.', 4, 'Çok temiz ve güzel bir ortam. Fiyatlar makul.')
) as r(name, rating, comment)
on conflict do nothing;
