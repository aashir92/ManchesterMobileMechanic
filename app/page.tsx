import { PublicShell } from "@/components/layout/public-shell";
import { CtaSection } from "@/components/sections/cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesFullSection } from "@/components/sections/services-full-section";
import { ValueSection } from "@/components/sections/value-section";
import { getPublicAuth } from "@/lib/auth/public-session";
import { fetchLandingData } from "@/lib/data/fetch-landing";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ isAdmin }, { publicContent, siteContent }] = await Promise.all([
    getPublicAuth(),
    fetchLandingData(),
  ]);
  const c = publicContent;

  return (
    <PublicShell isAdmin={isAdmin} contact={c.contact}>
      <main className="relative">
        <HeroSection
          headline={c.hero_h1}
          subhead={c.hero_subhead}
          heroImageUrls={c.hero_image_urls}
          phoneTel={c.contact.phone_tel}
          editorSite={isAdmin ? siteContent : null}
        />
        <ServicesFullSection
          variant="home"
          servicesPage={c.services_page}
          isAdmin={isAdmin}
        />
        <ValueSection
          headline={c.home_value.headline}
          features={c.home_value.features}
          vanImageUrl={c.home_value.van_image_url}
          isAdmin={isAdmin}
        />
        <CtaSection
          headline={c.cta.headline}
          subtext={c.cta.subtext}
          callLabel={c.cta.call_label}
          bookLabel={c.cta.book_label}
          phoneTel={c.cta.phone_tel}
        />
      </main>
    </PublicShell>
  );
}
