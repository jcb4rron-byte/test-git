"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { trackClient } from "@/components/billing";
import { buttonClass } from "@/components/ui";
import { PLANS } from "@/lib/config/plans";

/** Upsell automático: se abre cuando la API responde límite alcanzado (429) o función Pro (402). */
export function UpgradeDialog({ open, reason, onClose }: { open: boolean; reason: "limit" | "pro_only"; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      trackClient("upgrade_prompt_shown", { reason });
    } else if (!open && d.open) d.close();
  }, [open, reason]);

  return (
    <dialog ref={ref} onClose={onClose} className="m-auto w-[min(92vw,30rem)] rounded-2xl border border-line bg-surface p-0 text-fg backdrop:bg-black/60">
      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Plan Pro</p>
        <h2 className="mt-2 font-display text-2xl">
          {reason === "limit" ? "Has usado lo de hoy" : "Esto es parte de Pro"}
        </h2>
        <p className="mt-3 text-fg-2">
          {reason === "limit"
            ? `Mañana se renueva tu plan gratuito. Con Pro tienes ${PLANS.pro.limits.revision} revisiones y ${PLANS.pro.limits.idea} ideas al día, con el informe completo.`
            : "La coherencia entre tu tienda y tu web, comparar antes y después y el informe completo están en el plan Pro."}
        </p>
        <ul className="mt-4 space-y-1 text-sm text-fg-2">
          {PLANS.pro.includes.slice(1, 4).map((t) => (
            <li key={t}>· {t}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link href="/precios" className={buttonClass("primary", "md", "flex-1")} onClick={() => trackClient("upgrade_clicked", { source: `dialog_${reason}` })}>
            Pasar a Pro {PLANS.pro.priceLabel}
          </Link>
          <button type="button" onClick={onClose} className={buttonClass("secondary", "md")}>
            Ahora no
          </button>
        </div>
      </div>
    </dialog>
  );
}
