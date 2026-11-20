import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { absoluteUrl } from "@/lib/config/site";
import { flag } from "@/lib/env";
import { sendWithBrevo } from "@/lib/email/brevo";
import { MARKETING_TEMPLATES, renderTemplate, type TemplateId } from "@/lib/email/templates";

/**
 * Envía una plantilla a una persona registrada, una sola vez por dedupeKey.
 * - Transaccionales: si EMAIL_ENABLED no es "false" y hay BREVO_API_KEY.
 * - Comerciales: además EMAIL_MARKETING_ENABLED=true (apagado por defecto: puerta de arranque)
 *   y consentimiento de la persona (marketing_opt_in).
 * Nunca lanza: un correo que falla no rompe un pago ni un webhook.
 */
export async function sendTemplate(userId: string, template: TemplateId, dedupeKey: string): Promise<"sent" | "skipped" | "failed"> {
  const admin = createAdminClient();
  try {
    const { data: profile } = await admin
      .from("profiles")
      .select("email, full_name, marketing_opt_in, unsubscribe_token")
      .eq("id", userId)
      .maybeSingle();
    if (!profile?.email) return "skipped";

    const isMarketing = MARKETING_TEMPLATES.has(template);
    const enabled = flag("EMAIL_ENABLED", true) && Boolean(process.env.BREVO_API_KEY);
    const marketingOk = !isMarketing || (flag("EMAIL_MARKETING_ENABLED", false) && profile.marketing_opt_in);
    if (!enabled || !marketingOk) return "skipped";

    // Reserva la clave antes de enviar: si ya existe, no se repite.
    const { error: dupError } = await admin.from("email_log").insert({ user_id: userId, template, dedupe_key: dedupeKey });
    if (dupError) return "skipped";

    const unsubscribeUrl = isMarketing ? absoluteUrl(`/api/unsubscribe?token=${profile.unsubscribe_token}`) : undefined;
    const rendered = renderTemplate(template, { name: profile.full_name, unsubscribeUrl });
    try {
      await sendWithBrevo({
        to: { email: profile.email, name: profile.full_name },
        ...rendered,
        unsubscribeUrl,
        tags: [template],
      });
      return "sent";
    } catch (e) {
      await admin.from("email_log").update({ status: "failed", error: String(e).slice(0, 500) }).eq("dedupe_key", dedupeKey);
      console.error("sendTemplate", template, e);
      return "failed";
    }
  } catch (e) {
    console.error("sendTemplate", template, e);
    return "failed";
  }
}
