import { PublicShell } from "@/components/layout/public-shell";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { getPublicAuth } from "@/lib/auth/public-session";
import { getPublishedPosts } from "@/lib/data/fetch-blog";
import { fetchLandingData } from "@/lib/data/fetch-landing";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Manchester Mobile Mechanic",
  description:
    "Tips, updates, and stories from your Manchester mobile mechanic — servicing, repairs, and keeping you on the road.",
};

export default async function BlogPage() {
  const [{ isAdmin }, posts, { publicContent }] = await Promise.all([
    getPublicAuth(),
    getPublishedPosts(),
    fetchLandingData(),
  ]);

  return (
    <PublicShell isAdmin={isAdmin} contact={publicContent.contact}>
      <main className="relative min-h-screen pt-20 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <header className={`text-center ${isAdmin ? "mb-6" : "mb-12"}`}>
            <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold text-[#083D6B] md:text-5xl">
              Blog
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[#42474f]">
              News, maintenance tips, and updates from Manchester Mobile Mechanic.
            </p>
          </header>

          {isAdmin ? (
            <div className="mb-3 flex justify-end sm:mb-4">
              <Link
                href="/blog/new"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold text-[#083D6B] shadow-md backdrop-blur-md transition hover:bg-white/35"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add article
              </Link>
            </div>
          ) : null}

          {posts.length === 0 ? (
            <p className="text-center text-[#42474f]">No articles yet. Check back soon.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} isAdmin={isAdmin} />
              ))}
            </div>
          )}
        </div>
      </main>
    </PublicShell>
  );
}
