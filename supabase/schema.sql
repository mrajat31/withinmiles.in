-- ============================================================
-- Within Miles — Supabase setup
-- Run this whole file in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Team profiles with role-based access control
-- Roles: 'admin' (full control) and 'member' (add/edit trips, own profile).
-- ⚠️ After team members sign up and save their profile once, make yourself admin:
--    Table Editor → profiles → your row → set role = 'admin'
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text not null default '',
  title text,
  bio text,
  photo_url text,
  instagram text,
  role text not null default 'member' check (role in ('admin', 'member')),
  is_public boolean not null default true
);

alter table public.profiles enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Public can view public profiles"
  on public.profiles for select
  using (is_public = true);

create policy "Team can view all profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- Members manage their own profile but can never set their own role
create policy "Users can create own profile"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid() and role = 'member');

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = 'member');

create policy "Admins manage all profiles"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Trips table
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title_en text not null,
  title_hi text,
  title_mr text,
  description_en text not null,
  description_hi text,
  description_mr text,
  destination text not null,
  region text not null default 'other'
    check (region in ('maharashtra','himachal','uttarakhand','kashmir','arunachal','meghalaya','goa','international','other')),
  category text not null default 'trek'
    check (category in ('trek','roadtrip','beach','adventure','weekend','international','pilgrimage')),
  duration_days int not null default 1,
  duration_nights int not null default 0,
  price numeric not null default 0,
  start_date date,
  end_date date,
  image_url text not null,
  highlights text[] not null default '{}',
  is_active boolean not null default true,
  is_featured boolean not null default false
);

-- Row Level Security:
--  * anyone can READ active trips (public website)
--  * only signed-in team members can read all / create / update / delete
alter table public.trips enable row level security;

create policy "Public can view active trips"
  on public.trips for select
  using (is_active = true);

create policy "Team can view all trips"
  on public.trips for select
  to authenticated
  using (true);

create policy "Team can insert trips"
  on public.trips for insert
  to authenticated
  with check (true);

create policy "Team can update trips"
  on public.trips for update
  to authenticated
  using (true);

create policy "Team can delete trips"
  on public.trips for delete
  to authenticated
  using (public.is_admin());

-- Storage bucket for trip images (public read, team write)
insert into storage.buckets (id, name, public)
values ('trip-images', 'trip-images', true)
on conflict (id) do nothing;

create policy "Public can view trip images"
  on storage.objects for select
  using (bucket_id = 'trip-images');

create policy "Team can upload trip images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'trip-images');

create policy "Team can update trip images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'trip-images');

create policy "Team can delete trip images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'trip-images');

-- Reviews: anyone can submit (hidden until approved), public reads approved only.
-- Approve a review in: Supabase Dashboard → Table Editor → reviews → set is_approved = true
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  rating int not null check (rating between 1 and 5),
  text text not null,
  trip_name text,
  is_approved boolean not null default false
);

alter table public.reviews enable row level security;

create policy "Public can view approved reviews"
  on public.reviews for select
  using (is_approved = true);

create policy "Anyone can submit a review"
  on public.reviews for insert
  with check (is_approved = false);

create policy "Team can manage reviews"
  on public.reviews for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
