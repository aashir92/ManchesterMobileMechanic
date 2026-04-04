"use client";

import { staggerContainer, staggerItem } from "@/components/motion/motion-section";
import { ServiceIcon } from "@/lib/icons/service-icons";
import type { ServiceDisplay } from "@/lib/types/database";
import { motion } from "framer-motion";
import Link from "next/link";

function splitFeatured(services: ServiceDisplay[]) {
  const list = [...services];
  let idx = list.findIndex((s) => s.price && s.price.length > 0);
  if (idx < 0) idx = 0;
  const [featured] = list.splice(idx, 1);
  return { featured, rest: list };
}

function SmallCard({ s }: { s: ServiceDisplay }) {
  return (
    <motion.div
      variants={staggerItem}
      className="rounded-xl border border-[#c2c6d0]/30 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl"
    >
      <ServiceIcon name={s.icon_name} className="mb-4 h-9 w-9 text-[#775a00]" />
      <h4 className="mb-2 font-[family-name:var(--font-montserrat)] text-xl font-bold text-[#083D6B]">
        {s.title}
      </h4>
      <p className="text-sm text-[#42474f]">{s.description}</p>
    </motion.div>
  );
}

export function ServicesBento({ services }: { services: ServiceDisplay[] }) {
  const { featured, rest } = splitFeatured(services);
  const a = rest[0];
  const b = rest[1];
  const wide = rest[2];
  const tail = rest.slice(3);

  return (
    <section className="bg-[#F4F5F7] py-24" id="services">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55 }}
        >
          <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-[#775a00]">
            Our Expertise
          </span>
          <h2 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold text-[#083D6B] md:text-5xl">
            Comprehensive Auto Solutions
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div
            variants={staggerItem}
            className="group flex flex-col justify-between rounded-xl border-l-4 border-[#E6B31E] bg-[#083D6B] p-8 text-white shadow-lg transition-shadow hover:shadow-2xl md:col-span-2 md:row-span-2"
          >
            <div>
              <ServiceIcon name={featured.icon_name} className="mb-6 h-12 w-12 text-[#E6B31E]" />
              <h3 className="mb-4 font-[family-name:var(--font-montserrat)] text-3xl font-bold">
                {featured.title}
              </h3>
              <p className="text-lg text-white/80">{featured.description}</p>
            </div>
            <Link
              href="tel:07845531351"
              className="mt-8 flex items-center gap-2 font-bold text-[#E6B31E] transition-all group-hover:gap-4"
            >
              Book Now <span aria-hidden>→</span>
            </Link>
          </motion.div>

          {a ? <SmallCard s={a} /> : null}
          {b ? <SmallCard s={b} /> : null}

          {wide ? (
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-6 rounded-xl bg-[#e7e8e9] p-8 md:col-span-2 md:col-start-3 md:row-start-2"
            >
              <div className="rounded-lg bg-[#002749] p-4 text-white">
                <ServiceIcon name={wide.icon_name} className="h-9 w-9" />
              </div>
              <div>
                <h4 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-[#083D6B]">
                  {wide.title}
                </h4>
                <p className="text-[#42474f]">{wide.description}</p>
              </div>
            </motion.div>
          ) : null}

          {tail.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:col-span-4 md:row-start-3 md:grid-cols-4">
              {tail.map((s) => (
                <SmallCard key={s.id ?? s.title} s={s} />
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
