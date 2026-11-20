import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { effectivePlan } from "@/lib/plan";
import { getUsageToday } from "@/lib/quota";
import { PLANS } from "@/lib/config/plans";
import { Eyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ReviewForm } from "./review-form";

export default async function RevisarPage({ searchParams }: { searchParams: Promise<{ modo?: string }> }) {
  const { modo } = await searchParams;
  const mode = modo === "coherencia" ? "coherencia" : "revision";
  const { profile } = await requireUser();
  const plan = effectivePlan(profile);
  const usage = await getUsageToday(profile.id);
  const limit = PLANS[plan].limits[mode];
  const left = Math.max(0, limit - usage[mode]);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Eyebrow>{mode === "coherencia" ? "Coherencia phygital" : "Revisión con foto"}</Eyebrow>
        <h1 className="mt-2 font-display text-3xl">{mode === "coherencia" ? "Tu tienda y tu web, ¿la misma historia?" : "¿Qué miramos hoy?"}</h1>
        <p className="mt-2 text-fg-2">
          {limit === 0
            ? "Disponible en el plan Pro."
            : `Te ${left === 1 ? "queda" : "quedan"} ${left} de ${limit} hoy.`}
        </p>
      </div>
      <div className="flex gap-2 text-sm" role="tablist" aria-label="Tipo de revisión">
        {[
          ["revision", "Un espacio", "/panel/revisar"],
          ["coherencia", "Tienda y web", "/panel/revisar?modo=coherencia"],
        ].map(([k, l, href]) => (
          <Link
            key={k}
            href={href}
            role="tab"
            aria-selected={mode === k}
            className={cn("rounded-full border px-4 py-2", mode === k ? "border-fg text-fg" : "border-line text-fg-2 hover:text-fg")}
          >
            {l}
          </Link>
        ))}
      </div>
      <ReviewForm key={mode} mode={mode} isPro={plan === "pro"} defaultStoreType={profile.store_type} />
    </div>
  );
}
