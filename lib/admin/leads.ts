import { sql } from "@/lib/admin/db";
import { normalizePhone } from "@/lib/admin/phone";

export type LeadStage = "new" | "contacted" | "quoted" | "won" | "lost";

// One customer per phone number: a returning customer reuses their record.
export async function upsertCustomer(input: { name: string; phone: string; email?: string }): Promise<string> {
  const digits = normalizePhone(input.phone);
  if (!digits) throw new Error("Enter a 10-digit phone number.");
  const [row] = await sql`insert into customers (name, phone, phone_digits, email)
    values (${input.name.trim()}, ${input.phone.trim()}, ${digits}, ${input.email?.trim() || null})
    on conflict (phone_digits) where archived_at is null
    do update set email = coalesce(customers.email, excluded.email)
    returning id`;
  return row.id;
}

export async function saveWebsiteLead(input: {
  name: string;
  phone: string;
  email: string;
  message: string;
  services: string[];
  source: string;
  submissionId: string;
}): Promise<{ leadId: string; number: number; created: boolean }> {
  const customerId = await upsertCustomer(input);
  const source = input.source === "restorfx" ? "referral" : "website";
  const [inserted] = await sql`insert into leads (customer_id, services, message, source, submission_id)
    values (${customerId}, ${input.services}, ${input.message}, ${source}, ${input.submissionId})
    on conflict (submission_id) do nothing
    returning id, number::int as number`;
  if (inserted) {
    await sql`insert into activity (entity, entity_id, action) values ('lead', ${inserted.id}, 'created')`;
    return { leadId: inserted.id, number: inserted.number, created: true };
  }
  const [existing] = await sql`select id, number::int as number from leads where submission_id = ${input.submissionId}`;
  return { leadId: existing.id, number: existing.number, created: false };
}
