import type { JSONContent } from "@tiptap/core";

/** Blog row from `public.blogs` (TipTap JSON in `content`). */
export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: JSONContent | Record<string, unknown>;
  featured_image_url: string | null;
  created_at: string;
  published: boolean;
};

export type BlogPost = BlogPostRow;
