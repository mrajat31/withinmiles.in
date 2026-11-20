-- ============================================================
-- withinmiles.in, Migration: trip approval workflow
-- Zone Heads create/edit trips → status 'pending' → Owner approves → live.
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

alter table public.trips
  add column if not exists approval_status text not null default 'approved'
  check (approval_status in ('pending', 'approved'));

-- Everything already on the site stays approved
update public.trips set approval_status = 'approved' where approval_status is null;

-- Public only ever sees approved + active trips
drop policy if exists "Public can view active trips" on public.trips;
create policy "Public can view active trips"
  on public.trips for select
  using (is_active = true and approval_status = 'approved');

-- Zone Head changes always need the Owner's sign-off;
-- the Owner's own changes are live immediately.
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
    -- volunteers (photo-only) keep the existing status
    new.approval_status := old.approval_status;
  end if;
  return new;
end;
$$;

drop trigger if exists trips_enforce_approval on public.trips;
create trigger trips_enforce_approval
  before insert or update on public.trips
  for each row execute function public.enforce_trip_approval();

grant execute on all functions in schema public to anon, authenticated;
