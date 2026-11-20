import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInForm } from "../auth-forms";
import { Alert } from "@/components/ui";
import { getUser } from "@/lib/auth";
import { safeNext } from "@/lib/utils";

export const metadata: Metadata = { title: "Entrar", alternates: { canonical: "/entrar" } };

const ERRORS: Record<string, string> = {
  enlace: "El enlace ha caducado o ya se usó. Vuelve a intentarlo.",
  google: "No se ha podido entrar con Google. Inténtalo de nuevo.",
};

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const dest = safeNext(next);
  if (await getUser()) redirect(dest);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Entrar</h1>
        <p className="mt-2 text-fg-2">Sigue donde lo dejaste.</p>
      </div>
      {error && ERRORS[error] ? <Alert tone="bad">{ERRORS[error]}</Alert> : null}
      <SignInForm next={dest} />
    </div>
  );
}
