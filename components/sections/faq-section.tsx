"use client";

import { FAQ_ITEMS } from "@/lib/data/defaults";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-[#e1e3e4] bg-white py-24" id="faq">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-[#775a00]">
            FAQ
          </span>
          <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold text-[#083D6B] md:text-4xl">
            Common questions
          </h2>
        </motion.div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                className="overflow-hidden rounded-xl border border-[#e1e3e4] bg-[#F4F5F7]/50"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[#083D6B] transition-colors hover:bg-white/80"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {item.question}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {isOpen ? (
                  <div className="border-t border-[#e1e3e4] bg-white px-5 py-4 text-[#42474f] leading-relaxed">
                    {item.answer}
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
