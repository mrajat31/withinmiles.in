-- ============================================================
-- Within Miles, Supabase setup
-- Run this whole file in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Team profiles with role-based access control
-- Roles:
--   'owner'    , super admin: delete trips, approve reviews, manage team
--   'zone_head', add/edit trips (titles, prices, dates, photos)
--   'volunteer', can only update trip photos
-- ⚠️ After signing in once and saving your profile, make yourself owner:
--    Table Editor → profiles → your row → set role = 'owner'
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text not null default '',
  title text,
  bio text,
  photo_url text,
  instagram text,
  role text not null default 'volunteer' check (role in ('owner', 'zone_head', 'volunteer')),
  is_public boolean not null default true
);

alter table public.profiles enable row level security;

-- Helpers: current user's team role / owner check
create or replace function public.app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.app_role() = 'owner';
$$;

create policy "Public can view public profiles"
  on public.profiles for select
  using (is_public = true);

create policy "Team can view all profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- Members manage their own profile; a trigger stops role self-promotion
create policy "Users can create own profile"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid() and role = 'volunteer');

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Owner manages all profiles"
  on public.profiles for all
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

-- Only the owner may change anyone's role
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_owner() then
    raise exception 'Only the owner can change roles';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Every new auth user automatically gets a profile row (role: volunteer)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

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
    check (category in ('trek','roadtrip','beach','adventure','weekend','pilgrimage')),
  categories text[] not null default '{}'
    check (categories <@ array['trek','roadtrip','beach','adventure','weekend','pilgrimage','international']::text[]),
  duration_days int not null default 1,
  duration_nights int not null default 0,
  price numeric not null default 0,
  start_date date,
  end_date date,
  batches jsonb not null default '[]'::jsonb,
  image_url text not null,
  highlights text[] not null default '{}',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  approval_status text not null default 'approved'
    check (approval_status in ('pending', 'approved')),
  best_months text,
  pickup_points text,
  departure_note text,
  price_note text,
  itinerary text,
  includes text[] not null default '{}',
  excludes text[] not null default '{}',
  things_to_carry text[] not null default '{}',
  created_by uuid default auth.uid() references auth.users (id) on delete set null
);

-- Row Level Security:
--  * anyone can READ active trips (public website)
--  * only signed-in team members can read all / create / update / delete
alter table public.trips enable row level security;

create policy "Public can view active trips"
  on public.trips for select
  using (is_active = true and approval_status = 'approved');

create policy "Team can view all trips"
  on public.trips for select
  to authenticated
  using (true);

create policy "Team can insert trips"
  on public.trips for insert
  to authenticated
  with check (public.app_role() in ('owner', 'zone_head'));

create policy "Team can update trips"
  on public.trips for update
  to authenticated
  using (public.app_role() in ('owner', 'zone_head', 'volunteer'));

create policy "Team can delete trips"
  on public.trips for delete
  to authenticated
  using (public.is_owner());

-- Volunteers may only change a trip's photo, nothing else
create or replace function public.restrict_volunteer_trip_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.app_role() = 'volunteer'
     and (to_jsonb(new) - 'image_url') is distinct from (to_jsonb(old) - 'image_url') then
    raise exception 'Volunteers can only update trip photos';
  end if;
  return new;
end;
$$;

drop trigger if exists trips_volunteer_guard on public.trips;
create trigger trips_volunteer_guard
  before update on public.trips
  for each row execute function public.restrict_volunteer_trip_update();

-- Zone Head changes always need the Owner's sign-off
create or replace function public.enforce_trip_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_owner() then
    if tg_op = 'INSERT' then
      new.approval_status := coalesce(new.approval_status, 'approved');
    end if;
  elsif public.app_role() = 'zone_head' then
    new.approval_status := 'pending';
  elsif tg_op = 'UPDATE' then
    new.approval_status := old.approval_status;
  end if;
  return new;
end;
$$;

drop trigger if exists trips_enforce_approval on public.trips;
create trigger trips_enforce_approval
  before insert or update on public.trips
  for each row execute function public.enforce_trip_approval();

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
  using (public.is_owner())
  with check (public.is_owner());

-- ============================================================
-- Access grants (required): RLS policies above do the real
-- protection; these standard grants let the API roles reach
-- the tables at all.
-- ============================================================
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;
alter default privileges in schema public
  grant all on tables to anon, authenticated;
