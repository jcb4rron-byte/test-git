import type { Metadata } from "next";
import { JsonLd, PublicShell } from "@/components/site";
import { ButtonLink, Card, Check, Eyebrow } from "@/components/ui";
import { CheckoutButton, TrackOnMount } from "@/components/billing";
import { PLANS, YEARLY } from "@/lib/config/plans";
import { FAQ } from "@/lib/content/faq";
import { getProfile } from "@/lib/auth";
import { isPro } from "@/lib/plan";
import { yearlyEnabled } from "@/lib/stripe";
import { site } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Precios",
  description: `Gratis con 1 revisión al día. Pro por ${PLANS.pro.priceLabel} IVA incluido: informe completo, coherencia tienda y web e ideas de escaparate.`,
  alternates: { canonical: "/precios" },
};

export default async function PreciosPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const { checkout } = await searchParams;
  const profile = await getProfile();
  const pro = isPro(profile);
  const yearly = yearlyEnabled();

  return (
    <PublicShell>
      <TrackOnMount name="pricing_viewed" props={{ logged_in: Boolean(profile) }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${site.name} Pro`,
          brand: { "@type": "Brand", name: site.brand },
          description: PLANS.pro.includes.join(". "),
          offers: { "@type": "Offer", price: "9.99", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
        }}
      />
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-16 text-center sm:px-6">
        <Eyebrow>Precios fijos, sin permanencia</Eyebrow>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">
          Gratis para empezar. <span className="accent">Pro para trabajar.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-fg-2">
          El plan gratuito te da una revisión al día para siempre. Pro es para cuando cambias el escaparate, preparas campaña o quieres que
          tu equipo tenga una guía.
        </p>
        {checkout === "cancel" ? (
          <p className="mx-auto mt-6 max-w-md rounded-xl border border-line px-4 py-3 text-sm text-fg-2">
            Has cancelado el pago. No se ha cobrado nada.
          </p>
        ) : null}
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-20 sm:px-6 md:grid-cols-2">
        <Card>
          <p className="font-display text-xl">{PLANS.free.name}</p>
          <p className="mt-3 font-display text-4xl">{PLANS.free.priceLabel}</p>
          <p className="mt-1 text-sm text-muted">{PLANS.free.priceNote}</p>
          <ul className="mt-6 space-y-3">
            {PLANS.free.includes.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-fg-2"><Check className="mt-0.5 text-fg" />{t}</li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href={profile ? "/panel" : "/registro"} variant="secondary" size="lg" className="w-full">
              {profile ? "Ir a mi panel" : "Crear cuenta gratis"}
            </ButtonLink>
          </div>
        </Card>

        <Card className="border-fg">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl">{PLANS.pro.name}</p>
            <span className="rounded-full bg-inverse px-2.5 py-0.5 text-xs text-inverse-fg">Recomendado</span>
          </div>
          <p className="mt-3 font-display text-4xl">{PLANS.pro.priceLabel}</p>
          <p className="mt-1 text-sm text-muted">{PLANS.pro.priceNote}</p>
          <ul className="mt-6 space-y-3">
            {PLANS.pro.includes.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-fg-2"><Check className="mt-0.5 text-fg" />{t}</li>
            ))}
          </ul>
          <div className="mt-8 space-y-3">
            {pro ? (
              <ButtonLink href="/panel/suscripcion" size="lg" className="w-full">Ya tienes Pro</ButtonLink>
            ) : profile ? (
              <>
                <CheckoutButton label={`Pasar a Pro ${PLANS.pro.priceLabel}`} source="precios" />
                {yearly ? (
                  <CheckoutButton interval="year" variant="secondary" label={`Pagar un año ${YEARLY.priceLabel}`} source="precios_anual" />
                ) : null}
              </>
            ) : (
              <ButtonLink href={`/registro?next=${encodeURIComponent("/precios")}`} size="lg" className="w-full">
                Pasar a Pro {PLANS.pro.priceLabel}
              </ButtonLink>
            )}
            {yearly && !pro ? <p className="text-center text-xs text-muted">Anual: {YEARLY.priceNote}.</p> : null}
          </div>
        </Card>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl">Dudas sobre el pago</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {FAQ.slice(3).map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <span className="text-muted transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-fg-2">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted">
            Pago seguro con Stripe. Al suscribirte aceptas las <a className="underline underline-offset-4" href="/condiciones">condiciones de suscripción</a>.
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
