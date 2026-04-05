-- Blog posts: public read published only; authenticated full CRUD.

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text not null default '',
  content jsonb not null default '{}'::jsonb,
  featured_image_url text,
  created_at timestamptz not null default now(),
  published boolean not null default true,
  constraint blogs_slug_unique unique (slug)
);

create index if not exists blogs_created_at_idx on public.blogs (created_at desc);
create index if not exists blogs_published_idx on public.blogs (published);

alter table public.blogs enable row level security;

-- Anyone (including anon) can read published posts.
create policy "blogs_select_published"
  on public.blogs
  for select
  using (published = true);

-- Authenticated users (admin) can read all posts including drafts.
create policy "blogs_select_authenticated"
  on public.blogs
  for select
  to authenticated
  using (true);

create policy "blogs_insert_authenticated"
  on public.blogs
  for insert
  to authenticated
  with check (true);

create policy "blogs_update_authenticated"
  on public.blogs
  for update
  to authenticated
  using (true)
  with check (true);

create policy "blogs_delete_authenticated"
  on public.blogs
  for delete
  to authenticated
  using (true);
