// Criterios de puntuación. Basados en las capas de auditoría BARRONSYSTEM
// (Módulo 1, puntuación de 0 a 3) y en la composición de escaparate del Módulo 3.
// Los usan el prompt de la IA y la interfaz, así que el texto es el mismo en los dos.

export type CriterionDef = { key: string; label: string; question: string };

export const REVISION_CRITERIA = [
  { key: "punto_focal", label: "Punto focal", question: "¿Hay un solo protagonista, a la altura de los ojos de quien pasa (aprox. 1,40 a 1,70 m), y todo lo demás le acompaña?" },
  { key: "composicion", label: "Composición y jerarquía", question: "¿Se leen protagonista, secundarios y fondo? ¿Hay una estructura clara (pirámide, repetición o asimetría) y grupos impares?" },
  { key: "color", label: "Color y contraste", question: "¿Paleta de dos o tres colores y contraste suficiente para que el producto se despegue del fondo?" },
  { key: "luz", label: "Luz", question: "¿Luz de acento sobre el punto focal, luz general suave, temperatura adecuada al producto y sin reflejos en el cristal?" },
  { key: "historia", label: "Mensaje e historia", question: "¿Se entiende en tres segundos qué se vende, a quién y qué se quiere que sienta? ¿Cabe en una frase?" },
  { key: "orden", label: "Orden, aire y limpieza", question: "¿Hay aire entre piezas, sin saturar? ¿Está limpio, planchado, sin cajas ni etiquetas a la vista?" },
  { key: "senaletica", label: "Cartelería y precio", question: "¿Cartel breve, legible desde la acera o el pasillo, coherente con la marca y con precio claro si procede?" },
  { key: "invitacion", label: "Invitación a la compra", question: "¿Invita a entrar, tocar o probar? ¿Se ve el interior, el acceso está despejado y el producto es alcanzable?" },
] as const satisfies readonly CriterionDef[];

export const COHERENCIA_CRITERIA = [
  { key: "identidad", label: "Identidad visual", question: "¿Tienda y web comparten color, tipografía, tono y estilo fotográfico?" },
  { key: "protagonista", label: "Mismo protagonista", question: "¿El producto o la colección del escaparate es el que abre la portada web (escaparate = hero)?" },
  { key: "mensaje", label: "Misma campaña", question: "¿El mensaje y la campaña de temporada son los mismos en los dos canales?" },
  { key: "imagen", label: "Calidad de imagen", question: "¿La foto de producto y el estilismo de la web están a la altura de la tienda (o al revés)?" },
  { key: "recorrido", label: "Recorrido equivalente", question: "¿Los puntos focales de la tienda tienen su sección en la web y el orden de lectura es parecido?" },
  { key: "llamada", label: "Llamada a la acción", question: "¿La puerta de la tienda y el botón principal de la web invitan con la misma claridad?" },
] as const satisfies readonly CriterionDef[];

export type RevisionCriterionKey = (typeof REVISION_CRITERIA)[number]["key"];
export type CoherenciaCriterionKey = (typeof COHERENCIA_CRITERIA)[number]["key"];

export const SPACE_LABELS = {
  escaparate: "Escaparate",
  mesa: "Mesa de producto",
  lineal: "Lineal o muro",
  probador: "Probador",
  fachada: "Fachada y entrada",
  interior: "Vista general de la tienda",
  web: "Web",
} as const;

export const STORE_TYPE_LABELS = {
  moda: "Moda",
  calzado: "Calzado",
  joyeria: "Joyería",
  decoracion: "Decoración y hogar",
  belleza: "Belleza",
  gourmet: "Alimentación gourmet",
  otro: "Otro",
} as const;

/** Puntuación global 0-100 a partir de los criterios de 0 a 3 (igual que la hoja de BARRONSYSTEM). */
export function overallScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((a, b) => a + Math.min(3, Math.max(0, Math.round(b))), 0);
  return Math.round((sum / (scores.length * 3)) * 100);
}
