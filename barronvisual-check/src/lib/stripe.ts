import "server-only";
import Stripe from "stripe";
import { requireEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BillingInterval } from "@/lib/config/plans";
import type { Profile } from "@/types/db";

// Se crea al primer uso: el build no necesita la clave.
let stripe: Stripe | null = null;
export function getStripe(): Stripe {
  stripe ??= new Stripe(requireEnv("STRIPE_SECRET_KEY"), { apiVersion: "2026-11-18.endive" });
  return stripe;
}

export function priceIdFor(interval: BillingInterval): string | null {
  return interval === "year"
    ? process.env.STRIPE_PRICE_PRO_YEARLY || null
    : process.env.STRIPE_PRICE_PRO_MONTHLY || null;
}

export const yearlyEnabled = () => Boolean(process.env.STRIPE_PRICE_PRO_YEARLY);

/** Tipo impositivo manual (IVA 21 % incluido en el precio), como en BARRON ACCESS. Opcional. */
export const ivaTaxRate = () => process.env.STRIPE_TAX_RATE_IVA || null;

/** Devuelve el cliente de Stripe de la persona, creándolo si no existe. */
export async function ensureCustomer(profile: Profile): Promise<string> {
  if (profile.stripe_customer_id) return profile.stripe_customer_id;

  const customer = await getStripe().customers.create(
    {
      email: profile.email,
      name: profile.store_name || profile.full_name || undefined,
      metadata: { user_id: profile.id },
    },
    { idempotencyKey: `customer-${profile.id}` },
  );

  const admin = createAdminClient();
  await admin.from("profiles").update({ stripe_customer_id: customer.id }).eq("id", profile.id);
  return customer.id;
}

/** Copia una suscripción de Stripe a la tabla subscriptions y recalcula el plan. */
export async function syncSubscription(sub: Stripe.Subscription, userIdHint?: string | null): Promise<string | null> {
  const admin = createAdminClient();
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  let userId = userIdHint || sub.metadata?.user_id || null;
  if (!userId) {
    const { data } = await admin.from("profiles").select("id").eq("stripe_customer_id", customerId).maybeSingle();
    userId = data?.id ?? null;
  }
  if (!userId) {
    console.error("syncSubscription: sin usuario para", sub.id, customerId);
    return null;
  }

  const item = sub.items.data[0];
  const { error } = await admin.from("subscriptions").upsert(
    {
      id: sub.id,
      user_id: userId,
      status: sub.status,
      price_id: item?.price.id ?? null,
      billing_interval: item?.price.recurring?.interval === "year" ? "year" : "month",
      unit_amount_cents: item?.price.unit_amount ?? null,
      current_period_end: item?.current_period_end ? new Date(item.current_period_end * 1000).toISOString() : null,
      cancel_at_period_end: sub.cancel_at_period_end,
      canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(`subscriptions upsert: ${error.message}`);

  // Guarda el customer en el perfil si aún no lo tenía (pago iniciado desde otra sesión).
  await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", userId).is("stripe_customer_id", null);
  const { error: rpcError } = await admin.rpc("sync_profile_plan", { p_user: userId });
  if (rpcError) throw new Error(`sync_profile_plan: ${rpcError.message}`);
  return userId;
}
