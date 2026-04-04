"use client";

import { updateServicesPageContent } from "@/app/admin/actions";
import {
  ServicesFullInline,
  ServicesHomeInline,
  ServicesIntroInline,
} from "@/components/admin/inline/services-inline-panels";
import type { ServicesPageContent } from "@/lib/cms/services-schema";
import { motion } from "framer-motion";
import { ArrowRight, Wrench, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

function isVisible(v: { visible?: boolean } | undefined): boolean {
  return v?.visible !== false;
}

function ServicesIntro({
  eyebrow,
  title,
  subtitle,
  className = "",
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b from-[#062f55] via-[#083D6B] to-[#083D6B] pb-14 pt-12 text-white md:pb-20 md:pt-16 ${className}`}
    >
      <div
        className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#E6B31E]/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-white/5 blur-2xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <span className="mb-3 inline-block border-b-2 border-[#E6B31E] pb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#E6B31E] md:text-sm">
          {eyebrow}
        </span>
        <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold leading-tight md:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/88 md:text-lg">
          {subtitle}
        </p>
        {footer}
      </div>
    </div>
  );
}

export function ServicesFullSection({
  variant = "full",
  servicesPage,
  isAdmin = false,
}: {
  variant?: "home" | "full";
  servicesPage: ServicesPageContent;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(servicesPage);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(servicesPage);
  }, [servicesPage]);

  const c = isAdmin ? draft : servicesPage;
  const { home, full } = c;

  async function saveServices() {
    setSaving(true);
    const r = await updateServicesPageContent(draft);
    setSaving(false);
    if ("error" in r && r.error) alert(r.error);
    else router.refresh();
  }

  if (variant === "home") {
    const mechItems = isAdmin
      ? home.mechanical_items
      : home.mechanical_items.filter(isVisible);
    const elecSummaries = isAdmin
      ? home.electrical_summaries
      : home.electrical_summaries.filter(isVisible);

    return (
      <section className="relative" id="services">
        <ServicesIntro
          eyebrow={home.intro_eyebrow}
          title={home.intro_title}
          subtitle={home.intro_subtitle}
          footer={
            isAdmin ? (
              <div className="mt-8">
                <ServicesIntroInline
                  variant="home"
                  draft={draft}
                  setDraft={setDraft}
                  onSave={saveServices}
                  saving={saving}
                />
              </div>
            ) : null
          }
        />

        <div className="relative bg-[#F4F5F7] pb-20 pt-10 md:pb-24 md:pt-14">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(100%,72rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E6B31E]/50 to-transparent"
            aria-hidden
          />
          <div className="relative mx-auto max-w-7xl px-6">
            {isAdmin ? (
              <div className="mb-8">
                <ServicesHomeInline
                  draft={draft}
                  setDraft={setDraft}
                  onSave={saveServices}
                  saving={saving}
                />
              </div>
            ) : null}
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-8 lg:items-stretch xl:gap-10">
              <motion.div
                className="min-h-[220px] lg:col-span-5 lg:h-full lg:min-h-0"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
              >
                <div className="relative aspect-[4/3] min-h-[220px] w-full overflow-hidden rounded-2xl shadow-[0_24px_48px_-12px_rgba(8,61,107,0.35)] ring-2 ring-[#083D6B]/20 lg:aspect-auto lg:h-full">
                  <Image
                    src={home.spotlight_image_url}
                    alt="Mechanic performing engine and oil service in a professional workshop"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    unoptimized
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#062f55]/95 via-[#083D6B]/35 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#E6B31E]">
                      {home.spotlight_kicker}
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-montserrat)] text-lg font-bold md:text-xl">
                      {home.spotlight_title}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="lg:col-span-7 lg:flex lg:h-full lg:min-h-0"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.05 }}
              >
                <div className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-[#083D6B]/10 border-l-4 border-l-[#E6B31E] bg-white p-6 shadow-[0_20px_50px_-12px_rgba(8,61,107,0.14)] md:p-8">
                  <div className="mb-5 flex shrink-0 items-center gap-3">
                    <div className="rounded-xl bg-[#083D6B] p-2.5 text-white shadow-md">
                      <Wrench className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-[#083D6B] md:text-2xl">
                      {home.mechanical_card_title}
                    </h3>
                  </div>
                  <ul className="min-h-0 flex-1 space-y-2.5 text-[#42474f]">
                    {mechItems.map((item) => (
                      <li key={item.id} className="flex gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E6B31E] shadow-sm"
                          aria-hidden
                        />
                        <span className="text-base leading-snug">{item.title}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 shrink-0 border-t border-[#083D6B]/10 pt-5 lg:mt-auto">
                    <Link
                      href="/services#mechanical-services"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#083D6B] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#062f55]"
                    >
                      View details
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="relative mt-8 overflow-hidden rounded-2xl border border-[#083D6B]/15 bg-[#083D6B] p-6 text-white shadow-[0_20px_50px_-12px_rgba(8,61,107,0.35)] md:mt-10 md:p-8 lg:mt-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.06 }}
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(230,179,30,0.15),transparent)]"
                aria-hidden
              />
              <div className="relative">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#E6B31E]/25 p-2.5 text-[#E6B31E]">
                      <Zap className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="font-[family-name:var(--font-montserrat)] text-xl font-bold md:text-2xl">
                      {home.electrical_card_title}
                    </h3>
                  </div>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {elecSummaries.map((group) => (
                    <li
                      key={group.id}
                      className="rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 backdrop-blur-sm"
                    >
                      <span className="block text-sm font-bold leading-snug text-white">
                        {group.heading}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    href="/services#auto-electrical-services"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-[#E6B31E] bg-[#E6B31E] px-4 py-2.5 text-sm font-bold text-[#251a00] shadow-md transition-colors hover:bg-[#f0c040]"
                  >
                    View details
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  const mechanical = isAdmin ? full.mechanical : full.mechanical.filter(isVisible);
  const electricalGroups = isAdmin
    ? full.electrical_groups
    : full.electrical_groups
        .filter(isVisible)
        .map((g) => ({
          ...g,
          items: g.items.filter(isVisible),
        }))
        .filter((g) => g.items.length > 0);

  return (
    <section className="relative" id="services">
      <ServicesIntro
        eyebrow={home.intro_eyebrow}
        title={home.intro_title}
        subtitle={full.intro_subtitle}
        footer={
          isAdmin ? (
            <div className="mt-8">
              <ServicesIntroInline
                variant="full"
                draft={draft}
                setDraft={setDraft}
                onSave={saveServices}
                saving={saving}
              />
            </div>
          ) : null
        }
      />

      <div className="relative overflow-hidden bg-gradient-to-b from-[#d8e2ed]/95 via-[#eef2f8] to-[#f4f7fb] pb-20 pt-12 md:pb-24 md:pt-16">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(100%,72rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E6B31E]/60 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-40 top-24 h-[min(32rem,80vw)] w-[min(32rem,80vw)] rounded-full bg-[#083D6B]/[0.09] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-32 bottom-32 h-[min(26rem,70vw)] w-[min(26rem,70vw)] rounded-full bg-[#E6B31E]/[0.11] blur-3xl"
          aria-hidden
        />
        <div className="relative z-[1] mx-auto max-w-7xl px-6">
          {isAdmin ? (
            <div className="mb-8">
              <ServicesFullInline
                draft={draft}
                setDraft={setDraft}
                onSave={saveServices}
                saving={saving}
              />
            </div>
          ) : null}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-8 xl:gap-10">
            <motion.div
              id="mechanical-services"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="scroll-mt-28 rounded-2xl border border-[#083D6B]/12 border-l-4 border-l-[#E6B31E] bg-white/95 p-6 shadow-[0_24px_56px_-14px_rgba(8,61,107,0.22)] ring-1 ring-[#083D6B]/5 backdrop-blur-sm md:p-8 lg:self-start"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-[#083D6B] p-3 text-white shadow-md ring-2 ring-[#083D6B]/20">
                  <Wrench className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-[#083D6B] md:text-2xl">
                  {full.mechanical_section_title}
                </h3>
              </div>
              <ul className="space-y-4 text-[#42474f]">
                {mechanical.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 rounded-lg border border-[#083D6B]/8 bg-gradient-to-br from-white to-[#f4f8fc] px-3 py-3 md:px-4"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E6B31E]"
                      aria-hidden
                    />
                    <div>
                      <p className="font-semibold leading-snug text-[#083D6B]">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#42474f]">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              id="auto-electrical-services"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="scroll-mt-28 space-y-5 lg:self-start"
            >
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#062f55] to-[#0a4a7a] px-5 py-4 text-white shadow-[0_20px_40px_-10px_rgba(6,47,85,0.45)] ring-1 ring-[#E6B31E]/25 md:px-6 md:py-5">
                <div className="rounded-xl bg-[#E6B31E]/25 p-2.5 text-[#E6B31E] ring-1 ring-[#E6B31E]/30">
                  <Zap className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="font-[family-name:var(--font-montserrat)] text-xl font-bold md:text-2xl">
                  {full.electrical_section_title}
                </h3>
              </div>
              {electricalGroups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-2xl border border-[#083D6B]/12 border-l-4 border-l-[#E6B31E] bg-white/95 p-5 shadow-[0_22px_50px_-14px_rgba(8,61,107,0.18)] ring-1 ring-[#083D6B]/5 backdrop-blur-sm md:p-6"
                >
                  <h4 className="mb-4 font-[family-name:var(--font-montserrat)] text-base font-bold text-[#083D6B] md:text-lg">
                    {group.heading}
                  </h4>
                  <ul className="space-y-3 text-sm text-[#42474f] md:text-[15px]">
                    {(isAdmin ? group.items : group.items.filter(isVisible)).map((item) => (
                      <li
                        key={item.id}
                        className="flex gap-3 rounded-lg border border-[#083D6B]/8 bg-gradient-to-br from-white to-[#f4f8fc] px-3 py-2.5"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E6B31E]"
                          aria-hidden
                        />
                        <div>
                          <p className="font-semibold text-[#083D6B]">{item.title}</p>
                          <p className="mt-0.5 leading-relaxed">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
