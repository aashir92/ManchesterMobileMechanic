import { createClient } from "@/lib/supabase/server";

export async function getPublicAuth(): Promise<{ isAdmin: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { isAdmin: !!user };
}
