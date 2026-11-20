-- ============================================================
-- withinmiles.in — Trip difficulty levels
-- Run in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

alter table public.trips
  add column if not exists difficulty text
  check (difficulty in ('beginner', 'moderate', 'advanced'));

update public.trips set difficulty = v.d
from (values
  ('vasota-fort-lakeside-camping', 'moderate'),
  ('dategad-chalkewadi', 'moderate'),
  ('rajgad-pali-darwaza', 'moderate'),
  ('nanemachi-satsada', 'beginner'),
  ('korigad-fort', 'beginner'),
  ('rajmachi-twin-fort', 'moderate'),
  ('twin-fort-flower-bloom', 'beginner'),
  ('torna-fort', 'moderate'),
  ('kamalgad-fort', 'moderate'),
  ('rohida-fort', 'beginner'),
  ('pratapgad-fort', 'beginner'),
  ('jivdhan-valley-crossing', 'advanced'),
  ('amk-expedition', 'advanced'),
  ('moroshicha-bhairavgad', 'advanced')
) as v(slug, d)
where trips.slug = v.slug;
