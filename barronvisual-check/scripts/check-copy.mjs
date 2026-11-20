#!/usr/bin/env node
// Comprueba las reglas de estilo del grupo (CLAUDE.md de master-plan-barron) en el texto de la app:
// - prohibido "negocio" (usar "tienda" o "tu Tienda o tu Marca")
// - sin guion largo (—) para incisos
// - precios fijos, sin "Desde"
// - grafía exacta de las marcas
// Uso: npm run check:copy   (sale con código 1 si encuentra algo)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DIRS = ["src", "public", "docs"];
const FILES = ["README.md"];
const EXT = /\.(tsx?|mjs|txt|md)$/;

// Líneas donde la regla se menciona a propósito (las instrucciones de la IA).
const ALLOW = [/No uses nunca la palabra "negocio"/, /No uses guion largo \(—\)/, /prohibido "negocio"/, /sin guion largo \(—\)/, /Nada de "negocio"/, /sin "negocio"/, /"Desde"/];

const RULES = [
  { name: 'palabra "negocio"', re: /\bnegocios?\b/i },
  { name: "guion largo (—)", re: /—/ },
  { name: 'precio con "Desde"', re: /\bdesde\s+\d+[.,]?\d*\s*€/i },
  { name: "grafía de marca", re: /\b(Barronvisual|BarronVisual|Barron Visual|Barronsystem|BarronSystem|Maison BARRON|maison barron)\b/ },
];

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (EXT.test(name)) yield p;
  }
}

let problems = 0;
const all = [...DIRS.flatMap((d) => [...files(join(ROOT, d))]), ...FILES.map((f) => join(ROOT, f))];
{
  for (const file of all) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (ALLOW.some((a) => a.test(line))) return;
      for (const r of RULES) {
        if (r.re.test(line)) {
          problems++;
          console.log(`${relative(ROOT, file)}:${i + 1}  ${r.name}  →  ${line.trim().slice(0, 120)}`);
        }
      }
    });
  }
}
if (problems) {
  console.error(`\n${problems} problema(s) de estilo de marca.`);
  process.exit(1);
}
console.log("Texto conforme a las reglas de marca.");
