"use client";

import type { ContactBlockPublic } from "@/lib/cms/merge-site-content";
import { LOGO_FALLBACK } from "@/lib/data/defaults";
import Link from "next/link";
import { useState } from "react";

export function Footer({ contact }: { contact: ContactBlockPublic }) {
  const [logoSrc, setLogoSrc] = useState("/brand/Logo.png");

  return (
    <footer className="border-t border-[#e1e3e4] bg-white py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Manchester Mobile Mechanic"
            className="h-10 w-auto object-contain"
            onError={() => setLogoSrc(LOGO_FALLBACK)}
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-[#42474f]">
            © {new Date().getFullYear()} Manchester Mobile Mechanic
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-bold text-[#083D6B]">
          <Link className="transition-colors hover:text-[#E6B31E]" href="/services">
            Services
          </Link>
          <Link className="transition-colors hover:text-[#E6B31E]" href="/about">
            About
          </Link>
          <Link className="transition-colors hover:text-[#E6B31E]" href="/contact">
            Contact
          </Link>
          <Link className="transition-colors hover:text-[#E6B31E]" href="#">
            Privacy Policy
          </Link>
          <Link className="transition-colors hover:text-[#E6B31E]" href="#">
            Terms of Service
          </Link>
        </nav>
        <div className="flex gap-4">
          <a
            className="rounded-full bg-[#e7e8e9] p-2 transition-all hover:bg-[#E6B31E]/40"
            href={contact.whatsapp_url}
            aria-label="WhatsApp"
          >
            <svg className="h-6 w-6 fill-[#25D366]" viewBox="0 0 24 24" aria-hidden>
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.001.332.005c.109.004.258-.041.404.311.159.389.542 1.32.59 1.42.048.1.08.217.014.346-.066.13-.1.21-.2.325-.1.115-.21.257-.3.346-.1.1-.205.209-.089.407.116.198.515.849 1.104 1.373.758.677 1.397.887 1.597.986.198.099.313.082.43-.052.117-.135.5-.583.634-.783.135-.2.27-.167.455-.1.185.067 1.17.551 1.371.652.201.101.336.151.385.234.049.082.049.474-.095.879z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
