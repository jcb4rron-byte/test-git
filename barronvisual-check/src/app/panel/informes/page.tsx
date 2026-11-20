import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { effectivePlan } from "@/lib/plan";
import { listReports } from "@/lib/reports";
import { PLANS } from "@/lib/config/plans";
import { SPACE_LABELS } from "@/lib/ai/criteria";
import { formatDate } from "@/lib/utils";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { ScoreTone } from "@/components/score";

const KIND_LABEL = { revision: "Revisión", coherencia: "Tienda y web", idea: "Idea de escaparate" } as const;

export default async function InformesPage() {
  const { profile } = await requireUser();
  const plan = effectivePlan(profile);
  const { items, hiddenCount } = await listReports(profile.id, plan, 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Historial</Eyebrow>
          <h1 className="mt-2 font-display text-3xl">Mis informes</h1>
        </div>
        <ButtonLink href="/panel/revisar">Nueva revisión</ButtonLink>
      </div>

      {items.length === 0 ? (
        <p className="text-fg-2">Aún no tienes informes. Empieza por una foto de tu escaparate.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Informes guardados</caption>
            <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Informe</th>
                <th scope="col" className="hidden px-4 py-3 font-medium sm:table-cell">Tipo</th>
                <th scope="col" className="hidden px-4 py-3 font-medium md:table-cell">Fecha</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Puntuación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-surface-2">
                  <td className="px-4 py-3">
                    <Link href={`/panel/informes/${r.id}`} className="font-medium underline-offset-4 hover:underline">{r.title}</Link>
                    <p className="text-xs text-muted sm:hidden">{KIND_LABEL[r.kind]} · {formatDate(r.created_at)}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-fg-2 sm:table-cell">
                    {KIND_LABEL[r.kind]}
                    {r.kind === "revision" && r.space_type ? ` · ${SPACE_LABELS[r.space_type]}` : ""}
                  </td>
                  <td className="hidden px-4 py-3 text-fg-2 md:table-cell">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    {r.score !== null ? (
                      <span className="inline-flex flex-col items-end">
                        <span className="font-display text-lg tabular-nums">{r.score}</span>
                        <ScoreTone score={r.score} />
                      </span>
                    ) : (
                      <span className="text-muted">·</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hiddenCount > 0 ? (
        <p className="text-sm text-fg-2">
          {hiddenCount} {hiddenCount === 1 ? "informe tiene" : "informes tienen"} más de {PLANS.free.historyDays} días y no se muestran en el plan
          gratuito. Siguen guardados: <Link href="/precios" className="underline underline-offset-4">con Pro los ves todos</Link>.
        </p>
      ) : null}
    </div>
  );
}
