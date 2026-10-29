import { DEMO, sql, type Row } from "@/lib/admin/db";
import { normalizePhone } from "@/lib/admin/phone";
import { SERVICE_CATEGORIES } from "@/lib/services-data";

export type LeadStage = "new" | "contacted" | "quoted" | "won" | "lost";

export type LeadRow = {
  id: string;
  number: number;
  stage: LeadStage;
  source: string;
  services: string[];
  message: string;
  notes: string;
  createdAt: Date;
  customer: { id: string; name: string; phone: string; email: string | null };
};

export const LEAD_STAGES: { id: LeadStage; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "quoted", label: "Quoted" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

// The moves the board offers; anything else is refused on the server too.
export const NEXT_STAGES: Record<LeadStage, LeadStage[]> = {
  new: ["contacted", "lost"],
  contacted: ["quoted", "lost"],
  quoted: ["won", "lost"],
  lost: ["new"],
  won: [],
};

export const LEAD_SOURCES: Record<string, string> = {
  website: "Website",
  phone: "Phone call",
  "walk-in": "Walk-in",
  instagram: "Instagram",
  google: "Google",
  referral: "Referral",
  email: "Email",
  other: "Other",
};

// A message the person filling in a form can act on; anything else is a bug or an outage.
export class InputError extends Error {}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (id: string) => UUID.test(id);

// "protection/ppf" → "Paint Protection Film", from the same data the website uses.
export function serviceName(key: string): string | null {
  const [categorySlug, serviceSlug] = key.split("/");
  const category = SERVICE_CATEGORIES.find((c) => c.slug === categorySlug);
  return category?.services.find((s) => s.slug === serviceSlug)?.name ?? null;
}

export async function logActivity(entity: string, entityId: string, action: string, userId: string | null) {
  await sql`insert into activity (entity, entity_id, action, user_id) values (${entity}, ${entityId}, ${action}, ${userId})`;
}

// The name a phone customer gets until a later call or form tells us who they are.
export const UNKNOWN_CALLER = "Unknown caller";

// One customer per phone number: a returning customer reuses their record.
export async function upsertCustomer(input: { name: string; phone: string; email?: string }): Promise<string> {
  const digits = normalizePhone(input.phone);
  if (!digits) throw new InputError("Enter a 10-digit phone number.");
  const [row] = await sql`insert into customers (name, phone, phone_digits, email)
    values (${input.name.trim()}, ${input.phone.trim()}, ${digits}, ${input.email?.trim() || null})
    on conflict (phone_digits) where archived_at is null
    do update set email = coalesce(customers.email, excluded.email),
      name = case when customers.name = ${UNKNOWN_CALLER} then excluded.name else customers.name end
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
  // A real customer's request must never land in throwaway demo data; the route then emails it instead.
  if (DEMO) throw new Error("Demo mode: no database connected, quote not stored");
  const customerId = await upsertCustomer(input);
  const source = input.source === "restorfx" ? "referral" : "website";
  const [inserted] = await sql`insert into leads (customer_id, services, message, source, submission_id)
    values (${customerId}, ${input.services}, ${input.message}, ${source}, ${input.submissionId})
    on conflict (submission_id) do nothing
    returning id, number::int as number`;
  if (inserted) {
    await logActivity("lead", inserted.id, "created", null);
    return { leadId: inserted.id, number: inserted.number, created: true };
  }
  const [existing] = await sql`select id, number::int as number from leads where submission_id = ${input.submissionId}`;
  return { leadId: existing.id, number: existing.number, created: false };
}

const toLeadRow = (r: Row): LeadRow => ({
  id: r.id,
  number: r.number,
  stage: r.stage,
  source: r.source,
  services: r.services,
  message: r.message,
  notes: r.notes,
  createdAt: new Date(r.created_at),
  customer: { id: r.customer_id, name: r.customer_name, phone: r.customer_phone, email: r.customer_email },
});

export async function listLeads(): Promise<LeadRow[]> {
  // shortcut: newest 500 only, add paging once the board holds that many open leads
  const rows = await sql`select l.id, l.number::int as number, l.stage, l.source, l.services, l.message, l.notes, l.created_at,
      c.id as customer_id, c.name as customer_name, c.phone as customer_phone, c.email as customer_email
    from leads l join customers c on c.id = l.customer_id
    where l.archived_at is null order by l.created_at desc limit 500`;
  return rows.map(toLeadRow);
}

export async function getLead(id: string): Promise<LeadRow | null> {
  if (!isUuid(id)) return null;
  const [row] = await sql`select l.id, l.number::int as number, l.stage, l.source, l.services, l.message, l.notes, l.created_at,
      c.id as customer_id, c.name as customer_name, c.phone as customer_phone, c.email as customer_email
    from leads l join customers c on c.id = l.customer_id
    where l.id = ${id} and l.archived_at is null`;
  return row ? toLeadRow(row) : null;
}

export async function createManualLead(
  input: { name: string; phone: string; email?: string; vehicle?: string; service?: string; source: string; notes?: string },
  userId: string
): Promise<string> {
  const name = input.name.trim();
  if (!name) throw new InputError("Enter the customer's name.");
  if (!(input.source in LEAD_SOURCES)) throw new InputError("Pick where the lead came from.");
  if (input.service && !serviceName(input.service)) throw new InputError("Pick a service from the list.");

  const customerId = await upsertCustomer({ name, phone: input.phone, email: input.email });
  let vehicleId: string | null = null;
  if (input.vehicle?.trim()) {
    const [vehicle] = await sql`insert into vehicles (customer_id, label) values (${customerId}, ${input.vehicle.trim()}) returning id`;
    vehicleId = vehicle.id;
  }
  const [lead] = await sql`insert into leads (customer_id, vehicle_id, services, notes, source)
    values (${customerId}, ${vehicleId}, ${input.service ? [input.service] : []}, ${input.notes?.trim() ?? ""}, ${input.source})
    returning id`;
  await logActivity("lead", lead.id, "created", userId);
  return lead.id;
}

export async function setLeadStage(id: string, stage: LeadStage, userId: string): Promise<void> {
  const lead = await getLead(id);
  if (!lead || !NEXT_STAGES[lead.stage].includes(stage)) throw new InputError("That move isn't available for this lead.");
  await sql`update leads set stage = ${stage}, updated_at = now() where id = ${id}`;
  await logActivity("lead", id, `stage:${stage}`, userId);
}

export async function saveLeadNotes(id: string, notes: string, userId: string): Promise<void> {
  if (!isUuid(id)) throw new InputError("That lead doesn't exist.");
  await sql`update leads set notes = ${notes.slice(0, 5000)}, updated_at = now() where id = ${id}`;
  await logActivity("lead", id, "notes", userId);
}
