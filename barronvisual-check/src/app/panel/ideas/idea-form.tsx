"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Field, buttonClass, inputClass } from "@/components/ui";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import { STORE_TYPE_LABELS } from "@/lib/ai/criteria";

const CAMPAIGNS = [
  "Rebajas de enero",
  "San Valentín",
  "Día del Padre",
  "Primavera",
  "Día de la Madre",
  "Verano",
  "Vuelta al cole",
  "Otoño",
  "Black Friday",
  "Navidad",
];

export function IdeaForm({ defaultStoreType }: { defaultStoreType: string | null }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState(false);

  async function submit(form: HTMLFormElement) {
    const fd = new FormData(form);
    const body = Object.fromEntries(Array.from(fd.entries()).filter(([, v]) => String(v).trim() !== ""));
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/ideas", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
      if (res.ok && data.id) return router.push(`/panel/informes/${data.id}`);
      if (res.status === 429) setDialog(true);
      setError(data.message ?? "No se ha podido generar la idea.");
    } catch {
      setError("Revisa tu conexión e inténtalo de nuevo.");
    }
    setSending(false);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e.currentTarget);
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tipo de tienda" htmlFor="store_type">
          <select id="store_type" name="store_type" required defaultValue={defaultStoreType ?? ""} className={inputClass}>
            <option value="" disabled>Elige una opción</option>
            {Object.entries(STORE_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </Field>
        <Field label="Campaña o fecha" htmlFor="campaign">
          <input id="campaign" name="campaign" list="campaigns" required minLength={2} maxLength={80} placeholder="Navidad" className={inputClass} />
          <datalist id="campaigns">
            {CAMPAIGNS.map((c) => <option key={c} value={c} />)}
          </datalist>
        </Field>
      </div>
      <Field label="Producto protagonista" htmlFor="product" hint="Lo que quieres vender con este escaparate.">
        <input id="product" name="product" required minLength={2} maxLength={160} placeholder="Jerséis de lana de la nueva colección" className={inputClass} />
      </Field>
      <Field label="Estilo de tu tienda (opcional)" htmlFor="style">
        <input id="style" name="style" maxLength={160} placeholder="Natural, cálido, de barrio" className={inputClass} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Presupuesto" htmlFor="budget">
          <select id="budget" name="budget" required defaultValue="bajo" className={inputClass}>
            <option value="bajo">Bajo: reutilizar y pedir prestado</option>
            <option value="medio">Medio</option>
            <option value="alto">Alto</option>
          </select>
        </Field>
        <Field label="Tamaño del escaparate (opcional)" htmlFor="window_size">
          <select id="window_size" name="window_size" defaultValue="" className={inputClass}>
            <option value="">Sin indicar</option>
            <option value="pequeno">Pequeño (menos de 2 m)</option>
            <option value="mediano">Mediano (2 a 4 m)</option>
            <option value="grande">Grande (más de 4 m)</option>
          </select>
        </Field>
      </div>
      {error ? <Alert tone="bad">{error}</Alert> : null}
      <button type="submit" disabled={sending} className={buttonClass("primary", "lg")}>
        {sending ? "Pensando el concepto…" : "Proponer una idea"}
      </button>
      <UpgradeDialog open={dialog} reason="limit" onClose={() => setDialog(false)} />
    </form>
  );
}
