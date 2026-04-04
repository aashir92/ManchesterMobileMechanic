import { buildDefaultServicesPageContent } from "@/lib/cms/default-services-page";
import {
  heroSlidesToPublicUrls,
  normalizeHeroCarouselJson,
} from "@/lib/cms/hero-carousel";
import {
  homeValueFeaturesSchema,
  servicesPageContentSchema,
  type HomeValueFeatureCms,
  type ServicesPageContent,
} from "@/lib/cms/services-schema";
import {
  ABOUT_TRUST_POINTS,
  DEFAULT_ABOUT_TEXT,
  DEFAULT_SITE_CONTENT,
  HERO_SERVICE_CAROUSEL_URLS,
  VAN_IMAGE,
} from "@/lib/data/defaults";
import type { HomeValueFeatureRow, SiteContent } from "@/lib/types/database";

const DEFAULT_CONTACT = {
  eyebrow: "Get in touch",
  headline: "Book your service",
  intro:
    "Call, WhatsApp, or send a message. We will get back to you to confirm time and location.",
  phone_display: "0784 5531351",
  phone_tel: "07845531351",
  whatsapp_url: "https://wa.me/447845531351",
  email_note:
    "Prefer email? Submit the booking form. We will reply by email or phone as soon as we can.",
} as const;

const DEFAULT_ABOUT_LABELS = {
  page_eyebrow: "About us",
  experience_title: "Your experience",
  why_title: "Why we started",
  trust_eyebrow: "Trust",
  trust_title: "Why you can trust us",
  trust_intro:
    "We build long-term relationships with drivers and businesses across Manchester — not one-off quick fixes.",
} as const;

const DEFAULT_HOME_VALUE_FEATURES: HomeValueFeatureCms[] = [
  {
    id: "vf-0",
    icon_key: "CarFront",
    title: "Mobile service – we come to you",
    body: "We repair your vehicle at home, work, or roadside — no garage queues.",
    visible: true,
  },
  {
    id: "vf-1",
    icon_key: "Timer",
    title: "Fast & reliable",
    body: "Efficiency without compromising on mechanical integrity.",
    visible: true,
  },
  {
    id: "vf-2",
    icon_key: "Receipt",
    title: "Transparent pricing",
    body: "No hidden fees. Upfront quotes that stay consistent.",
    visible: true,
  },
  {
    id: "vf-3",
    icon_key: "Trophy",
    title: "Experienced technician",
    body: "Specialist knowledge in mechanical and auto electrical work.",
    visible: true,
  },
  {
    id: "vf-4",
    icon_key: "MapPin",
    title: "Based in Manchester",
    body: "Proudly serving Manchester and surrounding areas.",
    visible: true,
  },
];

const DEFAULT_CTA = {
  headline: "Ready to get your car fixed without the hassle?",
  subtext: "Call now or message us to book your service today.",
  call_label: "Call now",
  book_label: "Book appointment",
} as const;

function asString(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
}

function asHomeFeatures(v: unknown): HomeValueFeatureRow[] {
  const p = homeValueFeaturesSchema.safeParse(v);
  return p.success ? p.data : [];
}

function legacyHeroUrls(hero_bg_url: string | null): string[] {
  const trimmed = hero_bg_url?.trim();
  if (!trimmed) return [...HERO_SERVICE_CAROUSEL_URLS];
  const rest = HERO_SERVICE_CAROUSEL_URLS.filter((u) => u !== trimmed);
  return [trimmed, ...rest];
}

function resolveHeroImageUrls(row: SiteContent): string[] {
  const slides = row.hero_carousel_urls;
  const visible = heroSlidesToPublicUrls(slides);
  if (slides.length > 0 && visible.length > 0) return visible;
  const bg =
    row.hero_bg_url?.trim() ||
    DEFAULT_SITE_CONTENT.hero_bg_url?.trim() ||
    null;
  return legacyHeroUrls(bg);
}

function parseServicesPage(raw: unknown): ServicesPageContent {
  const p = servicesPageContentSchema.safeParse(raw);
  if (p.success) return p.data;
  return buildDefaultServicesPageContent();
}

export function normalizeSiteRow(
  row: Record<string, unknown> | SiteContent | null | undefined,
): SiteContent {
  if (!row || typeof row !== "object") {
    return { ...DEFAULT_SITE_CONTENT };
  }

  const r = row as Record<string, unknown>;

  return {
    id: typeof r.id === "number" ? r.id : Number(r.id) || 1,
    hero_h1: asString(r.hero_h1) ?? DEFAULT_SITE_CONTENT.hero_h1,
    hero_subhead: asString(r.hero_subhead) ?? DEFAULT_SITE_CONTENT.hero_subhead,
    hero_bg_url: asString(r.hero_bg_url),
    about_text: asString(r.about_text),
    hero_carousel_urls: normalizeHeroCarouselJson(r.hero_carousel_urls),
    contact_eyebrow: asString(r.contact_eyebrow),
    contact_headline: asString(r.contact_headline),
    contact_intro: asString(r.contact_intro),
    contact_phone_display: asString(r.contact_phone_display),
    contact_phone_tel: asString(r.contact_phone_tel),
    contact_whatsapp_url: asString(r.contact_whatsapp_url),
    contact_email_note: asString(r.contact_email_note),
    about_page_eyebrow: asString(r.about_page_eyebrow),
    about_experience_title: asString(r.about_experience_title),
    about_why_title: asString(r.about_why_title),
    trust_eyebrow: asString(r.trust_eyebrow),
    trust_title: asString(r.trust_title),
    trust_intro: asString(r.trust_intro),
    about_trust_points: asStringArray(r.about_trust_points),
    home_value_headline: asString(r.home_value_headline),
    home_value_features: asHomeFeatures(r.home_value_features),
    van_image_url: asString(r.van_image_url),
    cta_headline: asString(r.cta_headline),
    cta_subtext: asString(r.cta_subtext),
    cta_call_label: asString(r.cta_call_label),
    cta_book_label: asString(r.cta_book_label),
    services_page_content: r.services_page_content ?? null,
  };
}

export type ContactBlockPublic = {
  eyebrow: string;
  headline: string;
  intro: string;
  phone_display: string;
  phone_tel: string;
  whatsapp_url: string;
  email_note: string;
};

export type AboutBlockPublic = {
  page_eyebrow: string;
  experience_title: string;
  why_title: string;
  trust_eyebrow: string;
  trust_title: string;
  trust_intro: string;
  trust_points: string[];
};

export type HomeValueBlockPublic = {
  headline: string;
  features: HomeValueFeatureCms[];
  van_image_url: string;
};

export type CtaBlockPublic = {
  headline: string;
  subtext: string;
  call_label: string;
  book_label: string;
  phone_tel: string;
};

export type PublicSiteContent = {
  hero_h1: string;
  hero_subhead: string;
  hero_image_urls: string[];
  about_text: string | null;
  about: AboutBlockPublic;
  contact: ContactBlockPublic;
  home_value: HomeValueBlockPublic;
  cta: CtaBlockPublic;
  services_page: ServicesPageContent;
};

export function mergeToPublicSiteContent(
  raw: Record<string, unknown> | SiteContent | null | undefined,
): PublicSiteContent {
  const row = normalizeSiteRow(raw);

  const trustPoints =
    row.about_trust_points.length > 0 ? row.about_trust_points : [...ABOUT_TRUST_POINTS];

  const homeFeaturesRaw =
    row.home_value_features.length > 0 ? row.home_value_features : DEFAULT_HOME_VALUE_FEATURES;
  const homeFeaturesParsed = homeValueFeaturesSchema.safeParse(homeFeaturesRaw);
  const homeFeatures = homeFeaturesParsed.success
    ? homeFeaturesParsed.data
    : DEFAULT_HOME_VALUE_FEATURES;

  const phone_tel = row.contact_phone_tel ?? DEFAULT_CONTACT.phone_tel;

  return {
    hero_h1: row.hero_h1?.trim() || DEFAULT_SITE_CONTENT.hero_h1,
    hero_subhead: row.hero_subhead?.trim() || DEFAULT_SITE_CONTENT.hero_subhead,
    hero_image_urls: resolveHeroImageUrls(row),
    about_text: row.about_text?.trim() || null,
    about: {
      page_eyebrow: row.about_page_eyebrow ?? DEFAULT_ABOUT_LABELS.page_eyebrow,
      experience_title:
        row.about_experience_title ?? DEFAULT_ABOUT_LABELS.experience_title,
      why_title: row.about_why_title ?? DEFAULT_ABOUT_LABELS.why_title,
      trust_eyebrow: row.trust_eyebrow ?? DEFAULT_ABOUT_LABELS.trust_eyebrow,
      trust_title: row.trust_title ?? DEFAULT_ABOUT_LABELS.trust_title,
      trust_intro: row.trust_intro ?? DEFAULT_ABOUT_LABELS.trust_intro,
      trust_points: trustPoints,
    },
    contact: {
      eyebrow: row.contact_eyebrow ?? DEFAULT_CONTACT.eyebrow,
      headline: row.contact_headline ?? DEFAULT_CONTACT.headline,
      intro: row.contact_intro ?? DEFAULT_CONTACT.intro,
      phone_display: row.contact_phone_display ?? DEFAULT_CONTACT.phone_display,
      phone_tel: phone_tel,
      whatsapp_url: row.contact_whatsapp_url ?? DEFAULT_CONTACT.whatsapp_url,
      email_note: row.contact_email_note ?? DEFAULT_CONTACT.email_note,
    },
    home_value: {
      headline: row.home_value_headline?.trim() || "Why us",
      features: homeFeatures,
      van_image_url: row.van_image_url?.trim() || VAN_IMAGE,
    },
    cta: {
      headline: row.cta_headline ?? DEFAULT_CTA.headline,
      subtext: row.cta_subtext ?? DEFAULT_CTA.subtext,
      call_label: row.cta_call_label ?? DEFAULT_CTA.call_label,
      book_label: row.cta_book_label ?? DEFAULT_CTA.book_label,
      phone_tel,
    },
    services_page: parseServicesPage(row.services_page_content),
  };
}

/** Experience / why paragraphs when about_text is empty. */
export function splitAboutExperienceWhy(aboutText: string | null): {
  experience: string;
  why: string;
} {
  const raw = (aboutText?.trim() || DEFAULT_ABOUT_TEXT)
    .split(/\n\n+/)
    .filter(Boolean);
  return {
    experience:
      raw[0] ??
      "We provide expert mobile mechanic services across Manchester, delivering high-quality repairs and diagnostics at your home or workplace.",
    why:
      raw[1] ??
      "Our goal is simple – save you time, money, and stress by bringing professional service directly to your door.",
  };
}
