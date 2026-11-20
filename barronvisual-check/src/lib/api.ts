import "server-only";
import { NextResponse } from "next/server";
import { AIError } from "@/lib/ai/generate";
import { track } from "@/lib/analytics";
import { sendTemplate } from "@/lib/email/send";
import type { Feature, PlanId } from "@/lib/config/plans";

export const jsonError = (status: number, error: string, message: string, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ error, message, ...extra }, { status });

/** Semana ISO (2026-W47): un aviso de límite como mucho por semana. */
export function isoWeek(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export async function limitReachedResponse(userId: string, feature: Feature, plan: PlanId, used: number) {
  await track("limit_reached", { feature, plan, used }, userId);
  if (plan === "free") await sendTemplate(userId, "limit_reached", `limit:${userId}:${isoWeek()}`);
  return jsonError(
    429,
    "limit_reached",
    plan === "free"
      ? "Has usado lo que incluye el plan gratuito hoy. Mañana se renueva, o pasa a Pro para seguir."
      : "Has llegado al límite diario de tu plan. Se renueva a medianoche.",
    { plan, feature },
  );
}

export function aiErrorResponse(e: unknown) {
  if (e instanceof AIError) {
    switch (e.code) {
      case "invalid_image":
        return jsonError(422, e.code, `${e.message} No se ha descontado de tu límite.`);
      case "refusal":
        return jsonError(422, e.code, "No hemos podido revisar esta imagen. Prueba con otra foto. No se ha descontado de tu límite.");
      case "rate_limited":
        return jsonError(503, e.code, "Hay mucha demanda ahora mismo. Inténtalo en un minuto. No se ha descontado de tu límite.");
      default:
        return jsonError(502, e.code, "No hemos podido generar el informe. Inténtalo de nuevo. No se ha descontado de tu límite.");
    }
  }
  console.error(e);
  return jsonError(500, "internal", "Algo ha fallado. Inténtalo de nuevo. No se ha descontado de tu límite.");
}
