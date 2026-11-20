import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { absoluteUrl } from "@/lib/config/site";

export const runtime = "nodejs";

async function unsubscribe(token: string | null): Promise<boolean> {
  if (!token || !/^[0-9a-f-]{36}$/i.test(token)) return false;
  const admin = createAdminClient();
  const { data } = await admin.from("profiles").update({ marketing_opt_in: false }).eq("unsubscribe_token", token).select("id");
  return Boolean(data?.length);
}

// Enlace del correo: da de baja y lleva a la página de confirmación.
export async function GET(request: Request) {
  const ok = await unsubscribe(new URL(request.url).searchParams.get("token"));
  return NextResponse.redirect(absoluteUrl(`/baja?ok=${ok ? 1 : 0}`));
}

// Baja con un clic desde el cliente de correo (List-Unsubscribe-Post, RFC 8058).
export async function POST(request: Request) {
  await unsubscribe(new URL(request.url).searchParams.get("token"));
  return new NextResponse(null, { status: 204 });
}
