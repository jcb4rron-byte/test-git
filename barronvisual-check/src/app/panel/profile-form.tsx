"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { completeOnboarding, updateProfile } from "./actions";
import { Alert, Field, buttonClass, inputClass } from "@/components/ui";
import { STORE_TYPE_LABELS } from "@/lib/ai/criteria";
import type { Profile } from "@/types/db";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass("primary", "lg")}>
      {pending ? "Guardando…" : label}
    </button>
  );
}

export function ProfileForm({ profile, mode }: { profile: Profile; mode: "onboarding" | "edit" }) {
  const [state, action] = useActionState(mode === "onboarding" ? completeOnboarding : updateProfile, undefined);
  return (
    <form action={action} className="space-y-5">
      <Field label="Tu nombre" htmlFor="full_name">
        <input id="full_name" name="full_name" defaultValue={profile.full_name ?? ""} autoComplete="name" className={inputClass} />
      </Field>
      <Field label="Nombre de la tienda o la marca" htmlFor="store_name">
        <input id="store_name" name="store_name" defaultValue={profile.store_name ?? ""} autoComplete="organization" className={inputClass} />
      </Field>
      <Field label="Tipo de tienda" htmlFor="store_type">
        <select id="store_type" name="store_type" defaultValue={profile.store_type ?? ""} className={inputClass}>
          <option value="">Elige una opción</option>
          {Object.entries(STORE_TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </Field>
      <Field label="Ciudad" htmlFor="city">
        <input id="city" name="city" defaultValue={profile.city ?? ""} autoComplete="address-level2" className={inputClass} />
      </Field>
      {mode === "edit" ? (
        <label className="flex items-start gap-3 text-sm text-fg-2">
          <input type="checkbox" name="marketing_opt_in" defaultChecked={profile.marketing_opt_in} className="mt-1 h-4 w-4" />
          <span>Quiero recibir consejos de escaparate y novedades por email.</span>
        </label>
      ) : null}
      {state?.error ? <Alert tone="bad">{state.error}</Alert> : null}
      {state?.message ? <Alert tone="good">{state.message}</Alert> : null}
      <Submit label={mode === "onboarding" ? "Guardar y hacer mi primera revisión" : "Guardar cambios"} />
    </form>
  );
}
