import type { ReactNode } from "react";
import { SiteEditModeProvider } from "@/components/admin/inline/site-edit-mode-provider";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import type { ContactBlockPublic } from "@/lib/cms/merge-site-content";

export function PublicShell({
  isAdmin = false,
  contact,
  children,
}: {
  isAdmin?: boolean;
  contact: ContactBlockPublic;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar isAdmin={isAdmin} contact={contact} />
      <SiteEditModeProvider isAdmin={isAdmin}>{children}</SiteEditModeProvider>
      <Footer contact={contact} />
      {!isAdmin ? <WhatsAppFab whatsappUrl={contact.whatsapp_url} /> : null}
    </>
  );
}
