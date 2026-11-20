"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTemplate } from "@/lib/email/send";

export async function grantPro(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("user_id"));
  const days = Math.min(365, Math.max(1, Number(formData.get("days")) || 30));
  const until = new Date(Date.now() + days * 86400000).toISOString();
  await createAdminClient().from("profiles").update({ pro_until: until }).eq("id", userId);
  revalidatePath("/admin/usuarios");
}

export async function revokePro(formData: FormData) {
  await requireAdmin();
  await createAdminClient().from("profiles").update({ pro_until: null }).eq("id", String(formData.get("user_id")));
  revalidatePath("/admin/usuarios");
}

export async function setAffiliateStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!["pending", "active", "paused", "rejected"].includes(status)) return;
  const admin = createAdminClient();
  const { data } = await admin.from("affiliates").update({ status }).eq("id", id).select("user_id").single();
  if (data && status === "active") await sendTemplate(data.user_id, "affiliate_approved", `aff-ok:${id}`);
  revalidatePath("/admin/afiliados");
}

export async function setCommissionStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!["approved", "paid", "void"].includes(status)) return;
  await createAdminClient()
    .from("commissions")
    .update({ status, paid_at: status === "paid" ? new Date().toISOString() : null })
    .eq("id", id);
  revalidatePath("/admin/afiliados");
}
