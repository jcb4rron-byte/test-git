import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseSecretKey, supabaseUrl } from "@/lib/env";

// Service role: salta RLS. SOLO en servidor (webhooks, cuotas, IA, panel de admin).
export function createAdminClient() {
  return createClient(supabaseUrl(), supabaseSecretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const IMAGES_BUCKET = "report-images";
