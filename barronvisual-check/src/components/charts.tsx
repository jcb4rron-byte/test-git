"use client";

import { useState } from "react";

// Barras diarias en SVG, sin librerías. Reglas de la guía de visualización:
// marcas finas con extremo redondeado de 4 px apoyado en la base, 2 px de hueco entre barras,
// rejilla tenue, tooltip al pasar por encima (zona de toque mayor que la barra),
// leyenda si hay 2 series y vista de tabla para lectores de pantalla.

type Series = { key: string; label: string; color: string };
type Point = { day: string } & Record<string, number | string>;

const W = 640;
const H = 180;
const PAD = { top: 12, right: 8, bottom: 22, left: 28 };

function niceMax(v: number) {
  if (v <= 4) return 4;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / p) * p;
}

const shortDay = (iso: string) => {
  const [, m, d] = iso.split("-");
  return `${Number(d)}/${Number(m)}`;
};

export function DailyBars({ title, data, series }: { title: string; data: Point[]; series: Series[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(1, ...data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0))));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / Math.max(1, data.length);
  const gap = 2;
  const barW = Math.max(2, Math.min(14, (slot - gap * (series.length + 1)) / series.length));
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const ticks = [0, max / 2, max];
  const h = hover !== null ? data[hover] : null;

  return (
    <figure className="rounded-2xl border border-line bg-surface p-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-display text-base">{title}</span>
        {series.length > 1 ? (
          <span className="flex gap-4 text-xs text-fg-2">
            {series.map((s) => (
              <span key={s.key} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
                {s.label}
              </span>
            ))}
          </span>
        ) : null}
      </figcaption>

      <div className="relative mt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${title}, últimos ${data.length} días`} onMouseLeave={() => setHover(null)}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth="1" />
              <text x={PAD.left - 6} y={y(t) + 3} textAnchor="end" fontSize="9" fill="var(--muted)">{t}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const x0 = PAD.left + i * slot + (slot - (barW * series.length + gap * (series.length - 1))) / 2;
            return (
              <g key={d.day}>
                {series.map((s, j) => {
                  const v = Number(d[s.key]) || 0;
                  const top = y(v);
                  const hgt = PAD.top + innerH - top;
                  if (hgt <= 0) return null;
                  const r = Math.min(4, barW / 2, hgt);
                  const x = x0 + j * (barW + gap);
                  // Rectángulo con las dos esquinas superiores redondeadas, base plana sobre el eje.
                  const path = `M${x},${top + hgt} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${top + hgt} Z`;
                  return <path key={s.key} d={path} fill={s.color} opacity={hover === null || hover === i ? 1 : 0.45} />;
                })}
                {i % Math.ceil(data.length / 7) === 0 ? (
                  <text x={PAD.left + i * slot + slot / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--muted)">
                    {shortDay(d.day)}
                  </text>
                ) : null}
                <rect x={PAD.left + i * slot} y={PAD.top} width={slot} height={innerH} fill="transparent" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} />
              </g>
            );
          })}
        </svg>
        {h ? (
          <div
            className="pointer-events-none absolute top-0 rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-lg"
            style={{ left: `${Math.min(80, ((PAD.left + (hover ?? 0) * slot) / W) * 100)}%` }}
          >
            <p className="font-medium text-fg">{shortDay(h.day)}</p>
            {series.map((s) => (
              <p key={s.key} className="flex items-center gap-1.5 text-fg-2">
                <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
                {s.label}: <span className="tabular-nums text-fg">{h[s.key]}</span>
              </p>
            ))}
          </div>
        ) : null}
      </div>

      <details className="mt-3 text-xs text-muted">
        <summary className="cursor-pointer">Ver como tabla</summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr>
              <th className="py-1 font-medium">Día</th>
              {series.map((s) => <th key={s.key} className="py-1 font-medium">{s.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.day} className="border-t border-line">
                <td className="py-1">{d.day}</td>
                {series.map((s) => <td key={s.key} className="py-1 tabular-nums text-fg-2">{d[s.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
