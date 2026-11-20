import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignUpForm } from "../auth-forms";
import { Check } from "@/components/ui";
import { getUser } from "@/lib/auth";
import { safeNext } from "@/lib/utils";
import { normalizeRef } from "@/lib/affiliates";
import { PLANS } from "@/lib/config/plans";

export const metadata: Metadata = {
  title: "Crear cuenta gratis",
  description: "Crea tu cuenta y revisa tu escaparate gratis con el método BARRONSYSTEM.",
  alternates: { canonical: "/registro" },
  robots: { index: true, follow: true },
};

export default async function RegistroPage({ searchParams }: { searchParams: Promise<{ next?: string; ref?: string }> }) {
  const { next, ref } = await searchParams;
  const dest = safeNext(next, "/panel/bienvenida");
  if (await getUser()) redirect(dest);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Crea tu cuenta gratis</h1>
        <ul className="mt-4 space-y-2 text-sm text-fg-2">
          {PLANS.free.includes.slice(0, 3).map((t) => (
            <li key={t} className="flex gap-2"><Check className="mt-0.5 text-fg" />{t}</li>
          ))}
        </ul>
      </div>
      <SignUpForm next={dest} refCode={normalizeRef(ref) ?? undefined} />
    </div>
  );
}
