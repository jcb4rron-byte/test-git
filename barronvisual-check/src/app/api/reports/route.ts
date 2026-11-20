import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getProfile, getUser } from "@/lib/auth";
import { effectivePlan } from "@/lib/plan";
import { limitFor } from "@/lib/config/plans";
import { consumeQuota, refundQuota } from "@/lib/quota";
import { ReviewInputSchema } from "@/lib/ai/schemas";
import { generateCoherencia, generateRevision } from "@/lib/ai/generate";
import { createAdminClient, IMAGES_BUCKET } from "@/lib/supabase/admin";
import { extensionFor, readImage } from "@/lib/images";
import { track } from "@/lib/analytics";
import { aiErrorResponse, jsonError, limitReachedResponse } from "@/lib/api";

export const runtime = "nodejs";
// La IA puede tardar: ver timeout del cliente en lib/ai/generate.ts.
export const maxDuration = 300;

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return jsonError(401, "unauthorized", "Inicia sesión para revisar.");
  const profile = await getProfile();
  if (!profile) return jsonError(401, "unauthorized", "Inicia sesión para revisar.");

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, "bad_request", "No se ha recibido la imagen. Si pesa mucho, prueba con una más ligera.");
  }

  const parsed = ReviewInputSchema.safeParse({
    kind: form.get("kind"),
    space_type: form.get("space_type"),
    store_type: form.get("store_type") || profile.store_type || undefined,
    goal: (form.get("goal") as string | null) || undefined,
  });
  if (!parsed.success) return jsonError(400, "bad_request", "Revisa los datos del formulario.");
  const input = parsed.data;

  const files = form.getAll("images").filter((f): f is File => f instanceof File);
  const needed = input.kind === "coherencia" ? 2 : 1;
  if (files.length !== needed) {
    return jsonError(400, "bad_request", needed === 2 ? "Sube la foto de la tienda y la captura de la web." : "Sube una foto.");
  }

  let images;
  try {
    images = await Promise.all(files.map(readImage));
  } catch (e) {
    return jsonError(400, "bad_image", e instanceof Error ? e.message : "Imagen no válida.");
  }

  const plan = effectivePlan(profile);
  const limit = limitFor(plan, input.kind);
  if (limit === 0) {
    await track("upgrade_prompt_shown", { feature: input.kind, reason: "pro_only" }, user.id);
    return jsonError(402, "pro_required", "La coherencia tienda y web está en el plan Pro.", { feature: input.kind });
  }

  const quota = await consumeQuota(user.id, input.kind, limit);
  if (!quota.allowed) return limitReachedResponse(user.id, input.kind, plan, quota.used);

  try {
    const generated =
      input.kind === "coherencia"
        ? await generateCoherencia(input, images[0], images[1])
        : await generateRevision(input, images[0]);

    const reportId = randomUUID();
    const admin = createAdminClient();

    // Las fotos se guardan después de generar: si la IA falla no quedan archivos huérfanos.
    const paths: string[] = [];
    for (const [i, img] of images.entries()) {
      const path = `${user.id}/${reportId}/${i + 1}.${extensionFor(img.mediaType)}`;
      const { error } = await admin.storage.from(IMAGES_BUCKET).upload(path, img.bytes, { contentType: img.mediaType, upsert: false });
      if (error) console.error("upload", path, error.message);
      else paths.push(path);
    }

    const { error } = await admin.from("reports").insert({
      id: reportId,
      user_id: user.id,
      kind: input.kind,
      space_type: input.space_type,
      title: generated.result.titulo || "Revisión",
      input: { goal: input.goal ?? null, store_type: input.store_type ?? null },
      image_paths: paths,
      score: generated.score,
      result: generated.result,
      model: generated.usage.model,
      input_tokens: generated.usage.input_tokens,
      output_tokens: generated.usage.output_tokens,
      duration_ms: generated.usage.duration_ms,
    });
    if (error) throw new Error(`reports insert: ${error.message}`);

    await track(
      "report_created",
      { kind: input.kind, space_type: input.space_type, score: generated.score, plan, ...generated.usage },
      user.id,
    );
    return NextResponse.json({ id: reportId, used: quota.used, limit });
  } catch (e) {
    await refundQuota(user.id, input.kind);
    await track("report_failed", { kind: input.kind, code: (e as { code?: string })?.code ?? "internal" }, user.id);
    return aiErrorResponse(e);
  }
}
