"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";

const field =
  "input-gold w-full border border-white/10 bg-surface-900 px-4 py-3 text-sm text-white placeholder-white/20 focus:border-gold-500 focus:outline-none focus:ring-0";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-white/60";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold w-full py-3.5 text-sm disabled:opacity-60">
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginPage() {
  const [state, action] = useFormState(login, undefined);

  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-surface-900 px-4 py-12">
      <form action={action} className="w-full max-w-sm space-y-5 border border-white/10 bg-surface-800 p-8">
        <div>
          <p className="font-display text-3xl font-semibold text-gold-500">KAR FX</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">Shop admin</p>
        </div>

        <div>
          <label htmlFor="login-email" className={label}>Email</label>
          <input id="login-email" name="email" type="email" autoComplete="username" required className={field} />
        </div>

        <div>
          <label htmlFor="login-password" className={label}>Password</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" required className={field} />
        </div>

        {state?.error && (
          <p role="alert" className="text-sm text-red-400">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </form>
    </main>
  );
}
