import type { Metadata } from "next";
import { PublicShell } from "@/components/site";
import { ButtonLink, Card, Check, Eyebrow } from "@/components/ui";
import { PLANS } from "@/lib/config/plans";

export const metadata: Metadata = {
  title: "Programa de afiliados",
  description: "Recomienda BARRONVISUAL Check a tiendas y escaparatistas y llévate el 30 % de sus pagos durante 12 meses.",
  alternates: { canonical: "/afiliados" },
};

const FOR_WHO = [
  "Formadoras y formadores de equipos de tienda",
  "Escaparatistas y visual merchandisers freelance",
  "Asociaciones de comerciantes y centros comerciales abiertos",
  "Agencias y consultoras que trabajan con comercio local",
  "Creadoras y creadores de contenido sobre retail",
];

export default function AfiliadosPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-16 sm:px-6">
        <Eyebrow>Programa de afiliados</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl sm:text-5xl">
          Ayuda a más tiendas a vender mejor <span className="accent">y gana con ello.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-fg-2">
          Comparte tu enlace. Cada vez que una tienda que llegue por ti pague Pro ({PLANS.pro.priceLabel}), te llevas el 30 % de la base
          imponible durante sus primeros 12 meses.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/registro?next=/panel/afiliados" size="lg">Solicitar mi código</ButtonLink>
          <ButtonLink href="/entrar?next=/panel/afiliados" variant="secondary" size="lg">Ya tengo cuenta</ButtonLink>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-3">
        {[
          ["1", "Solicita tu código", "Creas tu cuenta, eliges tu código y nos cuentas a quién se lo recomendarías. Revisamos cada solicitud a mano."],
          ["2", "Comparte tu enlace", "Quien entra por tu enlace y acepta la cookie de afiliación queda asociado a ti durante 30 días."],
          ["3", "Cobra cada mes", "Las comisiones se retienen 30 días por si hay devoluciones y se pagan a mano contra tu factura."],
        ].map(([n, t, s]) => (
          <Card key={n}>
            <span className="font-display text-4xl text-muted">{n}</span>
            <h2 className="mt-4 text-lg font-medium">{t}</h2>
            <p className="mt-2 text-fg-2">{s}</p>
          </Card>
        ))}
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">Para quién es</h2>
            <ul className="mt-6 space-y-3">
              {FOR_WHO.map((t) => (
                <li key={t} className="flex gap-2 text-fg-2"><Check className="mt-1 text-fg" />{t}</li>
              ))}
            </ul>
          </div>
          <div id="condiciones">
            <h2 className="font-display text-2xl">Condiciones</h2>
            <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-fg-2">
              <li>30 % de la base imponible (sin IVA) de cada pago, durante 12 meses desde el primer pago de cada referido.</li>
              <li>La atribución dura 30 días desde que la persona acepta la cookie y solo cuenta para cuentas nuevas.</li>
              <li>Comisiones retenidas 30 días; si hay devolución, se anulan.</li>
              <li>Pago mensual por transferencia contra factura. [COMPLETAR: importe mínimo de pago y datos de facturación].</li>
              <li>Indica siempre que es un enlace de afiliado. Nada de correo no solicitado, autorreferidos, promesas de resultados ni anuncios que pujen por la marca BARRONVISUAL.</li>
              <li>BARRONVISUAL puede pausar un código que incumpla estas reglas y cambiar las condiciones avisando con 30 días.</li>
            </ul>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
