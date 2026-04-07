import { PublicShell } from "@/components/layout/public-shell";
import { ContactSection } from "@/components/sections/contact-section";
import { MapSection } from "@/components/sections/map-section";
import { getPublicAuth } from "@/lib/auth/public-session";
import { fetchLandingData } from "@/lib/data/fetch-landing";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [{ isAdmin }, { publicContent }] = await Promise.all([
    getPublicAuth(),
    fetchLandingData(),
  ]);

  return (
    <PublicShell isAdmin={isAdmin} contact={publicContent.contact}>
      <main className="relative pt-16">
        <ContactSection
          key={`${publicContent.contact.phone_display}|${publicContent.contact.phone_tel}|${publicContent.contact.whatsapp_url}|${publicContent.contact.booking_email}`}
          contact={publicContent.contact}
          isAdmin={isAdmin}
        />
        <MapSection />
      </main>
    </PublicShell>
  );
}
