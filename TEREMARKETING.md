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
- **Puerta de arranque (JCB, 7 nov 2026):** no se contacta con ninguna empresa ni institución, ni se envía ningún correo comercial, hasta que JCB lo decida. Todavía no está dado de alta en la Seguridad Social ni en la Cámara de Comercio. Hasta entonces el sistema solo prepara: investigación, listas, borradores y guías. Qué altas hacen falta y cuándo se puede empezar a vender lo valida JCB con su gestor.
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

## 5. CRM mínimo (hoja de Google, luego BARRONPLATFORM)

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
  - **Estudio**: Diseño de Escaparate, Estrategia anual de Visual Merchandising, Diseño de Página Web y Sistema Integral. Cliente ideal: comercios independientes premium y marcas con varias tiendas, de moda, calzado, joyería y decoración. Precios: 12 productos de 490 a 5.990 € (datos de `CLAUDE.md`).
  - **Consultoría**: Auditoría Phygital Retail 490 € (1 día), Workshop In-Company 990 € (2 días), Alta Asesoría con Juan Carlos 1.990 € (4 días). Cliente ideal: marcas y cadenas con tienda y web que no trabajan juntas, y equipos de retail que necesitan criterio. **La Auditoría de 490 € es la mejor puerta de entrada.**
  - **Academia**: programas online, MASTER CLASS, sesión 1-to-1 virtual y recursos. Cliente ideal: escaparatistas, VM junior, estudiantes y dueños de tienda. Se vende con embudo (checklist → secuencia de email → curso), no con correo en frío.
- Prioridad de venta activa: Auditoría (490 €) y Estudio con comercios y marcas de 1 a 30 tiendas en España y Francia.
- Gancho: casos de estudio (Chanel, Zara Francia, Lladró, Galeries Lafayette, Printemps, Maison Margiela) y menciones de prensa.
- Secuencia: correo 1 con caso → seguimiento a los 7 días → seguimiento a los 14 → cierre educado.
- Bloqueantes de Juan Carlos: rellenar los 4 casos. Los borradores de backlinks se quedan sin enviar hasta que él lo decida.

### MARITERE
- Oferta de entrada: **Diagnóstico de tienda, 149 €**, con hoja de visita, informe y plan de formación.
- Compradores: comercios locales, asociaciones de comerciantes, cámaras de comercio, centros de formación.
- Palanca: el taller de AMAPE en Barbate y sus menciones.
- Siguiente venta: Academia de empresa (informe trimestral) y cápsulas.
- Bloqueantes: verificar la ficha de Google, crear el buzón `info@maritere.es`, subir el material de Academia.

### Fashion Retail Talent
- Qué es: **no es una agencia de selección, es un proveedor de talento creativo freelance** para marcas y retailers (por proyecto, campaña o temporada). Pide talento con formulario o briefing. Sectores: moda, lujo, belleza, lifestyle, retail y pop-up. Hay que tener en cuenta que también necesita captar freelancers (lado de oferta), aunque solo se venda a empresas.
- Cliente ideal (decidido por JCB, 7 nov 2026): **moda y lujo**: marcas y retailers con campañas, aperturas y temporadas, y pop-ups de esas marcas. Solo España y solo en castellano, de momento.
- **Misión del agente FRT, semanas 1-2: investigación de precios.** Entregable: tabla de 10 a 15 comparables (plataformas de freelance creativo, agencias de talento de retail y moda, bolsas de empleo sectoriales) con su modelo, tarifa pública, servicios y público. Modelos a comparar: margen sobre la tarifa diaria del freelance, comisión fija por proyecto, suscripción y paquetes por volumen. Resultado: tres escenarios de precio con su justificación. Los precios no se publican en la web de FRT (regla de `CLAUDE.md`). Las cifras no se inventan: cada una lleva su fuente, y lo que no sea público se marca como no disponible.
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
| Barronico concept store | Suscriptores a la lista de aviso |, |
| MANTA ZAMORANA | Altas en lista de espera |, |

## 9. Hoja de ruta

- **Semana 1:** completar los `[COMPLETAR]`, crear la hoja CRM, definir el perfil de cliente ideal por marca.
- **Semana 2:** 20 leads de BARRONVISUAL y 20 de MARITERE y sus borradores listos, sin enviar nada.
- **Semana 3:** rutina del lunes activa (solo informe). Los envíos y el seguimiento a los 7 días empiezan cuando JCB abra la puerta de arranque.
- **Semana 4:** revisión de resultados, decisión de qué agente automatizar más.

## 10. Riesgos y reglas

- **RGPD y correo no solicitado:** solo B2B con interés legítimo, identificación clara, baja en cada envío.
- **Reputación del dominio:** se limita el volumen diario y se vigila la entrega a bandeja de entrada.
- **Dependencia de ti:** si el material bloqueante no llega, el sistema se estanca. El resumen del lunes lo avisa.
- **Claves:** rotar la contraseña de Titan y no volver a pegarla en un chat.

## 11. Decisiones pendientes

**Decididas**
- **CRM:** se arranca con una hoja de Google (gratis, sin límites y los agentes la leen y escriben). El destino es BARRONPLATFORM (Supabase), que ya tiene acceso con login y la ruta `/admin`; hay que construir `/admin/leads`. Brevo queda solo para listas con consentimiento (newsletters, secuencia del Checklist), no para correo en frío.
- **Envío del correo en frío:** desde buzones reales (Titan/Gmail), uno a uno y personalizado, no desde Brevo.
- **Ritmo de envío:** empezar con 5 a 10 correos al día, de martes a jueves entre las 9:30 y las 11:00, subiendo poco a poco para cuidar la reputación del dominio. Empieza cuando estén listos los casos de estudio y el CRM.

**Pendientes de Juan Carlos**
1. ~~Auditoría de 490 € como oferta de entrada~~ Confirmado por JCB.
2. ~~Separar CÓDIGO del Estudio~~ Confirmado por JCB (ver propuesta en la sección 7).
3. ~~Perfil prioritario de FRT~~ Decidido: moda y lujo.

## 12. Encaje con lo que ya existe (revisado el 7 nov 2026)

Fuentes leídas: `CLAUDE.md`, `docs/agentes.md`, README de FRT, `apps/platform/CLAUDE.md` y los índices del monorepo `master-plan-barron`; Search Console de barronvisual.com, Gmail (borradores) y Drive. No he podido leer Vercel, Brevo ni Supabase (las claves fallaron) ni los archivos del iMac (Remote Control no ofrece ninguna carpeta).

### 12.1 Reglas del grupo que aplican a todo lo de TEREMARKETING
- Línea editorial común: ideas de izquierdas y conciencia socialista, humanista. Las personas primero. Se critican modelos, nunca personas.
- Prohibido "negocio" fuera del blog: usar "tienda" o "tu Tienda o tu Marca".
- Sin guion largo para incisos. Precios fijos, sin "Desde". Datos solo verificados y citados.
- Claves y contraseñas solo en Vercel o `.env`, nunca en el chat.
- Nada pesado de lunes a viernes entre 14:00 y 20:00 (Madrid). Un modelo por tarea.
- Nada se envía, publica ni compra sin OK de JCB.

### 12.2 Lo que ya cubren los agentes actuales (`docs/agentes.md`)
Blogs de las cinco marcas, indexación semanal en Search Console, radar de mejoras, resumen diario de Gmail y Calendar, y ofertas de FRT con GitHub Actions. **Ninguno prospecta ni hace seguimiento comercial.** Eso es lo nuevo.

### 12.3 Agentes nuevos (mismo formato que `docs/agentes.md`)

| Tarea | Cuándo | Puede | No puede | Presupuesto | Prueba | Cómo pararla |
|---|---|---|---|---|---|---|
| Prospección semanal | lunes 8:30 | Buscar leads en fuentes públicas, puntuarlos y anotarlos en el CRM | Enviar nada, usar listas compradas, guardar datos personales sin base legal | 10 leads por marca | Filas nuevas con fuente y fecha | Desactivar la tarea |
| Borradores y seguimiento | martes 9:00 | Dejar borradores en Gmail, uno por lead, con un caso real | Enviar | 10 borradores | Borradores visibles y estado en el CRM | Desactivar la tarea |
| Newsletter CÓDIGO, quincenal | martes alterno 9:00 | Redactar y dejar en Brevo como borrador | Enviar sin OK de JCB, inventar datos o casos | 1 borrador por quincena | Campaña en borrador con enlaces comprobados | Desactivar la tarea |
| Informe TEREMARKETING | lunes 7:30 | Leer Search Console y el CRM, escribir el resumen y tres acciones | Escribir en los sistemas | 1 informe | Línea nueva en `docs/historial/` con cifras | Desactivar la tarea |
| FRT, investigación de precios (una vez) | semanas 1 y 2 | Leer páginas públicas de competidores y citar fuentes | Inventar cifras | 10 a 15 comparables | Tabla con una fuente por dato | Termina sola |

### 12.4 Newsletter de CÓDIGO (Barronico)
- **A quién:** quien se apunta en barronico.es con la opción «Código». Solo con consentimiento. Baja en cada envío.
- **Frecuencia:** cada 15 días, jueves a las 10:00 (Madrid). El agente redacta el martes por la mañana. JCB revisa y envía o programa.
- **Contenido (5 minutos de lectura):** 1) una idea práctica de SEO, GEO, web o IA aplicada a una tienda de moda o lujo; 2) un ejemplo real y verificado; 3) una herramienta o plantilla útil; 4) una sola llamada a la acción: escribir a info@barronico.es o por WhatsApp.
- **Diferencia con BARRONVISUAL:** BARRONVISUAL habla de escaparate, tienda y criterio visual. CÓDIGO habla de ejecución digital: SEO local y GEO, web y eCommerce, contenido y automatización con IA para comercios y marcas de moda y lujo.
- **Medición:** aperturas, clics, respuestas y bajas. Brevo reescribe los enlaces con su dominio; en una newsletter con consentimiento es aceptable, pero hay que vigilar la entrega.

### 12.5 FRT: límites que ya están escritos
- No es ETT, ni agencia de colocación, ni empresa de selección. «Proporcionamos talento freelance especializado a marcas y retailers de toda España».
- Prohibido en su copy: "colocación", "ETT", "trabajo temporal", "cesión de trabajadores", "negocio", y precios, cifras o testimonios inventados. Evitar "selección", "candidato", "puesto", "plantilla".
- **Aviso:** si el modelo de precio es un margen sobre la tarifa del freelance, puede acercarse a intermediación laboral o cesión de trabajadores. Hay que validarlo con un asesor antes de fijar nada. Ya está previsto el registro como agencia de colocación ante el SEPE.

### 12.6 Lo que dicen los datos de Google
- **Search Console, barronvisual.com, 30 días:** 321 clics. La mayoría son de la marca ("barronvisual", "juan carlos barron"). Hay poco tráfico de búsquedas sin marca.
- **Oportunidad local para CÓDIGO:** «agencia ecommerce zamora» tiene 30 impresiones en posición 3,1 y 0 clics, y «agencia marketing online zamora» aparece en posición 2. Falta una página que responda a esas búsquedas.
- **Otras búsquedas:** «agencia de visual merchandising» está en posición 51,6, lejos de la primera página.
- **Solo veo la propiedad barronvisual.com.** Las otras (FRT, MariTere, Barronico…) no aparecen con esta cuenta. GA4 no es accesible desde aquí.
- **Ficha de Google de MariTere:** creada el 2 oct sin dirección visible. Falta que JCB la verifique y que cree `info@maritere.es`.
- **Direcciones (confirmadas por JCB, 7 nov 2026):** BARRONVISUAL y Maison Barron están en Balborraz 16, planta 3 (la tercera planta de BARRONVISUAL). Barronico, la tienda física que está a punto de abrir, está en Balborraz 14. Son dos locales distintos: cada uno necesita su propia ficha de Google, con el mismo nombre, dirección y teléfono en todas partes. MariTere sigue sin dirección visible, para no ser la tercera empresa en Balborraz 16.
- **Gmail:** hay 2 borradores de backlinks sin enviar desde el 1 oct (Cámara de Comercio de Zamora y AZECO). **Se quedan como borrador: JCB no quiere enviar ningún correo todavía.**

### 12.7 Primeros pasos concretos
1. **No enviar los 2 borradores de Gmail ni ningún otro correo hasta que JCB lo decida** (pendiente su alta en la Seguridad Social y en la Cámara de Comercio).
2. JCB verifica la ficha de Google de MariTere.
3. Se crea la hoja CRM y el agente de prospección carga 10 leads de BARRONVISUAL y 10 de MariTere en Zamora y Castilla y León, solo como lista interna.
4. Se crea la página de CÓDIGO para búsquedas locales («agencia de marketing digital en Zamora»).
5. La newsletter de CÓDIGO se prepara pero no arranca hasta que JCB abra la puerta de arranque (la fecha del 20 de noviembre queda anulada).
6. Se renuevan las claves de Vercel, Brevo y Supabase para leer su estado.

