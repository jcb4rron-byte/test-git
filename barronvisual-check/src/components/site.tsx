import Link from "next/link";
import { ThemeToggle } from "@/components/theme";
import { ButtonLink, Logo } from "@/components/ui";
import { site } from "@/lib/config/site";

const NAV = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/precios", label: "Precios" },
  { href: "/afiliados", label: "Afiliados" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label={`${site.name}, inicio`} className="text-fg">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="hidden items-center gap-6 text-sm text-fg-2 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-fg">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex"><ThemeToggle /></span>
          <Link href="/entrar" className="hidden px-2 text-sm text-fg-2 hover:text-fg sm:inline">
            Entrar
          </Link>
          <ButtonLink href="/registro" size="sm" className="px-3 sm:px-4">
            Empezar gratis
          </ButtonLink>
          <details className="relative md:hidden">
            <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-line" aria-label="Menú">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-line bg-surface p-2 shadow-xl">
              {[...NAV, { href: "/entrar", label: "Entrar" }].map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-xl px-3 py-2 text-sm text-fg-2 hover:bg-surface-2 hover:text-fg">
                  {n.label}
                </Link>
              ))}
              <div className="mt-1 flex items-center justify-between border-t border-line px-3 pt-2 text-sm text-fg-2">
                Tema
                <ThemeToggle />
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="text-fg" />
          <p className="mt-4 max-w-sm text-sm text-muted">{site.anchor}</p>
          <p className="mt-4 text-sm text-muted">
            Un producto de{" "}
            <a href={site.links.barronvisual} className="underline underline-offset-4 hover:text-fg">
              BARRONVISUAL
            </a>{" "}
            con el método BARRONSYSTEM. Grupo{" "}
            <a href={site.links.maisonBarron} className="underline underline-offset-4 hover:text-fg">
              Maison Barron
            </a>
            .
          </p>
        </div>
        <nav aria-label="Producto" className="space-y-2 text-sm">
          <p className="font-medium text-fg">Producto</p>
          <Link href="/precios" className="block text-muted hover:text-fg">Precios</Link>
          <Link href="/afiliados" className="block text-muted hover:text-fg">Programa de afiliados</Link>
          <a href={site.links.consultoria} className="block text-muted hover:text-fg">Consultoría BARRONVISUAL</a>
          <a href={site.links.academia} className="block text-muted hover:text-fg">Academia BARRONVISUAL</a>
        </nav>
        <nav aria-label="Legal" className="space-y-2 text-sm">
          <p className="font-medium text-fg">Legal</p>
          <Link href="/aviso-legal" className="block text-muted hover:text-fg">Aviso legal</Link>
          <Link href="/privacidad" className="block text-muted hover:text-fg">Privacidad</Link>
          <Link href="/cookies" className="block text-muted hover:text-fg">Cookies</Link>
          <Link href="/condiciones" className="block text-muted hover:text-fg">Condiciones de suscripción</Link>
          <a href={`mailto:${site.contactEmail}`} className="block text-muted hover:text-fg">{site.contactEmail}</a>
        </nav>
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="contenido">{children}</main>
      <SiteFooter />
    </>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify no escapa "<": se sustituye para que ningún texto cierre el <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
