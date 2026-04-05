import type { BlogPostRow } from "@/lib/types/blog";
import Image from "next/image";
import Link from "next/link";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogRelatedSection({ posts }: { posts: BlogPostRow[] }) {
  if (posts.length < 1) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="border-t border-black/10 bg-[#F4F5F7] py-14 md:py-20"
    >
      <div className="mx-auto max-w-[1920px] px-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
        <h2
          id="related-heading"
          className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-[#083D6B] md:text-3xl"
        >
          You may also like
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F5F7]">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-[#083D6B]/40">
                    No image
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <time
                  dateTime={post.created_at}
                  className="text-xs font-medium uppercase tracking-wide text-[#083D6B]/60"
                >
                  {formatDate(post.created_at)}
                </time>
                <h3 className="mt-2 line-clamp-2 font-[family-name:var(--font-montserrat)] text-base font-bold text-[#083D6B] group-hover:text-[#E6B31E]">
                  {post.title}
                </h3>
                {post.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-sm text-[#083D6B]/80">
                    {post.excerpt}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 flex justify-center md:justify-end">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full border-2 border-[#E6B31E] px-5 py-2.5 text-sm font-semibold text-[#083D6B] transition-colors hover:bg-[#E6B31E]/10"
          >
            View more articles
          </Link>
        </div>
      </div>
    </section>
  );
}
