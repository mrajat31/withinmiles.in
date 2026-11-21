-- ============================================================
-- withinmiles.in  Multiple batches (departure dates) per trip
-- Run in: Supabase Dashboard -> SQL Editor -> Run. Safe to re-run.
-- Each trip can now list several departure dates. The legacy
-- start_date/end_date keep holding the next upcoming batch so
-- sorting and "This Week's Trips" keep working.
-- ============================================================

alter table public.trips
  add column if not exists batches jsonb not null default '[]'::jsonb;

-- Backfill: existing single dates become the first batch
update public.trips
   set batches = jsonb_build_array(
     jsonb_build_object('start', start_date, 'end', end_date, 'note', null)
   )
 where batches = '[]'::jsonb
   and start_date is not null;

select 'Trip batches ready' as result;
