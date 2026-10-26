"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addMember, changeActive, changePassword } from "./actions";

const field =
  "input-gold w-full border border-white/10 bg-surface-800 px-4 py-3 text-base text-white placeholder-white/25 focus:border-gold-500 focus:outline-none focus:ring-0";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-white/60";

type Result = { error?: string; done?: string } | undefined;

function Message({ state }: { state: Result }) {
  if (!state) return null;
  return (
    <p role="status" className={state.error ? "text-sm text-red-400" : "text-sm text-white/60"}>
      {state.error ?? state.done}
    </p>
  );
}

function Submit({ children, quiet }: { children: React.ReactNode; quiet?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${quiet ? "btn-ghost" : "btn-gold"} disabled:opacity-60`}>
      {children}
    </button>
  );
}

export function AddMemberForm() {
  const [state, action] = useFormState(addMember, undefined);
  return (
    <form action={action} className="space-y-4 border border-white/10 bg-surface-800/50 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="member-name" className={label}>Name</label>
          <input id="member-name" name="name" required autoComplete="off" className={field} />
        </div>
        <div>
          <label htmlFor="member-email" className={label}>Email</label>
          <input id="member-email" name="email" type="email" required autoComplete="off" className={field} />
        </div>
        <div>
          <label htmlFor="member-role" className={label}>Role</label>
          <select id="member-role" name="role" defaultValue="tech" className={field}>
            <option value="tech">Tech: sees jobs, no money or settings</option>
            <option value="owner">Owner: sees everything</option>
          </select>
        </div>
        <div>
          <label htmlFor="member-password" className={label}>Starting password</label>
          <input id="member-password" name="password" type="text" required minLength={10} autoComplete="off" placeholder="At least 10 characters" className={field} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Submit>Add person</Submit>
        <Message state={state} />
      </div>
    </form>
  );
}

export function ResetPasswordForm({ id, name }: { id: string; name: string }) {
  const [state, action] = useFormState(changePassword, undefined);
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="id" value={id} />
      <label htmlFor={`reset-${id}`} className="sr-only">New password for {name}</label>
      <div className="flex gap-2">
        <input id={`reset-${id}`} name="password" type="text" required minLength={10} autoComplete="off" placeholder="New password" className={`${field} min-w-0 flex-1 py-2`} />
        <Submit quiet>Reset</Submit>
      </div>
      <Message state={state} />
    </form>
  );
}

export function ActiveToggle({ id, active }: { id: string; active: boolean }) {
  const [state, action] = useFormState(changeActive, undefined);
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="active" value={active ? "false" : "true"} />
      <Submit quiet>{active ? "Deactivate" : "Reactivate"}</Submit>
      <Message state={state} />
    </form>
  );
}
