"use client";

import { signOut } from "@/app/admin/actions";
import type { ContactBlockPublic } from "@/lib/cms/merge-site-content";
import { LOGO_FALLBACK } from "@/lib/data/defaults";
import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar({
  isAdmin = false,
  contact,
}: {
  isAdmin?: boolean;
  contact: ContactBlockPublic;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/brand/logo.png");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const solid = !isHome || scrolled || open;
  const telHref = contact.phone_tel.replace(/\s/g, "");
  const callLabel = "Call now";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-[background-color,border-color,box-shadow] duration-300 ${
        solid
          ? "border-b border-black/5 bg-white/90 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Manchester Mobile Mechanic"
            className={`h-auto max-h-[60px] w-auto object-contain ${solid ? "" : "brightness-0 invert"}`}
            onError={() => setLogoSrc(LOGO_FALLBACK)}
          />
          <span
            className={`hidden font-[family-name:var(--font-montserrat)] text-lg font-bold tracking-tight sm:inline ${
              solid ? "text-[#083D6B]" : "text-white"
            }`}
          >
            MANCHESTER MOBILE MECHANIC
          </span>
        </Link>

        <div
          className={`hidden items-center gap-6 md:flex ${solid ? "font-semibold text-[#083D6B]" : "text-sm font-semibold uppercase tracking-wider text-white/95"}`}
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-opacity hover:opacity-80 ${solid ? "" : "uppercase"} ${
                pathname === href
                  ? solid
                    ? "text-[#E6B31E]"
                    : "text-white"
                  : solid
                    ? ""
                    : "hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            className={
              solid
                ? "flex items-center gap-2 rounded-lg bg-[#E6B31E] px-5 py-2 normal-case tracking-normal text-[#251a00] transition-opacity hover:opacity-90"
                : "flex items-center gap-2 rounded border border-white/80 px-5 py-2 normal-case tracking-normal text-white transition-colors hover:bg-white/10"
            }
            href={`tel:${telHref}`}
          >
            <Phone className="h-4 w-4" aria-hidden />
            {callLabel}
          </a>
          {isAdmin ? (
            <span className="flex items-center gap-2 normal-case">
              <span className="rounded bg-[#E6B31E]/20 px-2 py-1 text-xs font-bold text-[#083D6B]">
                Editing
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-lg border border-[#083D6B]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#083D6B] hover:bg-[#F4F5F7]"
                >
                  Sign out
                </button>
              </form>
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className={`rounded-md p-2 md:hidden ${solid ? "text-[#083D6B]" : "text-white"}`}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-black/5 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4 font-semibold text-[#083D6B]">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <a
              className="flex items-center justify-center gap-2 rounded-lg bg-[#E6B31E] py-3 text-[#251a00]"
              href={`tel:${telHref}`}
              onClick={() => setOpen(false)}
            >
              <Phone className="h-4 w-4" />
              {callLabel}
            </a>
            {isAdmin ? (
              <div className="flex flex-col gap-3 border-t border-black/10 pt-4 normal-case">
                <span className="self-start rounded bg-[#E6B31E]/20 px-2 py-1 text-xs font-bold text-[#083D6B]">
                  Editing
                </span>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="w-full rounded-lg border border-[#083D6B]/30 bg-[#F4F5F7] py-3 text-sm font-semibold text-[#083D6B] hover:bg-[#E8EAED]"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
