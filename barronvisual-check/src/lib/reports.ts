import "server-only";
import { createAdminClient, IMAGES_BUCKET } from "@/lib/supabase/admin";
import { historyCutoff } from "@/lib/plan";
import type { PlanId } from "@/lib/config/plans";
import type { CoherenciaResult, IdeaResult, RevisionResult } from "@/lib/ai/schemas";
import type { ReportRow } from "@/types/db";

export const REPORT_LIST_COLUMNS = "id, kind, space_type, title, score, created_at, image_paths, images_deleted_at";
export type ReportListItem = Pick<ReportRow, "id" | "kind" | "space_type" | "title" | "score" | "created_at" | "image_paths" | "images_deleted_at">;

export async function listReports(userId: string, plan: PlanId, limit = 50): Promise<{ items: ReportListItem[]; hiddenCount: number }> {
  const admin = createAdminClient();
  const cutoff = historyCutoff(plan);
  let query = admin.from("reports").select(REPORT_LIST_COLUMNS).eq("user_id", userId).order("created_at", { ascending: false }).limit(limit);
  if (cutoff) query = query.gte("created_at", cutoff.toISOString());
  const { data } = await query;

  let hiddenCount = 0;
  if (cutoff) {
    const { count } = await admin
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .lt("created_at", cutoff.toISOString());
    hiddenCount = count ?? 0;
  }
  return { items: (data ?? []) as ReportListItem[], hiddenCount };
}

export async function getReport(userId: string, id: string): Promise<ReportRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const admin = createAdminClient();
  const { data } = await admin.from("reports").select("*").eq("id", id).eq("user_id", userId).maybeSingle();
  return (data as ReportRow) ?? null;
}

export async function signedImageUrls(paths: string[], expiresIn = 3600): Promise<string[]> {
  if (paths.length === 0) return [];
  const admin = createAdminClient();
  const { data } = await admin.storage.from(IMAGES_BUCKET).createSignedUrls(paths, expiresIn);
  return (data ?? []).map((d) => d.signedUrl).filter((u): u is string => Boolean(u));
}

// ─── Vista según plan ──────────────────────────────────────────────────────────
// El plan gratuito ve el diagnóstico y las 3 prioridades; el resto llega bloqueado.
// Se recorta en el servidor: el contenido Pro nunca viaja al navegador de una cuenta gratuita.

export type RevisionView = Pick<RevisionResult, "titulo" | "resumen" | "lo_que_funciona" | "prioridades"> & {
  locked: boolean;
  criterios: RevisionResult["criterios"] | null;
  plan: RevisionResult["plan"] | null;
  guia_equipo: string[] | null;
  paleta_sugerida: RevisionResult["paleta_sugerida"] | null;
  cartel_sugerido: string | null;
};

export function revisionView(result: RevisionResult, pro: boolean): RevisionView {
  return {
    titulo: result.titulo,
    resumen: result.resumen,
    lo_que_funciona: result.lo_que_funciona,
    prioridades: result.prioridades,
    locked: !pro,
    criterios: pro ? result.criterios : null,
    plan: pro ? result.plan : null,
    guia_equipo: pro ? result.guia_equipo : null,
    paleta_sugerida: pro ? result.paleta_sugerida : null,
    cartel_sugerido: pro ? result.cartel_sugerido : null,
  };
}

export type IdeaView = Pick<IdeaResult, "titulo" | "frase_brief" | "paleta" | "punto_focal"> & {
  locked: boolean;
  montaje: string[];
  historia: string | null;
  estructura: IdeaResult["estructura"] | null;
  por_que_estructura: string | null;
  atrezo: IdeaResult["atrezo"] | null;
  cartel: string | null;
  luz: string | null;
  medir: string[] | null;
  errores_a_evitar: string[] | null;
  tiempo_montaje: string | null;
  totalSteps: number;
};

export function ideaView(result: IdeaResult, pro: boolean): IdeaView {
  return {
    titulo: result.titulo,
    frase_brief: result.frase_brief,
    paleta: result.paleta,
    punto_focal: result.punto_focal,
    locked: !pro,
    montaje: pro ? result.montaje : result.montaje.slice(0, 3),
    totalSteps: result.montaje.length,
    historia: pro ? result.historia : null,
    estructura: pro ? result.estructura : null,
    por_que_estructura: pro ? result.por_que_estructura : null,
    atrezo: pro ? result.atrezo : null,
    cartel: pro ? result.cartel : null,
    luz: pro ? result.luz : null,
    medir: pro ? result.medir : null,
    errores_a_evitar: pro ? result.errores_a_evitar : null,
    tiempo_montaje: pro ? result.tiempo_montaje : null,
  };
}

export type CoherenciaView = Pick<CoherenciaResult, "titulo" | "resumen" | "lo_que_funciona"> & {
  locked: boolean;
  prioridades: CoherenciaResult["prioridades"] | null;
  criterios: CoherenciaResult["criterios"] | null;
  en_tienda: string[] | null;
  en_web: string[] | null;
};

// La coherencia es solo Pro: si la cuenta vuelve a gratis, ve el resumen de las que ya hizo.
export function coherenciaView(result: CoherenciaResult, pro: boolean): CoherenciaView {
  return {
    titulo: result.titulo,
    resumen: result.resumen,
    lo_que_funciona: result.lo_que_funciona,
    locked: !pro,
    prioridades: pro ? result.prioridades : null,
    criterios: pro ? result.criterios : null,
    en_tienda: pro ? result.en_tienda : null,
    en_web: pro ? result.en_web : null,
  };
}
