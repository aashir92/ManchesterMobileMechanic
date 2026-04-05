import { BlogArticleAside } from "@/components/blog/blog-article-aside";
import { BlogCtaStrip } from "@/components/blog/blog-cta-strip";
import { BlogHeroMotion, FadeIn, Reveal } from "@/components/blog/blog-motion";
import { BlogRelatedSection } from "@/components/blog/blog-related-section";
import { PublicShell } from "@/components/layout/public-shell";
import { getPublicAuth } from "@/lib/auth/public-session";
import { blogContentToHtml } from "@/lib/blog/html";
import { getPostBySlug, getRelatedPosts } from "@/lib/data/fetch-blog";
import { fetchLandingData } from "@/lib/data/fetch-landing";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: "Blog | Manchester Mobile Mechanic",
    };
  }
  return {
    title: `${post.title} | Manchester Mobile Mechanic`,
    description: post.excerpt?.trim() || `Read ${post.title} on the Manchester Mobile Mechanic blog.`,
    openGraph: post.featured_image_url
      ? { images: [{ url: post.featured_image_url }] }
      : undefined,
  };
}

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

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const [{ isAdmin }, post, { publicContent }, relatedPosts] = await Promise.all([
    getPublicAuth(),
    getPostBySlug(slug),
    fetchLandingData(),
    getRelatedPosts(slug, 3),
  ]);

  if (!post) notFound();

  const bodyHtml = blogContentToHtml(post.content);

  return (
    <PublicShell isAdmin={isAdmin} contact={publicContent.contact}>
      <main className="relative">
        <div className="bg-white pb-16 pt-20">
          {/* Wide shell on PC + sidebar so space is used intentionally; text stays left-aligned with a wider measure than typography’s default 65ch. */}
          <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
            {/* Toolbar full-width so the xl grid row aligns sidebar top with hero (not with this row). */}
            <FadeIn>
              <div className="flex items-center justify-between gap-4 pb-6">
                <Link
                  href="/blog"
                  className="inline-flex h-9 shrink-0 items-center text-sm font-semibold text-[#083D6B] hover:underline"
                >
                  ← Back to blogs
                </Link>
                {isAdmin ? (
                  <Link
                    href={`/blog/${post.slug}/edit`}
                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold leading-none text-[#083D6B] shadow-md backdrop-blur-md transition hover:bg-white/35"
                  >
                    Edit article
                  </Link>
                ) : null}
              </div>
            </FadeIn>

            <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_min(300px,26vw)] xl:gap-12 xl:items-start">
              <div className="min-w-0">
                {post.featured_image_url ? (
                  <BlogHeroMotion className="pb-6 lg:pb-7">
                    <div className="w-full max-w-5xl 2xl:max-w-6xl">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/10 shadow-sm sm:aspect-[3/2] xl:rounded-3xl">
                        <Image
                          src={post.featured_image_url}
                          alt=""
                          fill
                          priority
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 100vw, (max-width: 1536px) 70vw, 1152px"
                        />
                      </div>
                    </div>
                  </BlogHeroMotion>
                ) : null}

                <FadeIn delay={post.featured_image_url ? 0.1 : 0.04}>
                  <article className="w-full max-w-[min(96ch,100%)] text-left">
                    <header className="mb-6 lg:mb-8">
                      <p className="text-sm font-medium uppercase tracking-wide text-[#42474f]">
                        {formatDate(post.created_at)}
                      </p>
                      <h1 className="mt-2 max-w-[40ch] font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-snug text-[#083D6B] sm:max-w-none sm:text-3xl md:text-[1.75rem] md:leading-tight">
                        {post.title}
                      </h1>
                      {post.excerpt ? (
                        <p className="mt-3 max-w-none text-base leading-relaxed text-[#42474f] md:mt-4 md:text-[1.05rem]">
                          {post.excerpt}
                        </p>
                      ) : null}
                    </header>

                    <div
                      className="blog-article-prose prose prose-sm sm:prose-base prose-headings:text-[#083D6B] prose-a:text-[#083D6B] prose-img:rounded-xl prose-p:leading-relaxed prose-headings:font-semibold md:prose-base"
                      dangerouslySetInnerHTML={{ __html: bodyHtml }}
                    />
                  </article>
                </FadeIn>
              </div>

              <BlogArticleAside />
            </div>
          </div>
        </div>
        <Reveal>
          <BlogRelatedSection posts={relatedPosts} />
        </Reveal>
        <Reveal delay={0.08}>
          <BlogCtaStrip />
        </Reveal>
      </main>
    </PublicShell>
  );
}
