import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { isPro } from "@/lib/plan";
import { createAdminClient } from "@/lib/supabase/admin";
import { REVISION_CRITERIA, SPACE_LABELS } from "@/lib/ai/criteria";
import type { RevisionResult } from "@/lib/ai/schemas";
import { formatDate, cn } from "@/lib/utils";
import { Card, Eyebrow, LockIcon, buttonClass, inputClass } from "@/components/ui";
import { CriterionMeter } from "@/components/score";
import { PLANS } from "@/lib/config/plans";

type Row = { id: string; title: string; space_type: string | null; score: number | null; created_at: string; result: RevisionResult };

export default async function CompararPage({ searchParams }: { searchParams: Promise<{ a?: string; b?: string }> }) {
  const { profile } = await requireUser("/panel/comparar");
  if (!isPro(profile)) {
    return (
      <div className="max-w-xl space-y-6">
        <Eyebrow>Antes y después</Eyebrow>
        <h1 className="font-display text-3xl">Compara dos revisiones del mismo espacio</h1>
        <p className="text-fg-2">Mira qué criterios han subido tras el cambio, con la misma escala BARRONSYSTEM. Es la forma de dejar de cambiar el escaparate sin medir.</p>
        <p className="flex items-center gap-2 text-sm text-muted"><LockIcon /> Disponible en Pro.</p>
        <Link href="/precios" className={buttonClass("primary", "lg")}>Pasar a Pro {PLANS.pro.priceLabel}</Link>
      </div>
    );
  }

  const { a, b } = await searchParams;
  const admin = createAdminClient();
  const { data } = await admin
    .from("reports")
    .select("id, title, space_type, score, created_at, result")
    .eq("user_id", profile.id)
    .eq("kind", "revision")
    .order("created_at", { ascending: false })
    .limit(100);
  const rows = (data ?? []) as Row[];
  const after = rows.find((r) => r.id === b) ?? rows[0];
  const before = rows.find((r) => r.id === a) ?? rows.find((r) => r.id !== after?.id && r.space_type === after?.space_type) ?? rows[1];

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Antes y después</Eyebrow>
        <h1 className="mt-2 font-display text-3xl">Comparar revisiones</h1>
      </div>

      {rows.length < 2 ? (
        <p className="text-fg-2">Necesitas al menos dos revisiones. Haz una ahora y otra después del cambio.</p>
      ) : (
        <>
          <form className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" method="get">
            {(
              [
                ["a", "Antes", before?.id],
                ["b", "Después", after?.id],
              ] as const
            ).map(([name, label, value]) => (
              <label key={name} className="space-y-1.5 text-sm font-medium">
                {label}
                <select name={name} defaultValue={value} className={inputClass}>
                  {rows.map((r) => (
                    <option key={r.id} value={r.id}>
                      {formatDate(r.created_at)} · {r.space_type ? SPACE_LABELS[r.space_type as keyof typeof SPACE_LABELS] : ""} · {r.title} ({r.score})
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <button type="submit" className={buttonClass("secondary", "md")}>Comparar</button>
          </form>

          {before && after ? (
            <Card>
              <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 gap-y-4 text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">Criterio</span>
                <span className="text-xs uppercase tracking-wider text-muted">Antes</span>
                <span className="text-xs uppercase tracking-wider text-muted">Después</span>
                <span className="text-right text-xs uppercase tracking-wider text-muted">Cambio</span>
                <span className="font-medium">Puntuación global</span>
                <span className="font-display text-lg tabular-nums">{before.score}</span>
                <span className="font-display text-lg tabular-nums">{after.score}</span>
                <Delta value={(after.score ?? 0) - (before.score ?? 0)} />
                {REVISION_CRITERIA.map((c) => {
                  const x = before.result.criterios[c.key].puntuacion;
                  const y = after.result.criterios[c.key].puntuacion;
                  return [
                    <span key={`${c.key}-l`} className="text-fg-2">{c.label}</span>,
                    <CriterionMeter key={`${c.key}-a`} value={x} label={`${c.label}, antes`} />,
                    <CriterionMeter key={`${c.key}-b`} value={y} label={`${c.label}, después`} />,
                    <Delta key={`${c.key}-d`} value={y - x} />,
                  ];
                })}
              </div>
              {before.space_type !== after.space_type ? (
                <p className="mt-6 text-sm text-muted">Estás comparando espacios distintos: la comparación tiene más sentido con el mismo espacio.</p>
              ) : null}
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}

function Delta({ value }: { value: number }) {
  const label = value > 0 ? `+${value}` : `${value}`;
  return (
    <span className={cn("text-right font-medium tabular-nums", value > 0 && "text-good", value < 0 && "text-bad", value === 0 && "text-muted")}>
      <span aria-hidden="true">{value > 0 ? "▲ " : value < 0 ? "▼ " : "= "}</span>
      {value === 0 ? "Igual" : label}
    </span>
  );
}
