import { Badge, Card, Check, LockIcon, buttonClass } from "@/components/ui";
import { CriterionMeter } from "@/components/score";
import { TrackedLink } from "@/components/tracked-link";
import { COHERENCIA_CRITERIA, REVISION_CRITERIA } from "@/lib/ai/criteria";
import type { CoherenciaView, IdeaView, RevisionView } from "@/lib/reports";
import { site } from "@/lib/config/site";
import { PLANS } from "@/lib/config/plans";

function SectionTitle({ children, pro }: { children: React.ReactNode; pro?: boolean }) {
  return (
    <h2 className="flex items-center gap-2 font-display text-lg tracking-wide">
      {children}
      {pro ? <Badge tone="pro">Pro</Badge> : null}
    </h2>
  );
}

/** Bloque bloqueado: no lleva contenido real (el servidor no lo envía), solo la invitación a Pro. */
export function LockedSection({ title, description }: { title: string; description: string }) {
  return (
    <Card className="relative overflow-hidden">
      <SectionTitle pro>{title}</SectionTitle>
      <div className="mt-4 space-y-2 blur-[3px] select-none" aria-hidden="true">
        {[92, 78, 85, 60].map((w, i) => (
          <div key={i} className="h-3 rounded bg-surface-2" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-sm text-fg-2">
          <LockIcon className="mt-0.5" />
          {description}
        </p>
        <TrackedLink href="/precios" event="upgrade_clicked" target={`locked:${title}`} className={buttonClass("primary", "sm")}>
          Ver con Pro {PLANS.pro.priceLabel}
        </TrackedLink>
      </div>
    </Card>
  );
}

function Priorities({ items }: { items: { titulo: string; por_que: string; como: string; tiempo: string }[] }) {
  return (
    <ol className="space-y-3">
      {items.map((p, i) => (
        <li key={i} className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-start gap-4">
            <span className="font-display text-2xl leading-none text-muted">{i + 1}</span>
            <div className="min-w-0 space-y-1.5">
              <h3 className="font-medium text-fg">{p.titulo}</h3>
              <p className="text-sm text-fg-2">{p.por_que}</p>
              <p className="text-sm text-fg-2">{p.como}</p>
              {p.tiempo ? <p className="text-xs text-muted">Tiempo: {p.tiempo}</p> : null}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-sm text-fg-2">
          <Check className="mt-0.5 text-fg" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Swatches({ colors }: { colors: { nombre: string; hex: string; uso?: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-3">
      {colors.map((c) => (
        <li key={c.hex + c.nombre} className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm">
          <span className="h-6 w-6 rounded-full border border-line" style={{ background: c.hex }} aria-hidden="true" />
          <span className="text-fg">{c.nombre}</span>
          <span className="font-mono text-xs text-muted">{c.hex.toUpperCase()}</span>
          {c.uso ? <span className="text-xs text-muted">· {c.uso}</span> : null}
        </li>
      ))}
    </ul>
  );
}

function CriteriaGrid<K extends string>({
  defs,
  criterios,
}: {
  defs: readonly { key: K; label: string; question: string }[];
  criterios: Record<K, { puntuacion: number; lo_que_veo: string; como_mejorarlo: string }>;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {defs.map((d) => {
        const c = criterios[d.key];
        return (
          <Card key={d.key} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-medium">{d.label}</h3>
              <CriterionMeter value={c.puntuacion} label={d.label} />
            </div>
            <p className="text-sm text-fg-2">{c.lo_que_veo}</p>
            <p className="text-sm text-fg">
              <span className="text-muted">Para mejorar: </span>
              {c.como_mejorarlo}
            </p>
          </Card>
        );
      })}
    </div>
  );
}

/** Siguiente paso dentro del ecosistema: la persona experta, sin precios aquí (viven en barronvisual.com). */
export function ExpertUpsell({ score }: { score: number | null }) {
  const low = score !== null && score < 60;
  return (
    <Card className="no-print border-fg/40">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Siguiente paso</p>
      <h2 className="mt-2 font-display text-lg">{low ? "¿Lo miramos en persona?" : "¿Quieres llevarlo más lejos?"}</h2>
      <p className="mt-2 text-sm text-fg-2">
        {low
          ? "Una foto enseña mucho, pero no todo: el recorrido, la luz a cada hora y cómo trabaja el equipo se ven en la tienda. La Auditoría Phygital Retail de BARRONVISUAL lo revisa todo en un día, con Juan Carlos Barrón."
          : "Si quieres aprender a montarlo tú, la Academia de BARRONVISUAL tiene cursos de escaparatismo y visual merchandising con certificado."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <TrackedLink href={low ? site.links.consultoria : site.links.academia} target={low ? "consultoria" : "academia"} className={buttonClass("secondary", "sm")}>
          {low ? "Ver la Auditoría Phygital Retail" : "Ver la Academia"}
        </TrackedLink>
      </div>
    </Card>
  );
}

export function RevisionReport({ view }: { view: RevisionView }) {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <SectionTitle>Diagnóstico</SectionTitle>
        <p className="text-base leading-relaxed text-fg-2">{view.resumen}</p>
      </section>

      {view.lo_que_funciona.length ? (
        <section className="space-y-3">
          <SectionTitle>Lo que ya funciona</SectionTitle>
          <List items={view.lo_que_funciona} />
        </section>
      ) : null}

      <section className="space-y-3">
        <SectionTitle>Las 3 mejoras que más se notan</SectionTitle>
        <Priorities items={view.prioridades} />
      </section>

      {view.criterios ? (
        <section className="space-y-3">
          <SectionTitle pro>Los 8 criterios BARRONSYSTEM</SectionTitle>
          <CriteriaGrid defs={REVISION_CRITERIA} criterios={view.criterios} />
        </section>
      ) : (
        <LockedSection title="Los 8 criterios BARRONSYSTEM" description="Qué se ve y cómo subir un punto en punto focal, composición, color, luz, historia, orden, cartelería e invitación." />
      )}

      {view.plan ? (
        <section className="space-y-3">
          <SectionTitle pro>Plan de 30, 60 y 90 días</SectionTitle>
          <div className="grid gap-3 md:grid-cols-3">
            {(
              [
                ["30 días", "Lo que el cliente nota mañana", view.plan.dias_30],
                ["60 días", "Lo que cambia la manera de trabajar", view.plan.dias_60],
                ["90 días", "Lo que necesita inversión o decisión", view.plan.dias_90],
              ] as const
            ).map(([t, s, items]) => (
              <Card key={t}>
                <h3 className="font-display text-lg">{t}</h3>
                <p className="mb-3 text-xs text-muted">{s}</p>
                <List items={[...items]} />
              </Card>
            ))}
          </div>
        </section>
      ) : (
        <LockedSection title="Plan de 30, 60 y 90 días" description="Lo de mañana, lo de este mes y lo que necesita inversión, en orden." />
      )}

      {view.guia_equipo ? (
        <section className="grid gap-3 md:grid-cols-2">
          <Card>
            <SectionTitle pro>Guía para tu equipo</SectionTitle>
            <p className="mb-3 mt-1 text-xs text-muted">Para imprimir y dejar junto a la caja.</p>
            <List items={view.guia_equipo} />
          </Card>
          <Card className="space-y-4">
            <SectionTitle pro>Color y cartel</SectionTitle>
            {view.paleta_sugerida?.length ? <Swatches colors={view.paleta_sugerida} /> : null}
            {view.cartel_sugerido ? (
              <p className="rounded-xl border border-dashed border-line p-4 text-center font-display text-xl">{view.cartel_sugerido}</p>
            ) : null}
          </Card>
        </section>
      ) : (
        <LockedSection title="Guía para tu equipo, color y cartel" description="Checklist diaria, paleta sugerida y texto de cartel listo para imprimir." />
      )}
    </div>
  );
}

export function CoherenciaReport({ view }: { view: CoherenciaView }) {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <SectionTitle>¿Cuentan la misma historia?</SectionTitle>
        <p className="text-base leading-relaxed text-fg-2">{view.resumen}</p>
      </section>
      {view.lo_que_funciona.length ? (
        <section className="space-y-3">
          <SectionTitle>Donde ya coinciden</SectionTitle>
          <List items={view.lo_que_funciona} />
        </section>
      ) : null}
      {view.locked || !view.prioridades || !view.criterios ? (
        <LockedSection title="Informe de coherencia" description="La coherencia tienda y web es una función Pro. Tu informe sigue guardado." />
      ) : (
        <>
          <section className="space-y-3">
            <SectionTitle>Las 3 prioridades</SectionTitle>
            <Priorities items={view.prioridades} />
          </section>
          <section className="space-y-3">
            <SectionTitle pro>Los 6 criterios de coherencia</SectionTitle>
            <CriteriaGrid defs={COHERENCIA_CRITERIA} criterios={view.criterios} />
          </section>
          <section className="grid gap-3 md:grid-cols-2">
            <Card>
              <SectionTitle>En la tienda</SectionTitle>
              <div className="mt-3"><List items={view.en_tienda ?? []} /></div>
            </Card>
            <Card>
              <SectionTitle>En la web</SectionTitle>
              <div className="mt-3"><List items={view.en_web ?? []} /></div>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}

const STRUCTURE_LABELS = { piramide: "Pirámide", repeticion: "Repetición", asimetria: "Asimetría" } as const;
const COST_LABELS = { bajo: "Coste bajo", medio: "Coste medio", alto: "Coste alto" } as const;

export function IdeaReport({ view }: { view: IdeaView }) {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <SectionTitle>El brief en una frase</SectionTitle>
        <p className="accent text-2xl leading-snug text-fg">{view.frase_brief}</p>
        {view.historia ? <p className="text-base text-fg-2">{view.historia}</p> : null}
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Card className="space-y-3">
          <SectionTitle>Paleta</SectionTitle>
          <Swatches colors={view.paleta} />
        </Card>
        <Card className="space-y-2">
          <SectionTitle>Punto focal</SectionTitle>
          <p className="text-sm text-fg-2">{view.punto_focal}</p>
          {view.estructura ? (
            <p className="text-sm text-fg-2">
              <span className="text-fg">Estructura: {STRUCTURE_LABELS[view.estructura]}.</span> {view.por_que_estructura}
            </p>
          ) : null}
        </Card>
      </section>

      <section className="space-y-3">
        <SectionTitle>Montaje paso a paso</SectionTitle>
        <ol className="space-y-2">
          {view.montaje.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-fg-2">
              <span className="w-5 shrink-0 font-display text-muted">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        {view.locked && view.totalSteps > view.montaje.length ? (
          <p className="text-sm text-muted">Y {view.totalSteps - view.montaje.length} pasos más en la versión Pro.</p>
        ) : null}
      </section>

      {view.locked ? (
        <LockedSection title="Atrezo, cartel, luz y cómo medirlo" description="Lista de atrezo con alternativas reutilizadas, texto del cartel, luz, errores a evitar y cómo saber si funciona." />
      ) : (
        <>
          <section className="space-y-3">
            <SectionTitle pro>Atrezo</SectionTitle>
            <div className="grid gap-3 md:grid-cols-2">
              {(view.atrezo ?? []).map((a, i) => (
                <Card key={i} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium">{a.elemento}</h3>
                    <Badge>{COST_LABELS[a.coste]}</Badge>
                  </div>
                  <p className="text-sm text-fg-2">{a.alternativa_reutilizada}</p>
                </Card>
              ))}
            </div>
          </section>
          <section className="grid gap-3 md:grid-cols-3">
            <Card className="space-y-2">
              <SectionTitle>Cartel</SectionTitle>
              <p className="font-display text-xl">{view.cartel}</p>
            </Card>
            <Card className="space-y-2">
              <SectionTitle>Luz</SectionTitle>
              <p className="text-sm text-fg-2">{view.luz}</p>
            </Card>
            <Card className="space-y-2">
              <SectionTitle>Tiempo</SectionTitle>
              <p className="text-sm text-fg-2">{view.tiempo_montaje}</p>
            </Card>
          </section>
          <section className="grid gap-3 md:grid-cols-2">
            <Card>
              <SectionTitle>Cómo saber si funciona</SectionTitle>
              <div className="mt-3"><List items={view.medir ?? []} /></div>
            </Card>
            <Card>
              <SectionTitle>Errores a evitar</SectionTitle>
              <div className="mt-3"><List items={view.errores_a_evitar ?? []} /></div>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}

export function AiNotice() {
  return (
    <p className="text-xs text-muted">
      Informe generado con inteligencia artificial siguiendo el método BARRONSYSTEM. Es orientativo: revisa siempre el resultado con tu criterio y el de tu equipo.
    </p>
  );
}
