# TEREMARKETING

Sistema de marketing híbrido (humano + agentes de IA) de Maison Barron.
Capa de marketing de BARRONPLATFORM. Versión 0.1 · 7 nov 2026

Los puntos marcados `[COMPLETAR]` son datos que no se han podido confirmar.

## 1. Objetivo (hasta febrero 2027)

Conseguir ventas y reuniones comerciales para, por este orden:

1. **BARRONVISUAL**: servicios de visual merchandising, escaparatismo, consultoría y web/SEO.
2. **MARITERE**: Diagnóstico de tienda (149 €), cápsulas formativas y Academia de empresa.
3. **Fashion Retail Talent (FRT)**: `[COMPLETAR: qué se vende exactamente y a quién (empresas, candidatos o ambos), precio y llamada a la acción]`.
4. **Barronico**: `[COMPLETAR: productos y precios actuales]`.
5. **MANTA ZAMORANA**: sin producto hasta febrero. Solo lista de espera.
6. **BARRON ACCESS**: suscripciones de 95, 295 y 995 €. Pendiente de probar con claves `sk_test_`.

## 2. Principios

- **Los agentes proponen, Juan Carlos aprueba y envía.** Ningún agente envía correos, publica ni cobra por su cuenta.
- **Gasto cero nuevo.** Se usan Claude, Claude Code, GitHub, Vercel, Titan, Brevo (plan gratuito), GA4, Search Console, Looker Studio, Gmail, Calendar y Google Sheets.
- **Una sola fuente de verdad.** Este documento y el `CLAUDE.md` del monorepo `master-plan-barron`.
- **Cada marca con su voz.** Ningún texto sale sin pasar por la guía de voz de su marca.
- **Los secretos no se pegan en el chat.** Claves y contraseñas solo en variables de entorno de Vercel.

## 3. Organigrama

```
Head of Marketing: Juan Carlos Barrón (estrategia, voz, aprobación y envío)
│
├── TERE (orquestador): reparte tareas, prepara el resumen semanal, escala decisiones
│   ├── Agente Prospección     → lista de leads y borradores de correo
│   ├── Agente Contenido       → blog, casos de estudio, publicaciones
│   ├── Agente SEO/GEO         → palabras clave, datos estructurados, backlinks
│   ├── Agente Email/CRM       → secuencias, seguimiento, limpieza de la hoja
│   ├── Agente Analítica       → resumen semanal con 3 acciones
│   └── Brand Guardian         → revisa voz y coherencia de cada pieza
```

Cada agente es una sesión de Claude o Claude Code con instrucciones fijas en el repositorio. TERE es la sesión "Maison Barron".

## 4. Agentes

| Agente | Misión | Entradas | Salida | Límite |
|---|---|---|---|---|
| Prospección | Buscar y puntuar leads por marca | Perfil de cliente ideal, web pública | Filas en el CRM y borradores en Gmail | Solo datos públicos. No envía |
| Contenido | Una pieza por semana y su reutilización | Casos, calendario, guía de voz | Borradores en `/blog` y textos para redes | No publica sin visto bueno |
| SEO/GEO | Aumentar visibilidad en Google y buscadores de IA | Search Console, GA4 | Cambios de código y lista de backlinks | Cambios en producción tras aprobación |
| Email/CRM | Seguimiento a los 7 días, secuencias | CRM, Brevo, Titan | Borradores y estados actualizados | No envía. Respeta bajas y RGPD |
| Analítica | Decir qué funciona | GA4, GSC, Looker, CRM | Resumen del lunes con 3 acciones | Solo lectura |
| Brand Guardian | Coherencia de marca | Guías de voz, `brand-tokens.yml` | Aprobado o corregido, con motivo | Puede bloquear una pieza |

## 5. CRM mínimo (Google Sheets)

Columnas: `marca · empresa · contacto · cargo · email/teléfono · origen · fecha primer contacto · estado · próximo paso · fecha próximo paso · oferta · notas`

Estados: `nuevo → contactado → respondió → reunión → propuesta → ganado / perdido`

Reglas:
- Un lead sin acción en 7 días aparece en el resumen del lunes.
- Todo contacto lleva origen y base legal (interés legítimo B2B o consentimiento).
- Hay una columna de baja y se respeta siempre.

## 6. Rutina semanal

| Día | Quién | Qué |
|---|---|---|
| Lunes | Analítica + TERE | Resumen: tráfico, leads, ventas, 3 acciones de venta |
| Lunes | Prospección | 10 leads nuevos por marca prioritaria |
| Martes | Email/CRM | Borradores de correo y de seguimiento listos en Gmail |
| Miércoles | Contenido | Una pieza en borrador |
| Jueves | Juan Carlos | Revisa y envía correos, aprueba contenido |
| Viernes | SEO/GEO + TERE | Cambios aprobados, actualización del `CLAUDE.md`, pendientes |

## 7. Plan por producto

### BARRONVISUAL
- Cliente ideal: `[COMPLETAR: marcas, tiendas independientes o grandes cadenas]`.
- Gancho: casos de estudio (Chanel, Zara Francia, Lladró, Galeries Lafayette) y menciones de prensa.
- Oferta de entrada: `[COMPLETAR]`.
- Secuencia: correo 1 con caso → seguimiento a los 7 días → seguimiento a los 14 → cierre educado.
- Bloqueantes de Juan Carlos: rellenar los 4 casos, enviar los borradores de backlinks.

### MARITERE
- Oferta de entrada: **Diagnóstico de tienda, 149 €**, con hoja de visita, informe y plan de formación.
- Compradores: comercios locales, asociaciones de comerciantes, cámaras de comercio, centros de formación.
- Palanca: el taller de AMAPE en Barbate y sus menciones.
- Siguiente venta: Academia de empresa (informe trimestral) y cápsulas.
- Bloqueantes: verificar la ficha de Google, crear el buzón `info@maritere.es`, subir el material de Academia.

### Fashion Retail Talent
- `[COMPLETAR: qué ofrece a empresas y a candidatos]`.
- Propuesta de arranque: lista de leads por lado del mercado, un correo de presentación por lado, y una página de captación con formulario.

### Barronico
- `[COMPLETAR]`. Se aplica el mismo motor: una pieza por semana y lista de correo.

### MANTA ZAMORANA
- Solo lista de espera con aviso de lanzamiento en febrero. Sin campañas hasta tener producto.

## 8. Medición

| Marca | KPI principal | KPI secundario |
|---|---|---|
| BARRONVISUAL | Reuniones agendadas | Respuestas a correos, leads desde la web |
| MARITERE | Diagnósticos vendidos | Consultas de Academia de empresa |
| FRT | `[COMPLETAR]` | Altas y contactos |
| Barronico | `[COMPLETAR]` | Suscriptores |
| MANTA ZAMORANA | Altas en lista de espera | — |

## 9. Hoja de ruta

- **Semana 1:** completar los `[COMPLETAR]`, crear la hoja CRM, definir el perfil de cliente ideal por marca.
- **Semana 2:** 20 leads de BARRONVISUAL y 20 de MARITERE, primeros 10 correos enviados.
- **Semana 3:** rutina del lunes activa y primer seguimiento a los 7 días.
- **Semana 4:** revisión de resultados, decisión de qué agente automatizar más.

## 10. Riesgos y reglas

- **RGPD y correo no solicitado:** solo B2B con interés legítimo, identificación clara, baja en cada envío.
- **Reputación del dominio:** se limita el volumen diario y se vigila la entrega a bandeja de entrada.
- **Dependencia de ti:** si el material bloqueante no llega, el sistema se estanca. El resumen del lunes lo avisa.
- **Claves:** rotar la contraseña de Titan y no volver a pegarla en un chat.

## 11. Decisiones pendientes

1. Cliente ideal y oferta de entrada de BARRONVISUAL.
2. Qué vende exactamente FRT y a quién.
3. Qué vende Barronico y a qué precio.
4. Dónde vive el CRM: Google Sheets o Brevo.
5. Qué día de la semana se envían los correos.
