import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/ui";
import { ThemeToggle } from "@/components/theme";

export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" aria-label="Inicio"><Logo /></Link>
        <ThemeToggle />
      </header>
      <main id="contenido" className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:pt-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
