# Maritere Retail School — web básica (maritere.es)

Construida según el **Maison BARRON Master Plan Director**, sección 5.7: *web básica sobre maritere.es — presentación, catálogo de cursos, contacto — sin checkout ni LMS*.

## Posicionamiento aplicado
- Formación **básica y práctica** para **empleados y encargados** de tienda física y online.
- **Solo B2B**: textos dirigidos a RRHH, formación y dirección de operaciones. No hay oferta para particulares.
- **Tono directo y práctico**: no se usa el registro editorial/lujo de Maison BARRON ni el de BARRONVISUAL.
- **SEO de RRHH/formación de empresas** (formación empleados de tienda, cursos encargado de tienda…), separado de las palabras clave de BARRONVISUAL.

## Páginas
- `index.html`: presentación, para quién, formatos con precio, cápsulas destacadas, cómo trabajamos, academia para cadenas y CTA.
- `cursos.html`: 14 cápsulas prácticas de 90 min en 4 bloques, cada una con su entregable ("Te llevas"), y FAQ (Schema.org `Course` con `Offer`).
- `precios.html`: 6 formatos, tabla de tarifas y ejemplos de coste.
- `contacto.html`: formulario de propuesta para empresas.

## Oferta y precios (orientativos, sin IVA)
| Formato | Precio |
|---|---|
| Cápsula online en directo (90 min, 6–20 pers.) | 19 €/persona |
| Taller en tienda (3 h, hasta 12 pers.) | 290 €/grupo |
| Pack Primera Semana (4 cápsulas) | 59 €/persona |
| Programa Encargados (4 × 2 h) | 129 €/persona |
| Diagnóstico de tienda (cliente incógnito + informe) | 149 €/tienda |
| Academia de empresa (1 cápsula/mes por tienda) | 290 €/tienda/año |

Referencias de mercado consultadas (oct 2026, por búsqueda, porque la red del entorno bloqueaba las webs): Retail Academy/Luxe Talent vende cursos online de 69,90 € a 180 €; Retail Learning Institute cobra unos 800 $/tienda/año por microcursos de 5–20 min. También se han tomado ideas de Staff Global (incorporación rápida), Retail360 (diagnóstico con cliente incógnito), Texageres (academia corporativa, formación en la propia tienda), LearnWorlds y AcademyPoint (microformación y estándar común en cadenas). No se ha copiado ningún texto.
- `assets/`, `robots.txt`, `sitemap.xml`.

HTML y CSS puro, sin dependencias ni build. Se sube tal cual por FTP o a cualquier hosting estático.

## Reglas del plan respetadas
- **No se promete "bonificable" ni FUNDAE.** El bloque está preparado y comentado en `index.html` (busca `BLOQUE FORMACIÓN BONIFICADA`). Se activa solo cuando esté cerrado el registro FUNDAE o el acuerdo con una entidad organizadora.
- **Sin logo:** la marca va como texto. La identidad de Maritere está pendiente y el logo no se genera.
- **Paleta neutra provisional** (blanco roto, grafito y azul sobrio). Para cambiarla basta con editar los tokens de `:root` en `assets/css/style.css`.
- **Sin checkout, LMS, gestión de alumnos ni backend.** El formulario usa `mailto:`.

## Pendiente de decidir o confirmar
1. Registro FUNDAE, para activar el bloque de bonificación.
2. Validar el catálogo de 14 cápsulas y los precios: son una propuesta, no tarifas aprobadas.
3. **Límite del plan (5.7):** la Academia de empresa y la grabación de 30 días se pueden servir sin LMS (videollamada, enlace privado, PDF). Si se quieren seguimiento por alumno o acceso a una plataforma, eso ya es LMS y requiere repriorizar.
4. Certificado de asistencia: confirmar que se emite.
4. Crear `info@maritere.es` (plan 6.1, tarea 8). Hasta entonces, el email de la web y del formulario no funciona.
5. Identidad visual de Maritere: logo y paleta.
6. Si se incluye o no el origen del nombre (homenaje a Teresa Barrón). Lo he dejado fuera de la web a la espera de tu decisión.
7. Aviso legal, privacidad y cookies.
