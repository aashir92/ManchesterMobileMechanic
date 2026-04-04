import {
  AUTO_ELECTRICAL_GROUPS,
  MECHANICAL_SERVICE_ITEMS,
  SERVICES_HOME_SPOTLIGHT_IMAGE,
} from "@/lib/data/defaults";
import type { ServicesPageContent } from "@/lib/cms/services-schema";

export function buildDefaultServicesPageContent(): ServicesPageContent {
  const mechanical = MECHANICAL_SERVICE_ITEMS.map((item, i) => ({
    id: `m-${i}`,
    title: item.title,
    description: item.description,
    visible: true,
  }));

  const electrical_groups = AUTO_ELECTRICAL_GROUPS.map((g, gi) => ({
    id: `g-${gi}`,
    heading: g.heading,
    summary: g.summary,
    visible: true,
    items: g.items.map((it, ii) => ({
      id: `g-${gi}-i-${ii}`,
      title: it.title,
      description: it.description,
      visible: true,
    })),
  }));

  return {
    version: 1,
    home: {
      intro_eyebrow: "What we offer",
      intro_title: "Our services",
      intro_subtitle:
        "Mechanical and auto electrical work at your doorstep — explore full details for each area below.",
      spotlight_image_url: SERVICES_HOME_SPOTLIGHT_IMAGE,
      spotlight_kicker: "Workshop quality",
      spotlight_title: "Oil, brakes, diagnostics & more",
      mechanical_card_title: "Mechanical services",
      electrical_card_title: "Auto electrical services",
      mechanical_items: MECHANICAL_SERVICE_ITEMS.map((item, i) => ({
        id: `hm-${i}`,
        title: item.title,
        visible: true,
      })),
      electrical_summaries: AUTO_ELECTRICAL_GROUPS.map((g, i) => ({
        id: `he-${i}`,
        heading: g.heading,
        visible: true,
      })),
    },
    full: {
      intro_subtitle:
        "Mechanical repairs and auto electrical work — at your doorstep across Manchester and surrounding areas.",
      mechanical_section_title: "Mechanical services",
      electrical_section_title: "Auto electrical services",
      mechanical,
      electrical_groups,
    },
  };
}
