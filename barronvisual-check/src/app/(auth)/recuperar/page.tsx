import type { Metadata } from "next";
import Link from "next/link";
import { ResetForm } from "../auth-forms";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function RecuperarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Recuperar contraseña</h1>
        <p className="mt-2 text-fg-2">Te enviamos un enlace para elegir una nueva.</p>
      </div>
      <ResetForm />
      <p className="text-center text-sm"><Link href="/entrar" className="text-muted underline underline-offset-4 hover:text-fg">Volver a entrar</Link></p>
    </div>
  );
}
