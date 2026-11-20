import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, syncSubscription } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { markReferralConverted, recordCommission } from "@/lib/affiliates";
import { sendTemplate } from "@/lib/email/send";
import { track } from "@/lib/analytics";

// Stripe necesita el cuerpo sin parsear para verificar la firma.
export const runtime = "nodejs";

async function userIdForCustomer(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null): Promise<string | null> {
  if (!customer) return null;
  const id = typeof customer === "string" ? customer : customer.id;
  const admin = createAdminClient();
  const { data } = await admin.from("profiles").select("id").eq("stripe_customer_id", id).maybeSingle();
  return data?.id ?? null;
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "webhook no configurado" }, { status: 400 });

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (e) {
    console.error("Firma de webhook no válida", e);
    return NextResponse.json({ error: "firma no válida" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: seen } = await admin.from("stripe_events").select("id").eq("id", event.id).maybeSingle();
  if (seen) return NextResponse.json({ received: true, duplicate: true });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode !== "subscription" || !session.subscription) break;
        const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
        const sub = await getStripe().subscriptions.retrieve(subId);
        const userId = await syncSubscription(sub, session.client_reference_id);
        if (userId) {
          await track("subscription_started", { interval: sub.items.data[0]?.price.recurring?.interval ?? "month" }, userId);
          await markReferralConverted(userId);
          await sendTemplate(userId, "pro_activated", `pro:${sub.id}`);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.paused":
      case "customer.subscription.resumed": {
        await syncSubscription(event.data.object);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const userId = await syncSubscription(sub);
        if (userId) {
          await track("subscription_canceled", { reason: sub.cancellation_details?.reason ?? null }, userId);
          await sendTemplate(userId, "subscription_canceled", `canceled:${sub.id}`);
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        const userId = await userIdForCustomer(invoice.customer);
        if (userId) await recordCommission(invoice, userId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const userId = await userIdForCustomer(invoice.customer);
        if (userId && invoice.id) {
          await track("payment_failed", { attempt: invoice.attempt_count }, userId);
          await sendTemplate(userId, "payment_failed", `payfail:${invoice.id}`);
        }
        break;
      }

      default:
        break;
    }
  } catch (e) {
    // 500 para que Stripe reintente. No se marca como procesado.
    console.error("webhook", event.type, e);
    return NextResponse.json({ error: "error procesando el evento" }, { status: 500 });
  }

  await admin.from("stripe_events").insert({ id: event.id, type: event.type });
  return NextResponse.json({ received: true });
}
