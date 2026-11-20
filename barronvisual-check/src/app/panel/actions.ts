"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod/v4";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, IMAGES_BUCKET } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { track } from "@/lib/analytics";
import { STORE_TYPES } from "@/lib/ai/schemas";

export type FormState = { error?: string; message?: string } | undefined;

const ProfileSchema = z.object({
  full_name: z.string().trim().max(80).optional(),
  store_name: z.string().trim().max(80).optional(),
  store_type: z.enum(STORE_TYPES).optional(),
  city: z.string().trim().max(80).optional(),
});

function profileFields(formData: FormData) {
  const get = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" && v.trim() ? v : undefined;
  };
  return ProfileSchema.safeParse({
    full_name: get("full_name"),
    store_name: get("store_name"),
    store_type: get("store_type"),
    city: get("city"),
  });
}

export async function completeOnboarding(_: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireUser();
  const parsed = profileFields(formData);
  if (!parsed.success) return { error: "Revisa los datos." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ ...parsed.data, onboarded_at: new Date().toISOString() })
    .eq("id", user.id);
  if (error) return { error: "No se han podido guardar los datos." };
  await track("onboarding_completed", { store_type: parsed.data.store_type ?? null }, user.id);
  redirect("/panel/revisar");
}

export async function updateProfile(_: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireUser();
  const parsed = profileFields(formData);
  if (!parsed.success) return { error: "Revisa los datos." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ ...parsed.data, marketing_opt_in: formData.get("marketing_opt_in") === "on" })
    .eq("id", user.id);
  if (error) return { error: "No se han podido guardar los cambios." };
  revalidatePath("/panel", "layout");
  return { message: "Cambios guardados." };
}

export async function deleteReport(formData: FormData) {
  const { user } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const admin = createAdminClient();
  const { data } = await admin.from("reports").select("image_paths").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!data) return;
  if (data.image_paths?.length) await admin.storage.from(IMAGES_BUCKET).remove(data.image_paths as string[]);
  // Con la sesión de la persona: RLS garantiza que solo borra lo suyo.
  const supabase = await createClient();
  await supabase.from("reports").delete().eq("id", id);
  revalidatePath("/panel/informes");
  redirect("/panel/informes");
}

/** Derecho de supresión (RGPD): cancela la suscripción, borra fotos, datos y la cuenta. */
export async function deleteAccount(_: FormState, formData: FormData): Promise<FormState> {
  const { user, profile } = await requireUser();
  if (formData.get("confirm") !== "BORRAR") return { error: "Escribe BORRAR para confirmar." };
  const admin = createAdminClient();

  try {
    if (profile.stripe_customer_id && process.env.STRIPE_SECRET_KEY) {
      const subs = await getStripe().subscriptions.list({ customer: profile.stripe_customer_id, status: "all", limit: 20 });
      for (const s of subs.data) {
        if (!["canceled", "incomplete_expired"].includes(s.status)) await getStripe().subscriptions.cancel(s.id);
      }
    }
    const { data: files } = await admin.storage.from(IMAGES_BUCKET).list(user.id, { limit: 1000 });
    for (const folder of files ?? []) {
      const { data: inner } = await admin.storage.from(IMAGES_BUCKET).list(`${user.id}/${folder.name}`, { limit: 100 });
      const paths = (inner ?? []).map((f) => `${user.id}/${folder.name}/${f.name}`);
      if (paths.length) await admin.storage.from(IMAGES_BUCKET).remove(paths);
    }
    await track("account_deleted", {}, null);
    const { error } = await admin.auth.admin.deleteUser(user.id); // borra en cascada perfil, informes y uso
    if (error) throw error;
  } catch (e) {
    console.error("deleteAccount", e);
    return { error: `No se ha podido borrar la cuenta. Escríbenos y lo hacemos a mano.` };
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/?cuenta=borrada");
}

const AffiliateSchema = z.object({
  code: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{3,24}$/, { error: "Usa de 3 a 24 letras minúsculas, números o guiones." }),
  website: z.string().trim().max(200).optional(),
  audience: z.string().trim().max(500).optional(),
});

export async function joinAffiliates(_: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireUser();
  if (formData.get("terms") !== "on") return { error: "Acepta las condiciones del programa." };
  const parsed = AffiliateSchema.safeParse({
    code: formData.get("code"),
    website: (formData.get("website") as string) || undefined,
    audience: (formData.get("audience") as string) || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const admin = createAdminClient();
  // Se crea con el servidor: la persona no puede elegir comisión ni estado.
  const { error } = await admin.from("affiliates").insert({ user_id: user.id, ...parsed.data });
  if (error) {
    return { error: error.code === "23505" ? "Ese código ya está cogido o ya tienes una solicitud." : "No se ha podido enviar la solicitud." };
  }
  await track("affiliate_joined", {}, user.id);
  revalidatePath("/panel/afiliados");
  return { message: "Solicitud enviada. Te avisamos por email cuando esté aprobada." };
}
