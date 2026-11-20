import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { CLIENT_EVENTS, track, type EventName } from "@/lib/analytics";

export const runtime = "nodejs";

// Eventos de interfaz (lista cerrada). Sin datos personales: solo claves y valores cortos.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { name?: string; props?: Record<string, unknown> } | null;
  if (!body?.name || !CLIENT_EVENTS.has(body.name as EventName)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const props: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(body.props ?? {}).slice(0, 8)) {
    if (/^[a-z_]{1,32}$/.test(k) && (typeof v === "number" || typeof v === "boolean" || (typeof v === "string" && v.length <= 64))) {
      props[k] = v;
    }
  }
  const user = await getUser();
  await track(body.name as EventName, props, user?.id ?? null);
  return NextResponse.json({ ok: true });
}
