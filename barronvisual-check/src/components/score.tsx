import { cn, scoreTone } from "@/lib/utils";

// Puntuación: número protagonista + estado con icono y texto (nunca solo color).

const TONE = {
  bajo: { label: "Mejorable", className: "text-bad", icon: "M12 7v6M12 16.5v.5" },
  medio: { label: "Correcto", className: "text-warn", icon: "M7 12h10" },
  alto: { label: "Muy bien", className: "text-good", icon: "M6.5 12.5l3.5 3.5 7.5-8" },
} as const;

export function ScoreTone({ score }: { score: number }) {
  const t = TONE[scoreTone(score)];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", t.className)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
        <path d={t.icon} />
      </svg>
      {t.label}
    </span>
  );
}

export function ScoreDial({ score, size = 132, label = "Puntuación BARRONSYSTEM" }: { score: number; size?: number; label?: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, score)) / 100) * c;
  return (
    <figure className="flex flex-col items-center gap-2" aria-label={`${label}: ${score} de 100`}>
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--fg)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="66" textAnchor="middle" className="fill-fg font-display" style={{ fontSize: 34 }}>
          {score}
        </text>
        <text x="60" y="84" textAnchor="middle" className="fill-muted" style={{ fontSize: 10 }}>
          de 100
        </text>
      </svg>
      <figcaption className="sr-only">{label}</figcaption>
      <ScoreTone score={score} />
    </figure>
  );
}

/** Medidor de 0 a 3 (escala de la auditoría BARRONSYSTEM): tres segmentos con hueco de 2 px. */
export function CriterionMeter({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-3" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={3} aria-valuenow={value}>
      <div className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn("h-2 w-7 rounded-[4px]", i <= value ? "bg-fg" : "bg-surface-2")} />
        ))}
      </div>
      <span className="text-sm tabular-nums text-fg-2">{value}/3</span>
    </div>
  );
}
