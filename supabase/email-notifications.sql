-- ============================================================
-- withinmiles.in — Email alerts via Resend (replaces WhatsApp alerts)
--
-- SETUP (3 minutes):
-- 1. Sign up free at https://resend.com using the email address where
--    you want to RECEIVE alerts (e.g. withinmilesin@gmail.com).
--    (Free tier sends to your own signup address, 100 emails/day.)
-- 2. In Resend: API Keys → Create API Key → copy it (starts with re_).
-- 3. Replace the two placeholders below, then run this whole file in:
--    Supabase Dashboard → SQL Editor → Run
--
-- This file is safe to run even if community-membership.sql was
-- already run (or never run) — everything is idempotent.
-- ============================================================

-- Membership applications table (no-op if it already exists)
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

drop policy if exists "Anyone can apply for membership" on public.members;
create policy "Anyone can apply for membership"
  on public.members for insert
  with check (status = 'pending');

drop policy if exists "Owner manages members" on public.members;
create policy "Owner manages members"
  on public.members for all
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

grant all on public.members to anon, authenticated;

-- ============================================================
-- Email notification helper (Resend)
-- ============================================================
create extension if not exists pg_net with schema extensions;

create or replace function public.notify_owner(subject text, body text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  resend_key text := 'RESEND_KEY_HERE';   -- your Resend API key (re_...)
  owner_email text := 'OWNER_EMAIL_HERE'; -- your Resend signup email
begin
  if resend_key = 'RESEND_KEY_HERE' then
    return; -- not configured yet; skip silently
  end if;
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'withinmiles.in <onboarding@resend.dev>',
      'to', jsonb_build_array(owner_email),
      'subject', subject,
      'text', body
    )
  );
end;
$$;

-- New membership applications
create or replace function public.notify_member_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_owner(
    'New community member application: ' || new.full_name,
    'Name: ' || new.full_name
    || E'\nWhatsApp: ' || new.whatsapp
    || E'\nCity: ' || coalesce(new.city, '-')
    || E'\nEligibility: ' || new.eligibility
    || E'\nTreks done: ' || new.treks_done
    || E'\nReferred by: ' || coalesce(new.referred_by, '-')
    || E'\n\nApprove it in the admin panel: https://withinmiles.in/admin');
  return new;
end;
$$;

drop trigger if exists members_notify on public.members;
create trigger members_notify
  after insert on public.members
  for each row execute function public.notify_member_application();

-- Trips submitted for approval
create or replace function public.notify_trip_pending()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.approval_status = 'pending'
     and (tg_op = 'INSERT' or old.approval_status is distinct from 'pending') then
    perform public.notify_owner(
      'Trip awaiting your approval: ' || new.title_en,
      'A zone head submitted or edited this trip:'
      || E'\n\n' || new.title_en || ' (' || new.destination || ')'
      || E'\nPrice: Rs. ' || new.price
      || E'\n\nReview and approve: https://withinmiles.in/admin');
  end if;
  return new;
end;
$$;

drop trigger if exists trips_notify_pending on public.trips;
create trigger trips_notify_pending
  after insert or update on public.trips
  for each row execute function public.notify_trip_pending();

-- New customer reviews
create or replace function public.notify_review_submitted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_approved = false then
    perform public.notify_owner(
      'New review from ' || new.name || ' (' || new.rating || ' stars)',
      'Trip: ' || coalesce(new.trip_name, '-')
      || E'\nRating: ' || new.rating || '/5'
      || E'\n\n' || new.text
      || E'\n\nApprove it in the admin panel: https://withinmiles.in/admin');
  end if;
  return new;
end;
$$;

drop trigger if exists reviews_notify on public.reviews;
create trigger reviews_notify
  after insert on public.reviews
  for each row execute function public.notify_review_submitted();

-- Clean up the old WhatsApp notifier if it exists
drop function if exists public.notify_owner_whatsapp(text);

grant execute on all functions in schema public to anon, authenticated;
