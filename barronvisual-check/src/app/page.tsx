import { JsonLd, PublicShell } from "@/components/site";
import { ButtonLink, Card, Check, Eyebrow } from "@/components/ui";
import { CriterionMeter, ScoreDial } from "@/components/score";
import { REVISION_CRITERIA } from "@/lib/ai/criteria";
import { PLANS } from "@/lib/config/plans";
import { site, absoluteUrl } from "@/lib/config/site";
import { FAQ } from "@/lib/content/faq";

const PROBLEMS = [
  { t: "El escaparate para a la gente, pero no entra.", s: "Revisamos si hay un punto focal claro y si la entrada invita a pasar." },
  { t: "El cliente no sabe dónde mirar.", s: "Composición, jerarquía y orden: qué sobra y qué tiene que ir a la altura de los ojos." },
  { t: "La web no se parece a la tienda.", s: "Con Pro comparas tu escaparate con tu página de inicio y te decimos qué alinear." },
  { t: "Se cambia sin medir.", s: "Cada revisión queda guardada para comparar antes y después, con la misma escala." },
];

const STEPS = [
  { n: "1", t: "Haz una foto", s: "De frente, desde la acera o el pasillo, como la ve quien pasa. Escaparate, mesa, lineal, probador, fachada o la tienda entera." },
  { n: "2", t: "Recibe tu puntuación", s: "8 criterios de 0 a 3 con la escala de la auditoría BARRONSYSTEM, y un diagnóstico en lenguaje de tienda, sin tecnicismos." },
  { n: "3", t: "Aplica el plan", s: "Las 3 mejoras que más se notan y un plan de 30, 60 y 90 días: primero lo que no cuesta dinero." },
];

// Ejemplo ilustrativo (no es un informe real de ninguna tienda).
const EXAMPLE = { score: 63, criteria: [3, 2, 2, 1] };

export default function Home() {
  return (
    <PublicShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: site.name,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: site.url,
            description: site.description,
            inLanguage: "es",
            publisher: { "@type": "Organization", name: site.brand, url: site.links.barronvisual },
            offers: [
              { "@type": "Offer", name: "Gratis", price: "0", priceCurrency: "EUR" },
              { "@type": "Offer", name: "Pro", price: "9.99", priceCurrency: "EUR", url: absoluteUrl("/precios") },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:pt-24">
        <div>
          <Eyebrow>Método BARRONSYSTEM · Visual merchandising con IA</Eyebrow>
          <h1 className="mt-5 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Tu escaparate, revisado <span className="accent">con ojo de experto.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-2">
            Haz una foto de tu escaparate, una mesa o un lineal. Recibe la puntuación BARRONSYSTEM, las tres mejoras que más se notan y
            un plan de 30, 60 y 90 días para tu Tienda o tu Marca.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/registro" size="lg">
              Revisar mi escaparate gratis
            </ButtonLink>
            <p className="text-sm text-muted">1 revisión al día gratis. Sin tarjeta.</p>
          </div>
        </div>

        <Card>
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">Ejemplo de informe</p>
          <div className="flex items-center gap-6">
            <ScoreDial score={EXAMPLE.score} size={120} />
            <div className="min-w-0 flex-1 space-y-3">
              {REVISION_CRITERIA.slice(0, 4).map((c, i) => (
                <div key={c.key}>
                  <p className="mb-1 text-sm text-fg-2">{c.label}</p>
                  <CriterionMeter value={EXAMPLE.criteria[i]} label={c.label} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-surface-2 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Mejora 1 · 15 minutos</p>
            <p className="mt-1 font-medium">Deja un solo protagonista a la altura de los ojos</p>
            <p className="mt-1 text-sm text-fg-2">Retira dos de las cinco piezas del primer plano y sube la principal sobre un cubo.</p>
          </div>
        </Card>
      </section>

      {/* Problemas */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Eyebrow>Lo que resuelve</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
            Mirar tu tienda <span className="accent">como la mira el cliente.</span>
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {PROBLEMS.map((p) => (
              <Card key={p.t} className="bg-bg">
                <h3 className="text-lg font-medium">{p.t}</h3>
                <p className="mt-2 text-fg-2">{p.s}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Eyebrow>Cómo funciona</Eyebrow>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl">Una foto, tres pasos.</h2>
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n}>
              <Card className="h-full">
                <span className="font-display text-4xl text-muted">{s.n}</span>
                <h3 className="mt-4 text-lg font-medium">{s.t}</h3>
                <p className="mt-2 text-fg-2">{s.s}</p>
              </Card>
            </li>
          ))}
        </ol>
        <div className="mt-16">
          <h3 className="font-display text-xl">Los 8 criterios</h3>
          <ul className="mt-6 grid gap-x-8 gap-y-4 md:grid-cols-2">
            {REVISION_CRITERIA.map((c) => (
              <li key={c.key} className="border-t border-line pt-4">
                <p className="font-medium">{c.label}</p>
                <p className="mt-1 text-sm text-fg-2">{c.question}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sección en blanco (patrón de marca BARRONVISUAL: una por página) */}
      <section className="bg-white text-black">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/60">Solo en Pro · Coherencia phygital</p>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
              Tu escaparate y tu web, <span className="accent">la misma historia.</span>
            </h2>
            <p className="mt-6 text-lg text-black/75">
              Sube la foto del escaparate y una captura de tu página de inicio. Te decimos si el producto protagonista, la campaña, el color y
              la llamada a la acción coinciden, y qué cambiar en cada lado.
            </p>
          </div>
          <ul className="space-y-4 self-center">
            {[
              ["Escaparate", "Hero de la web"],
              ["Puntos focales", "Secciones de producto"],
              ["Caja", "Checkout"],
              ["Compra por impulso", "Venta cruzada"],
            ].map(([a, b]) => (
              <li key={a} className="flex items-center justify-between gap-4 border-b border-black/15 pb-4 text-lg">
                <span>{a}</span>
                <span className="text-black/40" aria-hidden="true">→</span>
                <span className="text-right text-black/75">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ideas */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Ideas de escaparate</Eyebrow>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              ¿Qué pongo <span className="accent">para la próxima campaña?</span>
            </h2>
            <p className="mt-6 text-lg text-fg-2">
              Dinos la fecha, el producto y el presupuesto. Te proponemos un concepto con el brief en una frase, paleta, punto focal, montaje
              paso a paso y atrezo reutilizado o del comercio de al lado.
            </p>
          </div>
          <Card>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Ejemplo de brief</p>
            <p className="accent mt-3 text-2xl leading-snug">
              Para quien vuelve a casa con frío: la lana de este invierno se toca, no se mira.
            </p>
            <div className="mt-6 flex gap-2" aria-hidden="true">
              {["#3B2F2A", "#D9CBB8", "#9A3B2E"].map((h) => (
                <span key={h} className="h-10 w-10 rounded-full border border-line" style={{ background: h }} />
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Precios */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Eyebrow>Precios</Eyebrow>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl">Empieza gratis. Pasa a Pro cuando lo necesites.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {(["free", "pro"] as const).map((id) => {
              const p = PLANS[id];
              return (
                <Card key={id} className={id === "pro" ? "border-fg bg-bg" : "bg-bg"}>
                  <p className="font-display text-xl">{p.name}</p>
                  <p className="mt-3 font-display text-4xl">{p.priceLabel}</p>
                  <p className="mt-1 text-sm text-muted">{p.priceNote}</p>
                  <ul className="mt-6 space-y-3">
                    {p.includes.map((t) => (
                      <li key={t} className="flex gap-2 text-sm text-fg-2">
                        <Check className="mt-0.5 text-fg" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    {id === "pro" ? (
                      <ButtonLink href="/precios" size="lg" className="w-full">
                        Pasar a Pro {p.priceLabel}
                      </ButtonLink>
                    ) : (
                      <ButtonLink href="/registro" variant="secondary" size="lg" className="w-full">
                        Crear cuenta gratis
                      </ButtonLink>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Criterio */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>El criterio</Eyebrow>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              28 años de oficio, <span className="accent">en cada revisión.</span>
            </h2>
          </div>
          <div className="space-y-4 text-lg text-fg-2">
            <p>
              Check aplica BARRONSYSTEM, el método de visual merchandising de Juan Carlos Barrón, escaparatista y visual merchandiser
              con trayectoria en Zara France (Inditex), CHANEL, Galeries Lafayette, Lladró y National Geographic Stores.
            </p>
            <p>
              La inteligencia artificial hace la primera lectura con ese método. Para lo que una foto no enseña (el recorrido, la luz a cada
              hora, cómo trabaja tu equipo), está el estudio BARRONVISUAL.
            </p>
            <p className="text-base text-muted">{site.anchor}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <span className="text-muted transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-fg-2">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <p className="text-fg-2">¿Tienes una cadena o varias tiendas?</p>
            <ButtonLink href={site.links.contacto} variant="secondary">
              Pedir más información
            </ButtonLink>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
