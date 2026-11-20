import type { Metadata } from "next";
import { NewPasswordForm } from "../auth-forms";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Nueva contraseña" };

export default async function NuevaContrasenaPage() {
  // Llega aquí con la sesión abierta por el enlace del email.
  await requireUser("/nueva-contrasena");
  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">Elige una contraseña nueva</h1>
      <NewPasswordForm />
    </div>
  );
}
