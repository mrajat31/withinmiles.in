-- ============================================================
-- withinmiles.in  Trip Gallery
-- Run in: Supabase Dashboard -> SQL Editor -> Run. Safe to re-run.
-- Photos from real trips, shown on /gallery and on each trip page.
-- Owner, zone heads and volunteers can upload; owner (or the
-- uploader) can delete.
-- ============================================================

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  trip_id uuid references public.trips(id) on delete set null,
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  uploaded_by uuid default auth.uid()
);

alter table public.gallery_photos enable row level security;

drop policy if exists "Public can view gallery" on public.gallery_photos;
create policy "Public can view gallery"
  on public.gallery_photos for select
  using (true);

drop policy if exists "Team uploads gallery photos" on public.gallery_photos;
create policy "Team uploads gallery photos"
  on public.gallery_photos for insert
  to authenticated
  with check (public.app_role() in ('owner','zone_head','volunteer'));

drop policy if exists "Owner or uploader manages gallery photos" on public.gallery_photos;
create policy "Owner or uploader manages gallery photos"
  on public.gallery_photos for delete
  to authenticated
  using (public.is_owner() or uploaded_by = auth.uid());

drop policy if exists "Owner edits gallery photos" on public.gallery_photos;
create policy "Owner edits gallery photos"
  on public.gallery_photos for update
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

grant all on public.gallery_photos to anon, authenticated;

select 'Trip gallery ready' as result;
