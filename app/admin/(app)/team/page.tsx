import { requireUser } from "@/lib/admin/session";
import { listUsers } from "@/lib/admin/users";
import { ActiveToggle, AddMemberForm, ResetPasswordForm } from "./TeamForms";

export default async function TeamPage() {
  const me = await requireUser("owner");
  const members = await listUsers();

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">Logins</p>
        <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">Team</h1>
        <p className="mt-2 max-w-prose text-sm text-white/55">
          Everyone who can sign in to the shop admin. Deactivating someone signs them out right away and keeps their history.
        </p>
      </div>

      <ul className="divide-y divide-white/10 border-y border-white/10">
        {members.map((m) => (
          <li key={m.id} className="grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] md:items-start">
            <div className="min-w-0">
              <p className="font-semibold">
                {m.name}
                {m.id === me.id && <span className="ml-2 text-xs font-normal text-white/40">(you)</span>}
              </p>
              <p className="break-words text-sm text-white/55">{m.email}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/40">
                {m.role === "owner" ? "Owner" : "Tech"} · {m.active ? "Active" : "Deactivated"}
              </p>
            </div>
            <ResetPasswordForm id={m.id} name={m.name} />
            <ActiveToggle id={m.id} active={m.active} />
          </li>
        ))}
      </ul>

      <section className="space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Add someone</h2>
        <AddMemberForm />
      </section>
    </div>
  );
}
