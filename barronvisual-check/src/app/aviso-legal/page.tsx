import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";
import { site } from "@/lib/config/site";

export const metadata: Metadata = { title: "Aviso legal", alternates: { canonical: "/aviso-legal" } };

export default function AvisoLegal() {
  return (
    <LegalPage title="Aviso legal" updated="20 de noviembre de 2026">
      <p>En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), estos son los datos del titular de {site.name}:</p>
      <ul>
        <li><strong>Titular:</strong> [COMPLETAR: nombre o razón social]</li>
        <li><strong>NIF:</strong> [COMPLETAR]</li>
        <li><strong>Domicilio:</strong> [COMPLETAR: confirmar si es C/ Balborraz, 16, 49002 Zamora]</li>
        <li><strong>Email:</strong> <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></li>
        <li><strong>Datos registrales:</strong> [COMPLETAR si procede]</li>
      </ul>
      <h2>Uso del sitio</h2>
      <p>El acceso a la web es libre. Usar la aplicación requiere registro y aceptar las <a href="/condiciones">condiciones de suscripción</a>.</p>
      <h2>Propiedad intelectual</h2>
      <p>
        Las marcas BARRONVISUAL, BARRONSYSTEM y Maison Barron, los textos, el diseño y el código de esta web pertenecen a su titular. Las fotos que
        subes siguen siendo tuyas.
      </p>
      <h2>Inteligencia artificial</h2>
      <p>Los informes los genera un modelo de inteligencia artificial con el método BARRONSYSTEM. Son orientativos y no sustituyen el criterio profesional.</p>
    </LegalPage>
  );
}
