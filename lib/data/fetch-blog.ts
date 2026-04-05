import { createClient } from "@/lib/supabase/server";
import type { BlogPostRow } from "@/lib/types/blog";

function mapRow(row: Record<string, unknown>): BlogPostRow {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    excerpt: String(row.excerpt ?? ""),
    content: (row.content as BlogPostRow["content"]) ?? { type: "doc", content: [] },
    featured_image_url: (row.featured_image_url as string | null) ?? null,
    created_at: String(row.created_at ?? ""),
    published: Boolean(row.published),
  };
}

/** Lists posts visible to the current session (published only for anon; all for authenticated). */
export async function getPublishedPosts(): Promise<BlogPostRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, title, slug, excerpt, content, featured_image_url, created_at, published",
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => mapRow(row as Record<string, unknown>));
}

export async function getPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, title, slug, excerpt, content, featured_image_url, created_at, published",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}
