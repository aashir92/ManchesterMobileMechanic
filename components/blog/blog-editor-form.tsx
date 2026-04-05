"use client";

import { createBlog, updateBlog, uploadBlogImage } from "@/app/admin/actions";
import type { BlogPostRow } from "@/lib/types/blog";
import type { JSONContent } from "@tiptap/core";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type FormEvent } from "react";
import { RichTextEditor } from "./rich-text-editor";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function initialContent(c: BlogPostRow["content"] | undefined): JSONContent {
  if (c && typeof c === "object" && (c as JSONContent).type === "doc") {
    return c as JSONContent;
  }
  return { type: "doc", content: [] };
}

export function BlogEditorForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: BlogPostRow;
}) {
  const router = useRouter();
  const featuredFileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!initial);
  const [featuredUrl, setFeaturedUrl] = useState(initial?.featured_image_url ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [content, setContent] = useState<JSONContent>(() => initialContent(initial?.content));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugManual) setSlug(slugify(v));
  }

  function onSlugChange(v: string) {
    setSlugManual(true);
    setSlug(v);
  }

  async function onFeaturedFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadBlogImage(fd);
    if ("error" in res && res.error) {
      setError(res.error);
      return;
    }
    if ("url" in res && res.url) setFeaturedUrl(res.url);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    if (mode === "edit" && initial) {
      fd.set("id", initial.id);
      fd.set("previous_slug", initial.slug);
    }
    fd.set("title", title);
    fd.set("slug", slug.trim());
    fd.set("featured_image_url", featuredUrl.trim());
    if (published) fd.set("published", "on");
    fd.set("content_json", JSON.stringify(content));

    startTransition(async () => {
      const res = mode === "create" ? await createBlog(fd) : await updateBlog(fd);
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      if ("slug" in res && res.slug) {
        router.push(`/blog/${res.slug}`);
        router.refresh();
      }
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-[#083D6B]">
          {mode === "create" ? "New article" : "Edit article"}
        </h1>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#083D6B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#062f55] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <label className="block text-sm font-medium text-[#42474f]">
        Title
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2"
          required
        />
      </label>

      <label className="block text-sm font-medium text-[#42474f]">
        Slug
        <input
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 font-mono text-sm"
          required
        />
      </label>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-[#42474f]">Featured image</span>
        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-[200px] flex-1 text-sm text-[#42474f]">
            URL
            <input
              value={featuredUrl}
              onChange={(e) => setFeaturedUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 font-mono text-sm"
              placeholder="https://…"
            />
          </label>
          <button
            type="button"
            onClick={() => featuredFileRef.current?.click()}
            className="rounded-lg border border-[#083D6B]/40 bg-white/20 px-4 py-2 text-sm font-semibold text-[#083D6B] backdrop-blur-md hover:bg-[#083D6B]/10"
          >
            Upload
          </button>
          <input
            ref={featuredFileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFeaturedFile}
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#42474f]">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-black/20"
        />
        Published
      </label>

      <div>
        <span className="mb-2 block text-sm font-medium text-[#42474f]">Body</span>
        <RichTextEditor content={content} onChange={setContent} />
      </div>
    </form>
  );
}
