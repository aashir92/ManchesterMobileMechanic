import { BlogEditorForm } from "@/components/blog/blog-editor-form";
import { PublicShell } from "@/components/layout/public-shell";
import { getPublicAuth } from "@/lib/auth/public-session";
import { getPostBySlug } from "@/lib/data/fetch-blog";
import { fetchLandingData } from "@/lib/data/fetch-landing";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function EditBlogPage({ params }: Props) {
  const { slug } = await params;
  const [{ isAdmin }, post, { publicContent }] = await Promise.all([
    getPublicAuth(),
    getPostBySlug(slug),
    fetchLandingData(),
  ]);

  if (!isAdmin) {
    redirect(`/admin/login?next=${encodeURIComponent(`/blog/${slug}/edit`)}`);
  }

  if (!post) notFound();

  return (
    <PublicShell isAdmin={isAdmin} contact={publicContent.contact}>
      <main className="relative min-h-screen px-6 pb-24 pt-24">
        <div className="mb-6 flex flex-wrap gap-4">
          <Link
            href="/blog"
            className="text-sm font-semibold text-[#083D6B] hover:underline"
          >
            ← Back to blogs
          </Link>
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-semibold text-[#083D6B] hover:underline"
          >
            View article
          </Link>
        </div>
        <BlogEditorForm mode="edit" initial={post} />
      </main>
    </PublicShell>
  );
}
