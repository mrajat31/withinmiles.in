-- ============================================================
-- withinmiles.in, Community Membership + WhatsApp notifications
-- Run in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Membership applications (self-service from the website)
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  whatsapp text not null,
  email text,
  city text,
  eligibility text not null check (eligibility in ('two_treks', 'one_trek_with_member')),
  treks_done text not null,
  referred_by text,
  status text not null default 'pending' check (status in ('pending', 'active', 'rejected')),
  expires_at date
);

alter table public.members enable row level security;

-- Anyone can apply from the website (always lands as pending)
create policy "Anyone can apply for membership"
  on public.members for insert
  with check (status = 'pending');

-- Only the owner can see and manage applications
create policy "Owner manages members"
  on public.members for all
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

grant all on public.members to anon, authenticated;

-- ============================================================
-- WhatsApp notifications via CallMeBot (free personal alerts)
--
-- ONE-TIME SETUP (2 minutes):
-- 1. On your personal WhatsApp, send the message:
--       I allow callmebot to send me messages
--    to this number: +34 644 44 21 48
-- 2. It replies with your personal API key.
-- 3. Replace the two placeholders below, then run this file.
-- ============================================================
create extension if not exists pg_net with schema extensions;

create or replace function public.notify_owner_whatsapp(message text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  owner_phone text := '+919762610325';        -- your personal WhatsApp for approvals
  callmebot_key text := 'CALLMEBOT_KEY_HERE'; -- the API key CallMeBot sent you
begin
  if callmebot_key = 'CALLMEBOT_KEY_HERE' then
    return; -- not configured yet; skip silently
  end if;
  perform net.http_get(
    url := 'https://api.callmebot.com/whatsapp.php?phone=' || owner_phone
        || '&apikey=' || callmebot_key
        || '&text=' || replace(replace(message, ' ', '+'), '&', 'and')
  );
end;
$$;

-- Notify on new membership applications
create or replace function public.notify_member_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_owner_whatsapp(
    'withinmiles.in: New community member application from ' || new.full_name
    || ' (' || new.whatsapp || '). Review it in the admin panel.');
  return new;
end;
$$;

drop trigger if exists members_notify on public.members;
create trigger members_notify
  after insert on public.members
  for each row execute function public.notify_member_application();

-- Notify when a trip is submitted for approval
create or replace function public.notify_trip_pending()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.approval_status = 'pending'
     and (tg_op = 'INSERT' or old.approval_status is distinct from 'pending') then
    perform public.notify_owner_whatsapp(
      'withinmiles.in: Trip awaiting your approval: ' || new.title_en);
  end if;
  return new;
end;
$$;

drop trigger if exists trips_notify_pending on public.trips;
create trigger trips_notify_pending
  after insert or update on public.trips
  for each row execute function public.notify_trip_pending();

-- Notify when a customer submits a review
create or replace function public.notify_review_submitted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_approved = false then
    perform public.notify_owner_whatsapp(
      'withinmiles.in: New review from ' || new.name || ' ('
      || new.rating || ' stars). Approve it in the admin panel.');
  end if;
  return new;
end;
$$;

drop trigger if exists reviews_notify on public.reviews;
create trigger reviews_notify
  after insert on public.reviews
  for each row execute function public.notify_review_submitted();
