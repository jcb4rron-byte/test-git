import Link from "next/link";
import type { Metadata } from "next";
import { requireUser, isAdmin, touchLastSeen } from "@/lib/auth";
import { isPro } from "@/lib/plan";
import { Badge, Logo } from "@/components/ui";
import { ThemeToggle } from "@/components/theme";
import { PanelNav } from "./nav";

export const metadata: Metadata = { title: "Panel", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireUser();
  const pro = isPro(profile);

  await touchLastSeen(profile);

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/panel" aria-label="Panel"><Logo /></Link>
          <div className="flex items-center gap-3">
            <Badge tone={pro ? "pro" : "neutral"}>{pro ? "Pro" : "Gratis"}</Badge>
            <ThemeToggle />
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm text-fg-2 hover:text-fg">Salir</button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 md:grid-cols-[220px_1fr] md:gap-10 md:py-10">
        <aside className="no-print md:sticky md:top-24 md:self-start">
          <PanelNav isAdmin={isAdmin(profile)} isPro={pro} />
        </aside>
        <main id="contenido" className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
