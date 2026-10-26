import AdminRail from "@/components/admin/AdminRail";
import { requireUser } from "@/lib/admin/session";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="min-h-screen bg-surface-900 text-white md:grid md:grid-cols-[232px_minmax(0,1fr)]">
      <AdminRail name={user.name} isOwner={user.role === "owner"} />
      <main id="main-content" className="min-w-0 px-4 pb-16 pt-6 md:px-10 md:pt-10">
        {children}
      </main>
    </div>
  );
}
