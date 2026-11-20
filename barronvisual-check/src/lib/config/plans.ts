// Planes, límites diarios y qué incluye cada uno. Fuente única: la usan la API,
// la página de precios, el panel y los correos.

export type PlanId = "free" | "pro";
export type Feature = "revision" | "coherencia" | "idea";
export type BillingInterval = "month" | "year";

export type Plan = {
  id: PlanId;
  name: string;
  priceLabel: string;
  priceNote: string;
  /** Usos por día y función. 0 = no incluido. Se reinicia a medianoche (Madrid). */
  limits: Record<Feature, number>;
  /** Días de historial visibles. null = todo. */
  historyDays: number | null;
  includes: string[];
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Gratis",
    priceLabel: "0 €",
    priceNote: "Para siempre, sin tarjeta",
    limits: { revision: 1, coherencia: 0, idea: 1 },
    historyDays: 7,
    includes: [
      "1 revisión con foto al día",
      "Puntuación BARRONSYSTEM y las 3 mejoras prioritarias",
      "1 idea de escaparate al día (versión resumida)",
      "Historial de los últimos 7 días",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceLabel: "9,99 €/mes",
    priceNote: "IVA incluido. Cancelas cuando quieras",
    limits: { revision: 8, coherencia: 3, idea: 10 },
    historyDays: null,
    includes: [
      "8 revisiones con foto al día",
      "Informe completo: 8 criterios, plan de 30, 60 y 90 días y guía para tu equipo",
      "Coherencia tienda y web: escaparate frente a tu página de inicio (3 al día)",
      "10 ideas de escaparate al día, con montaje, atrezo y cartel",
      "Comparar antes y después",
      "Historial completo e informe para imprimir o guardar en PDF",
    ],
  },
};

// Precio anual opcional: solo se ofrece si existe STRIPE_PRICE_PRO_YEARLY.
export const YEARLY = {
  priceLabel: "99 €/año",
  priceNote: "IVA incluido. Equivale a 2 meses gratis",
};

export const FEATURE_LABELS: Record<Feature, string> = {
  revision: "Revisión con foto",
  coherencia: "Coherencia tienda y web",
  idea: "Idea de escaparate",
};

export function limitFor(plan: PlanId, feature: Feature): number {
  return PLANS[plan].limits[feature];
}
