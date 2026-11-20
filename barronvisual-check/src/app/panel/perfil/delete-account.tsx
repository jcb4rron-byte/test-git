"use client";

import { useActionState } from "react";
import { deleteAccount } from "../actions";
import { Alert, buttonClass, inputClass } from "@/components/ui";

export function DeleteAccount() {
  const [state, action, pending] = useActionState(deleteAccount, undefined);
  return (
    <form action={action} className="space-y-3">
      <label htmlFor="confirm" className="block text-sm text-fg-2">
        Escribe <strong className="text-fg">BORRAR</strong> para confirmar
      </label>
      <input id="confirm" name="confirm" autoComplete="off" className={inputClass} />
      {state?.error ? <Alert tone="bad">{state.error}</Alert> : null}
      <button type="submit" disabled={pending} className={buttonClass("danger", "md")}>
        {pending ? "Borrando…" : "Borrar mi cuenta para siempre"}
      </button>
    </form>
  );
}
