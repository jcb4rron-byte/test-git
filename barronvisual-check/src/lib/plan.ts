import { PLANS, type Feature, type PlanId } from "@/lib/config/plans";
import type { Profile } from "@/types/db";

/** Plan efectivo: Pro por Stripe o por concesión manual vigente (pro_until). Igual que is_pro() en SQL. */
export function effectivePlan(profile: Pick<Profile, "plan" | "pro_until"> | null | undefined): PlanId {
  if (!profile) return "free";
  if (profile.plan === "pro") return "pro";
  if (profile.pro_until && new Date(profile.pro_until).getTime() > Date.now()) return "pro";
  return "free";
}

export const isPro = (profile: Pick<Profile, "plan" | "pro_until"> | null | undefined) => effectivePlan(profile) === "pro";

export function limitsFor(plan: PlanId): Record<Feature, number> {
  return PLANS[plan].limits;
}

/** Fecha desde la que se muestra el historial (null = todo). */
export function historyCutoff(plan: PlanId): Date | null {
  const days = PLANS[plan].historyDays;
  if (days === null) return null;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}
