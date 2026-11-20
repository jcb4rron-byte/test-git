import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { effectivePlan } from "@/lib/plan";
import { getUsageToday } from "@/lib/quota";
import { listReports } from "@/lib/reports";
import { PLANS } from "@/lib/config/plans";
import { formatDate } from "@/lib/utils";
import { Eyebrow } from "@/components/ui";
import { IdeaForm } from "./idea-form";

export default async function IdeasPage() {
  const { profile } = await requireUser();
  const plan = effectivePlan(profile);
  const [usage, { items }] = await Promise.all([getUsageToday(profile.id), listReports(profile.id, plan, 30)]);
  const ideas = items.filter((r) => r.kind === "idea").slice(0, 8);
  const limit = PLANS[plan].limits.idea;

  return (
    <div className="grid gap-10 xl:grid-cols-[1fr_280px]">
      <div className="max-w-2xl space-y-8">
        <div>
          <Eyebrow>Ideas de escaparate</Eyebrow>
          <h1 className="mt-2 font-display text-3xl">¿Qué ponemos en el escaparate?</h1>
          <p className="mt-2 text-fg-2">
            Llevas {usage.idea} de {limit} hoy.{plan === "free" ? " En el plan gratuito ves el concepto, la paleta y los 3 primeros pasos." : ""}
          </p>
        </div>
        <IdeaForm defaultStoreType={profile.store_type} />
      </div>
      <aside>
        <h2 className="font-display text-lg">Tus últimas ideas</h2>
        {ideas.length ? (
          <ul className="mt-4 space-y-2">
            {ideas.map((i) => (
              <li key={i.id}>
                <Link href={`/panel/informes/${i.id}`} className="block rounded-xl border border-line p-3 hover:border-fg">
                  <p className="truncate text-sm font-medium">{i.title}</p>
                  <p className="text-xs text-muted">{formatDate(i.created_at)}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">Aún no has pedido ninguna.</p>
        )}
      </aside>
    </div>
  );
}
