import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-20");
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/precios", priority: 0.9, changeFrequency: "monthly" },
    { path: "/registro", priority: 0.7, changeFrequency: "yearly" },
    { path: "/afiliados", priority: 0.6, changeFrequency: "monthly" },
    { path: "/aviso-legal", priority: 0.2, changeFrequency: "yearly" },
    { path: "/privacidad", priority: 0.2, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
    { path: "/condiciones", priority: 0.2, changeFrequency: "yearly" },
  ];
  return pages.map((p) => ({ url: absoluteUrl(p.path), lastModified, changeFrequency: p.changeFrequency, priority: p.priority }));
}
