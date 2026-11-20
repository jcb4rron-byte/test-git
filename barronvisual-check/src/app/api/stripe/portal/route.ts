import { NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/config/site";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";

// Portal de cliente de Stripe: cambiar tarjeta, descargar facturas, cancelar.
export async function POST() {
  const profile = await getProfile();
  if (!profile) return jsonError(401, "unauthorized", "Inicia sesión.");
  if (!profile.stripe_customer_id) return jsonError(400, "no_customer", "Todavía no tienes ninguna suscripción.");

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: absoluteUrl("/panel/suscripcion"),
      locale: "es",
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("portal", e);
    return jsonError(500, "portal_error", "No se ha podido abrir la gestión de la suscripción.");
  }
}
