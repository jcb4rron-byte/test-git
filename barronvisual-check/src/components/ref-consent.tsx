"use client";

import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { acceptReferral } from "@/app/(auth)/actions";

// Si alguien llega con ?ref=codigo, se le pregunta antes de guardar la cookie
// de afiliación (no es imprescindible para el servicio, así que necesita consentimiento).
export function RefConsent() {
  const params = useSearchParams();
  const code = params.get("ref");
  const [closed, setClosed] = useState(false);
  const [pending, start] = useTransition();
  if (!code || closed || !/^[a-z0-9-]{3,24}$/i.test(code)) return null;

  return (
    <div role="dialog" aria-label="Enlace de recomendación" className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-xl rounded-2xl border border-line bg-surface p-4 shadow-2xl sm:p-5">
      <p className="text-sm text-fg-2">
        Has llegado por el enlace de recomendación de <strong className="text-fg">{code.toLowerCase()}</strong>. ¿Nos dejas guardar
        una cookie durante 30 días para saber quién te recomendó si te registras? No se usa para nada más.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => start(async () => { await acceptReferral(code); setClosed(true); })}
          className="h-9 rounded-full bg-inverse px-4 text-sm font-medium text-inverse-fg"
        >
          Aceptar
        </button>
        <button type="button" onClick={() => setClosed(true)} className="h-9 rounded-full border border-line px-4 text-sm text-fg">
          No, gracias
        </button>
      </div>
    </div>
  );
}
