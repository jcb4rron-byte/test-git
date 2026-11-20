import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Feature } from "@/lib/config/plans";

export type QuotaResult = { allowed: boolean; used: number };

/** Suma 1 al uso de hoy si cabe en el límite (atómico en Postgres). */
export async function consumeQuota(userId: string, feature: Feature, limit: number): Promise<QuotaResult> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("consume_quota", { p_user: userId, p_feature: feature, p_limit: limit });
  if (error) throw new Error(`consume_quota: ${error.message}`);
  const row = (Array.isArray(data) ? data[0] : data) as { allowed: boolean; used: number } | undefined;
  return { allowed: Boolean(row?.allowed), used: row?.used ?? 0 };
}

/** Devuelve el uso si la generación falla. Nunca lanza: un fallo aquí no debe tapar el error original. */
export async function refundQuota(userId: string, feature: Feature): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.rpc("refund_quota", { p_user: userId, p_feature: feature });
  } catch (e) {
    console.error("refund_quota", e);
  }
}

/** Uso de hoy por función (hora de Madrid). */
export async function getUsageToday(userId: string): Promise<Record<Feature, number>> {
  const admin = createAdminClient();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
  const { data } = await admin.from("usage_daily").select("feature, count").eq("user_id", userId).eq("day", today);
  const usage: Record<Feature, number> = { revision: 0, coherencia: 0, idea: 0 };
  for (const row of data ?? []) usage[row.feature as Feature] = row.count as number;
  return usage;
}
