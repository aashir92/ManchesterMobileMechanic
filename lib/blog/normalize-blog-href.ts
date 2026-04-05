/**
 * Normalize and validate hrefs for blog links. Rejects incomplete URLs like "https:".
 * Allows site paths (/contact), http(s) URLs, mailto:, tel:.
 */
export function normalizeBlogHref(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;

  if (t.startsWith("mailto:") && t.length > 7) return t;
  if (t.startsWith("tel:") && t.length > 4) return t;

  if (t.startsWith("/")) {
    if (t.startsWith("//")) return null;
    return t;
  }

  let candidate = t;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(t)) {
    candidate = `https://${t}`;
  }

  try {
    const u = new URL(candidate);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname || u.hostname.length < 1) return null;
    return u.toString();
  } catch {
    return null;
  }
}
