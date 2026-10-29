import Link from "next/link";
import CallCard from "@/components/admin/CallCard";
import { listCalls } from "@/lib/admin/calls";
import { requireUser } from "@/lib/admin/session";

export default async function CallsPage() {
  const user = await requireUser();
  const calls = await listCalls();

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">AI phone</p>
          <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">Calls</h1>
        </div>
        {user.role === "owner" && (
          <Link href="/admin/calls/setup" className="text-sm text-white/55 hover:text-gold-500">
            AI phone setup →
          </Link>
        )}
      </div>

      <p className="mt-4 text-sm text-white/45">
        {calls.length} {calls.length === 1 ? "call" : "calls"}
        {calls.length === 200 && " (showing the newest 200)"}
      </p>

      <div className="mt-3 space-y-3">
        {calls.map((call) => (
          <CallCard key={call.id} call={call} showLead />
        ))}
      </div>
      {calls.length === 0 && <p className="py-6 text-sm text-white/40">No calls yet. Calls the AI answers show up here.</p>}
    </div>
  );
}
