-- Run in Supabase SQL Editor (or via CLI). Creates tables, RLS, storage bucket policies.

-- Tables
create table if not exists public.site_content (
  id integer primary key default 1 check (id = 1),
  hero_h1 text not null default 'Professional Repairs At Your Doorstep',
  hero_subhead text not null default 'Manchester''s leading mobile mechanic service.',
  hero_bg_url text,
  about_text text
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  price text,
  icon_name text not null default 'Wrench',
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(),
  before_image_url text not null,
  after_image_url text not null,
  description text,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.site_content enable row level security;
alter table public.services enable row level security;
alter table public.portfolio enable row level security;

create policy "site_content_select_public" on public.site_content for select using (true);
create policy "site_content_write_authenticated" on public.site_content for all to authenticated using (true) with check (true);

create policy "services_select_public" on public.services for select using (true);
create policy "services_write_authenticated" on public.services for all to authenticated using (true) with check (true);

create policy "portfolio_select_public" on public.portfolio for select using (true);
create policy "portfolio_write_authenticated" on public.portfolio for all to authenticated using (true) with check (true);

-- Seed single site row (idempotent)
insert into public.site_content (id, hero_h1, hero_subhead, hero_bg_url, about_text)
values (
  1,
  'Professional Repairs At Your Doorstep',
  'Manchester Mobile Mechanic covering Manchester and Surrounding Areas. Reliable mechanical & auto electrical services.',
  null,
  null
)
on conflict (id) do nothing;

-- Storage: create bucket in Dashboard > Storage > New bucket > name: mechanic-assets, public.
-- Then run policies below (adjust if bucket already exists):

insert into storage.buckets (id, name, public)
values ('mechanic-assets', 'mechanic-assets', true)
on conflict (id) do nothing;

create policy "mechanic_assets_public_read"
on storage.objects for select
using (bucket_id = 'mechanic-assets');

create policy "mechanic_assets_authenticated_upload"
on storage.objects for insert to authenticated
with check (bucket_id = 'mechanic-assets');

create policy "mechanic_assets_authenticated_update"
on storage.objects for update to authenticated
using (bucket_id = 'mechanic-assets');

create policy "mechanic_assets_authenticated_delete"
on storage.objects for delete to authenticated
using (bucket_id = 'mechanic-assets');
