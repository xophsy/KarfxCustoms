"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-surface-900 px-6 py-24 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500/90">
          Something Went Wrong
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          We hit a snag loading this page.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
          Try refreshing this section, or head back home and we&apos;ll get you
          where you need to go.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="btn-gold"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="btn-ghost"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
