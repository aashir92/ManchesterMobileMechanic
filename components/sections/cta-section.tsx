"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CtaSection({
  headline,
  subtext,
  callLabel,
  bookLabel,
  phoneTel,
}: {
  headline: string;
  subtext: string;
  callLabel: string;
  bookLabel: string;
  phoneTel: string;
}) {
  const telHref = phoneTel.replace(/\s/g, "");

  return (
    <section className="border-t border-[#e1e3e4] bg-[#F4F5F7] py-16" id="cta">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 font-[family-name:var(--font-montserrat)] text-2xl font-bold text-[#083D6B] md:text-3xl">
            {headline}
          </h2>
          <p className="mb-8 text-lg text-[#42474f]">{subtext}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`tel:${telHref}`}
              className="inline-flex min-h-[52px] items-center justify-center rounded-lg bg-[#E6B31E] px-8 py-3 text-lg font-bold text-[#251a00] shadow-md transition-transform hover:brightness-110 active:scale-[0.99]"
            >
              {callLabel}
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[52px] items-center justify-center rounded-lg border-2 border-[#083D6B] bg-white px-8 py-3 text-lg font-bold text-[#083D6B] transition-colors hover:bg-[#083D6B]/5"
            >
              {bookLabel}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
