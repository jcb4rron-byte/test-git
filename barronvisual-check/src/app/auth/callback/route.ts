import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { attachReferral, REF_COOKIE } from "@/lib/affiliates";
import { sendTemplate } from "@/lib/email/send";
import { track } from "@/lib/analytics";
import { safeNext } from "@/lib/utils";

export const runtime = "nodejs";

// Vuelta de Google (code, PKCE) y de los enlaces de email (token_hash).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"));

  let supabase: Awaited<ReturnType<typeof createClient>> | null = null;
  let ok = false;
  try {
    supabase = await createClient();
    if (code) {
      ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
    } else if (tokenHash && type) {
      ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
    }
  } catch (e) {
    console.error("auth/callback", e);
    ok = false;
  }
  if (!ok || !supabase) return NextResponse.redirect(`${origin}/entrar?error=enlace`);

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const response = NextResponse.redirect(`${origin}${next}`);

  if (user) {
    // Referido: cookie (aceptada en la web) o el código guardado al registrarse por email.
    const ref = request.cookies.get(REF_COOKIE)?.value ?? (user.user_metadata?.ref as string | undefined);
    await attachReferral(user.id, ref);
    if (request.cookies.get(REF_COOKIE)) response.cookies.delete(REF_COOKIE);

    const admin = createAdminClient();
    const { count } = await admin.from("events").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("name", "signup");
    if ((count ?? 0) === 0) {
      await track("signup", { provider: user.app_metadata?.provider ?? "email" }, user.id);
      await sendTemplate(user.id, "welcome", `welcome:${user.id}`);
    } else {
      await track("login", { provider: user.app_metadata?.provider ?? "email" }, user.id);
    }
  }
  return response;
}
