"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveCustomer } from "../actions";

const field =
  "input-gold w-full border border-white/10 bg-surface-800 px-4 py-3 text-base text-white placeholder-white/25 focus:border-gold-500 focus:outline-none focus:ring-0";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-white/60";

type Customer = { id: string; name: string; phone: string; email: string | null; notes: string };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold disabled:opacity-60">
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export default function EditCustomerForm({ customer }: { customer: Customer }) {
  const [state, action] = useFormState(saveCustomer, undefined);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={customer.id} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cust-name" className={label}>Name</label>
          <input id="cust-name" name="name" required defaultValue={customer.name} className={field} />
        </div>
        <div>
          <label htmlFor="cust-phone" className={label}>Phone</label>
          <input id="cust-phone" name="phone" type="tel" required defaultValue={customer.phone} className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="cust-email" className={label}>Email</label>
        <input id="cust-email" name="email" type="email" defaultValue={customer.email ?? ""} className={field} />
      </div>
      <div>
        <label htmlFor="cust-notes" className={label}>Notes</label>
        <textarea id="cust-notes" name="notes" rows={3} defaultValue={customer.notes} className={`${field} resize-y`} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SaveButton />
        <p role="status" className={state?.error ? "text-sm text-red-400" : "text-sm text-white/50"}>
          {state?.error ?? (state?.saved ? "Saved." : "")}
        </p>
      </div>
    </form>
  );
}
