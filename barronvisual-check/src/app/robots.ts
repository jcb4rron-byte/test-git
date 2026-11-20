import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/panel", "/admin", "/api/", "/auth/", "/baja", "/nueva-contrasena"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
