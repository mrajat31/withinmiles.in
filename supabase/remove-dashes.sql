-- ============================================================
-- withinmiles.in — Remove em/en dashes from all existing database text
-- Run in: Supabase Dashboard → SQL Editor → Run (safe, in-place cleanup)
-- ============================================================

create or replace function pg_temp.clean(t text)
returns text language sql immutable as $$
  select replace(replace(replace(t, ' — ', ', '), '—', '-'), '–', '-');
$$;

create or replace function pg_temp.clean_arr(a text[])
returns text[] language sql immutable as $$
  select coalesce(array_agg(pg_temp.clean(x) order by ord), '{}')
  from unnest(a) with ordinality as u(x, ord);
$$;

update public.trips set
  title_en        = pg_temp.clean(title_en),
  title_hi        = pg_temp.clean(title_hi),
  title_mr        = pg_temp.clean(title_mr),
  description_en  = pg_temp.clean(description_en),
  description_hi  = pg_temp.clean(description_hi),
  description_mr  = pg_temp.clean(description_mr),
  destination     = pg_temp.clean(destination),
  best_months     = pg_temp.clean(best_months),
  pickup_points   = pg_temp.clean(pickup_points),
  departure_note  = pg_temp.clean(departure_note),
  price_note      = pg_temp.clean(price_note),
  itinerary       = pg_temp.clean(itinerary),
  highlights      = pg_temp.clean_arr(highlights),
  includes        = pg_temp.clean_arr(includes),
  excludes        = pg_temp.clean_arr(excludes),
  things_to_carry = pg_temp.clean_arr(things_to_carry);

update public.profiles set
  full_name = pg_temp.clean(full_name),
  title     = pg_temp.clean(title),
  bio       = pg_temp.clean(bio);

update public.reviews set
  name = pg_temp.clean(name),
  text = pg_temp.clean(text),
  trip_name = pg_temp.clean(trip_name);
