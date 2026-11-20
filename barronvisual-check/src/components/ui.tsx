import Link from "next/link";
import { cn } from "@/lib/utils";

// Piezas básicas de interfaz. Botones en píldora como barronvisual.com.

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50",
    size === "sm" && "h-9 px-4 text-sm",
    size === "md" && "h-11 px-5 text-sm",
    size === "lg" && "h-12 px-6 text-base",
    variant === "primary" && "bg-inverse text-inverse-fg hover:opacity-85",
    variant === "secondary" && "border border-line bg-transparent text-fg hover:border-fg",
    variant === "ghost" && "text-fg-2 hover:text-fg",
    variant === "danger" && "border border-bad text-bad hover:bg-bad hover:text-white",
    extra,
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: { href: string; children: React.ReactNode; variant?: Variant; size?: Size; className?: string } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) {
  const external = href.startsWith("http");
  if (external) {
    return (
      <a href={href} className={buttonClass(variant, size, className)} target="_blank" rel="noopener" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Card({ children, className = "", as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "section" | "article" | "li" }) {
  return <Tag className={cn("rounded-2xl border border-line bg-surface p-5 sm:p-6", className)}>{children}</Tag>;
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs uppercase tracking-[0.2em] text-muted", className)}>{children}</p>;
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "pro" | "good" | "warn" | "bad" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tone === "neutral" && "border-line text-fg-2",
        tone === "pro" && "border-fg bg-inverse text-inverse-fg",
        tone === "good" && "border-good text-good",
        tone === "warn" && "border-warn text-warn",
        tone === "bad" && "border-bad text-bad",
      )}
    >
      {children}
    </span>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-fg placeholder:text-muted focus:border-fg focus:outline-none";

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function Alert({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "bad" }) {
  return (
    <div
      role={tone === "bad" ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        tone === "neutral" && "border-line text-fg-2",
        tone === "good" && "border-good text-good",
        tone === "bad" && "border-bad text-bad",
      )}
    >
      {children}
    </div>
  );
}

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4 shrink-0", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4 shrink-0", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2 leading-none", className)}>
      <span className="font-display text-[13px] tracking-[0.14em] sm:text-[15px] sm:tracking-[0.18em]">BARRONVISUAL</span>
      <span className="accent text-base sm:text-lg">Check</span>
    </span>
  );
}
