# BARRONVISUAL Check

Aplicación web SaaS de **BARRONVISUAL**: la persona sube una foto de su escaparate, mesa o lineal y recibe una puntuación con el método **BARRONSYSTEM** (8 criterios de 0 a 3), las 3 mejoras prioritarias y un plan de 30, 60 y 90 días. Plan **Gratis** con límite diario y plan **Pro** a **9,99 €/mes** (IVA incluido).

Estado: **código completo, sin desplegar**. Pagos pensados para empezar en modo prueba (`sk_test_`). Antes de cobrar en real hay que cerrar la lista de la sección "Antes de producción".

## Documentación

| Documento | Qué contiene |
|---|---|
| [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) | Decisión de marca y nombre, arquitectura, estructura de carpetas, esquema de base de datos, flujos, monetización en el código, seguridad, costes |
| [docs/DISENO-UI-UX.md](docs/DISENO-UI-UX.md) | Sistema visual, modo claro y oscuro, pantallas, upsells sin trucos, accesibilidad, gráficos |
| [docs/LANZAMIENTO.md](docs/LANZAMIENTO.md) | Estrategia de lanzamiento y plan para los primeros 100 clientes |

## Stack

Next.js 16 (App Router) + React 19 + Tailwind CSS 4 · Node.js (route handlers y server actions) · PostgreSQL en Supabase (Auth con email y Google, RLS, Storage) · Stripe (Checkout, portal de cliente, webhooks) · Claude (API de Anthropic) para el análisis · Brevo para el correo · Vercel (hosting y cron).

## Arrancar en local

```bash
cd barronvisual-check
npm install
cp .env.example .env.local      # rellenar (ver docs/ARQUITECTURA.md, sección Variables)
npm run dev                      # http://localhost:3020
```

1. **Supabase**: crear un proyecto (región UE), ejecutar `supabase/migrations/20261120000000_init.sql` en el SQL Editor, activar el proveedor Google en Authentication y añadir `http://localhost:3020/auth/callback` (y la URL de producción) a las Redirect URLs.
2. **Stripe** (modo prueba): `STRIPE_SECRET_KEY=sk_test_... npm run stripe:setup -- --yearly --iva` y copiar los ids. Guardar una vez la configuración del portal de cliente en el panel de Stripe. Para el webhook en local: `stripe listen --forward-to localhost:3020/api/stripe/webhook`.
3. **Anthropic**: `ANTHROPIC_API_KEY` con un límite de gasto puesto en la consola.
4. **Admin**: añadir tu email a `ADMIN_EMAILS` o `update profiles set role = 'admin' where email = '...'`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` / `build` / `start` | Desarrollo, build de producción, servidor |
| `npm run typecheck` | TypeScript estricto |
| `npm run lint` | ESLint (reglas de Next y React) |
| `npm run check:copy` | Reglas de marca del grupo: sin "negocio", sin guion largo, sin "Desde" en precios, grafía de marcas |
| `npm run test:sql` | Prueba la migración en un PostgreSQL local temporal: triggers, cuotas, planes, RLS, afiliados |
| `npm run stripe:setup` | Crea producto y precios en Stripe (se niega con claves reales salvo `--live`) |

## Antes de producción (checklist)

- [ ] Alta de JCB (Seguridad Social, Cámara) y visto bueno del gestor para facturar. **Puerta de arranque de TEREMARKETING.**
- [ ] `grep -rn "\[COMPLETAR" src` sin resultados (aviso legal, privacidad, condiciones, afiliados) y textos revisados por asesoría.
- [ ] Prueba de punta a punta en modo test: registro email y Google, revisión, límite, pago, webhook, cancelación, borrar cuenta.
- [ ] Calidad de la IA validada con 20 fotos reales puntuadas a mano por JCB (ver docs/LANZAMIENTO.md, Fase 0).
- [ ] Coste real por informe medido en `/admin` y límites diarios ajustados.
- [ ] Remitente verificado en Brevo; `EMAIL_MARKETING_ENABLED` sigue en `false` hasta que JCB lo decida.
- [ ] Plan de Vercel adecuado para uso comercial (ver costes en docs/ARQUITECTURA.md).
- [ ] Marca "BARRONVISUAL Check" comprobada en OEPM/EUIPO.
