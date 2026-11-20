import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getProfile, getUser } from "@/lib/auth";
import { effectivePlan } from "@/lib/plan";
import { limitFor } from "@/lib/config/plans";
import { consumeQuota, refundQuota } from "@/lib/quota";
import { IdeaInputSchema } from "@/lib/ai/schemas";
import { generateIdea } from "@/lib/ai/generate";
import { createAdminClient } from "@/lib/supabase/admin";
import { track } from "@/lib/analytics";
import { aiErrorResponse, jsonError, limitReachedResponse } from "@/lib/api";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return jsonError(401, "unauthorized", "Inicia sesión para pedir ideas.");
  const profile = await getProfile();
  if (!profile) return jsonError(401, "unauthorized", "Inicia sesión para pedir ideas.");

  const body = await request.json().catch(() => null);
  const parsed = IdeaInputSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "bad_request", "Completa la campaña, el producto y el presupuesto.");
  const input = parsed.data;

  const plan = effectivePlan(profile);
  const limit = limitFor(plan, "idea");
  const quota = await consumeQuota(user.id, "idea", limit);
  if (!quota.allowed) return limitReachedResponse(user.id, "idea", plan, quota.used);

  try {
    const { result, usage } = await generateIdea(input);
    const id = randomUUID();
    const admin = createAdminClient();
    const { error } = await admin.from("reports").insert({
      id,
      user_id: user.id,
      kind: "idea",
      space_type: "escaparate",
      title: result.titulo || input.campaign,
      input,
      result,
      model: usage.model,
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      duration_ms: usage.duration_ms,
    });
    if (error) throw new Error(`reports insert: ${error.message}`);
    await track("report_created", { kind: "idea", plan, ...usage }, user.id);
    return NextResponse.json({ id, used: quota.used, limit });
  } catch (e) {
    await refundQuota(user.id, "idea");
    await track("report_failed", { kind: "idea", code: (e as { code?: string })?.code ?? "internal" }, user.id);
    return aiErrorResponse(e);
  }
}
