"use client";

import { clearVanImage, updateHomeValueFeatures, uploadVanImage } from "@/app/admin/actions";
import type { HomeValueFeatureCms } from "@/lib/cms/services-schema";
import { CarFront, ChevronDown, ChevronUp, MapPin, Plus, Receipt, Timer, Trash2, Trophy, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ICON_MAP: Record<string, LucideIcon> = {
  CarFront,
  Timer,
  Receipt,
  Trophy,
  MapPin,
};

const ICON_KEYS: HomeValueFeatureCms["icon_key"][] = [
  "CarFront",
  "Timer",
  "Receipt",
  "Trophy",
  "MapPin",
];

function isVisible(f: HomeValueFeatureCms): boolean {
  return f.visible !== false;
}

function cloneFeatures(f: HomeValueFeatureCms[]): HomeValueFeatureCms[] {
  return f.map((row) => ({ ...row }));
}

function moveRow(arr: HomeValueFeatureCms[], i: number, dir: -1 | 1): HomeValueFeatureCms[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j]!, next[i]!];
  return next;
}

function valueSectionResetKey(headline: string, features: HomeValueFeatureCms[]) {
  return [
    headline,
    ...features.map(
      (f, i) =>
        `${i}|${f.id}|${f.title}|${f.body}|${f.icon_key}|${f.visible === false ? 0 : 1}`,
    ),
  ].join("\u0001");
}

function ValueSectionInner({
  headline,
  features,
  vanImageUrl,
  highlightVan = false,
  isAdmin = false,
}: {
  headline: string;
  features: HomeValueFeatureCms[];
  vanImageUrl: string;
  highlightVan?: boolean;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [headlineEdit, setHeadlineEdit] = useState(headline);
  const [featuresEdit, setFeaturesEdit] = useState(() => cloneFeatures(features));
  const [savingValue, setSavingValue] = useState(false);

  const displayFeatures = isAdmin ? featuresEdit : features;
  const visible = displayFeatures.filter(isVisible);

  async function onVanFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    const r = await uploadVanImage(fd);
    if ("error" in r && r.error) alert(r.error);
    else router.refresh();
  }

  async function onClearVan() {
    if (!confirm("Remove custom image and use the default site image?")) return;
    const r = await clearVanImage();
    if ("error" in r && r.error) alert(r.error);
    else router.refresh();
  }

  async function saveValueFeatures() {
    setSavingValue(true);
    const fd = new FormData();
    fd.set("home_value_headline", headlineEdit);
    fd.set("home_value_features_json", JSON.stringify(featuresEdit));
    const r = await updateHomeValueFeatures(fd);
    setSavingValue(false);
    if ("error" in r && r.error) alert(r.error);
    else router.refresh();
  }

  function addFeature() {
    setFeaturesEdit((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        icon_key: "CarFront",
        title: "New point",
        body: "Description",
        visible: true,
      },
    ]);
  }

  return (
    <section className="relative overflow-hidden bg-[#083D6B] py-24 text-white" id="why-choose">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55 }}
          >
            {isAdmin ? (
              <div className="mb-8 rounded-xl border border-white/20 bg-black/40 p-4 backdrop-blur-md md:p-5">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#E6B31E]">
                  Why choose us
                </p>
                <label className="mb-4 block text-xs text-white/85">
                  Headline
                  <input
                    value={headlineEdit}
                    onChange={(e) => setHeadlineEdit(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
                  />
                </label>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                  Features
                </p>
                <ul className="mb-4 max-h-[min(52vh,28rem)] space-y-3 overflow-y-auto pr-1">
                  {featuresEdit.map((f, i) => (
                    <li
                      key={f.id}
                      className="rounded-lg border border-white/15 bg-black/25 p-3 text-xs text-white/90"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          title="Move up"
                          className="rounded border border-white/20 p-1 hover:bg-white/10 disabled:opacity-30"
                          disabled={i === 0}
                          onClick={() =>
                            setFeaturesEdit((prev) => moveRow(prev, i, -1))
                          }
                        >
                          <ChevronUp className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          title="Move down"
                          className="rounded border border-white/20 p-1 hover:bg-white/10 disabled:opacity-30"
                          disabled={i === featuresEdit.length - 1}
                          onClick={() =>
                            setFeaturesEdit((prev) => moveRow(prev, i, 1))
                          }
                        >
                          <ChevronDown className="h-4 w-4" aria-hidden />
                        </button>
                        <label className="ml-auto flex items-center gap-2 text-[10px] uppercase tracking-wide">
                          <input
                            type="checkbox"
                            checked={f.visible !== false}
                            onChange={(e) =>
                              setFeaturesEdit((prev) =>
                                prev.map((row, j) =>
                                  j === i
                                    ? { ...row, visible: e.target.checked }
                                    : row,
                                ),
                              )
                            }
                          />
                          Show
                        </label>
                        <button
                          type="button"
                          title="Remove"
                          className="rounded border border-red-400/40 p-1 text-red-200 hover:bg-red-500/20"
                          onClick={() =>
                            setFeaturesEdit((prev) => prev.filter((_, j) => j !== i))
                          }
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                      <label className="mb-2 block">
                        Icon
                        <select
                          value={f.icon_key}
                          onChange={(e) =>
                            setFeaturesEdit((prev) =>
                              prev.map((row, j) =>
                                j === i
                                  ? {
                                      ...row,
                                      icon_key: e.target
                                        .value as HomeValueFeatureCms["icon_key"],
                                    }
                                  : row,
                              ),
                            )
                          }
                          className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-2 py-1.5 text-sm text-white"
                        >
                          {ICON_KEYS.map((k) => (
                            <option key={k} value={k} className="bg-[#083D6B]">
                              {k}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="mb-2 block">
                        Title
                        <input
                          value={f.title}
                          onChange={(e) =>
                            setFeaturesEdit((prev) =>
                              prev.map((row, j) =>
                                j === i ? { ...row, title: e.target.value } : row,
                              ),
                            )
                          }
                          className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-2 py-1.5 text-sm text-white"
                        />
                      </label>
                      <label className="block">
                        Body
                        <textarea
                          value={f.body}
                          onChange={(e) =>
                            setFeaturesEdit((prev) =>
                              prev.map((row, j) =>
                                j === i ? { ...row, body: e.target.value } : row,
                              ),
                            )
                          }
                          rows={2}
                          className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-2 py-1.5 text-sm text-white"
                        />
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={addFeature}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                    Add feature
                  </button>
                  <button
                    type="button"
                    disabled={savingValue}
                    onClick={() => void saveValueFeatures()}
                    className="rounded-lg bg-[#E6B31E] px-4 py-2 text-sm font-bold text-[#251a00] disabled:opacity-50"
                  >
                    {savingValue ? "Saving…" : "Save headline & features"}
                  </button>
                </div>
              </div>
            ) : null}
            <div className="mb-3 h-1 w-16 rounded-full bg-[#E6B31E]" aria-hidden />
            <h2 className="mb-10 font-[family-name:var(--font-montserrat)] text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
              {isAdmin ? headlineEdit : headline}
            </h2>
            <div className="space-y-8">
              {visible.map((f, i) => {
                const Icon = ICON_MAP[f.icon_key] ?? CarFront;
                return (
                  <motion.div
                    key={f.id}
                    className="flex gap-6"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.45 }}
                  >
                    <div className="h-fit rounded-lg bg-[#E6B31E]/20 p-4">
                      <Icon className="h-6 w-6 text-[#E6B31E]" aria-hidden />
                    </div>
                    <div>
                      <h4 className="mb-2 text-xl font-bold">{f.title}</h4>
                      <p className="text-white/75">{f.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className={`relative rounded-lg ${
              highlightVan ? "ring-2 ring-inset ring-[#E6B31E]/90" : ""
            }`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#E6B31E]/10 blur-3xl" aria-hidden />
            <Image
              src={vanImageUrl}
              alt="Why choose us — feature image"
              width={900}
              height={560}
              className="relative z-10 h-[420px] w-full rounded-lg object-cover object-center shadow-2xl transition-all duration-500 hover:brightness-105 md:h-[500px]"
              unoptimized
            />
            {isAdmin ? (
              <div className="pointer-events-auto absolute inset-x-3 bottom-3 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-white/20 bg-black/50 p-2.5 backdrop-blur-md md:inset-x-4 md:bottom-4">
                <span className="w-full text-[10px] font-semibold uppercase tracking-wider text-[#E6B31E] md:w-auto md:mr-1">
                  Section image
                </span>
                <label className="cursor-pointer rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15">
                  Replace
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => void onVanFile(e)}
                  />
                </label>
                <button
                  type="button"
                  title="Use default site image"
                  onClick={() => void onClearVan()}
                  className="rounded-lg border border-white/30 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
                >
                  Use default
                </button>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ValueSection(props: {
  headline: string;
  features: HomeValueFeatureCms[];
  vanImageUrl: string;
  highlightVan?: boolean;
  isAdmin?: boolean;
}) {
  const resetKey = valueSectionResetKey(props.headline, props.features);
  return <ValueSectionInner key={resetKey} {...props} />;
}
