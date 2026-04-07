"use server";

import { excerptFromTipTapJson } from "@/lib/blog/excerpt-from-content";
import { buildDefaultServicesPageContent } from "@/lib/cms/default-services-page";
import {
  normalizeHeroCarouselJson,
  type HeroSlideRow,
} from "@/lib/cms/hero-carousel";
import { normalizeSiteRow, splitAboutExperienceWhy } from "@/lib/cms/merge-site-content";
import {
  homeValueFeaturesSchema,
  servicesPageContentSchema,
} from "@/lib/cms/services-schema";
import { DEFAULT_SITE_CONTENT, HERO_SERVICE_CAROUSEL_URLS } from "@/lib/data/defaults";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BUCKET = "mechanic-assets";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

function validateImage(file: File | null): string | null {
  if (!file || file.size === 0) return "No file provided";
  if (!ALLOWED.includes(file.type)) return "Use JPEG, PNG, or WebP";
  if (file.size > MAX_BYTES) return "File must be under 5MB";
  return null;
}

function revalidateCmsPaths() {
  const paths = [
    "/",
    "/about",
    "/contact",
    "/services",
    "/privacy",
    "/terms",
    "/admin",
    "/blog",
  ];
  for (const p of paths) revalidatePath(p);
}

function revalidateBlogPaths(slug?: string | null) {
  revalidatePath("/blog");
  if (slug?.trim()) revalidatePath(`/blog/${slug.trim()}`);
}

function storagePathFromPublicUrl(publicUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  try {
    return decodeURIComponent(publicUrl.slice(i + marker.length));
  } catch {
    return null;
  }
}

async function deleteMechanicAssetIfOwned(
  supabase: Awaited<ReturnType<typeof createClient>>,
  publicUrl: string | null | undefined,
) {
  if (!publicUrl?.trim()) return;
  const path = storagePathFromPublicUrl(publicUrl.trim());
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

function asHeroSlides(v: unknown): HeroSlideRow[] {
  return normalizeHeroCarouselJson(v);
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

async function ensureSiteRow(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from("site_content")
    .select("id")
    .eq("id", 1)
    .maybeSingle();
  if (!data) {
    await supabase.from("site_content").insert({
      id: 1,
      hero_h1: DEFAULT_SITE_CONTENT.hero_h1,
      hero_subhead: DEFAULT_SITE_CONTENT.hero_subhead,
      hero_bg_url: null,
      about_text: DEFAULT_SITE_CONTENT.about_text,
    });
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateSiteContent(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const hero_h1 = String(formData.get("hero_h1") ?? "").trim();
  const hero_subhead = String(formData.get("hero_subhead") ?? "").trim();
  const about_text = String(formData.get("about_text") ?? "").trim();

  await ensureSiteRow(supabase);

  const { error } = await supabase
    .from("site_content")
    .update({
      hero_h1: hero_h1 || DEFAULT_SITE_CONTENT.hero_h1,
      hero_subhead: hero_subhead || DEFAULT_SITE_CONTENT.hero_subhead,
      about_text: about_text || null,
    })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function updateHeroHeadlines(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const hero_h1 = String(formData.get("hero_h1") ?? "").trim();
  const hero_subhead = String(formData.get("hero_subhead") ?? "").trim();

  await ensureSiteRow(supabase);

  const { error } = await supabase
    .from("site_content")
    .update({
      hero_h1: hero_h1 || DEFAULT_SITE_CONTENT.hero_h1,
      hero_subhead: hero_subhead || DEFAULT_SITE_CONTENT.hero_subhead,
    })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function uploadHeroBackground(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  const err = validateImage(file);
  if (err) return { error: err };

  await ensureSiteRow(supabase);

  const ext = file!.name.split(".").pop() || "jpg";
  const path = `hero/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file!, { contentType: file!.type });

  if (upErr) return { error: upErr.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { data: row, error: fetchErr } = await supabase
    .from("site_content")
    .select("hero_carousel_urls")
    .eq("id", 1)
    .maybeSingle();

  if (fetchErr) return { error: fetchErr.message };

  const prev = asHeroSlides(row?.hero_carousel_urls);
  const next = [...prev, { url: publicUrl, visible: true }];

  const { error: dbErr } = await supabase
    .from("site_content")
    .update({ hero_bg_url: publicUrl, hero_carousel_urls: next })
    .eq("id", 1);

  if (dbErr) return { error: dbErr.message };
  revalidateCmsPaths();
  return { url: publicUrl };
}

export async function removeHeroCarouselSlide(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const index = Number(formData.get("index"));
  if (!Number.isInteger(index) || index < 0) return { error: "Invalid index" };

  await ensureSiteRow(supabase);

  const { data: row, error: fetchErr } = await supabase
    .from("site_content")
    .select("hero_carousel_urls")
    .eq("id", 1)
    .maybeSingle();

  if (fetchErr) return { error: fetchErr.message };

  const slides = asHeroSlides(row?.hero_carousel_urls);
  if (index >= slides.length) return { error: "Invalid index" };

  const [removed] = slides.splice(index, 1);
  await deleteMechanicAssetIfOwned(supabase, removed?.url);

  const { error: dbErr } = await supabase
    .from("site_content")
    .update({ hero_carousel_urls: slides })
    .eq("id", 1);

  if (dbErr) return { error: dbErr.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function moveHeroCarouselSlide(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const index = Number(formData.get("index"));
  const direction = String(formData.get("direction") ?? "");
  if (!Number.isInteger(index) || index < 0) return { error: "Invalid index" };
  if (direction !== "up" && direction !== "down") return { error: "Invalid direction" };

  await ensureSiteRow(supabase);

  const { data: row, error: fetchErr } = await supabase
    .from("site_content")
    .select("hero_carousel_urls")
    .eq("id", 1)
    .maybeSingle();

  if (fetchErr) return { error: fetchErr.message };

  const slides = asHeroSlides(row?.hero_carousel_urls);
  const j = direction === "up" ? index - 1 : index + 1;
  if (j < 0 || j >= slides.length) return { ok: true };

  const next = [...slides];
  [next[index], next[j]] = [next[j]!, next[index]!];

  const { error: dbErr } = await supabase
    .from("site_content")
    .update({ hero_carousel_urls: next })
    .eq("id", 1);

  if (dbErr) return { error: dbErr.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function toggleHeroSlideVisible(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const index = Number(formData.get("index"));
  if (!Number.isInteger(index) || index < 0) return { error: "Invalid index" };

  await ensureSiteRow(supabase);

  const { data: row, error: fetchErr } = await supabase
    .from("site_content")
    .select("hero_carousel_urls")
    .eq("id", 1)
    .maybeSingle();

  if (fetchErr) return { error: fetchErr.message };

  const slides = asHeroSlides(row?.hero_carousel_urls);
  if (index >= slides.length) return { error: "Invalid index" };

  const s = slides[index]!;
  const shown = s.visible !== false;
  slides[index] = { ...s, visible: !shown };

  const { error: dbErr } = await supabase
    .from("site_content")
    .update({ hero_carousel_urls: slides })
    .eq("id", 1);

  if (dbErr) return { error: dbErr.message };
  revalidateCmsPaths();
  return { ok: true };
}

/** Copies default hero URLs into hero_carousel_urls so admins can hide/reorder/remove them. */
export async function materializeDefaultHeroSlides() {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  await ensureSiteRow(supabase);

  const { data: row, error: fetchErr } = await supabase
    .from("site_content")
    .select("hero_carousel_urls")
    .eq("id", 1)
    .maybeSingle();

  if (fetchErr) return { error: fetchErr.message };

  const existing = asHeroSlides(row?.hero_carousel_urls);
  if (existing.length > 0) {
    return { ok: true, already: true as const };
  }

  const slides: HeroSlideRow[] = HERO_SERVICE_CAROUSEL_URLS.map((url) => ({
    url,
    visible: true,
  }));

  const { error: dbErr } = await supabase
    .from("site_content")
    .update({ hero_carousel_urls: slides })
    .eq("id", 1);

  if (dbErr) return { error: dbErr.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function updateContactContent(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  await ensureSiteRow(supabase);

  const patch = {
    contact_eyebrow: String(formData.get("contact_eyebrow") ?? "").trim() || null,
    contact_headline: String(formData.get("contact_headline") ?? "").trim() || null,
    contact_intro: String(formData.get("contact_intro") ?? "").trim() || null,
    contact_phone_display:
      String(formData.get("contact_phone_display") ?? "").trim() || null,
    contact_phone_tel: String(formData.get("contact_phone_tel") ?? "").trim() || null,
    contact_whatsapp_url:
      String(formData.get("contact_whatsapp_url") ?? "").trim() || null,
    contact_booking_email:
      String(formData.get("contact_booking_email") ?? "").trim() || null,
    contact_email_note: String(formData.get("contact_email_note") ?? "").trim() || null,
  };

  const { error } = await supabase.from("site_content").update(patch).eq("id", 1);
  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function updateAboutPageContent(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  await ensureSiteRow(supabase);

  const trustRaw = String(formData.get("about_trust_points") ?? "");
  const trust_points = trustRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const patch = {
    about_text: String(formData.get("about_text") ?? "").trim() || null,
    about_page_eyebrow: String(formData.get("about_page_eyebrow") ?? "").trim() || null,
    about_experience_title:
      String(formData.get("about_experience_title") ?? "").trim() || null,
    about_why_title: String(formData.get("about_why_title") ?? "").trim() || null,
    trust_eyebrow: String(formData.get("trust_eyebrow") ?? "").trim() || null,
    trust_title: String(formData.get("trust_title") ?? "").trim() || null,
    trust_intro: String(formData.get("trust_intro") ?? "").trim() || null,
    about_trust_points: trust_points,
  };

  const { error } = await supabase.from("site_content").update(patch).eq("id", 1);
  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function updateAboutBodyText(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  await ensureSiteRow(supabase);

  const about_text = String(formData.get("about_text") ?? "").trim() || null;

  const { error } = await supabase.from("site_content").update({ about_text }).eq("id", 1);
  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function updateAboutStoryParagraph(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  await ensureSiteRow(supabase);

  const section = String(formData.get("section") ?? "").trim();
  if (section !== "experience" && section !== "why") {
    return { error: "Invalid section" };
  }

  const text = String(formData.get("text") ?? "").trim();

  const { data: row, error: fetchErr } = await supabase
    .from("site_content")
    .select("about_text")
    .eq("id", 1)
    .maybeSingle();

  if (fetchErr) return { error: fetchErr.message };

  const { experience, why } = splitAboutExperienceWhy(row?.about_text ?? null);
  const nextExperience = section === "experience" ? text : experience;
  const nextWhy = section === "why" ? text : why;
  const merged = `${nextExperience.trim()}\n\n${nextWhy.trim()}`;
  const about_text = merged.trim() ? merged : null;

  const { error } = await supabase.from("site_content").update({ about_text }).eq("id", 1);
  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function updateContactPhones(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  await ensureSiteRow(supabase);

  const patch = {
    contact_phone_display:
      String(formData.get("contact_phone_display") ?? "").trim() || null,
    contact_phone_tel: String(formData.get("contact_phone_tel") ?? "").trim() || null,
    contact_whatsapp_url:
      String(formData.get("contact_whatsapp_url") ?? "").trim() || null,
    contact_booking_email:
      String(formData.get("contact_booking_email") ?? "").trim() || null,
  };

  const { error } = await supabase.from("site_content").update(patch).eq("id", 1);
  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function updateAboutTrustBlock(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  await ensureSiteRow(supabase);

  const trustRaw = String(formData.get("about_trust_points") ?? "");
  const about_trust_points = trustRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const patch = {
    trust_eyebrow: String(formData.get("trust_eyebrow") ?? "").trim() || null,
    trust_title: String(formData.get("trust_title") ?? "").trim() || null,
    trust_intro: String(formData.get("trust_intro") ?? "").trim() || null,
    about_trust_points,
  };

  const { error } = await supabase.from("site_content").update(patch).eq("id", 1);
  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function updateHomeValueFeatures(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  await ensureSiteRow(supabase);

  const featuresJson = String(formData.get("home_value_features_json") ?? "").trim();
  let parsed: unknown = [];
  if (featuresJson) {
    try {
      parsed = JSON.parse(featuresJson) as unknown;
    } catch {
      return { error: "Invalid features data" };
    }
  }

  const featuresCheck = homeValueFeaturesSchema.safeParse(parsed);
  if (!featuresCheck.success) {
    return { error: featuresCheck.error.issues.map((i) => i.message).join("; ") };
  }

  const patch = {
    home_value_headline: String(formData.get("home_value_headline") ?? "").trim() || null,
    home_value_features: featuresCheck.data,
  };

  const { error } = await supabase.from("site_content").update(patch).eq("id", 1);
  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function clearVanImage() {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  await ensureSiteRow(supabase);

  const { data: row } = await supabase
    .from("site_content")
    .select("van_image_url")
    .eq("id", 1)
    .maybeSingle();

  const prev = row?.van_image_url as string | null | undefined;
  await deleteMechanicAssetIfOwned(supabase, prev);

  const { error } = await supabase.from("site_content").update({ van_image_url: null }).eq("id", 1);
  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function updateHomeValueCta(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  await ensureSiteRow(supabase);

  const featuresJson = String(formData.get("home_value_features_json") ?? "").trim();
  let home_value_features: unknown = [];
  if (featuresJson) {
    try {
      home_value_features = JSON.parse(featuresJson) as unknown;
    } catch {
      return { error: "Invalid features JSON" };
    }
  }

  const patch = {
    home_value_headline: String(formData.get("home_value_headline") ?? "").trim() || null,
    van_image_url: String(formData.get("van_image_url") ?? "").trim() || null,
    home_value_features,
    cta_headline: String(formData.get("cta_headline") ?? "").trim() || null,
    cta_subtext: String(formData.get("cta_subtext") ?? "").trim() || null,
    cta_call_label: String(formData.get("cta_call_label") ?? "").trim() || null,
    cta_book_label: String(formData.get("cta_book_label") ?? "").trim() || null,
  };

  const { error } = await supabase.from("site_content").update(patch).eq("id", 1);
  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function uploadVanImage(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  const err = validateImage(file);
  if (err) return { error: err };

  await ensureSiteRow(supabase);

  const { data: prevRow } = await supabase
    .from("site_content")
    .select("van_image_url")
    .eq("id", 1)
    .maybeSingle();

  const ext = file!.name.split(".").pop() || "jpg";
  const path = `van/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file!, { contentType: file!.type });

  if (upErr) return { error: upErr.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  await deleteMechanicAssetIfOwned(supabase, prevRow?.van_image_url as string | undefined);

  const { error: dbErr } = await supabase
    .from("site_content")
    .update({ van_image_url: publicUrl })
    .eq("id", 1);

  if (dbErr) return { error: dbErr.message };
  revalidateCmsPaths();
  return { url: publicUrl };
}

export async function updateServicesPageContent(data: unknown) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = servicesPageContentSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join("; ") };
  }

  await ensureSiteRow(supabase);

  const { error } = await supabase
    .from("site_content")
    .update({ services_page_content: parsed.data })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

export async function resetServicesPageContent() {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  await ensureSiteRow(supabase);

  const fresh = buildDefaultServicesPageContent();
  const { error } = await supabase
    .from("site_content")
    .update({ services_page_content: fresh })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidateCmsPaths();
  return { ok: true };
}

/** Loads current row, merges with defaults, returns services JSON for admin editor. */
export async function loadServicesPageContentForAdmin(): Promise<{
  data: unknown;
  error?: string;
}> {
  const { supabase, user } = await requireUser();
  if (!user) return { data: null, error: "Unauthorized" };

  const { data: row } = await supabase
    .from("site_content")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const normalized = normalizeSiteRow(row as Record<string, unknown> | null);
  const parsed = servicesPageContentSchema.safeParse(normalized.services_page_content);
  const data = parsed.success ? parsed.data : buildDefaultServicesPageContent();
  return { data };
}

function parseBlogContentJson(raw: string): { ok: true; value: object } | { error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, value: { type: "doc", content: [] } };
  try {
    const v = JSON.parse(trimmed) as unknown;
    if (v && typeof v === "object" && (v as { type?: string }).type === "doc") {
      return { ok: true, value: v as object };
    }
    return { error: "Content must be a valid TipTap document" };
  } catch {
    return { error: "Invalid content JSON" };
  }
}

export async function uploadBlogImage(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  const err = validateImage(file);
  if (err) return { error: err };

  const ext = file!.name.split(".").pop() || "jpg";
  const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file!, { contentType: file!.type });

  if (upErr) return { error: upErr.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { url: publicUrl };
}

export async function createBlog(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const featured_image_url =
    String(formData.get("featured_image_url") ?? "").trim() || null;
  const published = formData.get("published") === "on" || formData.get("published") === "true";
  const contentRaw = String(formData.get("content_json") ?? "");

  if (!title) return { error: "Title is required" };
  if (!slug) return { error: "Slug is required" };

  const parsed = parseBlogContentJson(contentRaw);
  if ("error" in parsed) return { error: parsed.error };

  const excerpt = excerptFromTipTapJson(parsed.value);

  const { error } = await supabase.from("blogs").insert({
    title,
    slug,
    excerpt,
    featured_image_url,
    published,
    content: parsed.value,
  });

  if (error) {
    if (error.code === "23505") return { error: "That slug is already in use" };
    return { error: error.message };
  }

  revalidateBlogPaths(slug);
  return { ok: true as const, slug };
}

export async function updateBlog(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const featured_image_url =
    String(formData.get("featured_image_url") ?? "").trim() || null;
  const published = formData.get("published") === "on" || formData.get("published") === "true";
  const contentRaw = String(formData.get("content_json") ?? "");
  const previousSlug = String(formData.get("previous_slug") ?? "").trim();

  if (!id) return { error: "Missing post id" };
  if (!title) return { error: "Title is required" };
  if (!slug) return { error: "Slug is required" };

  const parsed = parseBlogContentJson(contentRaw);
  if ("error" in parsed) return { error: parsed.error };

  const excerpt = excerptFromTipTapJson(parsed.value);

  const { error } = await supabase
    .from("blogs")
    .update({
      title,
      slug,
      excerpt,
      featured_image_url,
      published,
      content: parsed.value,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "That slug is already in use" };
    return { error: error.message };
  }

  revalidateBlogPaths(slug);
  if (previousSlug && previousSlug !== slug) revalidateBlogPaths(previousSlug);
  return { ok: true as const, slug };
}

export async function deleteBlog(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const id = String(formData.get("id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!id) return { error: "Missing post id" };

  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateBlogPaths(slug);
  return { ok: true as const };
}

