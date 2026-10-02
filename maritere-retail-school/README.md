# Maritere Retail School — web

Escuela de retail phygital de **Maison BARRON** (visual merchandising, escaparatismo, retail phygital, eCommerce visual/SEO-GEO, IA aplicada, Home & Decor styling, in-company).

Web estática (HTML5 + CSS puro + JS mínimo, sin dependencias), mobile-first, lista para desplegar en Vercel / Netlify / FTP.

## Estructura
- `index.html` — Home en tres actos: Manifiesto → Programas (academia) → Dirección y ecosistema Maison BARRON
- `programas.html` — seis programas (Schema.org `Course`)
- `metodo.html` — BARRONSYSTEM (Observar · Narrar · Componer · Implantar · Medir)
- `admisiones.html` — proceso, formulario y FAQ (Schema.org `FAQPage`)
- `assets/` — `css/style.css`, `js/main.js`, `img/favicon.svg`
- `robots.txt`, `sitemap.xml`

## Dirección visual
Dark Luxury / lujo silencioso, según la *Auditoría Jamstack Barron Visual*: negro carbón `#060403`, bronce `#463828`, plata `#C5BBB6`, ámbar `#C49A62` para CTAs (contraste AA con texto negro), Cormorant Garamond + Inter. Sin imágenes pesadas: la "vitrina" es una composición CSS con proporción fija (CLS 0). El revelado al hacer scroll solo se activa con JS y respeta `prefers-reduced-motion`.

## Pendiente (por confirmar)
- Dominio definitivo (ahora `https://www.maritereretailschool.com` en canonical, OG, sitemap y robots).
- Email / backend del formulario (ahora `mailto:hola@maritereretailschool.com` de marcador).
- Calendario, precios, duraciones y plazas de cada programa.
- Fotografía real de escaparates y retrato de la dirección académica.
- Origen y relato del nombre "Maritere" para la sección de la escuela.
- Versiones FR / EN (hreflang).
- Textos legales (aviso legal, privacidad, cookies).
