import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";
import { PLANS } from "@/lib/config/plans";
import { site } from "@/lib/config/site";

export const metadata: Metadata = { title: "Condiciones de suscripción", alternates: { canonical: "/condiciones" } };

export default function Condiciones() {
  return (
    <LegalPage title="Condiciones de suscripción" updated="20 de noviembre de 2026">
      <p>[COMPLETAR: revisar estas condiciones con asesoría antes de cobrar en real.]</p>

      <h2>1. Qué es {site.name}</h2>
      <p>Una aplicación web que revisa fotos de espacios comerciales con el método BARRONSYSTEM mediante inteligencia artificial y propone ideas de escaparate. La presta [COMPLETAR: titular] (en adelante, BARRONVISUAL).</p>

      <h2>2. Cuenta</h2>
      <p>Necesitas una cuenta con un email válido. Eres responsable de tu contraseña y de lo que se haga con tu cuenta.</p>

      <h2>3. Planes y precio</h2>
      <ul>
        <li><strong>Gratis:</strong> {PLANS.free.includes.join("; ")}.</li>
        <li><strong>Pro:</strong> {PLANS.pro.priceLabel}, IVA incluido. {PLANS.pro.includes.join("; ")}.</li>
        <li>Los límites diarios se reinician a medianoche, hora peninsular española. Si una generación falla, no cuenta.</li>
      </ul>

      <h2>4. Pago, renovación y cancelación</h2>
      <ul>
        <li>El pago se hace con Stripe al contratar y se renueva automáticamente cada mes (o cada año si eliges el pago anual).</li>
        <li>Puedes cancelar cuando quieras desde tu panel. Mantienes Pro hasta el final del periodo pagado. No hay permanencia.</li>
        <li>Si cambia el precio, te avisaremos con al menos 30 días de antelación y podrás cancelar antes de que se aplique.</li>
      </ul>

      <h2>5. Derecho de desistimiento</h2>
      <p>[COMPLETAR: redactar con asesoría. Si contratas como consumidor, la ley prevé 14 días de desistimiento; al ser un servicio digital que empieza a prestarse al momento, hay que recoger tu consentimiento expreso y tu conocimiento de la pérdida de ese derecho al iniciar el servicio. Si contratas como empresa o profesional, no aplica.]</p>

      <h2>6. Uso correcto</h2>
      <ul>
        <li>Sube solo fotos que tengas derecho a usar. Evita que aparezcan personas reconocibles.</li>
        <li>No uses el servicio para revisar contenido que no sea un espacio comercial o su web, ni para automatizar peticiones masivas.</li>
      </ul>

      <h2>7. Inteligencia artificial y resultados</h2>
      <p>Los informes son orientativos. Los genera un modelo de inteligencia artificial y pueden contener errores. No garantizamos un resultado de ventas concreto: revisa siempre las propuestas con tu criterio.</p>

      <h2>8. Propiedad</h2>
      <p>Tus fotos son tuyas: nos das permiso solo para procesarlas y mostrarte el informe. El método BARRONSYSTEM, la marca y la aplicación son de BARRONVISUAL.</p>

      <h2>9. Responsabilidad</h2>
      <p>[COMPLETAR: limitación de responsabilidad, con asesoría.]</p>

      <h2>10. Ley y contacto</h2>
      <p>Se aplica la ley española. Para cualquier duda: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.</p>
    </LegalPage>
  );
}
