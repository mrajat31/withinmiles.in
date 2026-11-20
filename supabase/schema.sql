-- ============================================================
-- Within Miles — Supabase setup
-- Run this whole file in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

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
  category text not null default 'trek'
    check (category in ('trek','beach','adventure','weekend','international','pilgrimage')),
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
  using (true);

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
