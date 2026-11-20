import type { NextConfig } from "next";

// Cabeceras de seguridad básicas para todas las rutas.
// La CSP completa queda pendiente (ver docs/ARQUITECTURA.md, sección Seguridad).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Evita que Turbopack tome como raíz un lockfile de una carpeta superior.
  turbopack: { root: __dirname },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
