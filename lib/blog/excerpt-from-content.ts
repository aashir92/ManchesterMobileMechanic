import type { JSONContent } from "@tiptap/core";

const DEFAULT_MAX = 200;

/** Plain-text excerpt from the start of a TipTap JSON document (for cards + meta). */
export function excerptFromTipTapJson(doc: unknown, maxLen = DEFAULT_MAX): string {
  const parts: string[] = [];

  function walk(node: unknown): void {
    if (parts.join("").length >= maxLen + 80) return;
    if (!node || typeof node !== "object") return;
    const n = node as JSONContent;
    if (n.type === "text" && typeof n.text === "string") {
      parts.push(n.text);
      return;
    }
    if (Array.isArray(n.content)) {
      for (const c of n.content) walk(c);
    }
  }

  walk(doc);

  const s = parts.join("").replace(/\s+/g, " ").trim();
  if (!s) return "";
  if (s.length <= maxLen) return s;

  const slice = s.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > maxLen * 0.5 ? lastSpace : maxLen;
  return `${s.slice(0, cut).trim()}…`;
}
