import type { Metadata } from "next";
import { PublicShell } from "@/components/site";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "Baja de correos", robots: { index: false } };

export default async function BajaPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  return (
    <PublicShell>
      <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl">{ok === "1" ? "Te hemos dado de baja" : "No hemos encontrado tu suscripción"}</h1>
        <p className="mt-4 text-fg-2">
          {ok === "1"
            ? "No volverás a recibir correos comerciales. Seguirás recibiendo los avisos de tu cuenta (pagos, seguridad)."
            : "Puede que ya estuvieras de baja. Puedes cambiarlo en tu perfil."}
        </p>
        <ButtonLink href="/panel/perfil" variant="secondary" className="mt-8">Ir a mi perfil</ButtonLink>
      </section>
    </PublicShell>
  );
}
