import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS } from "@/lib/config/plans";

export type DailyStat = { day: string; signups: number; active_users: number; reports: number; upgrades: number; cancellations: number };

// Precio por millón de tokens (USD) para estimar el coste de IA. Valores de la
// documentación de Anthropic a 3 nov 2026; verificar en la página de precios si cambian.
const PRICE_PER_MTOK: Record<string, { in: number; out: number }> = {
  "claude-opus-5-5": { in: 4, out: 20 },
  "claude-sonnet-5-5": { in: 2, out: 10 },
  "claude-haiku-5-5": { in: 0.1, out: 0.5 },
};

export async function getOverview() {
  const admin = createAdminClient();
  const since30 = new Date(Date.now() - 30 * 86400000).toISOString();
  const [users, pros, manual, subs, reports30, tokens, daily] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "pro"),
    admin.from("profiles").select("id", { count: "exact", head: true }).neq("plan", "pro").gt("pro_until", new Date().toISOString()),
    admin.from("subscriptions").select("unit_amount_cents, billing_interval, status").in("status", ["active", "trialing", "past_due"]),
    admin.from("reports").select("id", { count: "exact", head: true }).gte("created_at", since30),
    admin.from("reports").select("model, input_tokens, output_tokens").gte("created_at", since30).limit(10000),
    admin.rpc("admin_daily_stats", { p_days: 30 }),
  ]);

  // MRR estimado con IVA incluido (lo que paga el cliente). Los anuales cuentan /12.
  const mrrCents = (subs.data ?? []).reduce(
    (acc, s) => acc + (s.unit_amount_cents ?? 999) / (s.billing_interval === "year" ? 12 : 1),
    0,
  );
  const aiCostUsd = (tokens.data ?? []).reduce((acc, r) => {
    const p = PRICE_PER_MTOK[r.model as string] ?? PRICE_PER_MTOK["claude-opus-5-5"];
    return acc + ((r.input_tokens ?? 0) * p.in + (r.output_tokens ?? 0) * p.out) / 1_000_000;
  }, 0);

  const totalUsers = users.count ?? 0;
  const proUsers = pros.count ?? 0;
  return {
    totalUsers,
    proUsers,
    manualPro: manual.count ?? 0,
    conversion: totalUsers ? proUsers / totalUsers : 0,
    mrrCents: Math.round(mrrCents),
    netMrrCents: Math.round(mrrCents / 1.21), // sin IVA (21 %)
    reports30: reports30.count ?? 0,
    aiCostUsd30: aiCostUsd,
    aiCostPerReport: (tokens.data?.length ?? 0) ? aiCostUsd / tokens.data!.length : 0,
    daily: ((daily.data ?? []) as DailyStat[]).map((d) => ({ ...d, day: String(d.day) })),
    proPriceLabel: PLANS.pro.priceLabel,
  };
}
