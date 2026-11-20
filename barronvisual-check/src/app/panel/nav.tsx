"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; pro?: boolean };

const ITEMS: Item[] = [
  { href: "/panel", label: "Inicio" },
  { href: "/panel/revisar", label: "Revisar con foto" },
  { href: "/panel/revisar?modo=coherencia", label: "Tienda y web", pro: true },
  { href: "/panel/ideas", label: "Ideas de escaparate" },
  { href: "/panel/informes", label: "Mis informes" },
  { href: "/panel/comparar", label: "Antes y después", pro: true },
  { href: "/panel/suscripcion", label: "Suscripción" },
  { href: "/panel/afiliados", label: "Afiliados" },
  { href: "/panel/perfil", label: "Perfil" },
];

export function PanelNav({ isAdmin, isPro }: { isAdmin: boolean; isPro: boolean }) {
  const path = usePathname();
  const items = isAdmin ? [...ITEMS, { href: "/admin", label: "Administración" }] : ITEMS;
  return (
    <nav aria-label="Panel" className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
      {items.map((it) => {
        const base = it.href.split("?")[0];
        const active = it.href.includes("?") ? false : base === "/panel" ? path === "/panel" : path.startsWith(base);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm",
              active ? "bg-surface-2 text-fg" : "text-fg-2 hover:bg-surface-2 hover:text-fg",
            )}
          >
            {it.label}
            {it.pro && !isPro ? <span className="rounded-full border border-line px-1.5 text-[10px] uppercase tracking-wider text-muted">Pro</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
