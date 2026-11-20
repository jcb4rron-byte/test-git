import { NextResponse } from "next/server";
import { createAdminClient, IMAGES_BUCKET } from "@/lib/supabase/admin";
import { sendTemplate } from "@/lib/email/send";

export const runtime = "nodejs";
export const maxDuration = 300;

// Tarea diaria (vercel.json: 06:15 UTC, fuera de la franja pico de Madrid).
// Vercel envía "Authorization: Bearer <CRON_SECRET>" si la variable existe.
const IMAGE_RETENTION_DAYS = Number(process.env.IMAGE_RETENTION_DAYS || 30);
const DAY = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }
  const admin = createAdminClient();
  const summary = { imagesDeleted: 0, commissionsApproved: 0, nudges: 0 };

  // 1. Borra las fotos pasados N días (los informes en texto se conservan). Privacidad y coste.
  const cutoff = new Date(Date.now() - IMAGE_RETENTION_DAYS * DAY).toISOString();
  const { data: old } = await admin
    .from("reports")
    .select("id, image_paths")
    .is("images_deleted_at", null)
    .lt("created_at", cutoff)
    .neq("image_paths", "{}")
    .limit(500);
  for (const r of old ?? []) {
    const { error } = await admin.storage.from(IMAGES_BUCKET).remove(r.image_paths as string[]);
    if (!error) {
      await admin.from("reports").update({ images_deleted_at: new Date().toISOString(), image_paths: [] }).eq("id", r.id);
      summary.imagesDeleted += 1;
    }
  }

  // 2. Comisiones que ya pasaron el periodo de retención: pendientes de pago manual.
  const { data: approved } = await admin
    .from("commissions")
    .update({ status: "approved" })
    .eq("status", "pending")
    .lt("available_at", new Date().toISOString())
    .select("id");
  summary.commissionsApproved = approved?.length ?? 0;

  // 3. Recordatorio a quien se registró hace 2 días y no ha hecho ninguna revisión.
  //    Solo sale si EMAIL_MARKETING_ENABLED=true y la persona aceptó correos (ver lib/email/send.ts).
  const from = new Date(Date.now() - 3 * DAY).toISOString();
  const to = new Date(Date.now() - 2 * DAY).toISOString();
  const { data: recent } = await admin.from("profiles").select("id").gte("created_at", from).lt("created_at", to).limit(500);
  for (const p of recent ?? []) {
    const { count } = await admin.from("reports").select("id", { count: "exact", head: true }).eq("user_id", p.id);
    if ((count ?? 0) === 0 && (await sendTemplate(p.id, "first_review_nudge", `nudge1:${p.id}`)) === "sent") summary.nudges += 1;
  }

  return NextResponse.json({ ok: true, ...summary });
}
