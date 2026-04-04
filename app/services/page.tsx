import { PublicShell } from "@/components/layout/public-shell";
import { ServicesFullSection } from "@/components/sections/services-full-section";
import { getPublicAuth } from "@/lib/auth/public-session";
import { fetchLandingData } from "@/lib/data/fetch-landing";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [{ isAdmin }, { publicContent }] = await Promise.all([
    getPublicAuth(),
    fetchLandingData(),
  ]);

  return (
    <PublicShell isAdmin={isAdmin} contact={publicContent.contact}>
      <main className="relative bg-gradient-to-b from-[#cfd9e6] via-[#e8eef5] to-[#dce6f0] pt-16">
        <ServicesFullSection
          variant="full"
          servicesPage={publicContent.services_page}
          isAdmin={isAdmin}
        />
      </main>
    </PublicShell>
  );
}
