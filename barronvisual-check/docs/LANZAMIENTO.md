# Lanzamiento y primeros 100 clientes · BARRONVISUAL Check

Versión 0.1 · 20 nov 2026. Encaja con `TEREMARKETING.md` y respeta sus reglas: **los agentes proponen, Juan Carlos aprueba y envía**; **puerta de arranque** (no se contacta con ninguna empresa ni se envía ningún correo comercial hasta que JCB lo decida, y no se cobra en real antes del alta); **gasto cero nuevo** salvo decisión expresa.

Ninguna cifra de conversión de este documento es un dato del mercado: son **hipótesis de trabajo** para planificar, y se sustituyen por los datos reales de `/admin` en cuanto existan.

## 1. Objetivo

**100 clientes Pro de pago** = 999 € al mes con IVA (unos 826 € de base). El valor real para el grupo es mayor: cada tienda que usa Check es una candidata a la Auditoría Phygital Retail (490 €), a la Academia y a BARRON ACCESS. Por eso se mide también cuántos clics llegan a esos servicios (`upsell_clicked`).

## 2. Fases

### Fase 0 · Antes de abrir (sin coste nuevo salvo lo que decida JCB)

1. **Infraestructura de pruebas:** proyecto Supabase en la UE, Stripe en modo test, clave de Anthropic con límite de gasto, remitente verificado en Brevo. Prueba completa de la checklist del README.
2. **Calidad de la IA (lo más importante).** JCB elige 20 fotos reales (de su archivo, con permiso: escaparates buenos, regulares y malos de moda, calzado, joyería y decoración) y las puntúa a mano con la hoja BARRONSYSTEM. Se pasan por Check y se comparan las notas criterio a criterio. Se ajusta el prompt hasta que la IA no se aleje de JCB más de un punto en la mayoría de criterios. Sin esto no se lanza: el producto vende criterio de experto.
3. **Coste real:** con esas 20 revisiones, mirar en `/admin` el coste por informe y decidir modelo y límites.
4. **Legal:** rellenar los `[COMPLETAR]`, revisión de asesoría, alta de JCB. Marca en OEPM/EUIPO.
5. **Contenido de partida:** 3 informes de ejemplo reales (con permiso de las tiendas) para la portada y las redes, en lugar del ejemplo ilustrativo.

### Fase 1 · Beta privada (2 a 3 semanas tras la puerta de arranque)

- **20 tiendas conocidas** (Zamora y Castilla y León, contactos de JCB, alumnado de la Academia): Pro de cortesía 30 días desde `/admin` a cambio de 15 minutos de conversación.
- Preguntas: ¿hiciste algo de lo que proponía?, ¿qué te sobró?, ¿pagarías 9,99 €?, ¿qué te haría volver cada semana?
- Señal para pasar de fase: que al menos la mitad haga una segunda revisión del mismo espacio (antes y después) sin que se lo pidamos. Es la señal de hábito; si no aparece, se corrige el producto antes de buscar volumen.

### Fase 2 · Lanzamiento abierto

- Check enlazado desde barronvisual.com (portada, Academia, posts de escaparate) y desde la firma de correo de JCB.
- Publicación en LinkedIn de JCB con un caso real de antes y después.
- Precio de lanzamiento opcional: código promocional de Stripe (por ejemplo 50 % los 3 primeros meses) para las 100 primeras altas. **Decisión de JCB.** Alternativa sin descuento: 99 €/año como "precio fundador".

## 3. Los primeros 100 clientes: canales por orden

El orden va de menor a mayor coste y de mayor a menor confianza. Cada canal tiene su indicador.

### 1. El ecosistema propio (coste cero)

- **Web de BARRONVISUAL:** bloque "Revisa tu escaparate gratis" en la portada, en las páginas de Academia y al final de cada post de escaparatismo. Ya recibe tráfico de marca (321 clics en 30 días en Search Console según TEREMARKETING, sección 12.6).
- **Clientes y alumnado de la Academia** (Window Display Killer, VM Guidelines…): les encaja Check para practicar entre lecciones. Antes de escribirles, **[VERIFICAR] con el gestor** si se puede usar la excepción de clientes previos de la LSSI para productos similares; si no, solo a quien dio consentimiento.
- **MariTere Retail School:** incluir 3 meses de Check Pro en el Diagnóstico de tienda (149 €) y en la Academia de empresa como herramienta para el equipo. MariTere sigue siendo B2B y no vende Check; lo regala dentro de su servicio.
- **BARRON ACCESS:** Pro incluido para los socios (se da con `pro_until`); refuerza ACCESS y crea casos.
- **Newsletter de CÓDIGO (Barronico):** una mención en un número, solo a suscriptores con consentimiento.

Indicador: registros con origen en barronvisual.com y tasa de primera revisión en 24 horas.

### 2. Contenido que se busca (SEO y GEO)

- Una guía por campaña del calendario comercial (Rebajas, San Valentín, Día de la Madre, vuelta al cole, Black Friday, Navidad), publicada 6 a 8 semanas antes de la fecha, con el generador de ideas como herramienta gratuita dentro.
- Antes de escribir, comprobar volúmenes reales en el Planificador de palabras clave (como se hizo para MariTere). No hay datos verificados todavía para "ideas escaparate navidad" y similares.
- Ritmo: una pieza por semana (regla del grupo para los blogs), redactada por el agente de Contenido y aprobada por JCB.
- `llms.txt`, JSON-LD y FAQ ya están en la app para buscadores de IA.

Indicador: impresiones y clics sin marca en Search Console, registros desde orgánico.

### 3. Asociaciones de comerciantes y cámaras (B2B, mayor confianza)

- Oferta: **taller gratuito de 60 minutos "Revisa tu escaparate en directo"** para sus socios, con JCB revisando fotos de los asistentes en pantalla y un código de Stripe para 2 meses Pro.
- Primeros candidatos (ya en el radar de TEREMARKETING): Cámara de Comercio de Zamora y AZECO. Después, asociaciones de Castilla y León y Madrid.
- Envío: desde el buzón real de JCB, uno a uno, 5 a 10 al día, martes a jueves, según TEREMARKETING. **Solo cuando JCB abra la puerta de arranque.** Los borradores los prepara el agente de Prospección.

Indicador: talleres cerrados, asistentes, altas por código, conversión a Pro a los 60 días.

### 4. Afiliados (pago solo por resultado)

- Perfiles: escaparatistas y visual merchandisers freelance (la red de Fashion Retail Talent es un vivero natural), formadoras de comercio, agencias que trabajan con comercio local, creadores de contenido de retail.
- Propuesta: 30 % durante 12 meses. Para una persona que traiga 10 tiendas Pro son unos 24,80 € al mes de comisión (10 × 8,26 € × 30 %), sin trabajo extra para ella si ya asesora a esas tiendas.
- Reclutar 10 afiliados activos en el primer trimestre, uno a uno, con conversación previa.

Indicador: afiliados activos, registros y clientes por código.

### 5. Redes con antes y después

- Formato: vídeo vertical de 30 a 60 segundos. Foto del escaparate, nota de Check, JCB aplica 2 mejoras en 10 minutos, nueva foto, nueva nota. Solo con permiso de la tienda y sin personas reconocibles.
- Una pieza por semana en Instagram y LinkedIn, reutilizando la del blog.

Indicador: registros con `?utm_source` de cada red (añadir UTM a los enlaces).

### 6. Publicidad de pago (solo con validación previa)

Únicamente si las fases anteriores demuestran conversión y JCB decide gastar: prueba pequeña y acotada, segmentada a personas que gestionan tiendas en España. Rompe la regla de gasto cero; es su decisión.

## 4. Cuentas: cuántos registros hacen falta

Con una conversión de gratis a Pro **hipotética** del 3 % harían falta unas 3.300 cuentas gratuitas para 100 clientes; con un 5 %, unas 2.000; con un 8 % (más probable en canales de confianza como talleres y afiliados), unas 1.250. Por eso los canales 1, 3 y 4 van primero: pocas personas, mucha confianza.

## 5. Panel semanal (lunes, junto al resumen de TEREMARKETING)

| Indicador | Dónde | Para qué |
|---|---|---|
| Registros nuevos | `/admin` | Volumen |
| % que hace la primera revisión en 24 h | eventos `signup` y `report_created` | Activación |
| % que repite en 7 días | `usage_daily` | Hábito |
| Avisos de límite y clics en Pro | `limit_reached`, `upgrade_clicked` | Intención de pago |
| Altas y bajas Pro, ingreso mensual | `/admin` | Ingresos y abandono |
| Coste de IA por informe y por cliente | `/admin` | Margen |
| Clics a Auditoría y Academia | `upsell_clicked` | Valor para BARRONVISUAL |
| Registros y clientes por afiliado | `/admin/afiliados` | Canal |

Regla: cada lunes, una decisión con el dato (por ejemplo, si menos de la mitad hace la primera revisión, se acorta la bienvenida; si mucha gente llega al límite y no paga, se revisa qué ve bloqueado).

## 6. Calendario orientativo tras la puerta de arranque

| Semana | Hito |
|---|---|
| 0 | Fase 0 cerrada: IA validada, coste medido, legal completo, pagos en real |
| 1-3 | Beta privada con 20 tiendas |
| 4 | Lanzamiento abierto en barronvisual.com y LinkedIn; primer taller con una asociación |
| 5-12 | Una guía por semana, 10 afiliados, 2 talleres al mes |
| 12 | Revisión: ¿vamos hacia 100? Ajustar precio, límites o canal con los datos reales |

No he puesto fecha a los 100 clientes: depende de cuándo se abra la puerta de arranque y de la señal de hábito de la beta. Prometer una fecha sin esos datos sería inventarla.
