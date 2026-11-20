"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestPasswordReset, signIn, signInWithGoogle, signUp, updatePassword, type AuthState } from "./actions";
import { Alert, Field, buttonClass, inputClass } from "@/components/ui";

function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass("primary", "lg", "w-full")}>
      {pending ? "Un momento…" : children}
    </button>
  );
}

function Messages({ state }: { state: AuthState }) {
  if (state?.error) return <Alert tone="bad">{state.error}</Alert>;
  if (state?.message) return <Alert tone="good">{state.message}</Alert>;
  return null;
}

export function GoogleButton({ next }: { next: string }) {
  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={next} />
      <button type="submit" className={buttonClass("secondary", "lg", "w-full")}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z" />
          <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.6h-4a12 12 0 0 0 0 10.9l4-3.1z" />
          <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
        </svg>
        Continuar con Google
      </button>
    </form>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted">
      <span className="h-px flex-1 bg-line" />o con tu email<span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function SignInForm({ next }: { next: string }) {
  const [state, action] = useActionState(signIn, undefined);
  return (
    <div className="space-y-6">
      <GoogleButton next={next} />
      <Divider />
      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
        </Field>
        <Field label="Contraseña" htmlFor="password">
          <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
        </Field>
        <Messages state={state} />
        <Submit>Entrar</Submit>
      </form>
      <div className="flex justify-between text-sm">
        <Link href="/recuperar" className="text-muted underline-offset-4 hover:text-fg hover:underline">He olvidado mi contraseña</Link>
        <Link href={`/registro?next=${encodeURIComponent(next)}`} className="text-fg underline underline-offset-4">Crear cuenta</Link>
      </div>
    </div>
  );
}

export function SignUpForm({ next, refCode }: { next: string; refCode?: string }) {
  const [state, action] = useActionState(signUp, undefined);
  if (state?.message) return <Alert tone="good">{state.message}</Alert>;
  return (
    <div className="space-y-6">
      <GoogleButton next={next} />
      <Divider />
      <form action={action} className="space-y-4">
        {refCode ? <input type="hidden" name="ref" value={refCode} /> : null}
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
        </Field>
        <Field label="Contraseña" htmlFor="password" hint="Al menos 8 caracteres.">
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={inputClass} />
        </Field>
        <label className="flex items-start gap-3 text-sm text-fg-2">
          <input type="checkbox" name="terms" required className="mt-1 h-4 w-4 accent-current" />
          <span>
            Acepto las <Link href="/condiciones" className="underline underline-offset-4">condiciones</Link> y la{" "}
            <Link href="/privacidad" className="underline underline-offset-4">política de privacidad</Link>.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-fg-2">
          <input type="checkbox" name="marketing" className="mt-1 h-4 w-4 accent-current" />
          <span>Quiero recibir consejos de escaparate y novedades de BARRONVISUAL por email (opcional, te das de baja con un clic).</span>
        </label>
        <Messages state={state} />
        <Submit>Crear cuenta gratis</Submit>
      </form>
      <p className="text-center text-sm text-muted">
        ¿Ya tienes cuenta? <Link href={`/entrar?next=${encodeURIComponent(next)}`} className="text-fg underline underline-offset-4">Entrar</Link>
      </p>
      <p className="text-center text-xs text-muted">Si entras con Google aceptas también las condiciones y la política de privacidad.</p>
    </div>
  );
}

export function ResetForm() {
  const [state, action] = useActionState(requestPasswordReset, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field label="Email" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
      </Field>
      <Messages state={state} />
      <Submit>Enviarme el enlace</Submit>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action] = useActionState(updatePassword, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field label="Contraseña nueva" htmlFor="password" hint="Al menos 8 caracteres.">
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={inputClass} />
      </Field>
      <Messages state={state} />
      <Submit>Guardar contraseña</Submit>
    </form>
  );
}
