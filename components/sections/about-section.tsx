"use client";

import { DEFAULT_ABOUT_TEXT } from "@/lib/data/defaults";
import { motion } from "framer-motion";

export function AboutSection({ aboutText }: { aboutText: string | null }) {
  const text = (aboutText?.trim() || DEFAULT_ABOUT_TEXT).split("\n\n").filter(Boolean);

  return (
    <section className="border-t border-[#e1e3e4] bg-white py-20" id="about">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.span
          className="mb-3 block text-sm font-bold uppercase tracking-widest text-[#775a00]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          About us
        </motion.span>
        <motion.h2
          className="mb-8 font-[family-name:var(--font-montserrat)] text-3xl font-bold text-[#083D6B] md:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Mobile mechanic services across Manchester
        </motion.h2>
        <div className="space-y-6 text-left text-lg leading-relaxed text-[#42474f] md:text-center">
          {text.map((para) => (
            <motion.p
              key={`about-${para.slice(0, 24)}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}


