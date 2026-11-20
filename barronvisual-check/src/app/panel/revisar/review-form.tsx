"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Alert, Field, buttonClass, inputClass } from "@/components/ui";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import { SPACE_LABELS } from "@/lib/ai/criteria";
import { cn } from "@/lib/utils";

const SPACES = ["escaparate", "mesa", "lineal", "probador", "fachada", "interior"] as const;
// Máximo de la API de visión (lado largo). Se reduce en el móvil antes de subir:
// la foto pesa menos y cabe en el límite de 4,5 MB por petición de Vercel.
const MAX_EDGE = 2576;

async function prepareImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se ha podido procesar la imagen"))), "image/jpeg", 0.85),
  );
}

function Picker({ label, hint, file, onFile, capture }: { label: string; hint: string; file: File | null; onFile: (f: File | null) => void; capture?: boolean }) {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  return (
    <label className={cn("flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed border-line bg-surface text-center hover:border-fg", preview ? "p-0" : "p-8")}>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:)
        <img src={preview} alt={`Vista previa: ${label}`} className="max-h-80 w-full object-contain" />
      ) : (
        <>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
          <span className="font-medium">{label}</span>
          <span className="text-sm text-muted">{hint}</span>
        </>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        {...(capture ? { capture: "environment" as const } : {})}
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}

export function ReviewForm({ mode, isPro, defaultStoreType }: { mode: "revision" | "coherencia"; isPro: boolean; defaultStoreType: string | null }) {
  const router = useRouter();
  const [space, setSpace] = useState<(typeof SPACES)[number]>("escaparate");
  const [store, setStore] = useState<File | null>(null);
  const [web, setWeb] = useState<File | null>(null);
  const [goal, setGoal] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<null | "limit" | "pro_only">(mode === "coherencia" && !isPro ? "pro_only" : null);

  const ready = mode === "coherencia" ? store && web : store;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    if (mode === "coherencia" && !isPro) return setDialog("pro_only");
    setStatus("sending");
    setError(null);
    try {
      const form = new FormData();
      form.set("kind", mode);
      form.set("space_type", mode === "coherencia" ? "escaparate" : space);
      if (defaultStoreType) form.set("store_type", defaultStoreType);
      if (goal.trim()) form.set("goal", goal.trim());
      form.append("images", await prepareImage(store!), "tienda.jpg");
      if (mode === "coherencia") form.append("images", await prepareImage(web!), "web.jpg");

      const res = await fetch("/api/reports", { method: "POST", body: form });
      const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string; message?: string };
      if (res.ok && data.id) {
        router.push(`/panel/informes/${data.id}`);
        return;
      }
      if (res.status === 429) setDialog("limit");
      if (res.status === 402) setDialog("pro_only");
      setError(data.message ?? "No se ha podido generar el informe.");
      setStatus("error");
    } catch {
      setError("No se ha podido enviar la foto. Revisa tu conexión.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {mode === "revision" ? (
        <fieldset>
          <legend className="mb-2 text-sm font-medium">¿Qué vas a revisar?</legend>
          <div className="flex flex-wrap gap-2">
            {SPACES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpace(s)}
                aria-pressed={space === s}
                className={cn("rounded-full border px-4 py-2 text-sm", space === s ? "border-fg bg-inverse text-inverse-fg" : "border-line text-fg-2 hover:border-fg")}
              >
                {SPACE_LABELS[s]}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className={cn("grid gap-4", mode === "coherencia" && "md:grid-cols-2")}>
        <Picker
          label={mode === "coherencia" ? "Foto del escaparate o la tienda" : "Haz o sube una foto"}
          hint="De frente, como la ve quien pasa. JPG, PNG o WebP."
          file={store}
          onFile={setStore}
          capture
        />
        {mode === "coherencia" ? (
          <Picker label="Captura de tu web" hint="La portada, en el móvil o en el ordenador." file={web} onFile={setWeb} />
        ) : null}
      </div>

      <Field label="¿Qué quieres conseguir? (opcional)" htmlFor="goal" hint="Por ejemplo: que entre más gente, vender la colección nueva, que se vea más premium.">
        <input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} maxLength={300} className={inputClass} />
      </Field>

      <p className="text-xs text-muted">No subas fotos donde se reconozca a personas. Las fotos se borran a los 30 días.</p>

      {error ? <Alert tone="bad">{error}</Alert> : null}

      <button type="submit" disabled={!ready || status === "sending"} className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
        {status === "sending" ? "Revisando con el método BARRONSYSTEM…" : mode === "coherencia" ? "Revisar coherencia" : "Revisar"}
      </button>
      {status === "sending" ? (
        <p role="status" className="text-sm text-muted">Puede tardar un poco. No cierres esta página.</p>
      ) : null}

      <UpgradeDialog open={dialog !== null} reason={dialog ?? "limit"} onClose={() => setDialog(null)} />
    </form>
  );
}
