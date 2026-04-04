import { z } from "zod";

export const iconKeySchema = z.enum([
  "CarFront",
  "Timer",
  "Receipt",
  "Trophy",
  "MapPin",
]);

export const mechanicalLineSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  visible: z.boolean().optional(),
});

export const electricalItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  visible: z.boolean().optional(),
});

export const electricalGroupSchema = z.object({
  id: z.string(),
  heading: z.string(),
  summary: z.string(),
  visible: z.boolean().optional(),
  items: z.array(electricalItemSchema),
});

export const homeMechanicalCardItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  visible: z.boolean().optional(),
});

export const homeElectricalSummarySchema = z.object({
  id: z.string(),
  heading: z.string(),
  visible: z.boolean().optional(),
});

export const servicesPageHomeSchema = z.object({
  intro_eyebrow: z.string(),
  intro_title: z.string(),
  intro_subtitle: z.string(),
  spotlight_image_url: z.string(),
  spotlight_kicker: z.string(),
  spotlight_title: z.string(),
  mechanical_card_title: z.string(),
  electrical_card_title: z.string(),
  mechanical_items: z.array(homeMechanicalCardItemSchema),
  electrical_summaries: z.array(homeElectricalSummarySchema),
});

export const servicesPageFullSchema = z.object({
  intro_subtitle: z.string(),
  mechanical_section_title: z.string(),
  electrical_section_title: z.string(),
  mechanical: z.array(mechanicalLineSchema),
  electrical_groups: z.array(electricalGroupSchema),
});

export const servicesPageContentSchema = z.object({
  version: z.number().int().optional(),
  home: servicesPageHomeSchema,
  full: servicesPageFullSchema,
});

export type ServicesPageContent = z.infer<typeof servicesPageContentSchema>;
export type MechanicalLineCms = z.infer<typeof mechanicalLineSchema>;
export type ElectricalGroupCms = z.infer<typeof electricalGroupSchema>;

export const homeValueFeatureSchema = z.object({
  id: z.string(),
  icon_key: iconKeySchema,
  title: z.string(),
  body: z.string(),
  visible: z.boolean().optional(),
});

export const homeValueFeaturesSchema = z.array(homeValueFeatureSchema);

export type HomeValueFeatureCms = z.infer<typeof homeValueFeatureSchema>;
