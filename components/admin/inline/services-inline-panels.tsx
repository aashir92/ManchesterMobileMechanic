"use client";

import type {
  ElectricalGroupCms,
  MechanicalLineCms,
  ServicesPageContent,
} from "@/lib/cms/services-schema";
import type { Dispatch, SetStateAction } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

const panelClass =
  "rounded-xl border border-[#083D6B]/15 bg-white/95 p-4 shadow-sm backdrop-blur-sm";
const labelClass = "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#083D6B]";
const inputClass =
  "mt-0.5 w-full rounded-lg border border-[#083D6B]/15 bg-white px-3 py-2 text-sm text-[#191c1d]";
const btnGold =
  "rounded-lg bg-[#E6B31E] px-3 py-2 text-xs font-bold text-[#251a00] hover:brightness-105 disabled:opacity-50";
const btnGhost =
  "rounded-lg border border-[#083D6B]/20 px-2 py-1 text-xs font-medium text-[#083D6B] hover:bg-[#083D6B]/5";

function newId() {
  return crypto.randomUUID();
}

export function ServicesIntroInline({
  variant,
  draft,
  setDraft,
  onSave,
  saving,
}: {
  variant: "home" | "full";
  draft: ServicesPageContent;
  setDraft: Dispatch<SetStateAction<ServicesPageContent>>;
  onSave: () => void | Promise<void>;
  saving: boolean;
}) {
  const subtitle =
    variant === "home" ? draft.home.intro_subtitle : draft.full.intro_subtitle;
  const setSubtitle = (v: string) => {
    setDraft((d) =>
      variant === "home"
        ? { ...d, home: { ...d.home, intro_subtitle: v } }
        : { ...d, full: { ...d.full, intro_subtitle: v } },
    );
  };

  return (
    <div className={`${panelClass} mb-4 border-white/20 bg-black/35 text-white backdrop-blur-md`}>
      <p className={labelClass + " text-[#E6B31E]/90"}>Section intro</p>
      <label className="mb-2 block text-xs text-white/85">
        Eyebrow
        <input
          value={draft.home.intro_eyebrow}
          onChange={(e) =>
            setDraft((d) => ({ ...d, home: { ...d.home, intro_eyebrow: e.target.value } }))
          }
          className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="mb-2 block text-xs text-white/85">
        Title
        <input
          value={draft.home.intro_title}
          onChange={(e) =>
            setDraft((d) => ({ ...d, home: { ...d.home, intro_title: e.target.value } }))
          }
          className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="mb-3 block text-xs text-white/85">
        {variant === "home" ? "Subtitle (home)" : "Subtitle (services page)"}
        <textarea
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
        />
      </label>
      <button type="button" disabled={saving} className={btnGold} onClick={() => void onSave()}>
        {saving ? "Saving…" : "Save intro"}
      </button>
    </div>
  );
}

export function ServicesHomeInline({
  draft,
  setDraft,
  onSave,
  saving,
}: {
  draft: ServicesPageContent;
  setDraft: Dispatch<SetStateAction<ServicesPageContent>>;
  onSave: () => void | Promise<void>;
  saving: boolean;
}) {
  const h = draft.home;

  function moveMech(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= h.mechanical_items.length) return;
    setDraft((d) => {
      const arr = [...d.home.mechanical_items];
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
      return { ...d, home: { ...d.home, mechanical_items: arr } };
    });
  }

  function moveElec(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= h.electrical_summaries.length) return;
    setDraft((d) => {
      const arr = [...d.home.electrical_summaries];
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
      return { ...d, home: { ...d.home, electrical_summaries: arr } };
    });
  }

  return (
    <div className="space-y-4">
      <div className={panelClass}>
        <p className={labelClass}>Spotlight image & overlay</p>
        <label className="mb-2 block text-sm">
          Image URL
          <input
            value={h.spotlight_image_url}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                home: { ...d.home, spotlight_image_url: e.target.value },
              }))
            }
            className={inputClass + " font-mono text-xs"}
          />
        </label>
        <label className="mb-2 block text-sm">
          Kicker (e.g. WORKSHOP QUALITY)
          <input
            value={h.spotlight_kicker}
            onChange={(e) =>
              setDraft((d) => ({ ...d, home: { ...d.home, spotlight_kicker: e.target.value } }))
            }
            className={inputClass}
          />
        </label>
        <label className="mb-2 block text-sm">
          Spotlight title
          <input
            value={h.spotlight_title}
            onChange={(e) =>
              setDraft((d) => ({ ...d, home: { ...d.home, spotlight_title: e.target.value } }))
            }
            className={inputClass}
          />
        </label>
      </div>

      <div className={panelClass}>
        <p className={labelClass}>Card titles</p>
        <label className="mb-2 block text-sm">
          Mechanical card title
          <input
            value={h.mechanical_card_title}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                home: { ...d.home, mechanical_card_title: e.target.value },
              }))
            }
            className={inputClass}
          />
        </label>
        <label className="mb-2 block text-sm">
          Electrical card title
          <input
            value={h.electrical_card_title}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                home: { ...d.home, electrical_card_title: e.target.value },
              }))
            }
            className={inputClass}
          />
        </label>
      </div>

      <div className={panelClass}>
        <p className={labelClass}>Mechanical list (home)</p>
        <ul className="space-y-2">
          {h.mechanical_items.map((item, i) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-[#083D6B]/10 p-2"
            >
              <input
                value={item.title}
                onChange={(e) => {
                  const t = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    home: {
                      ...d.home,
                      mechanical_items: d.home.mechanical_items.map((x, k) =>
                        k === i ? { ...x, title: t } : x,
                      ),
                    },
                  }));
                }}
                className="min-w-[12rem] flex-1 rounded border border-[#083D6B]/15 px-2 py-1 text-sm"
              />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={item.visible !== false}
                  onChange={(e) => {
                    const vis = e.target.checked;
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        mechanical_items: d.home.mechanical_items.map((x, k) =>
                          k === i ? { ...x, visible: vis } : x,
                        ),
                      },
                    }));
                  }}
                />
                Show
              </label>
              <div className="flex gap-0.5">
                <button type="button" className={btnGhost} title="Up" onClick={() => moveMech(i, -1)}>
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button type="button" className={btnGhost} title="Down" onClick={() => moveMech(i, 1)}>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={btnGhost}
                  title="Remove"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        mechanical_items: d.home.mechanical_items.filter((_, k) => k !== i),
                      },
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${btnGhost} mt-2 inline-flex items-center gap-1`}
          onClick={() =>
            setDraft((d) => ({
              ...d,
              home: {
                ...d.home,
                mechanical_items: [
                  ...d.home.mechanical_items,
                  { id: newId(), title: "New service line", visible: true },
                ],
              },
            }))
          }
        >
          <Plus className="h-4 w-4" /> Add line
        </button>
      </div>

      <div className={panelClass}>
        <p className={labelClass}>Electrical summary pills</p>
        <ul className="space-y-2">
          {h.electrical_summaries.map((item, i) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-[#083D6B]/10 p-2"
            >
              <input
                value={item.heading}
                onChange={(e) => {
                  const t = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    home: {
                      ...d.home,
                      electrical_summaries: d.home.electrical_summaries.map((x, k) =>
                        k === i ? { ...x, heading: t } : x,
                      ),
                    },
                  }));
                }}
                className="min-w-[12rem] flex-1 rounded border border-[#083D6B]/15 px-2 py-1 text-sm"
              />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={item.visible !== false}
                  onChange={(e) => {
                    const vis = e.target.checked;
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        electrical_summaries: d.home.electrical_summaries.map((x, k) =>
                          k === i ? { ...x, visible: vis } : x,
                        ),
                      },
                    }));
                  }}
                />
                Show
              </label>
              <div className="flex gap-0.5">
                <button type="button" className={btnGhost} onClick={() => moveElec(i, -1)}>
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button type="button" className={btnGhost} onClick={() => moveElec(i, 1)}>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        electrical_summaries: d.home.electrical_summaries.filter((_, k) => k !== i),
                      },
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${btnGhost} mt-2 inline-flex items-center gap-1`}
          onClick={() =>
            setDraft((d) => ({
              ...d,
              home: {
                ...d.home,
                electrical_summaries: [
                  ...d.home.electrical_summaries,
                  { id: newId(), heading: "New category", visible: true },
                ],
              },
            }))
          }
        >
          <Plus className="h-4 w-4" /> Add pill
        </button>
      </div>

      <button type="button" disabled={saving} className={btnGold} onClick={() => void onSave()}>
        {saving ? "Saving…" : "Save services (home block)"}
      </button>
    </div>
  );
}

function moveMechanical(arr: MechanicalLineCms[], i: number, dir: -1 | 1) {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j]!, next[i]!];
  return next;
}

function moveGroup(arr: ElectricalGroupCms[], i: number, dir: -1 | 1) {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j]!, next[i]!];
  return next;
}

function moveItem<T>(items: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= items.length) return items;
  const next = [...items];
  [next[i], next[j]] = [next[j]!, next[i]!];
  return next;
}

export function ServicesFullInline({
  draft,
  setDraft,
  onSave,
  saving,
}: {
  draft: ServicesPageContent;
  setDraft: Dispatch<SetStateAction<ServicesPageContent>>;
  onSave: () => void | Promise<void>;
  saving: boolean;
}) {
  const f = draft.full;

  return (
    <div className="space-y-4">
      <div className={panelClass}>
        <p className={labelClass}>Section titles</p>
        <label className="mb-2 block text-sm">
          Mechanical section title
          <input
            value={f.mechanical_section_title}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                full: { ...d.full, mechanical_section_title: e.target.value },
              }))
            }
            className={inputClass}
          />
        </label>
        <label className="mb-2 block text-sm">
          Electrical section title
          <input
            value={f.electrical_section_title}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                full: { ...d.full, electrical_section_title: e.target.value },
              }))
            }
            className={inputClass}
          />
        </label>
      </div>

      <div className={panelClass}>
        <p className={labelClass}>Mechanical services (full page)</p>
        <ul className="space-y-3">
          {f.mechanical.map((item, i) => (
            <li key={item.id} className="rounded-lg border border-[#083D6B]/10 p-3">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={item.visible !== false}
                    onChange={(e) => {
                      const vis = e.target.checked;
                      setDraft((d) => ({
                        ...d,
                        full: {
                          ...d.full,
                          mechanical: d.full.mechanical.map((x, k) =>
                            k === i ? { ...x, visible: vis } : x,
                          ),
                        },
                      }));
                    }}
                  />
                  Show
                </label>
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      full: {
                        ...d.full,
                        mechanical: moveMechanical(d.full.mechanical, i, -1),
                      },
                    }))
                  }
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      full: {
                        ...d.full,
                        mechanical: moveMechanical(d.full.mechanical, i, 1),
                      },
                    }))
                  }
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      full: {
                        ...d.full,
                        mechanical: d.full.mechanical.filter((_, k) => k !== i),
                      },
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <input
                value={item.title}
                onChange={(e) => {
                  const t = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    full: {
                      ...d.full,
                      mechanical: d.full.mechanical.map((x, k) =>
                        k === i ? { ...x, title: t } : x,
                      ),
                    },
                  }));
                }}
                className={inputClass + " mb-2 font-semibold"}
                placeholder="Title"
              />
              <textarea
                value={item.description}
                onChange={(e) => {
                  const t = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    full: {
                      ...d.full,
                      mechanical: d.full.mechanical.map((x, k) =>
                        k === i ? { ...x, description: t } : x,
                      ),
                    },
                  }));
                }}
                rows={3}
                className={inputClass}
                placeholder="Description"
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${btnGhost} mt-2 inline-flex items-center gap-1`}
          onClick={() =>
            setDraft((d) => ({
              ...d,
              full: {
                ...d.full,
                mechanical: [
                  ...d.full.mechanical,
                  {
                    id: newId(),
                    title: "New service",
                    description: "",
                    visible: true,
                  },
                ],
              },
            }))
          }
        >
          <Plus className="h-4 w-4" /> Add mechanical line
        </button>
      </div>

      <div className={panelClass}>
        <p className={labelClass}>Auto electrical groups</p>
        {f.electrical_groups.map((group, gi) => (
          <div key={group.id} className="mb-4 rounded-lg border border-[#E6B31E]/40 bg-[#F8FAFC] p-3">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <input
                value={group.heading}
                onChange={(e) => {
                  const t = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    full: {
                      ...d.full,
                      electrical_groups: d.full.electrical_groups.map((g, k) =>
                        k === gi ? { ...g, heading: t } : g,
                      ),
                    },
                  }));
                }}
                className={inputClass + " font-bold"}
              />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={group.visible !== false}
                  onChange={(e) => {
                    const vis = e.target.checked;
                    setDraft((d) => ({
                      ...d,
                      full: {
                        ...d.full,
                        electrical_groups: d.full.electrical_groups.map((g, k) =>
                          k === gi ? { ...g, visible: vis } : g,
                        ),
                      },
                    }));
                  }}
                />
                Show group
              </label>
              <button
                type="button"
                className={btnGhost}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    full: {
                      ...d.full,
                      electrical_groups: moveGroup(d.full.electrical_groups, gi, -1),
                    },
                  }))
                }
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={btnGhost}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    full: {
                      ...d.full,
                      electrical_groups: moveGroup(d.full.electrical_groups, gi, 1),
                    },
                  }))
                }
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={btnGhost}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    full: {
                      ...d.full,
                      electrical_groups: d.full.electrical_groups.filter((_, k) => k !== gi),
                    },
                  }))
                }
              >
                Remove group
              </button>
            </div>
            <ul className="space-y-2 border-l-2 border-[#083D6B]/20 pl-3">
              {group.items.map((item, ii) => (
                <li key={item.id} className="rounded border border-[#083D6B]/10 bg-white p-2">
                  <div className="mb-1 flex flex-wrap gap-1">
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={item.visible !== false}
                        onChange={(e) => {
                          const vis = e.target.checked;
                          setDraft((d) => ({
                            ...d,
                            full: {
                              ...d.full,
                              electrical_groups: d.full.electrical_groups.map((g, k) =>
                                k === gi
                                  ? {
                                      ...g,
                                      items: g.items.map((it, j) =>
                                        j === ii ? { ...it, visible: vis } : it,
                                      ),
                                    }
                                  : g,
                              ),
                            },
                          }));
                        }}
                      />
                      Show
                    </label>
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          full: {
                            ...d.full,
                            electrical_groups: d.full.electrical_groups.map((g, k) =>
                              k === gi
                                ? { ...g, items: moveItem(g.items, ii, -1) }
                                : g,
                            ),
                          },
                        }))
                      }
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          full: {
                            ...d.full,
                            electrical_groups: d.full.electrical_groups.map((g, k) =>
                              k === gi
                                ? { ...g, items: moveItem(g.items, ii, 1) }
                                : g,
                            ),
                          },
                        }))
                      }
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          full: {
                            ...d.full,
                            electrical_groups: d.full.electrical_groups.map((g, k) =>
                              k === gi
                                ? {
                                    ...g,
                                    items: g.items.filter((_, j) => j !== ii),
                                  }
                                : g,
                            ),
                          },
                        }))
                      }
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <input
                    value={item.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      setDraft((d) => ({
                        ...d,
                        full: {
                          ...d.full,
                          electrical_groups: d.full.electrical_groups.map((g, k) =>
                            k === gi
                              ? {
                                  ...g,
                                  items: g.items.map((it, j) =>
                                    j === ii ? { ...it, title: t } : it,
                                  ),
                                }
                              : g,
                          ),
                        },
                      }));
                    }}
                    className="mb-1 w-full rounded border px-2 py-1 text-sm font-semibold"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      const t = e.target.value;
                      setDraft((d) => ({
                        ...d,
                        full: {
                          ...d.full,
                          electrical_groups: d.full.electrical_groups.map((g, k) =>
                            k === gi
                              ? {
                                  ...g,
                                  items: g.items.map((it, j) =>
                                    j === ii ? { ...it, description: t } : it,
                                  ),
                                }
                              : g,
                          ),
                        },
                      }));
                    }}
                    rows={2}
                    className="w-full rounded border px-2 py-1 text-xs"
                  />
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`${btnGhost} mt-2 text-xs`}
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  full: {
                    ...d.full,
                    electrical_groups: d.full.electrical_groups.map((g, k) =>
                      k === gi
                        ? {
                            ...g,
                            items: [
                              ...g.items,
                              {
                                id: newId(),
                                title: "New item",
                                description: "",
                                visible: true,
                              },
                            ],
                          }
                        : g,
                    ),
                  },
                }))
              }
            >
              + Item in this group
            </button>
          </div>
        ))}
        <button
          type="button"
          className={`${btnGhost} inline-flex items-center gap-1`}
          onClick={() =>
            setDraft((d) => ({
              ...d,
              full: {
                ...d.full,
                electrical_groups: [
                  ...d.full.electrical_groups,
                  {
                    id: newId(),
                    heading: "New group",
                    summary: "",
                    visible: true,
                    items: [],
                  },
                ],
              },
            }))
          }
        >
          <Plus className="h-4 w-4" /> Add electrical group
        </button>
      </div>

      <button type="button" disabled={saving} className={btnGold} onClick={() => void onSave()}>
        {saving ? "Saving…" : "Save services (full page)"}
      </button>
    </div>
  );
}
