import Link from "next/link";

/** Sticky conversion rail on large screens so wide layouts don’t feel empty. */
export function BlogArticleAside() {
  return (
    <aside className="hidden min-w-0 xl:block" aria-label="Get help">
      <div className="sticky top-28 space-y-4 rounded-2xl border border-[#083D6B]/10 bg-[#F4F5F7] p-6 shadow-sm">
        <p className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-[#083D6B]">
          Need a mobile mechanic?
        </p>
        <p className="text-sm leading-relaxed text-[#42474f]">
          Book a visit in Manchester — we come to your home or workplace.
        </p>
        <Link
          href="/contact"
          className="flex min-h-11 w-full items-center justify-center rounded-full bg-[#E6B31E] px-4 py-2.5 text-center text-sm font-semibold text-[#083D6B] shadow-sm transition hover:bg-[#d4a41a]"
        >
          Contact us
        </Link>
        <Link
          href="/services"
          className="block text-center text-sm font-semibold text-[#083D6B] underline underline-offset-4 hover:text-[#E6B31E]"
        >
          View services
        </Link>
      </div>
    </aside>
  );
}
