-- Multiple tags per trip
-- A trip can now be both Trek AND Adventure (etc). The old single
-- "category" column stays and always mirrors the first tag, so nothing
-- else breaks. Run once in the Supabase SQL editor. Safe to re-run.

alter table public.trips
  add column if not exists categories text[] not null default '{}';

-- Backfill: every existing trip gets its current category as its first tag
update public.trips
   set categories = array[category]
 where categories = '{}' or categories is null;

-- Only allow known tags
alter table public.trips drop constraint if exists trips_categories_check;
alter table public.trips
  add constraint trips_categories_check
  check (categories <@ array['trek','roadtrip','beach','adventure','weekend','pilgrimage','international']::text[]);

select 'Trip tags ready. ' || count(*) || ' trips backfilled.' as result
from public.trips where cardinality(categories) > 0;
