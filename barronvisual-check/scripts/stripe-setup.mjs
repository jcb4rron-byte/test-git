#!/usr/bin/env node
// Crea en Stripe el producto Pro y sus precios (9,99 €/mes y, opcional, 99 €/año), IVA incluido.
// Idempotente: si ya existen (por lookup_key), los reutiliza.
//
// Uso:
//   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs            # modo prueba
//   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs --yearly   # + precio anual
//   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs --iva      # + tipo IVA 21 % incluido
// Con una clave sk_live_ se niega salvo que se pase --live (decisión del titular, no del script).
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
const args = new Set(process.argv.slice(2));
if (!key) {
  console.error("Falta STRIPE_SECRET_KEY");
  process.exit(1);
}
if (key.startsWith("sk_live_") && !args.has("--live")) {
  console.error("Clave en modo real. Si de verdad quieres crear los precios en real, añade --live.");
  process.exit(1);
}

const stripe = new Stripe(key);

async function ensurePrice({ lookup, amount, interval, product }) {
  const found = await stripe.prices.list({ lookup_keys: [lookup], limit: 1 });
  if (found.data[0]) return found.data[0];
  return stripe.prices.create({
    product,
    currency: "eur",
    unit_amount: amount,
    recurring: { interval },
    lookup_key: lookup,
    tax_behavior: "inclusive",
    nickname: `Pro ${interval === "year" ? "anual" : "mensual"}`,
  });
}

const products = await stripe.products.search({ query: "metadata['app']:'barronvisual-check'" }).catch(() => ({ data: [] }));
const product =
  products.data[0] ??
  (await stripe.products.create({
    name: "BARRONVISUAL Check Pro",
    description: "Revisiones con foto, informe completo BARRONSYSTEM, coherencia tienda y web e ideas de escaparate.",
    metadata: { app: "barronvisual-check" },
  }));

const monthly = await ensurePrice({ lookup: "check_pro_monthly", amount: 999, interval: "month", product: product.id });
const lines = [`STRIPE_PRICE_PRO_MONTHLY=${monthly.id}`];

if (args.has("--yearly")) {
  const yearly = await ensurePrice({ lookup: "check_pro_yearly", amount: 9900, interval: "year", product: product.id });
  lines.push(`STRIPE_PRICE_PRO_YEARLY=${yearly.id}`);
}

if (args.has("--iva")) {
  const rates = await stripe.taxRates.list({ active: true, limit: 100 });
  const iva =
    rates.data.find((r) => r.percentage === 21 && r.inclusive && r.country === "ES") ??
    (await stripe.taxRates.create({ display_name: "IVA", percentage: 21, inclusive: true, country: "ES", jurisdiction: "ES", description: "IVA España 21 % incluido" }));
  lines.push(`STRIPE_TAX_RATE_IVA=${iva.id}`);
}

console.log(`Producto: ${product.id} (${key.startsWith("sk_test_") ? "modo prueba" : "MODO REAL"})\n`);
console.log("Copia estas variables en .env.local y en Vercel:\n");
console.log(lines.join("\n"));
