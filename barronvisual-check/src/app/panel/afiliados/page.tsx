import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/config/site";
import { formatDate, formatEUR } from "@/lib/utils";
import { Badge, Card, Eyebrow } from "@/components/ui";
import { JoinAffiliates } from "./join-form";
import type { AffiliateRow, CommissionRow } from "@/types/db";

const STATUS = { pending: "Pendiente de aprobación", active: "Activo", paused: "En pausa", rejected: "No aprobado" } as const;
const C_STATUS = { pending: "Retenida", approved: "Lista para pagar", paid: "Pagada", void: "Anulada" } as const;

export default async function AfiliadosPanelPage() {
  const { profile } = await requireUser("/panel/afiliados");
  // Con la sesión de la persona: RLS solo deja ver su código, sus referidos y sus comisiones.
  const supabase = await createClient();
  const { data: aff } = await supabase.from("affiliates").select("*").eq("user_id", profile.id).maybeSingle();
  const affiliate = aff as AffiliateRow | null;

  if (!affiliate) {
    return (
      <div className="max-w-xl space-y-8">
        <div>
          <Eyebrow>Programa de afiliados</Eyebrow>
          <h1 className="mt-2 font-display text-3xl">Recomienda y gana el 30 %</h1>
          <p className="mt-2 text-fg-2">
            Si formas a equipos de tienda, escribes de retail o asesoras a comercios, puedes recomendar BARRONVISUAL Check con tu enlace. Te
            llevas el 30 % de lo que paguen tus referidos (sin IVA) durante sus primeros 12 meses.
          </p>
        </div>
        <JoinAffiliates />
      </div>
    );
  }

  const [{ data: refs }, { data: comms }] = await Promise.all([
    supabase.from("referrals").select("status"),
    supabase.from("commissions").select("*").order("created_at", { ascending: false }).limit(50),
  ]);
  const commissions = (comms ?? []) as CommissionRow[];
  const sum = (s: CommissionRow["status"][]) => commissions.filter((c) => s.includes(c.status)).reduce((a, c) => a + c.amount_cents, 0);
  const link = absoluteUrl(`/?ref=${affiliate.code}`);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Programa de afiliados</Eyebrow>
          <h1 className="mt-2 font-display text-3xl">Tu código: {affiliate.code}</h1>
        </div>
        <Badge tone={affiliate.status === "active" ? "good" : "neutral"}>{STATUS[affiliate.status]}</Badge>
      </div>

      <Card>
        <p className="text-sm text-muted">Tu enlace</p>
        <p className="mt-1 break-all font-mono text-sm">{link}</p>
        <p className="mt-3 text-xs text-muted">
          Indica siempre que es un enlace de afiliado. Comisión: {Math.round(affiliate.commission_rate * 100)} % de la base imponible durante {affiliate.commission_months} meses
          desde el primer pago. Las comisiones se retienen 30 días por si hay devoluciones.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Registros", String(refs?.length ?? 0)],
          ["Clientes Pro", String((refs ?? []).filter((r) => r.status === "converted").length)],
          ["Retenido", formatEUR(sum(["pending"]))],
          ["Por cobrar", formatEUR(sum(["approved"]))],
        ].map(([k, v]) => (
          <Card key={k}>
            <p className="text-sm text-muted">{k}</p>
            <p className="mt-1 font-display text-3xl tabular-nums">{v}</p>
          </Card>
        ))}
      </div>

      <section>
        <h2 className="font-display text-lg">Comisiones</h2>
        {commissions.length ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Importe</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface">
                {commissions.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3 tabular-nums">{formatEUR(c.amount_cents)}</td>
                    <td className="px-4 py-3 text-fg-2">{C_STATUS[c.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Todavía no hay comisiones.</p>
        )}
        <p className="mt-4 text-xs text-muted">
          Los pagos se hacen a mano una vez al mes contra tu factura. Pagado hasta ahora: {formatEUR(sum(["paid"]))}.
        </p>
      </section>
    </div>
  );
}
