import { BlogEditorForm } from "@/components/blog/blog-editor-form";
import { PublicShell } from "@/components/layout/public-shell";
import { getPublicAuth } from "@/lib/auth/public-session";
import { fetchLandingData } from "@/lib/data/fetch-landing";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const [{ isAdmin }, { publicContent }] = await Promise.all([
    getPublicAuth(),
    fetchLandingData(),
  ]);

  if (!isAdmin) {
    redirect("/admin/login?next=/blog/new");
  }

  return (
    <PublicShell isAdmin={isAdmin} contact={publicContent.contact}>
      <main className="relative min-h-screen px-6 pb-24 pt-24">
        <div className="mb-6">
          <Link
            href="/blog"
            className="text-sm font-semibold text-[#083D6B] hover:underline"
          >
            ← Back to blogs
          </Link>
        </div>
        <BlogEditorForm mode="create" />
      </main>
    </PublicShell>
  );
}
