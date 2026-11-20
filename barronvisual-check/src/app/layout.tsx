import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { arkhip, instrument, inter } from "./fonts";
import { ThemeProvider } from "@/components/theme";
import { RefConsent } from "@/components/ref-consent";
import { site } from "@/lib/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: revisa tu escaparate con criterio de experto`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: "Juan Carlos Barrón", url: site.links.barronvisual }],
  creator: site.brand,
  publisher: site.brand,
  keywords: [
    "revisar escaparate",
    "visual merchandising",
    "escaparatismo",
    "escaparate tienda",
    "ideas escaparate",
    "BARRONSYSTEM",
    "BARRONVISUAL",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name}: tu escaparate, revisado con ojo de experto`,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${arkhip.variable} ${instrument.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-fg">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-inverse focus:px-4 focus:py-2 focus:text-inverse-fg">
          Saltar al contenido
        </a>
        <ThemeProvider>
          {children}
          <Suspense fallback={null}>
            <RefConsent />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
