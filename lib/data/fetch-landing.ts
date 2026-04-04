import { mergeToPublicSiteContent, normalizeSiteRow } from "@/lib/cms/merge-site-content";
import type { PublicSiteContent } from "@/lib/cms/merge-site-content";
import { DEFAULT_SITE_CONTENT } from "@/lib/data/defaults";
import { createClient } from "@/lib/supabase/server";
import type { SiteContent } from "@/lib/types/database";

export type LandingData = {
  publicContent: PublicSiteContent;
  siteContent: SiteContent;
};

export async function fetchLandingData(): Promise<LandingData> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return {
      publicContent: mergeToPublicSiteContent(null),
      siteContent: { ...DEFAULT_SITE_CONTENT },
    };
  }

  const supabase = await createClient();
  const siteRes = await supabase
    .from("site_content")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const siteContent = normalizeSiteRow(siteRes.data as Record<string, unknown> | null);
  const publicContent = mergeToPublicSiteContent(siteContent);

  return { publicContent, siteContent };
}
