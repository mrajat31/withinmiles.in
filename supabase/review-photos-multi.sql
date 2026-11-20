-- ============================================================
-- withinmiles.in — Multiple photos per review
-- Run in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

alter table public.reviews
  add column if not exists photo_urls text[] not null default '{}';

-- Carry over any existing single photos
update public.reviews
set photo_urls = array[photo_url]
where photo_url is not null and photo_urls = '{}';
