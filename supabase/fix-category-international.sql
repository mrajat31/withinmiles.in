-- ============================================================
-- withinmiles.in — Fix: 'international' is a destination, not a trip type
-- Run in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

update public.trips set category = 'adventure' where category = 'international';

alter table public.trips drop constraint if exists trips_category_check;
alter table public.trips add constraint trips_category_check
  check (category in ('trek', 'roadtrip', 'beach', 'adventure', 'weekend', 'pilgrimage'));
