# Diseño UI/UX · BARRONVISUAL Check

Versión 0.1 · 20 nov 2026. Capturas en `docs/capturas/`.

## 1. Principios

1. **Es BARRONVISUAL, no una app genérica.** Negro y blanco, plata y grafito, Arkhip en titulares con remate en cursiva Instrument Serif, botones en píldora y la misma curva de animación (`cubic-bezier(0.16, 1, 0.3, 1)`, 240 ms). Tokens copiados de `packages/brand/src/barronvisual.ts`.
2. **Una foto, una respuesta útil.** El camino crítico (registro → bienvenida → foto → informe) tiene el mínimo de pasos y funciona con el pulgar en el móvil, con la cámara abierta directamente.
3. **El valor gratuito es real.** El plan gratis da un diagnóstico y 3 mejoras accionables; Pro amplía, no desbloquea lo básico.
4. **Upsell honesto.** Sin cuentas atrás, sin urgencia falsa, sin testimonios inventados. "Ahora no" siempre visible. El contenido Pro se enseña como sección bloqueada con lo que contiene, no como trampa.
5. **Criterio, no tecnicismo.** El texto habla de tienda: "lo que el cliente nota mañana", "a la altura de los ojos".

## 2. Sistema visual

| Token | Oscuro (modo de marca) | Claro (su "sección en blanco") | Uso |
|---|---|---|---|
| `bg` | `#000000` | `#fafafa` | Fondo |
| `surface` / `surface-2` | `#0a0a0a` / `#18181b` | `#ffffff` / `#f4f4f5` | Tarjetas, pistas de medidores |
| `fg` / `fg-2` / `muted` | `#fafafa` / `#d4d4d8` / `#a1a1aa` | `#09090b` / `#3f3f46` / `#52525b` | Texto principal, secundario, terciario |
| `line` | `#27272a` | `#e4e4e7` | Bordes |
| `inverse` | blanco | negro | Botón principal |
| `good` / `warn` / `bad` | `#4ade80` / `#fbbf24` / `#f87171` | `#15803d` / `#b45309` / `#b91c1c` | Estado, siempre con icono y texto |
| `series-1` / `series-2` | `#3987e5` / `#d95926` | `#2a78d6` / `#eb6834` | Gráficos del panel de administración |

Tipografía: **Arkhip** (titulares y cifras, la misma fuente local de barronvisual.com), **Instrument Serif** cursiva (remate editorial), **Inter** (interfaz, tablas y formularios, por legibilidad).

Patrón de marca respetado: **una sola sección en blanco por página** en la portada (coherencia tienda y web), igual que en barronvisual.com.

## 3. Modo claro y oscuro

- `next-themes` con clase en `<html>`; por defecto **oscuro** (es el modo de marca), con opción de seguir al sistema.
- Cada color tiene su valor elegido para cada modo; no es una inversión automática.
- Selector en la cabecera (en móvil, dentro del menú) y en el panel. El cambio no parpadea (`disableTransitionOnChange`).
- Al imprimir un informe se fuerza fondo blanco y se ocultan menús (`.no-print`).

## 4. Mapa de pantallas

| Zona | Pantallas |
|---|---|
| Pública | Portada · Precios · Afiliados · Entrar · Registro · Recuperar contraseña · Aviso legal · Privacidad · Cookies · Condiciones · Baja de correos · 404 |
| Panel | Inicio (última revisión, uso de hoy, recientes) · Bienvenida (tienda) · Revisar (un espacio / tienda y web) · Ideas de escaparate · Mis informes · Informe · Antes y después · Suscripción · Afiliados · Perfil (con borrar cuenta) |
| Admin | Resumen (4 cifras y 4 gráficos) · Usuarios (buscar, dar Pro de cortesía) · Afiliados (aprobar, comisiones) |

### Recorrido de una tienda nueva

1. **Portada.** Promesa ("Tu escaparate, revisado con ojo de experto"), ejemplo de informe etiquetado como ejemplo, los 4 dolores de BARRONVISUAL, cómo funciona, los 8 criterios, coherencia tienda y web, ideas, precios, el criterio de JCB (rotulado como trayectoria), preguntas frecuentes. Llamadas a la acción según la regla del grupo: una de registro en la cabecera del hero, una de compra (Pro) y una secundaria ("Pedir más información").
2. **Registro** con Google o email (consentimiento comercial separado y opcional).
3. **Bienvenida:** nombre de la tienda, tipo y ciudad (20 segundos). Ajusta la IA al producto.
4. **Revisar:** elegir el espacio, abrir la cámara, objetivo opcional. Aviso de privacidad. Botón con texto de progreso.
5. **Informe:** nota sobre 100 con estado (Mejorable, Correcto, Muy bien, con icono), foto, diagnóstico, lo que funciona, 3 mejoras numeradas con tiempo. En Gratis, 3 secciones bloqueadas que dicen qué contienen. Al final, siguiente paso con la persona experta (Auditoría o Academia, según la nota) y aviso de IA.
6. **Límite:** al día siguiente vuelve, o en el momento ve el diálogo de Pro.

## 5. Componentes clave

- **Medidor de criterio 0-3:** tres segmentos finos con 2 px de hueco y extremos redondeados de 4 px, número "2/3" al lado y `role="meter"` para lectores de pantalla. Es la misma escala de la hoja de auditoría BARRONSYSTEM.
- **Nota global:** anillo en tinta (monocromo, de marca), cifra en Arkhip y estado con icono y palabra (nunca solo color).
- **Sección bloqueada:** título con insignia Pro, líneas difuminadas sin contenido real, descripción de lo que hay y un botón.
- **Diálogo de mejora:** `<dialog>` nativo (foco atrapado y Escape gratis), razón concreta, 3 ventajas, "Pasar a Pro 9,99 €/mes" y "Ahora no".
- **Banner de afiliación:** solo si se llega con `?ref=`; pide permiso antes de guardar la cookie.

## 6. Accesibilidad

- Enlace "Saltar al contenido", foco visible en todo, objetivos táctiles de al menos 36 px.
- Contraste: textos secundarios con `fg-2`/`muted` elegidos para fondo claro y oscuro; los colores de estado se usan siempre con icono y texto.
- Formularios con `label` asociada, mensajes de error en `role="alert"`, estados de carga anunciados.
- Tablas con cabeceras; los gráficos tienen "Ver como tabla".
- `prefers-reduced-motion` desactiva animaciones y desplazamiento suave.
- Comprobado en 390 px de ancho sin desbordes horizontales.

## 7. Gráficos del panel de administración

Siguiendo la guía de visualización de datos: cifras clave como cifras (no gráficos), barras diarias finas con extremo redondeado apoyado en la base, rejilla tenue, un solo eje, tooltip al pasar por encima con zona de toque mayor que la barra, leyenda solo cuando hay dos series y vista de tabla.

Paleta de series validada con el script de la guía (fondo `#ffffff` en claro y `#0a0a0a` en oscuro): pasan banda de luminosidad, croma, separación para daltonismo (ΔE 24,7 claro / 26,8 oscuro), separación normal (33,6 / 31,8) y contraste mínimo de 3:1.

## 8. Reglas de texto (CLAUDE.md del grupo)

- Nada de "negocio": "tienda" o "tu Tienda o tu Marca".
- Nada de guion largo para incisos.
- Precios fijos, sin "Desde"; botón de compra con el precio: "Pasar a Pro 9,99 €/mes".
- Grafía exacta: BARRONVISUAL, BARRONSYSTEM, Maison Barron, MariTere Retail School.
- Sin datos, plazos ni testimonios que no se puedan verificar (por eso no prometemos "en un minuto").
- Se comprueba con `npm run check:copy`; las instrucciones de la IA llevan las mismas reglas.
