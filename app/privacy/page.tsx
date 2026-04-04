import { LegalDocument, LegalList, LegalSection, LegalSubheading } from "@/components/legal/legal-document";
import { PublicShell } from "@/components/layout/public-shell";
import { getPublicAuth } from "@/lib/auth/public-session";
import { fetchLandingData } from "@/lib/data/fetch-landing";
import Link from "next/link";

export const dynamic = "force-dynamic";

const LAST_UPDATED = "5 April 2026";

export default async function PrivacyPage() {
  const [{ isAdmin }, { publicContent }] = await Promise.all([
    getPublicAuth(),
    fetchLandingData(),
  ]);
  const phone = publicContent.contact.phone_display;

  return (
    <PublicShell isAdmin={isAdmin} contact={publicContent.contact}>
      <main className="relative pt-16">
        <LegalDocument title="Privacy Policy" lastUpdated={LAST_UPDATED}>
          <LegalSection title="Introduction">
            <p>
              Manchester Mobile Mechanic (“we”, “us”, “our”) respects your privacy. This policy explains how
              we collect, use, and protect personal information when you use our website (including booking
              and contact features) and when you communicate with us by phone or WhatsApp.
            </p>
            <p>
              This website is operated for the purpose of promoting and arranging mobile vehicle repair and
              related services in Manchester and surrounding areas.
            </p>
          </LegalSection>

          <LegalSection title="Who is responsible for your information?">
            <p>
              For the purposes of UK data protection law, the data controller is{" "}
              <strong>Manchester Mobile Mechanic</strong>. If you trade under a registered company name, you
              may wish to update this page to state the full legal entity name and company number.
            </p>
          </LegalSection>

          <LegalSection title="What information we collect">
            <LegalSubheading>When you browse our website</LegalSubheading>
            <p>
              We do not require you to create an account to view our site. Standard server and hosting logs
              (for example IP address, browser type, and pages visited) may be processed by our hosting
              provider to deliver the site securely and reliably.
            </p>
            <LegalSubheading>When you contact us</LegalSubheading>
            <p>
              If you use our <Link href="/contact">contact or booking form</Link>, we collect the details you
              submit (such as name, email address, phone number, vehicle or service details, and your
              message). Form submissions are processed by our form provider (Formspree) and delivered to us so
              we can respond.
            </p>
            <p>
              If you call us on <strong>{phone}</strong> or message us via WhatsApp, we will handle your
              phone number, messages, and any other information you choose to share as part of providing
              quotes and services.
            </p>
            <LegalSubheading>Admin access to the website</LegalSubheading>
            <p>
              Authorised staff who log in to the site’s admin area use a secure authentication service
              (Supabase). This involves processing account credentials and session data necessary to operate
              the site content. Visitors to the public site are not asked to sign in.
            </p>
          </LegalSection>

          <LegalSection title="How we use your information">
            <LegalList
              items={[
                "To respond to enquiries, provide quotes, and arrange appointments.",
                "To deliver mobile mechanic services you have requested.",
                "To improve our website and understand how it is used (where permitted by law).",
                "To comply with legal obligations (for example record-keeping or responding to lawful requests).",
                "To protect our business, website, and users from fraud or misuse.",
              ]}
            />
          </LegalSection>

          <LegalSection title="Legal bases for processing (UK GDPR)">
            <p>Depending on the activity, we rely on one or more of the following:</p>
            <LegalList
              items={[
                "Performance of a contract or steps taken at your request before entering a contract (for example arranging a visit).",
                "Legitimate interests in running our business, responding to enquiries, and maintaining our website—balanced against your rights.",
                "Consent, where we ask for it (for example for certain cookies or marketing, if offered).",
                "Legal obligation, where the law requires us to process data.",
              ]}
            />
          </LegalSection>

          <LegalSection title="Sharing your information">
            <p>We do not sell your personal data. We may share information with:</p>
            <LegalList
              items={[
                "Service providers who help us operate the website and forms (for example Formspree, hosting on Vercel, authentication and database services via Supabase).",
                "Professional advisers where required (for example accountants or lawyers).",
                "Authorities when required by law or to protect rights and safety.",
              ]}
            />
            <p>
              These providers act under contract and may only use your data for the services they provide to
              us. Some may process data outside the UK; where they do, we expect appropriate safeguards (such
              as standard contractual clauses) where required by law.
            </p>
          </LegalSection>

          <LegalSection title="How long we keep information">
            <p>
              We keep contact and enquiry data only as long as needed to handle your request, provide
              services, resolve disputes, and meet legal or accounting requirements. Retention periods vary
              depending on the nature of the data and our obligations.
            </p>
          </LegalSection>

          <LegalSection title="Your rights">
            <p>Under UK data protection law you may have the right to:</p>
            <LegalList
              items={[
                "Access a copy of your personal data.",
                "Correct inaccurate data.",
                "Request erasure in certain circumstances.",
                "Restrict or object to processing in certain circumstances.",
                "Data portability where applicable.",
                "Withdraw consent where processing is based on consent.",
                "Lodge a complaint with the Information Commissioner’s Office (ICO) at ico.org.uk.",
              ]}
            />
            <p>
              To exercise these rights, contact us using the details on our{" "}
              <Link href="/contact">Contact</Link> page or call <strong>{phone}</strong>.
            </p>
          </LegalSection>

          <LegalSection title="Cookies and similar technologies">
            <p>
              Our site may use cookies or similar technologies that are strictly necessary for the website or
              admin authentication to function. We do not use intrusive advertising cookies on the public
              pages described here; if we add optional analytics or marketing tools in future, we will update
              this policy and, where required, ask for your consent.
            </p>
          </LegalSection>

          <LegalSection title="Children">
            <p>
              Our services and website are aimed at adults booking vehicle work. We do not knowingly collect
              personal data from children. If you believe we have done so, please contact us and we will delete
              it where appropriate.
            </p>
          </LegalSection>

          <LegalSection title="Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. The “Last updated” date at the top will
              change when we do. Please review this page periodically. Continued use of the site after
              changes means you accept the updated policy where the law allows.
            </p>
          </LegalSection>

          <LegalSection title="Contact">
            <p>
              Questions about this policy or your data: use our <Link href="/contact">Contact</Link> page,
              call <strong>{phone}</strong>, or reach us via the WhatsApp link on the site.
            </p>
          </LegalSection>
        </LegalDocument>
      </main>
    </PublicShell>
  );
}
