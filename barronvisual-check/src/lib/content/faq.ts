import { PLANS } from "@/lib/config/plans";

// Preguntas frecuentes (portada y precios). Van también en JSON-LD FAQPage.
export const FAQ = [
  {
    q: "¿Sustituye a un escaparatista o a una consultoría?",
    a: "No. Es una primera lectura rápida con el método BARRONSYSTEM para que sepas qué cambiar hoy. Una foto no enseña el recorrido, la luz a cada hora ni cómo trabaja tu equipo: para eso está la consultoría de BARRONVISUAL.",
  },
  {
    q: "¿Quién hace el informe?",
    a: "Un modelo de inteligencia artificial siguiendo las instrucciones y la escala de puntuación del método BARRONSYSTEM. El informe es orientativo y siempre lo debe revisar una persona de la tienda.",
  },
  {
    q: "¿Qué pasa con mis fotos?",
    a: "Se guardan en privado para que veas tu informe y se borran a los 30 días; el informe en texto se conserva. Solo se usan para generar tu revisión. No subas fotos donde se reconozca a personas.",
  },
  {
    q: "¿Qué incluye el plan gratuito?",
    a: `${PLANS.free.limits.revision} revisión con foto al día con la puntuación y las 3 mejoras prioritarias, ${PLANS.free.limits.idea} idea de escaparate al día y el historial de los últimos ${PLANS.free.historyDays} días. Sin tarjeta.`,
  },
  {
    q: "¿Cuánto cuesta Pro y cómo lo cancelo?",
    a: `${PLANS.pro.priceLabel}, IVA incluido. Lo cancelas cuando quieras desde tu panel y mantienes Pro hasta el final del periodo pagado. Recibes factura con tu NIF si lo añades en el pago.`,
  },
  {
    q: "¿Sirve para cualquier tienda?",
    a: "Está pensada para tienda física de moda, calzado, joyería, decoración, belleza o alimentación gourmet. Funciona con escaparates, mesas, lineales, probadores, fachadas y vistas generales.",
  },
] as const;
