export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
export function formatEUR(cents: number): string {
  return eur.format(cents / 100);
}

const dateFmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Madrid" });
const dateTimeFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Madrid",
});
export const formatDate = (d: string | Date) => dateFmt.format(new Date(d));
export const formatDateTime = (d: string | Date) => dateTimeFmt.format(new Date(d));

/** Solo rutas internas: evita redirecciones abiertas con ?next=https://... */
export function safeNext(next: string | null | undefined, fallback = "/panel"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

export function scoreTone(score: number): "bajo" | "medio" | "alto" {
  if (score < 50) return "bajo";
  if (score < 75) return "medio";
  return "alto";
}
