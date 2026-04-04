"use client";

import {
  materializeDefaultHeroSlides,
  moveHeroCarouselSlide,
  removeHeroCarouselSlide,
  toggleHeroSlideVisible,
  updateHeroHeadlines,
  uploadHeroBackground,
} from "@/app/admin/actions";
import type { HeroSlideRow } from "@/lib/cms/hero-carousel";
import { HERO_FALLBACK_H1, HERO_FALLBACK_SUB } from "@/lib/data/defaults";
import type { SiteContent } from "@/lib/types/database";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  EyeOff,
  ImagePlus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const textReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function HeadlineWithGoldRepairs({ text }: { text: string }) {
  const match = /\b(repairs)\b/i.exec(text);
  if (!match || match.index === undefined) {
    return <>{text}</>;
  }
  const i = match.index;
  const word = match[0];
  const before = text.slice(0, i);
  const after = text.slice(i + word.length);
  return (
    <>
      {before}
      <span className="text-[#E6B31E]">{word}</span>
      {after}
    </>
  );
}

function HeroCarouselLayer({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <>
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence initial={false} mode="sync">
          <motion.img
            key={images[index] ?? index}
            src={images[index]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-[25] hidden w-14 items-center justify-center md:flex md:w-16">
        <button
          type="button"
          aria-label="Previous slide"
          disabled={images.length <= 1}
          onClick={() =>
            setIndex((i) => (i - 1 + images.length) % images.length)
          }
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden />
        </button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[25] hidden w-14 items-center justify-center md:flex md:w-16">
        <button
          type="button"
          aria-label="Next slide"
          disabled={images.length <= 1}
          onClick={() => setIndex((i) => (i + 1) % images.length)}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-6 w-6" aria-hidden />
        </button>
      </div>
    </>
  );
}

function HeroHeadlineEditor({
  headline,
  subhead,
}: {
  headline: string;
  subhead: string;
}) {
  const router = useRouter();
  const [editH1, setEditH1] = useState(headline);
  const [editSub, setEditSub] = useState(subhead);
  const [msg, setMsg] = useState<string | null>(null);

  function flash(t: string) {
    setMsg(t);
    setTimeout(() => setMsg(null), 2800);
  }

  async function saveHeroText() {
    const fd = new FormData();
    fd.set("hero_h1", editH1);
    fd.set("hero_subhead", editSub);
    const r = await updateHeroHeadlines(fd);
    if ("error" in r && r.error) flash(`Error: ${r.error}`);
    else {
      flash("Saved");
      router.refresh();
    }
  }

  return (
    <>
      {msg ? (
        <div className="pointer-events-none absolute left-1/2 top-24 z-[40] -translate-x-1/2 rounded-lg border border-white/20 bg-black/75 px-4 py-2 text-xs text-white backdrop-blur-sm">
          {msg}
        </div>
      ) : null}
      <div className="mb-5 rounded-xl border border-white/20 bg-black/40 p-4 shadow-lg backdrop-blur-md">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#E6B31E]/90">
          Hero text
        </p>
        <label className="mb-3 block text-xs font-medium text-white/80">
          Headline
          <input
            value={editH1}
            onChange={(e) => setEditH1(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-base font-semibold text-white placeholder:text-white/40"
          />
        </label>
        <label className="mb-3 block text-xs font-medium text-white/80">
          Subhead
          <textarea
            value={editSub}
            onChange={(e) => setEditSub(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40"
          />
        </label>
        <button
          type="button"
          onClick={() => void saveHeroText()}
          className="rounded-lg bg-[#E6B31E] px-4 py-2 text-xs font-bold text-[#251a00] hover:brightness-105"
        >
          Save text
        </button>
      </div>
    </>
  );
}

function HeroSlideStrip({ site }: { site: SiteContent }) {
  const router = useRouter();
  const slides: HeroSlideRow[] = site.hero_carousel_urls;

  async function runSlideAction(
    action: (fd: FormData) => Promise<{ error?: string; ok?: boolean }>,
    fields: Record<string, string>,
  ) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) fd.set(k, v);
    const r = await action(fd);
    if ("error" in r && r.error) alert(r.error);
    else router.refresh();
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    const r = await uploadHeroBackground(fd);
    if ("error" in r && r.error) alert(r.error);
    else router.refresh();
  }

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-[35] border-t border-white/10 bg-black/55 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-3 py-2.5 md:px-6">
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-white/60">
          Slides
        </span>
        {slides.length === 0 ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <span className="text-xs text-white/75">
              Built-in rotation is active. Import once to hide, reorder, or remove slides.
            </span>
            <button
              type="button"
              onClick={() =>
                void materializeDefaultHeroSlides().then((r) => {
                  if ("error" in r && r.error) alert(r.error);
                  else router.refresh();
                })
              }
              className="shrink-0 rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              Import default slides
            </button>
          </div>
        ) : (
          slides.map((slide, i) => (
            <div
              key={`${slide.url}-${i}`}
              className={`flex shrink-0 items-center gap-1 rounded-lg border border-white/15 bg-white/10 p-1 ${
                slide.visible === false ? "opacity-50" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.url}
                alt=""
                className="h-9 w-14 rounded object-cover"
              />
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  title="Move earlier"
                  className="rounded p-0.5 text-white/80 hover:bg-white/15"
                  onClick={() =>
                    void runSlideAction(moveHeroCarouselSlide, {
                      index: String(i),
                      direction: "up",
                    })
                  }
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Move later"
                  className="rounded p-0.5 text-white/80 hover:bg-white/15"
                  onClick={() =>
                    void runSlideAction(moveHeroCarouselSlide, {
                      index: String(i),
                      direction: "down",
                    })
                  }
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                type="button"
                title={slide.visible === false ? "Show on site" : "Hide on site"}
                className="rounded p-1.5 text-white/85 hover:bg-white/15"
                onClick={() =>
                  void runSlideAction(toggleHeroSlideVisible, { index: String(i) })
                }
              >
                {slide.visible === false ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                title="Remove slide"
                className="rounded p-1.5 text-red-300 hover:bg-red-500/20"
                onClick={() => {
                  if (!confirm("Remove this slide?")) return;
                  void runSlideAction(removeHeroCarouselSlide, { index: String(i) });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
        <label className="flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-white/35 px-2.5 text-xs font-medium text-white/90 hover:bg-white/10">
          <ImagePlus className="h-4 w-4" aria-hidden />
          Add
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => void onUpload(e)}
          />
        </label>
      </div>
    </div>
  );
}

export function HeroSection({
  headline,
  subhead,
  heroImageUrls,
  phoneTel,
  highlightHero = false,
  editorSite = null,
}: {
  headline: string;
  subhead: string;
  heroImageUrls: string[];
  phoneTel: string;
  highlightHero?: boolean;
  editorSite?: SiteContent | null;
}) {
  const images = useMemo(
    () => (heroImageUrls.length > 0 ? heroImageUrls : ["/hero/image1.jpeg"]),
    [heroImageUrls],
  );
  const carouselKey = images.join("|");

  const h = headline?.trim() || HERO_FALLBACK_H1;
  const s = subhead?.trim() || HERO_FALLBACK_SUB;
  const telHref = phoneTel.replace(/\s/g, "");

  return (
    <section
      className={`relative flex min-h-screen min-h-[85vh] flex-col overflow-hidden pt-16 ${
        highlightHero ? "ring-2 ring-inset ring-[#E6B31E]/90" : ""
      } ${editorSite ? "pb-[4.5rem] md:pb-20" : ""}`}
    >
      <HeroCarouselLayer key={carouselKey} images={images} />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#083D6B]/18 via-transparent to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/75 via-black/55 to-black/35"
        aria-hidden
      />

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-24 pt-3 max-md:justify-start md:pb-10 md:pt-4">
        <div
          className={`relative max-w-2xl shrink-0 ${editorSite ? "pointer-events-auto" : ""}`}
        >
          {editorSite ? (
            <HeroHeadlineEditor
              key={`${headline}|||${subhead}`}
              headline={headline}
              subhead={subhead}
            />
          ) : (
            <>
              <motion.h1
                custom={0}
                variants={textReveal}
                initial="hidden"
                animate="visible"
                className="mb-5 font-[family-name:var(--font-montserrat)] text-4xl font-bold leading-[1.12] tracking-tight text-white md:text-5xl lg:text-6xl"
              >
                <HeadlineWithGoldRepairs text={h} />
              </motion.h1>
              <motion.p
                custom={1}
                variants={textReveal}
                initial="hidden"
                animate="visible"
                className="max-w-lg text-base leading-relaxed text-white/90 md:text-lg"
              >
                {s}
              </motion.p>
            </>
          )}
        </div>
        {/* flex-1 spacer only on md+ so mobile CTAs stay under copy, not pinned to bottom */}
        <div className="hidden min-h-6 md:block md:flex-1" aria-hidden />
        <motion.div
          custom={2}
          variants={textReveal}
          initial="hidden"
          animate="visible"
          className="mt-6 max-w-2xl shrink-0 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-0 md:-mt-8 md:pb-2"
        >
          <Link
            href={`tel:${telHref}`}
            className="inline-flex min-h-[48px] min-w-[160px] items-center justify-center rounded border border-white/80 bg-transparent px-7 py-3 text-base font-semibold tracking-wide text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Call now
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-[48px] min-w-[160px] items-center justify-center gap-2 rounded border border-white/80 bg-transparent px-7 py-3 text-base font-semibold tracking-wide text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Book appointment
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </motion.div>
      </div>

      {editorSite ? <HeroSlideStrip site={editorSite} /> : null}
    </section>
  );
}
