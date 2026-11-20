-- ============================================================
-- withinmiles.in — Review photos
-- Run in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

alter table public.reviews add column if not exists photo_url text;

-- Public bucket for customer review photos (anonymous uploads allowed)
insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', true)
on conflict (id) do nothing;

create policy "Public can view review photos"
  on storage.objects for select
  using (bucket_id = 'review-photos');

create policy "Anyone can upload review photos"
  on storage.objects for insert
  with check (bucket_id = 'review-photos');

create policy "Owner can delete review photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'review-photos' and public.is_owner());
