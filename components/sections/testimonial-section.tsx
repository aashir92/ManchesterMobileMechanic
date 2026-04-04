"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";

export function TestimonialSection() {
  const reviewsUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL;

  return (
    <section className="border-t border-[#e1e3e4] bg-white py-24" id="reviews">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-[#775a00]">
            Google reviews
          </span>
          <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold text-[#083D6B] md:text-4xl">
            What our customers say
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[#42474f]">
            Trusted by drivers across Manchester and the surrounding area.
          </p>
        </motion.div>
        <motion.div
          className="mx-auto max-w-3xl rounded-xl border-l-4 border-[#E6B31E] bg-[#F4F5F7]/80 p-8 shadow-sm backdrop-blur-sm"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 flex gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-current" aria-hidden />
            ))}
          </div>
          <p className="mb-4 italic text-[#083D6B]">
            &ldquo;Had a major electrical fault on my Range Rover. No one else could find it.
            Manchester Mobile Mechanic arrived, diagnosed it in 20 minutes and fixed it on the
            spot. Absolute professional.&rdquo;
          </p>
          <div className="font-bold uppercase tracking-wide text-[#083D6B]">
            — James R., Manchester
          </div>
          {reviewsUrl ? (
            <div className="mt-6">
              <Link
                href={reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg bg-[#083D6B] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                Read more on Google
              </Link>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
