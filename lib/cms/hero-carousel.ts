export type HeroSlideRow = { url: string; visible?: boolean };

/** Parse DB jsonb: legacy string[] or { url, visible? }[] */
export function normalizeHeroCarouselJson(raw: unknown): HeroSlideRow[] {
  if (!Array.isArray(raw)) return [];
  const out: HeroSlideRow[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const url = item.trim();
      if (url) out.push({ url, visible: true });
      continue;
    }
    if (item && typeof item === "object" && "url" in item) {
      const url = String((item as { url: unknown }).url ?? "").trim();
      if (!url) continue;
      const vis = (item as { visible?: unknown }).visible;
      const visible = vis === false ? false : true;
      out.push({ url, visible });
    }
  }
  return out;
}

export function heroSlidesToPublicUrls(slides: HeroSlideRow[]): string[] {
  return slides
    .filter((s) => s.visible !== false)
    .map((s) => s.url.trim())
    .filter(Boolean);
}

export function slideUrlStrings(slides: HeroSlideRow[]): string[] {
  return slides.map((s) => s.url);
}
