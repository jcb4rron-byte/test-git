import { createAdminClient } from "@/lib/supabase/admin";
import { effectivePlan } from "@/lib/plan";
import { formatDate } from "@/lib/utils";
import { Badge, buttonClass, inputClass } from "@/components/ui";
import { grantPro, revokePro } from "../actions";
import type { Profile } from "@/types/db";

export const dynamic = "force-dynamic";

export default async function AdminUsers({ searchParams }: { searchParams: Promise<{ q?: string; plan?: string }> }) {
  const { q, plan } = await searchParams;
  const admin = createAdminClient();
  let query = admin
    .from("profiles")
    .select("id, email, full_name, store_name, store_type, city, plan, pro_until, created_at, last_seen_at, referred_by")
    .order("created_at", { ascending: false })
    .limit(200);
  if (q) {
    const safe = q.replace(/[%,()]/g, " ").trim();
    query = query.or(`email.ilike.%${safe}%,store_name.ilike.%${safe}%,full_name.ilike.%${safe}%`);
  }
  if (plan === "pro") query = query.eq("plan", "pro");
  if (plan === "free") query = query.eq("plan", "free");
  const { data } = await query;
  const users = (data ?? []) as Profile[];

  const ids = users.map((u) => u.id);
  const { data: counts } = ids.length
    ? await admin.from("reports").select("user_id").in("user_id", ids).limit(10000)
    : { data: [] as { user_id: string }[] };
  const reportsBy = new Map<string, number>();
  for (const r of counts ?? []) reportsBy.set(r.user_id, (reportsBy.get(r.user_id) ?? 0) + 1);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Usuarios</h1>
      <form className="flex flex-col gap-3 sm:flex-row" method="get">
        <input name="q" defaultValue={q} placeholder="Buscar por email, nombre o tienda" className={inputClass} />
        <select name="plan" defaultValue={plan ?? ""} className={`${inputClass} sm:w-44`}>
          <option value="">Todos</option>
          <option value="pro">Pro (Stripe)</option>
          <option value="free">Gratis</option>
        </select>
        <button className={buttonClass("secondary", "md")}>Filtrar</button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Persona</th>
              <th className="px-4 py-3 font-medium">Tienda</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Informes</th>
              <th className="px-4 py-3 font-medium">Alta</th>
              <th className="px-4 py-3 font-medium">Pro de cortesía</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-surface">
            {users.map((u) => {
              const eff = effectivePlan(u);
              return (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.full_name || "Sin nombre"}</p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-fg-2">
                    {u.store_name || "·"}
                    {u.city ? <span className="block text-xs text-muted">{u.city}</span> : null}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={eff === "pro" ? "pro" : "neutral"}>{eff === "pro" ? (u.plan === "pro" ? "Pro" : "Pro cortesía") : "Gratis"}</Badge>
                    {u.referred_by ? <span className="mt-1 block text-xs text-muted">Referido</span> : null}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{reportsBy.get(u.id) ?? 0}</td>
                  <td className="px-4 py-3 text-fg-2">
                    {formatDate(u.created_at)}
                    {u.last_seen_at ? <span className="block text-xs text-muted">Visto {formatDate(u.last_seen_at)}</span> : null}
                  </td>
                  <td className="px-4 py-3">
                    {u.pro_until && new Date(u.pro_until) > new Date() ? (
                      <form action={revokePro} className="flex items-center gap-2">
                        <input type="hidden" name="user_id" value={u.id} />
                        <span className="text-xs text-fg-2">Hasta {formatDate(u.pro_until)}</span>
                        <button className="text-xs underline">Quitar</button>
                      </form>
                    ) : (
                      <form action={grantPro} className="flex items-center gap-2">
                        <input type="hidden" name="user_id" value={u.id} />
                        <select name="days" defaultValue="30" className="rounded-lg border border-line bg-surface px-2 py-1 text-xs" aria-label="Días">
                          <option value="7">7 días</option>
                          <option value="30">30 días</option>
                          <option value="90">90 días</option>
                        </select>
                        <button className="text-xs underline">Dar Pro</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">Se muestran las 200 más recientes. Los datos de pago están en Stripe.</p>
    </div>
  );
}
