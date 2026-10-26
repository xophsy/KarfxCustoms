import { sql } from "@/lib/admin/db";
import { InputError, isUuid, logActivity, type LeadStage } from "@/lib/admin/leads";
import { normalizePhone } from "@/lib/admin/phone";

export type CustomerRow = { id: string; name: string; phone: string; email: string | null; vehicleCount: number; leadCount: number };

export type CustomerDetail = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string;
  createdAt: Date;
  vehicles: { id: string; label: string }[];
  leads: { id: string; number: number; stage: LeadStage; services: string[]; createdAt: Date }[];
};

const likeEscape = (text: string) => text.replace(/[\\%_]/g, (c) => `\\${c}`);

export async function listCustomers(q = ""): Promise<CustomerRow[]> {
  const term = q.trim();
  const pattern = `%${likeEscape(term)}%`;
  const digits = term.replace(/\D/g, "");
  const rows = await sql`select c.id, c.name, c.phone, c.email,
      (select count(*)::int from vehicles v where v.customer_id = c.id and v.archived_at is null) as vehicle_count,
      (select count(*)::int from leads l where l.customer_id = c.id and l.archived_at is null) as lead_count
    from customers c
    where c.archived_at is null
      and (${term} = '' or c.name ilike ${pattern} or c.email ilike ${pattern}
           or (${digits} <> '' and c.phone_digits like ${`%${digits}%`}))
    order by c.name
    limit 200`;
  return rows.map((r) => ({ id: r.id, name: r.name, phone: r.phone, email: r.email, vehicleCount: r.vehicle_count, leadCount: r.lead_count }));
}

export async function getCustomer(id: string): Promise<CustomerDetail | null> {
  if (!isUuid(id)) return null;
  const [customer] = await sql`select id, name, phone, email, notes, created_at from customers where id = ${id} and archived_at is null`;
  if (!customer) return null;
  const vehicles = await sql`select id, label from vehicles where customer_id = ${id} and archived_at is null order by created_at`;
  const leads = await sql`select id, number::int as number, stage, services, created_at from leads
    where customer_id = ${id} and archived_at is null order by created_at desc`;
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    notes: customer.notes,
    createdAt: new Date(customer.created_at),
    vehicles: vehicles.map((v) => ({ id: v.id, label: v.label })),
    leads: leads.map((l) => ({ id: l.id, number: l.number, stage: l.stage, services: l.services, createdAt: new Date(l.created_at) })),
  };
}

export async function updateCustomer(
  id: string,
  input: { name: string; phone: string; email: string; notes: string },
  userId: string
): Promise<void> {
  if (!isUuid(id)) throw new InputError("That customer doesn't exist.");
  const name = input.name.trim();
  if (!name) throw new InputError("Enter the customer's name.");
  const digits = normalizePhone(input.phone);
  if (!digits) throw new InputError("Enter a 10-digit phone number.");
  const email = input.email.trim().toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError("Check the email address.");

  const [taken] = await sql`select id from customers where phone_digits = ${digits} and archived_at is null and id <> ${id}`;
  if (taken) throw new InputError("Another customer already has this phone number.");

  await sql`update customers set name = ${name}, phone = ${input.phone.trim()}, phone_digits = ${digits},
    email = ${email || null}, notes = ${input.notes.slice(0, 5000)} where id = ${id}`;
  await logActivity("customer", id, "edited", userId);
}

export async function addVehicle(customerId: string, label: string, userId: string): Promise<string> {
  if (!isUuid(customerId)) throw new InputError("That customer doesn't exist.");
  const text = label.trim().slice(0, 200);
  if (!text) throw new InputError("Describe the vehicle, like 2024 BMW X5 · black.");
  const [vehicle] = await sql`insert into vehicles (customer_id, label) values (${customerId}, ${text}) returning id`;
  await logActivity("customer", customerId, "vehicle-added", userId);
  return vehicle.id;
}

export async function archiveVehicle(vehicleId: string, userId: string): Promise<void> {
  if (!isUuid(vehicleId)) throw new InputError("That vehicle doesn't exist.");
  const [vehicle] = await sql`update vehicles set archived_at = now()
    where id = ${vehicleId} and archived_at is null returning customer_id`;
  if (vehicle) await logActivity("customer", vehicle.customer_id, "vehicle-archived", userId);
}
