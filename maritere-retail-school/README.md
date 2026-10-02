# Maritere Retail School — web básica (maritere.es)

Construida según el **Maison BARRON Master Plan Director**, sección 5.7: *web básica sobre maritere.es — presentación, catálogo de cursos, contacto — sin checkout ni LMS*.

## Posicionamiento aplicado
- Formación **básica y práctica** para **empleados y encargados** de tienda física y online.
- **Solo B2B**: textos dirigidos a RRHH, formación y dirección de operaciones. No hay oferta para particulares.
- **Tono directo y práctico**: no se usa el registro editorial/lujo de Maison BARRON ni el de BARRONVISUAL.
- **SEO de RRHH/formación de empresas** (formación empleados de tienda, cursos encargado de tienda…), separado de las palabras clave de BARRONVISUAL.

## Páginas
- `index.html`: presentación, a quién va dirigida, catálogo resumido, cómo trabajamos, quién está detrás y CTA.
- `cursos.html`: catálogo inicial de 6 cursos y FAQ (Schema.org `Course`).
- `contacto.html`: formulario de propuesta para empresas.
- `assets/`, `robots.txt`, `sitemap.xml`.

HTML y CSS puro, sin dependencias ni build. Se sube tal cual por FTP o a cualquier hosting estático.

## Reglas del plan respetadas
- **No se promete "bonificable" ni FUNDAE.** El bloque está preparado y comentado en `index.html` (busca `BLOQUE FORMACIÓN BONIFICADA`). Se activa solo cuando esté cerrado el registro FUNDAE o el acuerdo con una entidad organizadora.
- **Sin logo:** la marca va como texto. La identidad de Maritere está pendiente y el logo no se genera.
- **Paleta neutra provisional** (blanco roto, grafito y azul sobrio). Para cambiarla basta con editar los tokens de `:root` en `assets/css/style.css`.
- **Sin checkout, LMS, gestión de alumnos ni backend.** El formulario usa `mailto:`.

## Pendiente de decidir o confirmar
1. Registro FUNDAE, para activar el bloque de bonificación.
2. Catálogo definitivo. El plan lo deja "a concretar": atención al cliente, VM operativo y caja/omnicanalidad vienen del plan; encargado de tienda, atención online y primeros días en tienda son propuestas mías.
3. Duraciones, horas y modalidad por curso (ahora figura "a medida").
4. Crear `info@maritere.es` (plan 6.1, tarea 8). Hasta entonces, el email de la web y del formulario no funciona.
5. Identidad visual de Maritere: logo y paleta.
6. Si se incluye o no el origen del nombre (homenaje a Teresa Barrón). Lo he dejado fuera de la web a la espera de tu decisión.
7. Aviso legal, privacidad y cookies.
