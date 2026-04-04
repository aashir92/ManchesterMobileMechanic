-- CMS extensions for site_content (run after 001_schema.sql).
--
-- Aligned with:
--   - lib/types/database.ts (SiteContent)
--   - lib/cms/merge-site-content.ts (normalizeSiteRow, mergeToPublicSiteContent)
--   - app/admin/actions.ts (all .from("site_content").update / hero carousel helpers)
--
-- Safe to re-run: every column uses IF NOT EXISTS. Does not drop or rename columns.

-- Hero carousel: [{ url, visible? }, ...] — see lib/cms/hero-carousel.ts
alter table public.site_content
  add column if not exists hero_carousel_urls jsonb not null default '[]'::jsonb;

-- Contact page + navbar/footer/FAB (merge uses defaults when null)
alter table public.site_content
  add column if not exists contact_eyebrow text,
  add column if not exists contact_headline text,
  add column if not exists contact_intro text,
  add column if not exists contact_phone_display text,
  add column if not exists contact_phone_tel text,
  add column if not exists contact_whatsapp_url text,
  add column if not exists contact_email_note text;

-- About page labels (body text stays in about_text from 001)
alter table public.site_content
  add column if not exists about_page_eyebrow text,
  add column if not exists about_experience_title text,
  add column if not exists about_why_title text,
  add column if not exists trust_eyebrow text,
  add column if not exists trust_title text,
  add column if not exists trust_intro text;

-- JSON array of strings; app reads via asStringArray() in merge-site-content.ts
alter table public.site_content
  add column if not exists about_trust_points jsonb not null default '[]'::jsonb;

-- Why us + van; home_value_features validated by homeValueFeaturesSchema (services-schema.ts)
alter table public.site_content
  add column if not exists home_value_headline text,
  add column if not exists home_value_features jsonb not null default '[]'::jsonb,
  add column if not exists van_image_url text;

-- CTA block (phone for CTA comes from contact_phone_tel in merge, not a separate column)
alter table public.site_content
  add column if not exists cta_headline text,
  add column if not exists cta_subtext text,
  add column if not exists cta_call_label text,
  add column if not exists cta_book_label text;

-- Full services page JSON; null => buildDefaultServicesPageContent() in merge
alter table public.site_content
  add column if not exists services_page_content jsonb;
