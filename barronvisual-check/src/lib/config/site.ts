// Datos de marca y enlaces. Cambiar aquí el nombre del producto lo cambia en toda la app.
// Grafía de marcas: respetar SIEMPRE las mayúsculas (CLAUDE.md del monorepo, sección 2).

export const site = {
  name: "BARRONVISUAL Check",
  shortName: "Check",
  brand: "BARRONVISUAL",
  method: "BARRONSYSTEM",
  group: "Maison Barron",
  tagline: "Haz una foto. Tu escaparate, revisado con criterio de experto.",
  description:
    "Sube una foto de tu escaparate, mesa o lineal y recibe una puntuación con el método BARRONSYSTEM, las tres mejoras que más se notan y un plan de 30, 60 y 90 días. Gratis una revisión al día.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3020").replace(/\/$/, ""),
  locale: "es_ES",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@barronvisual.com",
  // Frase ancla de BARRONVISUAL (no negociable, CLAUDE.md sección 1).
  anchor: "Llevamos 28 años diseñando recorridos que venden. Ahora también en pantalla.",
  links: {
    barronvisual: "https://barronvisual.com",
    consultoria: "https://barronvisual.com/consultoria",
    academia: "https://barronvisual.com/academia",
    windowDisplayKiller: "https://barronvisual.com/academia/window-display-killer",
    contacto: "https://barronvisual.com/contacto",
    sistema: "https://barronvisual.com/sistema",
    maisonBarron: "https://www.maisonbarron.es",
  },
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
