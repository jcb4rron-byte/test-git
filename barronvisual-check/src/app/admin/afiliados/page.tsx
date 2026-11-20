import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, formatEUR } from "@/lib/utils";
import { Badge, Card } from "@/components/ui";
import { setAffiliateStatus, setCommissionStatus } from "../actions";

export const dynamic = "force-dynamic";

type Aff = { id: string; user_id: string; code: string; status: string; commission_rate: number; website: string | null; audience: string | null; created_at: string; profiles?: { email: string; full_name: string | null } };
type Comm = { id: string; amount_cents: number; status: string; available_at: string; created_at: string; affiliates: { code: string } | null };

export default async function AdminAffiliates() {
  const admin = createAdminClient();
  const [{ data: affs }, { data: comms }] = await Promise.all([
    admin.from("affiliates").select("id, user_id, code, status, commission_rate, website, audience, created_at").order("created_at", { ascending: false }),
    admin.from("commissions").select("id, amount_cents, status, available_at, created_at, affiliates(code)").in("status", ["pending", "approved"]).order("created_at", { ascending: false }).limit(200),
  ]);
  const affiliates = (affs ?? []) as Aff[];
  // affiliates.user_id apunta a auth.users, no a profiles: los nombres se cruzan aparte.
  if (affiliates.length) {
    const { data: people } = await admin.from("profiles").select("id, email, full_name").in("id", affiliates.map((a) => a.user_id));
    const byId = new Map((people ?? []).map((p) => [p.id as string, p as { email: string; full_name: string | null }]));
    for (const a of affiliates) a.profiles = byId.get(a.user_id);
  }
  const commissions = (comms ?? []) as unknown as Comm[];
  const toPay = commissions.filter((c) => c.status === "approved").reduce((a, c) => a + c.amount_cents, 0);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl">Afiliados</h1>
        <p className="mt-1 text-sm text-muted">Los pagos se hacen a mano contra factura. Aquí solo se marcan como pagados.</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-lg">Solicitudes y afiliados</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {affiliates.map((a) => (
            <Card key={a.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{a.code}</p>
                <Badge tone={a.status === "active" ? "good" : "neutral"}>{a.status}</Badge>
              </div>
              <p className="text-sm text-fg-2">{a.profiles?.full_name || "Sin nombre"} · {a.profiles?.email}</p>
              {a.website ? <p className="break-all text-xs text-muted">{a.website}</p> : null}
              {a.audience ? <p className="text-sm text-fg-2">{a.audience}</p> : null}
              <p className="text-xs text-muted">{Math.round(a.commission_rate * 100)} % · desde {formatDate(a.created_at)}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {(["active", "paused", "rejected"] as const).filter((s) => s !== a.status).map((s) => (
                  <form key={s} action={setAffiliateStatus}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="status" value={s} />
                    <button className="rounded-full border border-line px-3 py-1 text-xs hover:border-fg">
                      {s === "active" ? "Aprobar" : s === "paused" ? "Pausar" : "Rechazar"}
                    </button>
                  </form>
                ))}
              </div>
            </Card>
          ))}
          {affiliates.length === 0 ? <p className="text-sm text-muted">Todavía no hay solicitudes.</p> : null}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-lg">Comisiones abiertas</h2>
          <p className="text-sm text-fg-2">Listo para pagar: <span className="tabular-nums text-fg">{formatEUR(toPay)}</span></p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Importe</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Disponible</th>
                <th className="px-4 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {commissions.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3">{c.affiliates?.code}</td>
                  <td className="px-4 py-3 tabular-nums">{formatEUR(c.amount_cents)}</td>
                  <td className="px-4 py-3 text-fg-2">{c.status === "pending" ? "Retenida" : "Lista"}</td>
                  <td className="px-4 py-3 text-fg-2">{formatDate(c.available_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {c.status === "approved" ? (
                        <form action={setCommissionStatus}>
                          <input type="hidden" name="id" value={c.id} />
                          <input type="hidden" name="status" value="paid" />
                          <button className="text-xs underline">Marcar pagada</button>
                        </form>
                      ) : null}
                      <form action={setCommissionStatus}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="status" value="void" />
                        <button className="text-xs text-muted underline">Anular</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
