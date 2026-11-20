import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Analítica de producto propia: eventos en Postgres, sin cookies ni terceros.
// Nunca se guardan datos personales en props (ni email ni nombre): solo ids y valores de producto.

export const EVENT_NAMES = [
  "signup",
  "login",
  "onboarding_completed",
  "report_created",
  "report_failed",
  "limit_reached",
  "upgrade_prompt_shown",
  "upgrade_clicked",
  "checkout_started",
  "subscription_started",
  "subscription_canceled",
  "payment_failed",
  "upsell_clicked",
  "pricing_viewed",
  "affiliate_joined",
  "referral_attached",
  "commission_created",
  "account_deleted",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

/** Eventos que el navegador puede enviar por /api/events (el resto solo los genera el servidor). */
export const CLIENT_EVENTS: ReadonlySet<EventName> = new Set<EventName>([
  "upgrade_prompt_shown",
  "upgrade_clicked",
  "upsell_clicked",
  "pricing_viewed",
]);

export async function track(name: EventName, props: Record<string, unknown> = {}, userId?: string | null): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("events").insert({ name, props, user_id: userId ?? null });
  } catch (e) {
    // La analítica nunca rompe una petición.
    console.error("track", name, e);
  }
}
