import "server-only";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { track } from "@/lib/analytics";

export const REF_COOKIE = "bvc_ref";
export const REF_COOKIE_DAYS = 30;
/** Días que una comisión queda retenida antes de poder pagarse (margen para devoluciones). */
export const COMMISSION_HOLD_DAYS = 30;
/** Plazo desde el registro para atribuir un referido (cubre la confirmación de email tardía). */
const ATTACH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export const normalizeRef = (code: string | null | undefined) =>
  code && /^[a-z0-9-]{3,24}$/.test(code.toLowerCase()) ? code.toLowerCase() : null;

/** Asocia una cuenta nueva al afiliado del código. Ignora autorreferidos y cuentas antiguas. */
export async function attachReferral(userId: string, rawCode: string | null | undefined): Promise<void> {
  const code = normalizeRef(rawCode);
  if (!code) return;
  const admin = createAdminClient();

  const [{ data: affiliate }, { data: profile }] = await Promise.all([
    admin.from("affiliates").select("id, user_id, status").eq("code", code).maybeSingle(),
    admin.from("profiles").select("id, referred_by, created_at").eq("id", userId).maybeSingle(),
  ]);
  if (!affiliate || affiliate.status !== "active" || !profile) return;
  if (affiliate.user_id === userId || profile.referred_by) return;
  if (Date.now() - new Date(profile.created_at).getTime() > ATTACH_WINDOW_MS) return;

  const { error } = await admin.from("referrals").insert({ affiliate_id: affiliate.id, referred_user_id: userId });
  if (error) return; // ya existía (unique)
  await admin.from("profiles").update({ referred_by: affiliate.id }).eq("id", userId).is("referred_by", null);
  await track("referral_attached", { affiliate_id: affiliate.id }, userId);
}

/** Marca el referido como convertido en su primer pago. */
export async function markReferralConverted(userId: string): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("referrals")
    .update({ status: "converted", converted_at: new Date().toISOString() })
    .eq("referred_user_id", userId)
    .eq("status", "registered");
}

/** Crea la comisión de una factura pagada si la persona vino de un afiliado activo. */
export async function recordCommission(invoice: Stripe.Invoice, userId: string): Promise<void> {
  if (!invoice.id || invoice.amount_paid <= 0) return;
  const admin = createAdminClient();

  const { data: referral } = await admin
    .from("referrals")
    .select("id, affiliate_id, status, converted_at, affiliates(status, commission_rate, commission_months)")
    .eq("referred_user_id", userId)
    .maybeSingle();
  if (!referral) return;

  const aff = (Array.isArray(referral.affiliates) ? referral.affiliates[0] : referral.affiliates) as
    | { status: string; commission_rate: number; commission_months: number }
    | null;
  if (!aff || aff.status !== "active") return;

  // Ventana de comisión: N meses desde la conversión (o desde ahora si es el primer pago).
  const convertedAt = referral.converted_at ? new Date(referral.converted_at) : new Date();
  const windowEnd = new Date(convertedAt);
  windowEnd.setMonth(windowEnd.getMonth() + Number(aff.commission_months));
  const paidAt = new Date((invoice.status_transitions?.paid_at ?? invoice.created) * 1000);
  if (paidAt > windowEnd) return;

  const base = invoice.total_excluding_tax ?? invoice.subtotal_excluding_tax ?? invoice.amount_paid;
  const amount = Math.round(base * Number(aff.commission_rate));
  if (amount <= 0) return;

  const availableAt = new Date(Date.now() + COMMISSION_HOLD_DAYS * 24 * 60 * 60 * 1000);
  const { error } = await admin.from("commissions").insert({
    affiliate_id: referral.affiliate_id,
    referral_id: referral.id,
    stripe_invoice_id: invoice.id,
    base_cents: base,
    amount_cents: amount,
    currency: invoice.currency,
    available_at: availableAt.toISOString(),
  });
  if (!error) await track("commission_created", { affiliate_id: referral.affiliate_id, amount_cents: amount }, userId);
}
