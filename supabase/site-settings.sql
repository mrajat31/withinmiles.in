-- ============================================================
-- withinmiles.in — Site settings (e.g. About page image)
-- Run in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Public can read settings"
  on public.site_settings for select
  using (true);

create policy "Owner manages settings"
  on public.site_settings for all
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

grant all on public.site_settings to anon, authenticated;
