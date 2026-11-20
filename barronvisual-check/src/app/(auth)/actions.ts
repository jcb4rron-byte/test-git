"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as z from "zod/v4";
import { createClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/config/site";
import { normalizeRef, REF_COOKIE } from "@/lib/affiliates";
import { safeNext } from "@/lib/utils";

export type AuthState = { error?: string; message?: string } | undefined;

const Email = z.email({ error: "Escribe un email válido." });
const Password = z.string().min(8, { error: "La contraseña necesita al menos 8 caracteres." });

const callbackUrl = (next: string) => absoluteUrl(`/auth/callback?next=${encodeURIComponent(next)}`);

export async function signInWithGoogle(formData: FormData) {
  const next = safeNext(formData.get("next") as string | null);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl(next) },
  });
  if (error || !data.url) redirect("/entrar?error=google");
  redirect(data.url);
}

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = Email.safeParse(formData.get("email"));
  const password = z.string().min(1).safeParse(formData.get("password"));
  if (!email.success) return { error: email.error.issues[0].message };
  if (!password.success) return { error: "Escribe tu contraseña." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: email.data, password: password.data });
  if (error) {
    return {
      error: error.code === "email_not_confirmed"
        ? "Confirma tu email con el enlace que te hemos enviado."
        : "Email o contraseña incorrectos.",
    };
  }
  redirect(safeNext(formData.get("next") as string | null));
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = Email.safeParse(formData.get("email"));
  const password = Password.safeParse(formData.get("password"));
  if (!email.success) return { error: email.error.issues[0].message };
  if (!password.success) return { error: password.error.issues[0].message };
  if (formData.get("terms") !== "on") return { error: "Necesitamos que aceptes las condiciones y la política de privacidad." };

  const ref = normalizeRef((await cookies()).get(REF_COOKIE)?.value ?? (formData.get("ref") as string | null));
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: email.data,
    password: password.data,
    options: {
      emailRedirectTo: callbackUrl("/panel/bienvenida"),
      data: {
        marketing_opt_in: formData.get("marketing") === "on" ? "true" : "false",
        ...(ref ? { ref } : {}),
      },
    },
  });
  if (error) {
    if (error.code === "user_already_exists") return { error: "Ya hay una cuenta con este email. Entra o recupera tu contraseña." };
    if (error.code === "weak_password") return { error: "Elige una contraseña más segura." };
    return { error: "No hemos podido crear la cuenta. Inténtalo de nuevo." };
  }
  return { message: "Te hemos enviado un enlace para confirmar tu email. Ábrelo desde este mismo dispositivo." };
}

export async function requestPasswordReset(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = Email.safeParse(formData.get("email"));
  if (!email.success) return { error: email.error.issues[0].message };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email.data, { redirectTo: callbackUrl("/nueva-contrasena") });
  // Mismo mensaje exista o no la cuenta (no revelar qué emails están registrados).
  return { message: "Si hay una cuenta con ese email, te llegará un enlace para elegir una contraseña nueva." };
}

export async function updatePassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const password = Password.safeParse(formData.get("password"));
  if (!password.success) return { error: password.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) return { error: "El enlace ha caducado. Pide uno nuevo." };
  redirect("/panel");
}

/** Guarda el código de afiliado solo tras el consentimiento de la persona (banner de la web). */
export async function acceptReferral(code: string) {
  const ref = normalizeRef(code);
  if (!ref) return;
  (await cookies()).set(REF_COOKIE, ref, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
}
