"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";

export function trackClient(name: string, props: Record<string, string | number | boolean> = {}) {
  try {
    void fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, props }),
      keepalive: true,
    });
  } catch {
    // sin analítica no pasa nada
  }
}

type Router = ReturnType<typeof useRouter>;

async function go(endpoint: string, body: unknown, setError: (s: string | null) => void, router: Router) {
  const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
  if (res.status === 401) {
    router.push(`/registro?next=${encodeURIComponent("/precios")}`);
    return;
  }
  if (!res.ok || !data.url) {
    setError(data.message ?? "No se ha podido abrir el pago.");
    return;
  }
  // Stripe (externo) o el propio panel si ya hay suscripción.
  if (data.url.startsWith("/") || data.url.startsWith(window.location.origin)) router.push(data.url.replace(window.location.origin, ""));
  else window.location.assign(data.url);
}

export function CheckoutButton({
  interval = "month",
  label,
  source,
  variant = "primary",
  className = "",
}: {
  interval?: "month" | "year";
  label: string;
  source: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className={className}>
      <button
        type="button"
        disabled={loading}
        className={buttonClass(variant, "lg", "w-full")}
        onClick={async () => {
          setLoading(true);
          setError(null);
          trackClient("upgrade_clicked", { source, interval });
          await go("/api/stripe/checkout", { interval }, setError, router);
          setLoading(false);
        }}
      >
        {loading ? "Abriendo el pago…" : label}
      </button>
      {error ? <p role="alert" className="mt-2 text-sm text-bad">{error}</p> : null}
    </div>
  );
}

export function PortalButton({ label = "Gestionar suscripción y facturas" }: { label?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <button
        type="button"
        disabled={loading}
        className={buttonClass("secondary", "md")}
        onClick={async () => {
          setLoading(true);
          setError(null);
          await go("/api/stripe/portal", {}, setError, router);
          setLoading(false);
        }}
      >
        {loading ? "Abriendo…" : label}
      </button>
      {error ? <p role="alert" className="mt-2 text-sm text-bad">{error}</p> : null}
    </div>
  );
}

export function TrackOnMount({ name, props = {} }: { name: string; props?: Record<string, string | number | boolean> }) {
  const key = JSON.stringify(props);
  useEffect(() => {
    trackClient(name, JSON.parse(key));
  }, [name, key]);
  return null;
}
