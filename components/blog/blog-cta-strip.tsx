import Link from "next/link";

export function BlogCtaStrip() {
  return (
    <div className="bg-[#F4F5F7] pb-16 pt-4 md:pb-20 md:pt-6">
      <div className="mx-auto max-w-[1920px] px-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#083D6B]/10 bg-white px-6 py-8 text-center shadow-sm md:px-10 md:py-10">
          <p className="font-[family-name:var(--font-montserrat)] text-lg font-semibold text-[#083D6B] md:text-xl">
            Need a mobile mechanic in Manchester?
          </p>
          <p className="mt-2 text-sm text-[#083D6B]/75 md:text-base">
            Book a visit or get in touch — we come to you.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] min-w-[160px] items-center justify-center rounded-full bg-[#E6B31E] px-6 py-3 text-sm font-semibold text-[#083D6B] shadow-sm transition hover:bg-[#d4a41a]"
            >
              Contact us
            </Link>
            <Link
              href="/services"
              className="text-sm font-semibold text-[#083D6B] underline underline-offset-4 transition hover:text-[#E6B31E]"
            >
              View our services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
