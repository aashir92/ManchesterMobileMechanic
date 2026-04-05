import { AnimatedBlogGrid } from "@/components/blog/animated-blog-grid";
import { FadeIn } from "@/components/blog/blog-motion";
import { PublicShell } from "@/components/layout/public-shell";
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
      <main className="relative min-h-screen bg-[#F4F5F7] pt-20 pb-24">
        <div className="mx-auto max-w-[90rem] px-6 xl:px-10">
          <FadeIn>
            <header
              className={`text-center ${isAdmin ? "mb-6" : "mb-12 md:mb-14 xl:mb-16"}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E6B31E]">
                Insights & tips
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-montserrat)] text-4xl font-bold text-[#083D6B] md:text-5xl">
                Blog
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-[#42474f]">
                News, maintenance tips, and updates from Manchester Mobile Mechanic.
              </p>
            </header>
          </FadeIn>

          {isAdmin ? (
            <FadeIn delay={0.06}>
              <div className="mb-3 flex justify-end sm:mb-4">
                <Link
                  href="/blog/new"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold text-[#083D6B] shadow-md backdrop-blur-md transition hover:bg-white/35"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Add article
                </Link>
              </div>
            </FadeIn>
          ) : null}

          {posts.length === 0 ? (
            <FadeIn delay={0.1}>
              <p className="text-center text-[#42474f]">No articles yet. Check back soon.</p>
            </FadeIn>
          ) : (
            <AnimatedBlogGrid posts={posts} isAdmin={isAdmin} />
          )}
        </div>
      </main>
    </PublicShell>
  );
}
