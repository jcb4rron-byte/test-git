"use client";

import { trackClient } from "@/components/billing";

/** Enlace que registra el clic (upsell a servicios de BARRONVISUAL, por ejemplo). */
export function TrackedLink({
  href,
  event = "upsell_clicked",
  target: targetName,
  children,
  className,
}: {
  href: string;
  event?: "upsell_clicked" | "upgrade_clicked";
  target: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      onClick={() => trackClient(event, { target: targetName })}
    >
      {children}
    </a>
  );
}
