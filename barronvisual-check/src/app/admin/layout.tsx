import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { Logo } from "@/components/ui";
import { ThemeToggle } from "@/components/theme";

export const metadata: Metadata = { title: "Administración", robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/afiliados", label: "Afiliados" },
  { href: "/panel", label: "Volver al panel" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" aria-label="Administración"><Logo /></Link>
            <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">Admin</span>
          </div>
          <ThemeToggle />
        </div>
        <nav aria-label="Administración" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="shrink-0 rounded-full px-3 py-1.5 text-sm text-fg-2 hover:bg-surface-2 hover:text-fg">
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="contenido" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
