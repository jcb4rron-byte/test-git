import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { effectivePlan } from "@/lib/plan";
import { getUsageToday } from "@/lib/quota";
import { listReports } from "@/lib/reports";
import { PLANS } from "@/lib/config/plans";
import { SPACE_LABELS } from "@/lib/ai/criteria";
import { formatDate } from "@/lib/utils";
import { ButtonLink, Card, Eyebrow, LockIcon } from "@/components/ui";
import { ScoreTone } from "@/components/score";
import { UsageMeters } from "@/components/usage";

const KIND_LABEL = { revision: "Revisión", coherencia: "Tienda y web", idea: "Idea" } as const;

export default async function PanelHome({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const { profile } = await requireUser();
  if (!profile.onboarded_at) redirect("/panel/bienvenida");
  await searchParams;

  const plan = effectivePlan(profile);
  const [usage, { items, hiddenCount }] = await Promise.all([getUsageToday(profile.id), listReports(profile.id, plan, 6)]);
  const reviews = items.filter((r) => r.kind !== "idea" && r.score !== null);
  const last = reviews[0];
  const name = profile.full_name?.split(" ")[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>{profile.store_name || "Tu tienda"}</Eyebrow>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">{name ? `Hola, ${name}.` : "Hola."}</h1>
        </div>
        <div className="flex gap-2">
          <ButtonLink href="/panel/revisar">Revisar con foto</ButtonLink>
          <ButtonLink href="/panel/ideas" variant="secondary">Pedir una idea</ButtonLink>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="font-display text-lg">Última revisión</h2>
          {last ? (
            <Link href={`/panel/informes/${last.id}`} className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-surface-2 p-4 hover:opacity-90">
              <div className="min-w-0">
                <p className="truncate font-medium">{last.title}</p>
                <p className="text-sm text-muted">
                  {last.space_type ? SPACE_LABELS[last.space_type] : ""} · {formatDate(last.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl">{last.score}</p>
                <ScoreTone score={last.score ?? 0} />
              </div>
            </Link>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-line p-6 text-center">
              <p className="text-fg-2">Todavía no has revisado ningún espacio.</p>
              <p className="mt-1 text-sm text-muted">Empieza por el escaparate: es lo primero que ve quien pasa.</p>
              <ButtonLink href="/panel/revisar" className="mt-4">Hacer mi primera revisión</ButtonLink>
            </div>
          )}
          {reviews.length > 1 ? (
            <p className="mt-4 text-sm text-fg-2">
              {plan === "pro" ? (
                <Link href="/panel/comparar" className="underline underline-offset-4">Compara con una revisión anterior</Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-muted"><LockIcon /> Comparar antes y después es parte de Pro</span>
              )}
            </p>
          ) : null}
        </Card>
        <UsageMeters usage={usage} plan={plan} />
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">Recientes</h2>
          <Link href="/panel/informes" className="text-sm text-fg-2 underline-offset-4 hover:underline">Ver todos</Link>
        </div>
        {items.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((r) => (
              <li key={r.id}>
                <Link href={`/panel/informes/${r.id}`} className="block rounded-2xl border border-line bg-surface p-4 hover:border-fg">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">{KIND_LABEL[r.kind]}</p>
                  <p className="mt-1 truncate font-medium">{r.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatDate(r.created_at)}
                    {r.score !== null ? ` · ${r.score}/100` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">Aquí verás tus revisiones e ideas.</p>
        )}
        {hiddenCount > 0 ? (
          <p className="mt-4 text-sm text-fg-2">
            Tienes {hiddenCount} {hiddenCount === 1 ? "informe anterior" : "informes anteriores"} a {PLANS.free.historyDays} días.{" "}
            <Link href="/precios" className="underline underline-offset-4">Con Pro los ves todos</Link>.
          </p>
        ) : null}
      </section>
    </div>
  );
}
