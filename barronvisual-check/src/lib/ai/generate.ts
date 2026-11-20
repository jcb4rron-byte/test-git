import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type * as z from "zod/v4";
import { COHERENCIA_SYSTEM, IDEA_SYSTEM, REVISION_SYSTEM, ideaUserText, revisionUserText } from "@/lib/ai/prompts";
import {
  CoherenciaSchema,
  IdeaSchema,
  RevisionSchema,
  type CoherenciaResult,
  type IdeaInput,
  type IdeaResult,
  type ReviewInput,
  type RevisionResult,
} from "@/lib/ai/schemas";
import { COHERENCIA_CRITERIA, REVISION_CRITERIA, overallScore } from "@/lib/ai/criteria";

// Modelo por defecto: Claude Opus 5.5. Se puede cambiar con ANTHROPIC_MODEL sin tocar código
// (por ejemplo claude-sonnet-5-5 cuesta la mitad por token; lo decide el titular, ver docs).
export const AI_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
type Effort = "low" | "medium" | "high" | "xhigh" | "max";
const EFFORT = (process.env.ANTHROPIC_EFFORT as Effort | undefined) || "medium";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  // Lee ANTHROPIC_API_KEY del entorno. 120 s por intento y 1 reintento: como mucho unos 240 s,
  // por debajo del maxDuration = 300 s de las rutas que generan informes.
  client ??= new Anthropic({ timeout: 120_000, maxRetries: 1 });
  return client;
}

export class AIError extends Error {
  constructor(
    public code: "refusal" | "invalid_image" | "truncated" | "unparsed" | "unavailable" | "rate_limited",
    message: string,
  ) {
    super(message);
  }
}

export type ImageInput = { base64: string; mediaType: "image/jpeg" | "image/png" | "image/webp" };

type Usage = { model: string; input_tokens: number; output_tokens: number; duration_ms: number };

async function run<S extends z.ZodType>(opts: {
  system: string;
  schema: S;
  content: Anthropic.Beta.BetaContentBlockParam[];
}): Promise<{ data: z.infer<S>; usage: Usage }> {
  const started = Date.now();
  let response;
  try {
    response = await getClient().beta.messages.parse({
      model: AI_MODEL,
      max_tokens: 16000,
      // Si el modelo declina por política, la API reintenta en el modelo de respaldo por defecto.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: EFFORT, format: betaZodOutputFormat(opts.schema) },
      system: [{ type: "text", text: opts.system, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: opts.content }],
    });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) throw new AIError("rate_limited", "Hay mucha demanda ahora mismo.");
    if (e instanceof Anthropic.APIError) {
      console.error("Anthropic API error", e.status, e.message);
      throw new AIError("unavailable", "El servicio de IA no responde.");
    }
    throw e;
  }

  if (response.stop_reason === "refusal") {
    throw new AIError("refusal", "No se ha podido revisar esta imagen.");
  }
  if (response.stop_reason === "max_tokens") {
    throw new AIError("truncated", "La respuesta ha salido incompleta.");
  }
  const data = response.parsed_output;
  if (!data) throw new AIError("unparsed", "La respuesta no tiene el formato esperado.");

  return {
    data: data as z.infer<S>,
    usage: {
      model: response.model,
      input_tokens:
        response.usage.input_tokens +
        (response.usage.cache_read_input_tokens ?? 0) +
        (response.usage.cache_creation_input_tokens ?? 0),
      output_tokens: response.usage.output_tokens,
      duration_ms: Date.now() - started,
    },
  };
}

const clamp03 = (n: number) => Math.min(3, Math.max(0, Math.round(Number.isFinite(n) ? n : 0)));
const HEX = /^#[0-9a-fA-F]{6}$/;

function imageBlocks(images: ImageInput[]): Anthropic.Beta.BetaContentBlockParam[] {
  return images.map((img) => ({
    type: "image",
    source: { type: "base64", media_type: img.mediaType, data: img.base64 },
  }));
}

export async function generateRevision(
  input: ReviewInput,
  image: ImageInput,
): Promise<{ result: RevisionResult; score: number; usage: Usage }> {
  const { data, usage } = await run({
    system: REVISION_SYSTEM,
    schema: RevisionSchema,
    content: [...imageBlocks([image]), { type: "text", text: revisionUserText(input) }],
  });
  if (!data.es_valida) throw new AIError("invalid_image", data.motivo_no_valida || "La foto no muestra un espacio de tienda.");

  for (const c of REVISION_CRITERIA) data.criterios[c.key].puntuacion = clamp03(data.criterios[c.key].puntuacion);
  data.prioridades = data.prioridades.slice(0, 3);
  data.paleta_sugerida = data.paleta_sugerida.filter((p) => HEX.test(p.hex)).slice(0, 3);
  const score = overallScore(REVISION_CRITERIA.map((c) => data.criterios[c.key].puntuacion));
  return { result: data, score, usage };
}

export async function generateCoherencia(
  input: ReviewInput,
  store: ImageInput,
  web: ImageInput,
): Promise<{ result: CoherenciaResult; score: number; usage: Usage }> {
  const { data, usage } = await run({
    system: COHERENCIA_SYSTEM,
    schema: CoherenciaSchema,
    content: [...imageBlocks([store, web]), { type: "text", text: revisionUserText(input) }],
  });
  if (!data.es_valida) throw new AIError("invalid_image", data.motivo_no_valida || "Las imágenes no son una tienda y su web.");

  for (const c of COHERENCIA_CRITERIA) data.criterios[c.key].puntuacion = clamp03(data.criterios[c.key].puntuacion);
  data.prioridades = data.prioridades.slice(0, 3);
  const score = overallScore(COHERENCIA_CRITERIA.map((c) => data.criterios[c.key].puntuacion));
  return { result: data, score, usage };
}

export async function generateIdea(input: IdeaInput): Promise<{ result: IdeaResult; usage: Usage }> {
  const { data, usage } = await run({
    system: IDEA_SYSTEM,
    schema: IdeaSchema,
    content: [{ type: "text", text: ideaUserText(input) }],
  });
  data.paleta = data.paleta.filter((p) => HEX.test(p.hex)).slice(0, 3);
  return { result: data, usage };
}
