# TEREMARKETING

Sistema de marketing híbrido (humano + agentes de IA) de Maison Barron.
Capa de marketing de BARRONPLATFORM. Versión 0.1 · 7 nov 2026

Los puntos marcados `[COMPLETAR]` son datos que no se han podido confirmar.

## 1. Objetivo (hasta febrero 2027)

Conseguir ventas y reuniones comerciales para, por este orden:

1. **BARRONVISUAL**: servicios de visual merchandising, escaparatismo, consultoría y web/SEO.
2. **MARITERE**: Diagnóstico de tienda (149 €), cápsulas formativas y Academia de empresa.
3. **Fashion Retail Talent (FRT)**: solo vende a empresas. Precios por definir con una investigación de mercado (la hace su agente, ver sección 7).
4. **Barronico**: tres líneas: concept store (producto propio y personalizado, aún sin subir a la web), taller (arreglos de ropa) y agencia de marketing digital e IA, especializada en tiendas, comercios y marcas de retail.
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
- Tres entradas con compradores distintos (hipótesis a validar, ver nota):
  - **Estudio** (diseño, escaparates, proyectos): marcas de moda, calzado, joyería y decoración con 2 a 20 tiendas propias, y comercios independientes premium. Decide: dirección de marca o de retail, responsable de VM, propietario.
  - **Consultoría** (guías de VM, rollouts, phygital): cadenas y marcas medianas con 5 a 100 tiendas que necesitan coherencia entre puntos de venta. Decide: dirección de retail, operaciones o marketing. Ventaja: español y francés.
  - **Academia** (cursos online): escaparatistas y VM junior, estudiantes, dependientes que ascienden a encargados, y dueños de tienda pequeña. Se vende con embudo (checklist → secuencia de email → curso), no con correo en frío. Los cursos tienen precio fijo visible.
- Prioridad de venta activa: Consultoría y Estudio con marcas de 3 a 30 tiendas en España y Francia. La Academia se vende con el embudo y el SEO.
- Gancho: casos de estudio (Chanel, Zara Francia, Lladró, Galeries Lafayette) y menciones de prensa.
- Oferta de entrada: `[COMPLETAR: precios del Estudio y la Consultoría, que no he podido ver]`.
- Secuencia: correo 1 con caso → seguimiento a los 7 días → seguimiento a los 14 → cierre educado.
- Bloqueantes de Juan Carlos: rellenar los 4 casos, enviar los borradores de backlinks.

### MARITERE
- Oferta de entrada: **Diagnóstico de tienda, 149 €**, con hoja de visita, informe y plan de formación.
- Compradores: comercios locales, asociaciones de comerciantes, cámaras de comercio, centros de formación.
- Palanca: el taller de AMAPE en Barbate y sus menciones.
- Siguiente venta: Academia de empresa (informe trimestral) y cápsulas.
- Bloqueantes: verificar la ficha de Google, crear el buzón `info@maritere.es`, subir el material de Academia.

### Fashion Retail Talent
- Solo vende a empresas (marcas y cadenas de moda, lujo y retail que contratan o forman talento).
- **Misión del agente FRT, semanas 1-2: investigación de precios.** Entregable: tabla de 10 a 15 competidores (agencias de selección de retail y moda, bolsas de empleo sectoriales, consultoras de talento) con modelo de precio, tarifa pública, servicios y público. Modelos a comparar: honorarios por selección (fijo o porcentaje del salario anual), suscripción por publicación de ofertas, y paquetes por volumen. Resultado: tres escenarios de precio con su justificación. Las cifras no se inventan: cada una lleva su fuente, y lo que no sea público se marca como no disponible.
- Después: lista de leads de empresas, un correo de presentación y una página de captación con formulario.

### Barronico
- **Agencia de marketing digital e IA** (especializada en tiendas, comercios y marcas de retail): es la línea B2B. Cliente: comercios y marcas con 1 a 10 tiendas. Decisión de posicionamiento pendiente: separar bien su oferta de la de BARRONVISUAL (que es diseño visual y phygital) para no competir entre ellas.
- **Taller (arreglos de ropa):** venta local. Se trabaja con ficha de Google, SEO local y WhatsApp, no con correo en frío.
- **Concept store:** sin producto en la web, no se vende aún. Hasta entonces: captar correos y enseñar el proceso en contenido. Cuando haya producto, se trata como Manta Zamorana.

### MANTA ZAMORANA
- Solo lista de espera con aviso de lanzamiento en febrero. Sin campañas hasta tener producto.

## 8. Medición

| Marca | KPI principal | KPI secundario |
|---|---|---|
| BARRONVISUAL | Reuniones agendadas | Respuestas a correos, leads desde la web |
| MARITERE | Diagnósticos vendidos | Consultas de Academia de empresa |
| FRT | Reuniones con empresas | Respuestas y presupuestos enviados |
| Barronico agencia | Reuniones agendadas | Respuestas a correos |
| Barronico taller | Llamadas y mensajes desde la ficha de Google | Reseñas nuevas |
| Barronico concept store | Suscriptores a la lista de aviso | — |
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

**Decididas**
- **CRM:** Google Sheets. Gratis, sin límites de contactos y los agentes lo leen y escriben fácilmente. Brevo queda solo para listas con consentimiento (newsletter, secuencia del Checklist), no para correo en frío.
- **Envío del correo en frío:** desde buzones reales (Titan/Gmail), uno a uno y personalizado, no desde Brevo.
- **Ritmo de envío:** empezar con 5 a 10 correos al día, de martes a jueves entre las 9:30 y las 11:00, subiendo poco a poco para cuidar la reputación del dominio. Empieza cuando estén listos los casos de estudio y el CRM.

**Pendientes de Juan Carlos**
1. Validar los tres perfiles de cliente de BARRONVISUAL (sección 7).
2. Precios del Estudio y la Consultoría.
3. Decidir cómo se separa la agencia de Barronico de BARRONVISUAL.
