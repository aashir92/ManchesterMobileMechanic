"use client";

import { deleteBlog } from "@/app/admin/actions";
import type { BlogPostRow } from "@/lib/types/blog";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function BlogPostCard({ post, isAdmin }: { post: BlogPostRow; isAdmin: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  async function onDelete() {
    if (!confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setErr(null);
    const fd = new FormData();
    fd.set("id", post.id);
    fd.set("slug", post.slug);
    startTransition(async () => {
      const res = await deleteBlog(fd);
      if ("error" in res && res.error) {
        setErr(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[16/10] bg-[#f4f5f7]">
          {post.featured_image_url ? (
            <Image
              src={post.featured_image_url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#083D6B]/10 to-[#E6B31E]/10 text-sm text-[#42474f]">
              No image
            </div>
          )}
          {!post.published ? (
            <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
              Draft
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <time className="text-xs font-medium uppercase tracking-wide text-[#42474f]">
            {formatDate(post.created_at)}
          </time>
          <h2 className="mt-2 font-[family-name:var(--font-montserrat)] text-lg font-bold text-[#083D6B] group-hover:underline">
            {post.title}
          </h2>
          {post.excerpt ? (
            <p className="mt-2 line-clamp-3 flex-1 text-sm text-[#42474f]">{post.excerpt}</p>
          ) : null}
          <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#E6B31E]">
            Read more →
          </span>
        </div>
      </Link>

      {isAdmin ? (
        <div className="pointer-events-none absolute inset-0 flex items-start justify-end gap-2 p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href={`/blog/${post.slug}/edit`}
            className="pointer-events-auto z-10 rounded-full border border-white/40 bg-white/20 p-2.5 text-[#083D6B] shadow backdrop-blur-md hover:bg-white/40"
            aria-label="Edit article"
            onClick={(e) => e.stopPropagation()}
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            disabled={pending}
            onClick={(e) => {
              e.stopPropagation();
              void onDelete();
            }}
            className="pointer-events-auto z-10 rounded-full border border-white/40 bg-white/20 p-2.5 text-red-700 shadow backdrop-blur-md hover:bg-red-50 disabled:opacity-50"
            aria-label="Delete article"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {err ? (
        <p className="px-5 pb-3 text-xs text-red-700" role="alert">
          {err}
        </p>
      ) : null}
    </article>
  );
}
