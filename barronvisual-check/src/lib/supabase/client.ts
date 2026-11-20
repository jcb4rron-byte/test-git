"use client";

import { createBrowserClient } from "@supabase/ssr";

// En el navegador solo se usa para Auth (Google, email). Los datos se leen en el servidor.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
  );
}
