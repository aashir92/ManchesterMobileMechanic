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
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const navLinkUnderline =
  "underline-offset-[5px] decoration-2 decoration-[#E6B31E] transition-colors duration-200";

function desktopNavLinkClass(href: string, pathname: string, solid: boolean) {
  const active = pathname === href;
  if (solid) {
    if (active) {
      return `cursor-pointer font-semibold text-[#E6B31E] underline ${navLinkUnderline}`;
    }
    return `cursor-pointer font-semibold text-[#083D6B] hover:text-[#E6B31E] hover:underline ${navLinkUnderline}`;
  }
  if (active) {
    return `cursor-pointer text-sm font-semibold uppercase tracking-wider text-[#E6B31E] underline ${navLinkUnderline}`;
  }
  return `cursor-pointer text-sm font-semibold uppercase tracking-wider text-white/95 hover:text-[#E6B31E] hover:underline ${navLinkUnderline}`;
}

function mobileNavLinkClass(href: string, pathname: string) {
  const active = pathname === href;
  if (active) {
    return `cursor-pointer py-1 font-semibold text-[#E6B31E] underline ${navLinkUnderline}`;
  }
  return `cursor-pointer py-1 font-semibold text-[#083D6B] hover:text-[#E6B31E] hover:underline ${navLinkUnderline}`;
}

export function Navbar({
  isAdmin = false,
  contact,
}: {
  isAdmin?: boolean;
  contact: ContactBlockPublic;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/brand/Logo.png");
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
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-6 py-2 md:gap-4 md:py-0">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
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

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 md:flex md:flex-nowrap lg:gap-5">
          <div className="flex min-w-0 flex-nowrap items-center gap-3 lg:gap-5">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`shrink-0 ${desktopNavLinkClass(href, pathname, solid)}`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex shrink-0 flex-nowrap items-center gap-2 lg:gap-3">
            <a
              className={
                solid
                  ? "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#E6B31E] px-3.5 text-sm font-semibold normal-case tracking-normal text-[#251a00] transition-opacity hover:opacity-90"
                  : "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/80 px-3.5 text-sm font-semibold normal-case tracking-normal text-white transition-colors hover:bg-white/10"
              }
              href={`tel:${telHref}`}
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              {callLabel}
            </a>
            {isAdmin ? (
              <>
                <span
                  className="hidden h-6 w-px shrink-0 bg-[#083D6B]/20 xl:block"
                  aria-hidden
                />
                <span className="flex flex-nowrap items-center gap-2 normal-case">
                  <span className="shrink-0 rounded-full bg-[#E6B31E]/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#083D6B]">
                    Editing
                  </span>
                  <Link
                    href="/admin/settings"
                    title="Change password"
                    className={`shrink-0 whitespace-nowrap text-xs font-semibold underline decoration-[#E6B31E] decoration-2 underline-offset-4 transition-colors hover:text-[#E6B31E] ${
                      solid ? "text-[#083D6B]" : "text-white/95 hover:text-[#E6B31E]"
                    }`}
                  >
                    <span className="2xl:inline">Change password</span>
                    <span className="2xl:hidden">Password</span>
                  </Link>
                  <form action={signOut} className="inline shrink-0">
                    <button
                      type="submit"
                      className="cursor-pointer whitespace-nowrap rounded-full border border-[#083D6B]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#083D6B] transition-colors hover:bg-[#F4F5F7]"
                    >
                      Sign out
                    </button>
                  </form>
                </span>
              </>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          className={`cursor-pointer rounded-lg p-2 transition-colors duration-200 active:scale-95 md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            solid
              ? "text-[#083D6B] hover:bg-[#083D6B]/10 focus-visible:outline-[#083D6B]"
              : "text-white hover:bg-white/15 focus-visible:outline-white"
          }`}
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
              <Link
                key={href}
                href={href}
                className={mobileNavLinkClass(href, pathname)}
                onClick={() => setOpen(false)}
              >
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
                <Link
                  href="/admin/settings"
                  className={`cursor-pointer py-1 text-sm font-semibold hover:text-[#E6B31E] hover:underline ${navLinkUnderline}`}
                  onClick={() => setOpen(false)}
                >
                  Change password
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="w-full cursor-pointer rounded-lg border border-[#083D6B]/30 bg-[#F4F5F7] py-3 text-sm font-semibold text-[#083D6B] transition-colors hover:bg-[#E8EAED]"
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
