"use client";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-surface-900 px-4">
      <div role="alert" className="max-w-md space-y-5 border border-white/10 bg-surface-800 p-8">
        <p className="font-display text-2xl font-semibold text-white">Couldn&apos;t load this page</p>
        <p className="text-sm leading-relaxed text-white/65">
          Something went wrong loading the admin. Try again, and if it keeps happening, check that the database is connected.
        </p>
        <button type="button" onClick={reset} className="btn-gold">
          Retry
        </button>
      </div>
    </main>
  );
}
