# TEREMARKETING

Sistema de marketing híbrido (humano + agentes de IA) de Maison Barron.
Capa de marketing de BARRONPLATFORM. Versión 0.1 · 7 nov 2026

Los puntos marcados `[COMPLETAR]` son datos que no se han podido confirmar.

## 1. Objetivo (hasta febrero 2027)

Conseguir ventas y reuniones comerciales para, por este orden:

1. **BARRONVISUAL**: servicios de visual merchandising, escaparatismo, consultoría y web/SEO.
2. **MARITERE**: Diagnóstico de tienda (149 €), cápsulas formativas y Academia de empresa.
3. **Fashion Retail Talent (FRT)**: empresa de talento creativo freelance (escaparatistas, visual merchandisers, UX web, dirección de arte, diseño, oficios artesanos, equipos de pop-up). Solo vende a empresas. Precios por definir con una investigación de mercado (la hace su agente, ver sección 7).
4. **Barronico** (Balborraz 14, Zamora; "abrimos muy pronto"): MATERIA (concept store MYSPACE con piezas de autor y customizadas, taller de costura y arreglos, escaparates de autor) y CÓDIGO (agencia de marketing digital e IA para marcas de ropa, comercios y tiendas). Tienda online "próximamente".
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
- Mensaje de la web: "Escaparate, tienda y web. Un solo sistema que vende." Dolores: el escaparate para a la gente pero no entra, el cliente no sabe dónde mirar, la web no se parece a la tienda, se cambia sin medir.
- Tres entradas (datos de la web). Cada encargo del Estudio tiene precio cerrado por nivel: comercio independiente, marca con varias tiendas o red amplia.
  - **Estudio**: Diseño de Escaparate, Estrategia anual de Visual Merchandising, Diseño de Página Web y Sistema Integral. Cliente ideal: comercios independientes premium y marcas con varias tiendas, de moda, calzado, joyería y decoración. Precios: `[COMPLETAR: están en cada página de servicio]`.
  - **Consultoría**: Auditoría Phygital Retail 490 € (1 día), Workshop In-Company 990 € (2 días), Alta Asesoría con Juan Carlos 1.990 € (4 días). Cliente ideal: marcas y cadenas con tienda y web que no trabajan juntas, y equipos de retail que necesitan criterio. **La Auditoría de 490 € es la mejor puerta de entrada.**
  - **Academia**: programas online, MASTER CLASS, sesión 1-to-1 virtual y recursos. Cliente ideal: escaparatistas, VM junior, estudiantes y dueños de tienda. Se vende con embudo (checklist → secuencia de email → curso), no con correo en frío.
- Prioridad de venta activa: Auditoría (490 €) y Estudio con comercios y marcas de 1 a 30 tiendas en España y Francia.
- Gancho: casos de estudio (Chanel, Zara Francia, Lladró, Galeries Lafayette, Printemps, Maison Margiela) y menciones de prensa.
- Secuencia: correo 1 con caso → seguimiento a los 7 días → seguimiento a los 14 → cierre educado.
- Bloqueantes de Juan Carlos: rellenar los 4 casos, enviar los borradores de backlinks.

### MARITERE
- Oferta de entrada: **Diagnóstico de tienda, 149 €**, con hoja de visita, informe y plan de formación.
- Compradores: comercios locales, asociaciones de comerciantes, cámaras de comercio, centros de formación.
- Palanca: el taller de AMAPE en Barbate y sus menciones.
- Siguiente venta: Academia de empresa (informe trimestral) y cápsulas.
- Bloqueantes: verificar la ficha de Google, crear el buzón `info@maritere.es`, subir el material de Academia.

### Fashion Retail Talent
- Qué es: **no es una agencia de selección, es un proveedor de talento creativo freelance** para marcas y retailers (por proyecto, campaña o temporada). Pide talento con formulario o briefing. Sectores: moda, lujo, belleza, lifestyle, retail y pop-up. Hay que tener en cuenta que también necesita captar freelancers (lado de oferta), aunque solo se venda a empresas.
- Cliente ideal: marcas de moda, lujo y belleza, cadenas con campañas y aperturas, y organizadores de pop-ups y eventos.
- **Misión del agente FRT, semanas 1-2: investigación de precios.** Entregable: tabla de 10 a 15 comparables (plataformas de freelance creativo, agencias de talento de retail y moda, bolsas de empleo sectoriales) con su modelo, tarifa pública, servicios y público. Modelos a comparar: margen sobre la tarifa diaria del freelance, comisión fija por proyecto, suscripción y paquetes por volumen. Resultado: tres escenarios de precio con su justificación. Las cifras no se inventan: cada una lleva su fuente, y lo que no sea público se marca como no disponible.
- Después: lista de leads de empresas, un correo de presentación y una prueba con un primer proyecto.

### Barronico
- **CÓDIGO, la agencia** (diseño y desarrollo web, eCommerce, marketing digital, SEO/GEO, branding, diseño gráfico): línea B2B para marcas de ropa, comercios y tiendas. **Se solapa con el Estudio de BARRONVISUAL (web y eCommerce).** Propuesta: BARRONVISUAL vende diseño phygital y consultoría de más valor; CÓDIGO vende ejecución digital recurrente (SEO, redes, contenido, web) a comercios de menor tamaño. Decisión pendiente de Juan Carlos.
- **MATERIA, taller y escaparates de autor:** venta local en Zamora. Se trabaja con ficha de Google, SEO local, WhatsApp, la apertura del local y el boca a boca, no con correo en frío.
- **MATERIA, concept store:** el local abre "muy pronto" y la tienda online es "próximamente". Hasta entonces: captar correos con la newsletter que ya existe (MATERIA o CÓDIGO) y enseñar el proceso en el contenido. Cuando haya producto, se trata como Manta Zamorana.

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
1. Confirmar que la Auditoría de 490 € es la oferta de entrada de BARRONVISUAL.
2. Decidir cómo se separa CÓDIGO (Barronico) del Estudio de BARRONVISUAL.
3. Dar de alta el perfil de cliente que FRT prioriza primero (moda, lujo, belleza o pop-up).
