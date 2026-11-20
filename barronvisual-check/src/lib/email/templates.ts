import { site, absoluteUrl } from "@/lib/config/site";
import { PLANS } from "@/lib/config/plans";

// Plantillas en español. Reglas de marca: ver scripts/check-copy.mjs (vocabulario, guion largo, cifras).

export type TemplateId =
  | "welcome"
  | "pro_activated"
  | "payment_failed"
  | "subscription_canceled"
  | "limit_reached"
  | "first_review_nudge"
  | "affiliate_approved";

/** Comerciales: solo con consentimiento (marketing_opt_in) y con EMAIL_MARKETING_ENABLED. */
export const MARKETING_TEMPLATES: ReadonlySet<TemplateId> = new Set<TemplateId>(["limit_reached", "first_review_nudge"]);

export type TemplateData = { name?: string | null; unsubscribeUrl?: string };

type Rendered = { subject: string; html: string; text: string };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(opts: { preheader: string; title: string; paragraphs: string[]; cta?: { label: string; href: string }; unsubscribeUrl?: string }): string {
  const p = opts.paragraphs.map((t) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#27272a">${t}</p>`).join("");
  const cta = opts.cta
    ? `<p style="margin:24px 0"><a href="${opts.cta.href}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-size:15px">${esc(opts.cta.label)}</a></p>`
    : "";
  const unsub = opts.unsubscribeUrl
    ? `<br><a href="${opts.unsubscribeUrl}" style="color:#71717a">Darme de baja de estos correos</a>`
    : "";
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f4f4f5;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
<span style="display:none;max-height:0;overflow:hidden">${esc(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;padding:32px">
<tr><td>
<p style="margin:0 0 24px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#71717a">${esc(site.name)}</p>
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#000;font-weight:500">${esc(opts.title)}</h1>
${p}${cta}
<p style="margin:32px 0 0;font-size:13px;line-height:1.6;color:#71717a">${esc(site.brand)} · ${esc(site.anchor)}${unsub}</p>
</td></tr></table></td></tr></table></body></html>`;
}

function textOf(paragraphs: string[], cta?: { label: string; href: string }, unsubscribeUrl?: string): string {
  const strip = (s: string) => s.replace(/<[^>]+>/g, "");
  return [
    ...paragraphs.map(strip),
    cta ? `${cta.label}: ${cta.href}` : "",
    unsubscribeUrl ? `Baja: ${unsubscribeUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function renderTemplate(id: TemplateId, data: TemplateData): Rendered {
  const hola = data.name ? `Hola, ${esc(data.name.split(" ")[0])}:` : "Hola:";
  const build = (subject: string, preheader: string, title: string, paragraphs: string[], cta?: { label: string; href: string }) => ({
    subject,
    html: layout({ preheader, title, paragraphs, cta, unsubscribeUrl: data.unsubscribeUrl }),
    text: textOf([title, ...paragraphs], cta, data.unsubscribeUrl),
  });

  switch (id) {
    case "welcome":
      return build(
        "Tu primera revisión te espera",
        "Haz una foto de tu escaparate y sabrás qué cambiar primero.",
        "Te damos la bienvenida",
        [
          hola,
          "Ya puedes revisar tu escaparate, una mesa o un lineal con el método BARRONSYSTEM. Haz la foto de frente, desde donde la ve quien pasa, con la luz de un día normal.",
          `Con el plan gratuito tienes ${PLANS.free.limits.revision} revisión al día y ${PLANS.free.limits.idea} idea de escaparate. Empieza por el espacio que más te preocupa.`,
        ],
        { label: "Hacer mi primera revisión", href: absoluteUrl("/panel/revisar") },
      );
    case "pro_activated":
      return build(
        "Ya tienes Pro",
        "Informe completo, coherencia tienda y web, comparar antes y después.",
        "Tu plan Pro está activo",
        [
          hola,
          "Gracias por confiar en BARRONVISUAL. Ya tienes el informe completo con los 8 criterios, el plan de 30, 60 y 90 días, la guía para tu equipo y la revisión de coherencia entre tu tienda y tu web.",
          "Las revisiones que ya habías hecho también se ven ahora completas.",
          "La factura te llega aparte, desde Stripe. Puedes cambiar o cancelar la suscripción cuando quieras desde tu panel.",
        ],
        { label: "Ir a mi panel", href: absoluteUrl("/panel") },
      );
    case "payment_failed":
      return build(
        "No hemos podido cobrar tu suscripción",
        "Revisa tu tarjeta para no perder el plan Pro.",
        "Hay un problema con el pago",
        [
          hola,
          "El banco ha rechazado el último cobro de tu plan Pro. Stripe lo volverá a intentar en los próximos días; mientras tanto sigues teniendo acceso.",
          "Si la tarjeta ha caducado o ha cambiado, puedes actualizarla en un minuto.",
        ],
        { label: "Actualizar mi forma de pago", href: absoluteUrl("/panel/suscripcion") },
      );
    case "subscription_canceled":
      return build(
        "Tu plan Pro ha terminado",
        "Tus informes siguen guardados.",
        "Hemos cerrado tu plan Pro",
        [
          hola,
          "Tu suscripción ha terminado y vuelves al plan gratuito. Tus informes siguen guardados y los verás completos si vuelves a Pro.",
          "Si nos cuentas por qué te has ido (respondiendo a este correo), nos ayudas a mejorar. Lo leemos todo.",
        ],
        { label: "Volver a Pro", href: absoluteUrl("/precios") },
      );
    case "limit_reached":
      return build(
        "Mañana tienes otra revisión (o 8 hoy con Pro)",
        "Con Pro revisas hasta 8 espacios al día con el informe completo.",
        "Has usado tu revisión de hoy",
        [
          hola,
          "Mañana a medianoche se renueva tu revisión gratuita.",
          `Si estás cambiando el escaparate o preparas campaña y necesitas revisar varias veces, el plan Pro te da ${PLANS.pro.limits.revision} revisiones al día, el informe completo y comparar antes y después, por ${PLANS.pro.priceLabel} (${PLANS.pro.priceNote.toLowerCase()}).`,
        ],
        { label: `Pasar a Pro ${PLANS.pro.priceLabel}`, href: absoluteUrl("/precios") },
      );
    case "first_review_nudge":
      return build(
        "¿Le hacemos la foto al escaparate?",
        "Una foto, tres mejoras.",
        "Tu primera revisión sigue pendiente",
        [
          hola,
          "Te registraste hace un par de días y todavía no has revisado ningún espacio. Basta una foto de frente, desde la acera.",
          "Enseguida tendrás la puntuación BARRONSYSTEM y las tres mejoras que más se notan, casi todas sin gastar.",
        ],
        { label: "Revisar mi escaparate", href: absoluteUrl("/panel/revisar") },
      );
    case "affiliate_approved":
      return build(
        "Tu código de afiliado está activo",
        "Ya puedes compartir tu enlace.",
        "Ya formas parte del programa de afiliados",
        [
          hola,
          "Hemos aprobado tu solicitud. Tu enlace y tus comisiones están en el panel, en la sección Afiliados.",
          "Recuerda indicar que es un enlace de afiliado cuando lo compartas.",
        ],
        { label: "Ver mi enlace", href: absoluteUrl("/panel/afiliados") },
      );
  }
}
