import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";
import { site } from "@/lib/config/site";

export const metadata: Metadata = { title: "Política de privacidad", alternates: { canonical: "/privacidad" } };

export default function Privacidad() {
  return (
    <LegalPage title="Política de privacidad" updated="20 de noviembre de 2026">
      <p>
        <strong>Responsable:</strong> [COMPLETAR: titular y NIF, igual que en el aviso legal]. Contacto:{" "}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>

      <h2>Qué datos tratamos y para qué</h2>
      <ul>
        <li><strong>Cuenta:</strong> email, nombre, nombre y tipo de tienda, ciudad. Para darte el servicio (base: contrato).</li>
        <li><strong>Fotos y capturas que subes:</strong> para generar tu informe (base: contrato). Se guardan en privado y se borran a los 30 días; el informe en texto se conserva mientras tengas cuenta. No subas fotos donde se reconozca a personas.</li>
        <li><strong>Pagos:</strong> los gestiona Stripe. No guardamos los datos de tu tarjeta (base: contrato y obligaciones legales de facturación).</li>
        <li><strong>Uso del servicio:</strong> qué funciones usas y cuántas veces, sin cookies de terceros, para los límites del plan y para mejorar el producto (base: interés legítimo).</li>
        <li><strong>Correos comerciales:</strong> solo si lo aceptas, con baja en cada correo (base: consentimiento).</li>
        <li><strong>Afiliación:</strong> si llegas por un enlace de recomendación y lo aceptas, guardamos quién te recomendó (base: consentimiento).</li>
      </ul>

      <h2>Quién nos ayuda a prestarlo (encargados del tratamiento)</h2>
      <ul>
        <li>Supabase: base de datos, autenticación y almacenamiento de fotos. Región: [COMPLETAR: región del proyecto, recomendada UE].</li>
        <li>Vercel: alojamiento de la web.</li>
        <li>Anthropic: modelo de inteligencia artificial que lee la foto y redacta el informe. [COMPLETAR: verificar el acuerdo de tratamiento (DPA), la retención de datos y las garantías de transferencia internacional vigentes].</li>
        <li>Stripe: pagos y facturas.</li>
        <li>Brevo: envío de correos.</li>
      </ul>
      <p>[COMPLETAR: revisar con asesoría las transferencias internacionales de cada proveedor y sus garantías.]</p>

      <h2>Decisiones automatizadas</h2>
      <p>La IA genera un informe orientativo. No tomamos decisiones con efectos jurídicos sobre ti ni sobre las personas de tu equipo a partir de él.</p>

      <h2>Cuánto tiempo</h2>
      <ul>
        <li>Fotos: 30 días.</li>
        <li>Cuenta e informes: hasta que borres la cuenta (Perfil, Borrar mi cuenta).</li>
        <li>Facturas: el plazo que exige la normativa fiscal.</li>
      </ul>

      <h2>Tus derechos</h2>
      <p>
        Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {site.contactEmail}. Si crees que no lo
        hemos hecho bien, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).
      </p>
    </LegalPage>
  );
}
