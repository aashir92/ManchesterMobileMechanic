import type { HeroSlideRow } from "@/lib/cms/hero-carousel";

export type { HeroSlideRow };

export type HomeValueFeatureRow = {
  id: string;
  icon_key: string;
  title: string;
  body: string;
  visible?: boolean;
};

export type SiteContent = {
  id: number;
  hero_h1: string;
  hero_subhead: string;
  hero_bg_url: string | null;
  about_text: string | null;
  hero_carousel_urls: HeroSlideRow[];
  contact_eyebrow: string | null;
  contact_headline: string | null;
  contact_intro: string | null;
  contact_phone_display: string | null;
  contact_phone_tel: string | null;
  contact_whatsapp_url: string | null;
  contact_booking_email: string | null;
  contact_email_note: string | null;
  about_page_eyebrow: string | null;
  about_experience_title: string | null;
  about_why_title: string | null;
  trust_eyebrow: string | null;
  trust_title: string | null;
  trust_intro: string | null;
  about_trust_points: string[];
  home_value_headline: string | null;
  home_value_features: HomeValueFeatureRow[];
  van_image_url: string | null;
  cta_headline: string | null;
  cta_subtext: string | null;
  cta_call_label: string | null;
  cta_book_label: string | null;
  services_page_content: unknown | null;
};

export type ServiceRow = {
  id: string;
  title: string;
  description: string;
  price: string | null;
  icon_name: string;
  created_at: string;
};

export type PortfolioItem = {
  id: string;
  before_image_url: string;
  after_image_url: string;
  description: string | null;
};

export type ServiceDisplay = {
  id?: string;
  title: string;
  description: string;
  price?: string | null;
  icon_name: string;
};
