import { getOverview } from "@/lib/admin-data";
import { formatEUR } from "@/lib/utils";
import { Card } from "@/components/ui";
import { DailyBars } from "@/components/charts";

export const dynamic = "force-dynamic";

const pct = (n: number) => `${(n * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })} %`;
const usd = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export default async function AdminHome() {
  const o = await getOverview();
  const tiles = [
    { k: "Cuentas", v: o.totalUsers.toLocaleString("es-ES"), s: `${o.manualPro} con Pro de cortesía` },
    { k: "Clientes Pro (Stripe)", v: o.proUsers.toLocaleString("es-ES"), s: `Conversión ${pct(o.conversion)}` },
    { k: "Ingreso mensual (MRR)", v: formatEUR(o.mrrCents), s: `${formatEUR(o.netMrrCents)} sin IVA` },
    { k: "Informes, 30 días", v: o.reports30.toLocaleString("es-ES"), s: `IA ${usd(o.aiCostUsd30)} · ${usd(o.aiCostPerReport)} por informe` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Resumen</h1>
        <p className="mt-1 text-sm text-muted">Datos propios de la app (sin cookies de terceros). El coste de IA es una estimación con precios de lista.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.k}>
            <p className="text-sm text-muted">{t.k}</p>
            <p className="mt-2 font-display text-4xl tabular-nums">{t.v}</p>
            <p className="mt-1 text-xs text-fg-2">{t.s}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DailyBars title="Altas por día" data={o.daily} series={[{ key: "signups", label: "Altas", color: "var(--series-1)" }]} />
        <DailyBars title="Personas activas por día" data={o.daily} series={[{ key: "active_users", label: "Activas", color: "var(--series-1)" }]} />
        <DailyBars title="Informes generados por día" data={o.daily} series={[{ key: "reports", label: "Informes", color: "var(--series-1)" }]} />
        <DailyBars
          title="Altas y bajas de Pro"
          data={o.daily}
          series={[
            { key: "upgrades", label: "Altas Pro", color: "var(--series-1)" },
            { key: "cancellations", label: "Bajas", color: "var(--series-2)" },
          ]}
        />
      </div>
    </div>
  );
}
