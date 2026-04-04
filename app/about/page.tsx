import { PublicShell } from "@/components/layout/public-shell";
import { AboutStorySections } from "@/components/sections/about-story-sections";
import { getPublicAuth } from "@/lib/auth/public-session";
import { fetchLandingData } from "@/lib/data/fetch-landing";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [{ isAdmin }, { publicContent }] = await Promise.all([
    getPublicAuth(),
    fetchLandingData(),
  ]);

  return (
    <PublicShell isAdmin={isAdmin} contact={publicContent.contact}>
      <main className="relative pt-16">
        <AboutStorySections
          key={publicContent.about_text ?? "__about__"}
          aboutText={publicContent.about_text}
          about={publicContent.about}
          isAdmin={isAdmin}
        />
      </main>
    </PublicShell>
  );
}
