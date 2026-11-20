import { requireUser } from "@/lib/auth";
import { effectivePlan } from "@/lib/plan";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS, YEARLY } from "@/lib/config/plans";
import { yearlyEnabled } from "@/lib/stripe";
import { formatDate, formatEUR } from "@/lib/utils";
import { Alert, Badge, Card, Check, Eyebrow } from "@/components/ui";
import { CheckoutButton, PortalButton } from "@/components/billing";
import type { SubscriptionRow } from "@/types/db";

const STATUS: Record<string, string> = {
  active: "Activa",
  trialing: "En prueba",
  past_due: "Pago pendiente",
  canceled: "Cancelada",
  unpaid: "Impagada",
  incomplete: "Pago sin completar",
  incomplete_expired: "Pago caducado",
  paused: "En pausa",
};

export default async function SuscripcionPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const { checkout } = await searchParams;
  const { profile } = await requireUser("/panel/suscripcion");
  const plan = effectivePlan(profile);
  const admin = createAdminClient();
  const { data } = await admin.from("subscriptions").select("*").eq("user_id", profile.id).order("created_at", { ascending: false }).limit(1);
  const sub = (data?.[0] as SubscriptionRow | undefined) ?? null;
  const manual = plan === "pro" && profile.plan !== "pro" && profile.pro_until;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Eyebrow>Suscripción</Eyebrow>
        <h1 className="mt-2 font-display text-3xl">Tu plan</h1>
      </div>

      {checkout === "ok" ? (
        <Alert tone="good">
          Pago recibido. Si tu plan todavía no aparece como Pro, espera unos segundos y recarga: Stripe nos avisa enseguida.
        </Alert>
      ) : null}

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-display text-2xl">{PLANS[plan].name}</p>
          <Badge tone={plan === "pro" ? "pro" : "neutral"}>{plan === "pro" ? "Activo" : "Gratis"}</Badge>
        </div>
        {sub && profile.plan === "pro" ? (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted">Estado</dt>
            <dd>{STATUS[sub.status] ?? sub.status}</dd>
            {sub.unit_amount_cents ? (
              <>
                <dt className="text-muted">Importe</dt>
                <dd>{formatEUR(sub.unit_amount_cents)} / {sub.billing_interval === "year" ? "año" : "mes"} (IVA incluido)</dd>
              </>
            ) : null}
            {sub.current_period_end ? (
              <>
                <dt className="text-muted">{sub.cancel_at_period_end ? "Termina el" : "Próxima renovación"}</dt>
                <dd>{formatDate(sub.current_period_end)}</dd>
              </>
            ) : null}
          </dl>
        ) : null}
        {sub?.status === "past_due" ? <Alert tone="bad">El último cobro ha fallado. Actualiza tu tarjeta para no perder Pro.</Alert> : null}
        {manual ? <p className="text-sm text-fg-2">Pro de cortesía hasta el {formatDate(profile.pro_until!)}.</p> : null}
        <ul className="space-y-2">
          {PLANS[plan].includes.map((t) => (
            <li key={t} className="flex gap-2 text-sm text-fg-2"><Check className="mt-0.5 text-fg" />{t}</li>
          ))}
        </ul>
        {profile.stripe_customer_id ? <PortalButton /> : null}
      </Card>

      {plan === "free" || manual ? (
        <Card className="space-y-4 border-fg">
          <p className="font-display text-xl">Pasa a Pro</p>
          <p className="text-fg-2">{PLANS.pro.priceLabel}. {PLANS.pro.priceNote}.</p>
          <CheckoutButton label={`Pasar a Pro ${PLANS.pro.priceLabel}`} source="suscripcion" />
          {yearlyEnabled() ? <CheckoutButton interval="year" variant="secondary" label={`Pagar un año ${YEARLY.priceLabel}`} source="suscripcion_anual" /> : null}
        </Card>
      ) : null}

      <p className="text-sm text-muted">
        Si cancelas, mantienes Pro hasta el final del periodo pagado y tus informes siguen guardados. Las facturas las emite Stripe a nombre de
        BARRONVISUAL y puedes descargarlas desde la gestión de la suscripción.
      </p>
    </div>
  );
}
