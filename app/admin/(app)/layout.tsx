import AdminRail from "@/components/admin/AdminRail";
import { DEMO } from "@/lib/admin/db";
import { requireUser } from "@/lib/admin/session";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="min-h-screen bg-surface-900 text-white md:grid md:grid-cols-[232px_minmax(0,1fr)] print:block print:min-h-0 print:bg-white">
      <AdminRail name={user.name} isOwner={user.role === "owner"} />
      <main id="main-content" className="min-w-0 px-4 pb-16 pt-6 md:px-10 md:pt-10 print:p-0">
        {DEMO && (
          <p role="status" className="mb-6 border border-gold-500/40 bg-gold-500/10 px-4 py-2.5 text-sm text-white/80 print:hidden">
            Demo mode: sample customers, and changes aren&apos;t kept. Connect the database in Vercel to go live.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
