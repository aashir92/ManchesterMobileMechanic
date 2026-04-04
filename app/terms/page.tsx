import { LegalDocument, LegalList, LegalSection, LegalSubheading } from "@/components/legal/legal-document";
import { PublicShell } from "@/components/layout/public-shell";
import { getPublicAuth } from "@/lib/auth/public-session";
import { fetchLandingData } from "@/lib/data/fetch-landing";
import Link from "next/link";

export const dynamic = "force-dynamic";

const LAST_UPDATED = "5 April 2026";

export default async function TermsPage() {
  const [{ isAdmin }, { publicContent }] = await Promise.all([
    getPublicAuth(),
    fetchLandingData(),
  ]);
  const phone = publicContent.contact.phone_display;

  return (
    <PublicShell isAdmin={isAdmin} contact={publicContent.contact}>
      <main className="relative pt-16">
        <LegalDocument title="Terms of Service" lastUpdated={LAST_UPDATED}>
          <LegalSection title="Agreement to these terms">
            <p>
              By accessing or using the Manchester Mobile Mechanic website (the “Site”), you agree to these
              Terms of Service. If you do not agree, please do not use the Site. We may change these terms;
              the “Last updated” date shows when they were last revised. Your continued use after changes
              constitutes acceptance of the updated terms where permitted by law.
            </p>
          </LegalSection>

          <LegalSection title="About the Site">
            <p>
              The Site provides general information about our mobile mechanic services, coverage in Manchester
              and surrounding areas, and ways to contact us. Content is for information only and may be updated
              without notice. We aim to keep information accurate but do not guarantee that all content is
              complete or current at all times.
            </p>
          </LegalSection>

          <LegalSection title="Services, quotes, and contracts">
            <p>
              Descriptions of services, prices, and examples on the Site are illustrative. A binding agreement
              for work on your vehicle is formed only when you and we have clearly agreed scope, price (where
              applicable), timing, and location—not merely by submitting a form or sending a message.
            </p>
            <p>
              We reserve the right to decline work that is unsafe, unlawful, or outside our expertise or
              coverage area. Any specific terms for a job (including cancellation or warranty) will be agreed
              with you directly.
            </p>
          </LegalSection>

          <LegalSection title="Use of the Site">
            <p>You agree not to:</p>
            <LegalList
              items={[
                "Use the Site in any way that breaks the law or infringes others’ rights.",
                "Attempt to gain unauthorised access to our systems, admin areas, or other users’ data.",
                "Introduce malware, overload our infrastructure, or scrape the Site in a way that harms performance.",
                "Use automated means to submit forms or contact us in a misleading or abusive manner.",
              ]}
            />
            <p>We may suspend or block access where we reasonably believe these rules are breached.</p>
          </LegalSection>

          <LegalSection title="Intellectual property">
            <p>
              The Site’s design, text, graphics, logos, and other materials are owned by us or our licensors
              and are protected by copyright and other intellectual property laws. You may view and print
              pages for personal, non-commercial use. You may not copy, modify, distribute, or create
              derivative works from the Site without our prior written consent, except as allowed by law.
            </p>
          </LegalSection>

          <LegalSection title="Limitation of liability">
            <p>
              To the fullest extent permitted by applicable law, we are not liable for any indirect,
              consequential, or special loss arising from your use of the Site or reliance on its content.
            </p>
            <p>
              Nothing in these terms excludes or limits liability for death or personal injury caused by
              negligence, fraud, or any other liability that cannot be excluded under English law. Any dispute
              relating to work we carry out on a vehicle may be subject to separate terms agreed at the time
              of service.
            </p>
          </LegalSection>

          <LegalSection title="Third-party links and services">
            <p>
              The Site may link to third parties (for example WhatsApp or map providers). Those services have
              their own terms and privacy policies. We are not responsible for third-party content or practices.
            </p>
          </LegalSection>

          <LegalSection title="Privacy">
            <p>
              Our use of personal data is described in our{" "}
              <Link href="/privacy" className="font-semibold text-[#083D6B] underline decoration-[#E6B31E] decoration-2 underline-offset-2 hover:text-[#E6B31E]">
                Privacy Policy
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection title="Governing law and disputes">
            <p>
              These terms are governed by the laws of <strong>England and Wales</strong>. The courts of
              England and Wales will have exclusive jurisdiction over disputes arising from these terms or use
              of the Site, subject to any mandatory rights you have as a consumer.
            </p>
          </LegalSection>

          <LegalSection title="Contact">
            <LegalSubheading>Questions about these terms</LegalSubheading>
            <p>
              Contact us via the <Link href="/contact">Contact</Link> page, call <strong>{phone}</strong>, or
              use WhatsApp as shown on the Site.
            </p>
          </LegalSection>
        </LegalDocument>
      </main>
    </PublicShell>
  );
}
