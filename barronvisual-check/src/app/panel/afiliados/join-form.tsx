"use client";

import Link from "next/link";
import { useActionState } from "react";
import { joinAffiliates } from "../actions";
import { Alert, Field, buttonClass, inputClass } from "@/components/ui";

export function JoinAffiliates() {
  const [state, action, pending] = useActionState(joinAffiliates, undefined);
  if (state?.message) return <Alert tone="good">{state.message}</Alert>;
  return (
    <form action={action} className="space-y-5">
      <Field label="Código que quieres usar" htmlFor="code" hint="Irá en tu enlace: 3 a 24 letras minúsculas, números o guiones.">
        <input id="code" name="code" required pattern="[a-z0-9-]{3,24}" placeholder="tu-nombre" className={inputClass} />
      </Field>
      <Field label="Web o red social (opcional)" htmlFor="website">
        <input id="website" name="website" type="url" placeholder="https://" className={inputClass} />
      </Field>
      <Field label="¿A quién se lo recomendarías? (opcional)" htmlFor="audience">
        <textarea id="audience" name="audience" rows={3} maxLength={500} className={inputClass} />
      </Field>
      <label className="flex items-start gap-3 text-sm text-fg-2">
        <input type="checkbox" name="terms" required className="mt-1 h-4 w-4" />
        <span>
          Acepto las <Link href="/afiliados#condiciones" className="underline underline-offset-4">condiciones del programa de afiliados</Link>.
        </span>
      </label>
      {state?.error ? <Alert tone="bad">{state.error}</Alert> : null}
      <button type="submit" disabled={pending} className={buttonClass("primary", "lg")}>
        {pending ? "Enviando…" : "Solicitar mi código"}
      </button>
    </form>
  );
}
