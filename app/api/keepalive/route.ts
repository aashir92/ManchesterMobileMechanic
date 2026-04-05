import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Lightweight GET for external cron (UptimeRobot, cron-job.org, GitHub Actions, etc.).
 * Runs one small read against Supabase so the project may count as "active" on the free tier.
 * Optional: set CRON_SECRET and send header Authorization: Bearer <secret>.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ ok: true, skipped: "supabase_not_configured" });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("site_content").select("id").eq("id", 1).maybeSingle();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
