import { NextResponse } from "next/server";
import { getProfile, getUser } from "@/lib/auth";
import { ensureCustomer, getStripe, ivaTaxRate, priceIdFor } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { absoluteUrl } from "@/lib/config/site";
import { track } from "@/lib/analytics";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return jsonError(401, "unauthorized", "Inicia sesión para pasar a Pro.");
  const profile = await getProfile();
  if (!profile) return jsonError(401, "unauthorized", "Inicia sesión para pasar a Pro.");

  const body = (await request.json().catch(() => ({}))) as { interval?: string };
  const interval = body.interval === "year" ? "year" : "month";
  const price = priceIdFor(interval);
  if (!price) return jsonError(503, "not_configured", "Los pagos todavía no están activados.");

  // Si ya tiene una suscripción viva, se gestiona desde el portal (no se crea otra).
  const admin = createAdminClient();
  const { data: live } = await admin
    .from("subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing", "past_due"])
    .limit(1);
  if (live?.length) return NextResponse.json({ url: absoluteUrl("/panel/suscripcion") });

  try {
    const customer = await ensureCustomer(profile);
    const taxRate = ivaTaxRate();
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer,
      client_reference_id: user.id,
      // Igual que BARRON ACCESS: Checkout estándar, sin Managed Payments (exigiría tax_code).
      managed_payments: { enabled: false },
      line_items: [{ price, quantity: 1, ...(taxRate ? { tax_rates: [taxRate] } : {}) }],
      metadata: { user_id: user.id, interval },
      subscription_data: { metadata: { user_id: user.id } },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      customer_update: { name: "auto", address: "auto" },
      locale: "es",
      success_url: absoluteUrl("/panel/suscripcion?checkout=ok&session_id={CHECKOUT_SESSION_ID}"),
      cancel_url: absoluteUrl("/precios?checkout=cancel"),
    });
    await track("checkout_started", { interval }, user.id);
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("checkout", e);
    return jsonError(500, "checkout_error", "No se ha podido abrir el pago. Inténtalo de nuevo.");
  }
}
