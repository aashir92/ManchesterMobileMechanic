"use client";

import { motion } from "framer-motion";

export function MapSection() {
  return (
    <section className="relative h-[450px] bg-slate-900" id="service-area" aria-labelledby="service-area-heading">
      <iframe
        title="Greater Manchester service area"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d152064.04351368942!2d-2.36367355!3d53.472224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487a4d4c5226f5db%3A0xd9be143804da6ba!2sManchester!5e0!3m2!1sen!2suk!4v1715600000000!5m2!1sen!2suk"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          className="pointer-events-auto max-w-sm rounded-lg bg-[#083D6B] p-6 text-center text-white shadow-2xl"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h4
            id="service-area-heading"
            className="mb-2 font-[family-name:var(--font-montserrat)] text-xl font-bold"
          >
            Service area
          </h4>
          <p className="text-sm text-white/85">
            Covering Manchester and surrounding areas — including Trafford, Salford, Stockport,
            Oldham, and beyond.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
