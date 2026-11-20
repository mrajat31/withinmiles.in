-- ============================================================
-- withinmiles.in — Homepage hero slideshow images
-- Run in: Supabase Dashboard → SQL Editor → Run
-- Owner uploads photos in Admin → Hero tab; they rotate on the homepage.
-- ============================================================

create table if not exists public.hero_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  image_url text not null
);

alter table public.hero_images enable row level security;

create policy "Public can view hero images"
  on public.hero_images for select
  using (true);

create policy "Owner manages hero images"
  on public.hero_images for all
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

grant all on public.hero_images to anon, authenticated;
