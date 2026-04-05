"use client";

import { updateAboutStoryParagraph, updateAboutTrustBlock } from "@/app/admin/actions";
import type { AboutBlockPublic } from "@/lib/cms/merge-site-content";
import { splitAboutExperienceWhy } from "@/lib/cms/merge-site-content";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function AboutTrustInlinePanel({
  eyebrow,
  title,
  intro,
  points,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  points: string[];
}) {
  const router = useRouter();
  const [eyebrowEdit, setEyebrowEdit] = useState(eyebrow);
  const [titleEdit, setTitleEdit] = useState(title);
  const [introEdit, setIntroEdit] = useState(intro);
  const [pointsEdit, setPointsEdit] = useState(points.join("\n"));
  const [savingTrust, setSavingTrust] = useState(false);

  async function saveTrust() {
    setSavingTrust(true);
    const fd = new FormData();
    fd.set("trust_eyebrow", eyebrowEdit);
    fd.set("trust_title", titleEdit);
    fd.set("trust_intro", introEdit);
    fd.set("about_trust_points", pointsEdit);
    const r = await updateAboutTrustBlock(fd);
    setSavingTrust(false);
    if ("error" in r && r.error) alert(r.error);
    else router.refresh();
  }

  const lines = pointsEdit
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <>
      <div className="mb-8 rounded-xl border border-white/20 bg-black/35 p-4 backdrop-blur-md md:p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#E6B31E]">
          Trust section
        </p>
        <label className="mb-2 block text-xs text-white/85">
          Eyebrow
          <input
            value={eyebrowEdit}
            onChange={(e) => setEyebrowEdit(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="mb-2 block text-xs text-white/85">
          Title
          <input
            value={titleEdit}
            onChange={(e) => setTitleEdit(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="mb-2 block text-xs text-white/85">
          Intro
          <textarea
            value={introEdit}
            onChange={(e) => setIntroEdit(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="mb-3 block text-xs text-white/85">
          Bullet lines (one per line)
          <textarea
            value={pointsEdit}
            onChange={(e) => setPointsEdit(e.target.value)}
            rows={6}
            className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
          />
        </label>
        <button
          type="button"
          disabled={savingTrust}
          onClick={() => void saveTrust()}
          className="rounded-lg bg-[#E6B31E] px-4 py-2 text-sm font-bold text-[#251a00] disabled:opacity-50"
        >
          {savingTrust ? "Saving…" : "Save trust block"}
        </button>
      </div>
      <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-[#E6B31E]">
        {eyebrowEdit}
      </span>
      <h2 className="mb-4 font-[family-name:var(--font-montserrat)] text-3xl font-bold md:text-4xl">
        {titleEdit}
      </h2>
      <p className="mb-10 text-lg leading-relaxed text-white/85 md:text-xl">{introEdit}</p>
      <ul className="space-y-4 rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-sm md:p-8">
        {lines.map((line, i) => (
          <li key={`${i}-${line.slice(0, 24)}`} className="flex gap-4 text-white/95">
            <BadgeCheck className="mt-0.5 h-7 w-7 shrink-0 text-[#E6B31E]" aria-hidden />
            <span className="text-lg leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function AboutStorySections({
  aboutText,
  about,
  isAdmin = false,
}: {
  aboutText: string | null;
  about: AboutBlockPublic;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const { experience, why } = splitAboutExperienceWhy(aboutText);
  const [expEdit, setExpEdit] = useState(experience);
  const [whyEdit, setWhyEdit] = useState(why);
  const [savingExperience, setSavingExperience] = useState(false);
  const [savingWhy, setSavingWhy] = useState(false);

  async function saveExperience() {
    setSavingExperience(true);
    const fd = new FormData();
    fd.set("section", "experience");
    fd.set("text", expEdit);
    const r = await updateAboutStoryParagraph(fd);
    setSavingExperience(false);
    if ("error" in r && r.error) alert(r.error);
    else router.refresh();
  }

  async function saveWhy() {
    setSavingWhy(true);
    const fd = new FormData();
    fd.set("section", "why");
    fd.set("text", whyEdit);
    const r = await updateAboutStoryParagraph(fd);
    setSavingWhy(false);
    if ("error" in r && r.error) alert(r.error);
    else router.refresh();
  }

  return (
    <>
      <section
        className="relative overflow-hidden bg-gradient-to-b from-[#062f55] via-[#083D6B] to-[#083D6B] pb-24 pt-14 text-white md:pb-28 md:pt-20"
        id="experience"
      >
        <div
          className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#E6B31E]/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-white/5 blur-2xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-3 inline-block border-b-2 border-[#E6B31E] pb-1 text-sm font-bold uppercase tracking-[0.2em] text-[#E6B31E]">
              {about.page_eyebrow}
            </span>
            <h1 className="mb-8 font-[family-name:var(--font-montserrat)] text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              {about.experience_title}
            </h1>
            {isAdmin ? (
              <div className="rounded-xl border border-white/20 bg-[#062f55]/80 p-4 backdrop-blur-sm">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#E6B31E]">
                  Story (first section)
                </p>
                <textarea
                  value={expEdit}
                  onChange={(e) => setExpEdit(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-base leading-relaxed text-white placeholder:text-white/40 md:text-lg"
                />
                <button
                  type="button"
                  disabled={savingExperience}
                  onClick={() => void saveExperience()}
                  className="mt-4 rounded-lg bg-[#E6B31E] px-4 py-2 text-sm font-bold text-[#251a00] disabled:opacity-50"
                >
                  {savingExperience ? "Saving…" : "Save your experience"}
                </button>
              </div>
            ) : (
              <p className="text-lg leading-relaxed text-white/90 md:text-xl">{experience}</p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="relative bg-[#F4F5F7] py-20 md:py-24" id="why-we-started">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            className="rounded-2xl border border-[#083D6B]/10 border-l-4 border-l-[#E6B31E] bg-white p-8 shadow-[0_20px_50px_-12px_rgba(8,61,107,0.15)] md:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 font-[family-name:var(--font-montserrat)] text-3xl font-bold text-[#083D6B] md:text-4xl">
              {about.why_title}
            </h2>
            {isAdmin ? (
              <div className="rounded-xl border border-[#083D6B]/15 bg-white p-4 shadow-sm">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#083D6B]">
                  Story (second section)
                </p>
                <textarea
                  value={whyEdit}
                  onChange={(e) => setWhyEdit(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-[#083D6B]/15 bg-[#F4F5F7] px-3 py-2 text-base leading-relaxed text-[#191c1d] md:text-lg"
                />
                <button
                  type="button"
                  disabled={savingWhy}
                  onClick={() => void saveWhy()}
                  className="mt-4 rounded-lg bg-[#E6B31E] px-4 py-2 text-sm font-bold text-[#251a00] disabled:opacity-50"
                >
                  {savingWhy ? "Saving…" : "Save why we started"}
                </button>
              </div>
            ) : (
              <p className="text-lg leading-relaxed text-[#42474f] md:text-xl">{why}</p>
            )}
          </motion.div>
        </div>
      </section>

      <section
        className="relative overflow-hidden border-t border-[#083D6B]/20 bg-[#083D6B] py-20 text-white md:py-24"
        id="trust"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(230,179,30,0.12),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {isAdmin ? (
              <AboutTrustInlinePanel
                key={[
                  about.trust_eyebrow,
                  about.trust_title,
                  about.trust_intro,
                  ...about.trust_points,
                ].join("\u0001")}
                eyebrow={about.trust_eyebrow}
                title={about.trust_title}
                intro={about.trust_intro}
                points={about.trust_points}
              />
            ) : (
              <>
                <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-[#E6B31E]">
                  {about.trust_eyebrow}
                </span>
                <h2 className="mb-4 font-[family-name:var(--font-montserrat)] text-3xl font-bold md:text-4xl">
                  {about.trust_title}
                </h2>
                <p className="mb-10 text-lg leading-relaxed text-white/85 md:text-xl">
                  {about.trust_intro}
                </p>
                <ul className="space-y-4 rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-sm md:p-8">
                  {about.trust_points.map((line) => (
                    <li key={line} className="flex gap-4 text-white/95">
                      <BadgeCheck
                        className="mt-0.5 h-7 w-7 shrink-0 text-[#E6B31E]"
                        aria-hidden
                      />
                      <span className="text-lg leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
