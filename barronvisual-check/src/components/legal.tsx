import { PublicShell } from "@/components/site";

// Plantillas legales. Los huecos [COMPLETAR] son datos que solo puede dar el titular
// (o su asesoría). Antes de cobrar en real: `grep -rn "\[COMPLETAR" src` debe salir vacío.

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <PublicShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">Última actualización: {updated}</p>
        <div className="mt-10 space-y-6 text-fg-2 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-fg [&_li]:ml-5 [&_li]:list-disc [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-fg">
          {children}
        </div>
      </article>
    </PublicShell>
  );
}
