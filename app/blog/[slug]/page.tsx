import { PublicShell } from "@/components/layout/public-shell";
import { getPublicAuth } from "@/lib/auth/public-session";
import { blogContentToHtml } from "@/lib/blog/html";
import { getPostBySlug } from "@/lib/data/fetch-blog";
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
  const [{ isAdmin }, post, { publicContent }] = await Promise.all([
    getPublicAuth(),
    getPostBySlug(slug),
    fetchLandingData(),
  ]);

  if (!post) notFound();

  const bodyHtml = blogContentToHtml(post.content);

  return (
    <PublicShell isAdmin={isAdmin} contact={publicContent.contact}>
      <main className="relative pb-24 pt-20">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 pb-6">
          <Link
            href="/blog"
            className="shrink-0 text-sm font-semibold text-[#083D6B] hover:underline"
          >
            ← Back to blogs
          </Link>
          {isAdmin ? (
            <Link
              href={`/blog/${post.slug}/edit`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold text-[#083D6B] shadow-md backdrop-blur-md transition hover:bg-white/35"
            >
              Edit article
            </Link>
          ) : null}
        </div>
        <article className="mx-auto max-w-3xl px-6">
          {post.featured_image_url ? (
            <div className="relative mb-10 aspect-[2/1] overflow-hidden rounded-2xl border border-black/10 shadow-sm">
              <Image
                src={post.featured_image_url}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width:768px) 100vw, 768px"
              />
            </div>
          ) : null}

          <header className="mb-8">
            <p className="text-sm font-medium uppercase tracking-wide text-[#42474f]">
              {formatDate(post.created_at)}
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-montserrat)] text-3xl font-bold text-[#083D6B] md:text-4xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-4 text-lg text-[#42474f]">{post.excerpt}</p>
            ) : null}
          </header>

          <div
            className="prose prose-lg max-w-none prose-headings:text-[#083D6B] prose-a:text-[#083D6B] prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </article>
      </main>
    </PublicShell>
  );
}
