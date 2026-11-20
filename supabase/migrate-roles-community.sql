-- ============================================================
-- withinmiles.in, Migration: 3-tier roles (owner / zone_head / volunteer)
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- Safe to run once on the existing project.
-- ============================================================

-- 1) Profiles: new role set (admin→owner, member→zone_head)
alter table public.profiles drop constraint if exists profiles_role_check;
update public.profiles set role = 'owner' where role = 'admin';
update public.profiles set role = 'zone_head' where role = 'member';
alter table public.profiles alter column role set default 'volunteer';
alter table public.profiles
  add constraint profiles_role_check check (role in ('owner', 'zone_head', 'volunteer'));

-- 2) Role helpers
create or replace function public.app_role()
returns text language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid(); $$;

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public
as $$ select public.app_role() = 'owner'; $$;

-- 3) Rebuild profile policies
drop policy if exists "Users can create own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins manage all profiles" on public.profiles;

create policy "Users can create own profile"
  on public.profiles for insert to authenticated
  with check (id = auth.uid() and role = 'volunteer');

create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy "Owner manages all profiles"
  on public.profiles for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

create or replace function public.protect_profile_role()
returns trigger language plpgsql security definer set search_path = public
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

-- 4) Trips: track creator + role-based write access
alter table public.trips
  add column if not exists created_by uuid default auth.uid() references auth.users (id) on delete set null;

drop policy if exists "Team can insert trips" on public.trips;
drop policy if exists "Team can update trips" on public.trips;
drop policy if exists "Team can delete trips" on public.trips;

create policy "Team can insert trips"
  on public.trips for insert to authenticated
  with check (public.app_role() in ('owner', 'zone_head'));

create policy "Team can update trips"
  on public.trips for update to authenticated
  using (public.app_role() in ('owner', 'zone_head', 'volunteer'));

create policy "Team can delete trips"
  on public.trips for delete to authenticated
  using (public.is_owner());

-- Volunteers may only change a trip's photo, nothing else
create or replace function public.restrict_volunteer_trip_update()
returns trigger language plpgsql security definer set search_path = public
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

-- 5) Reviews moderation: owner only
drop policy if exists "Team can manage reviews" on public.reviews;
create policy "Team can manage reviews"
  on public.reviews for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- 6) Retire the old helper
drop function if exists public.is_admin();

-- 7) Make sure future functions are callable
grant execute on all functions in schema public to anon, authenticated;
