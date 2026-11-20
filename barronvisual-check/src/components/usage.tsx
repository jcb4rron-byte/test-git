import Link from "next/link";
import { FEATURE_LABELS, PLANS, type Feature, type PlanId } from "@/lib/config/plans";
import { Card, buttonClass } from "@/components/ui";
import { cn } from "@/lib/utils";

/** Uso de hoy por función: barra fina con el límite del plan. */
export function UsageMeters({ usage, plan }: { usage: Record<Feature, number>; plan: PlanId }) {
  const limits = PLANS[plan].limits;
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg">Tu uso de hoy</h2>
        <p className="text-xs text-muted">Se renueva a medianoche</p>
      </div>
      <ul className="mt-5 space-y-4">
        {(Object.keys(FEATURE_LABELS) as Feature[]).map((f) => {
          const limit = limits[f];
          const used = usage[f];
          const pct = limit ? Math.min(100, (used / limit) * 100) : 0;
          return (
            <li key={f}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-fg-2">{FEATURE_LABELS[f]}</span>
                <span className="tabular-nums text-fg">{limit === 0 ? "Solo Pro" : `${used} de ${limit}`}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2" aria-hidden="true">
                <div className={cn("h-1.5 rounded-full", used >= limit && limit > 0 ? "bg-bad" : "bg-fg")} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
      {plan === "free" ? (
        <Link href="/precios" className={buttonClass("secondary", "sm", "mt-6 w-full")}>
          Más usos con Pro {PLANS.pro.priceLabel}
        </Link>
      ) : null}
    </Card>
  );
}
