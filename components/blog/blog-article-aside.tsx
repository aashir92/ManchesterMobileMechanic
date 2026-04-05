"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** Sticky conversion rail on large screens so wide layouts don’t feel empty. */
export function BlogArticleAside() {
  return (
    <aside className="hidden min-w-0 xl:block" aria-label="Get help">
      <motion.div
        className="sticky top-28 space-y-4 rounded-2xl border border-[#083D6B]/10 bg-[#F4F5F7] p-6 shadow-sm"
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.48, delay: 0.14, ease }}
      >
        <motion.p
          className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-[#083D6B]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2, ease }}
        >
          Need a mobile mechanic?
        </motion.p>
        <motion.p
          className="text-sm leading-relaxed text-[#42474f]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.26, ease }}
        >
          Book a visit in Manchester — we come to your home or workplace.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.32, ease }}
        >
          <Link
            href="/contact"
            className="flex min-h-11 w-full items-center justify-center rounded-full bg-[#E6B31E] px-4 py-2.5 text-center text-sm font-semibold text-[#083D6B] shadow-sm transition hover:bg-[#d4a41a]"
          >
            Contact us
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.38, ease }}
        >
          <Link
            href="/services"
            className="block text-center text-sm font-semibold text-[#083D6B] underline underline-offset-4 hover:text-[#E6B31E]"
          >
            View services
          </Link>
        </motion.div>
      </motion.div>
    </aside>
  );
}
