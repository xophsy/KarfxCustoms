import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-surface-900 px-6 py-24 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500/90">
          Page Not Found
        </p>
        <h1 className="mt-4 font-editorial text-5xl font-semibold md:text-6xl">
          That page isn&apos;t in the shop.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
          The link may have changed, or the page may have been moved while we
          were updating the site.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn-gold"
          >
            Back home
          </Link>
          <Link
            href="/portfolio"
            className="btn-ghost"
          >
            View portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
