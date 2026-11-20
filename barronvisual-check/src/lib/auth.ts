import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminEmails } from "@/lib/env";
import type { Profile } from "@/types/db";

/** Usuario verificado contra Supabase Auth (no se fía solo de la cookie). Una vez por petición. */
export const getUser = cache(async (): Promise<User | null> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (data) return data as Profile;

  // El trigger crea el perfil al registrarse; si faltara (usuarios anteriores), se crea aquí.
  const admin = createAdminClient();
  const { data: created } = await admin
    .from("profiles")
    .upsert({ id: user.id, email: user.email ?? "" }, { onConflict: "id" })
    .select("*")
    .single();
  return (created as Profile) ?? null;
});

export async function requireUser(next = "/panel"): Promise<{ user: User; profile: Profile }> {
  const user = await getUser();
  if (!user) redirect(`/entrar?next=${encodeURIComponent(next)}`);
  const profile = await getProfile();
  if (!profile) redirect(`/entrar?next=${encodeURIComponent(next)}`);
  return { user, profile };
}

export function isAdmin(profile: Pick<Profile, "role" | "email"> | null | undefined): boolean {
  if (!profile) return false;
  return profile.role === "admin" || adminEmails().includes(profile.email.toLowerCase());
}

export async function requireAdmin(): Promise<{ user: User; profile: Profile }> {
  const ctx = await requireUser("/admin");
  if (!isAdmin(ctx.profile)) redirect("/panel");
  return ctx;
}

/** Última visita (analítica de actividad). Como mucho una escritura por hora. */
export async function touchLastSeen(profile: Pick<Profile, "id" | "last_seen_at">): Promise<void> {
  if (profile.last_seen_at && Date.now() - new Date(profile.last_seen_at).getTime() < 3600_000) return;
  try {
    await createAdminClient().from("profiles").update({ last_seen_at: new Date().toISOString() }).eq("id", profile.id);
  } catch {
    // no es crítico
  }
}
