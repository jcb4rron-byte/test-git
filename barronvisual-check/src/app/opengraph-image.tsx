import { ImageResponse } from "next/og";
import { site } from "@/lib/config/site";

export const alt = `${site.name}: tu escaparate, revisado con ojo de experto`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000", color: "#fff", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 8 }}>BARRONVISUAL · CHECK</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.05 }}>Tu escaparate,</div>
          <div style={{ fontSize: 76, lineHeight: 1.05, fontStyle: "italic", color: "#d4d4d8" }}>revisado con ojo de experto.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a1a1aa" }}>
          <span>Método BARRONSYSTEM · Gratis 1 revisión al día</span>
          <span>Pro 9,99 €/mes</span>
        </div>
      </div>
    ),
    size,
  );
}
