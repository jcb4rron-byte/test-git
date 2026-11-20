import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = { title: "Cookies", alternates: { canonical: "/cookies" } };

export default function Cookies() {
  return (
    <LegalPage title="Política de cookies" updated="20 de noviembre de 2026">
      <p>Esta web no usa cookies de publicidad ni de analítica de terceros. Solo usa estas:</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted">
            <tr><th className="py-2">Nombre</th><th className="py-2">Para qué</th><th className="py-2">Duración</th><th className="py-2">Tipo</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            <tr><td className="py-2 font-mono">sb-*</td><td className="py-2">Mantener tu sesión iniciada</td><td className="py-2">Sesión de Supabase</td><td className="py-2">Técnica, necesaria</td></tr>
            <tr><td className="py-2 font-mono">bvc_ref</td><td className="py-2">Recordar quién te recomendó (solo si lo aceptas)</td><td className="py-2">30 días</td><td className="py-2">Afiliación, con consentimiento</td></tr>
          </tbody>
        </table>
      </div>
      <p>El modo claro u oscuro se guarda en el almacenamiento de tu navegador (clave <span className="font-mono">theme</span>) solo para recordar tu preferencia.</p>
      <p>Puedes borrar las cookies desde la configuración de tu navegador. Si borras la de sesión, tendrás que volver a entrar.</p>
    </LegalPage>
  );
}
