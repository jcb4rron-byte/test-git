import { PublicShell } from "@/components/site";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Error 404</p>
        <h1 className="mt-4 font-display text-4xl">Este escaparate está vacío</h1>
        <p className="mt-4 text-fg-2">La página que buscas no existe o se ha movido.</p>
        <ButtonLink href="/" className="mt-8">Volver al inicio</ButtonLink>
      </section>
    </PublicShell>
  );
}
