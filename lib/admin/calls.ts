import { DEMO, sql, type Row } from "@/lib/admin/db";
import { UNKNOWN_CALLER, isUuid, logActivity, upsertCustomer } from "@/lib/admin/leads";

export const CALL_TYPES = ["inquiry", "existing_customer", "vendor", "spam", "other"] as const;
export type CallType = (typeof CALL_TYPES)[number];

// One call the AI answered, already checked and cleaned by lib/phone/retell.ts.
export type CallInput = {
  retellCallId: string;
  fromNumber: string | null;
  callbackPhone: string | null; // "(919) 555-0142", never the shop's own number
  callerName: string | null;
  vehicle: string | null;
  serviceKeys: string[];
  timeframe: string | null;
  callType: CallType;
  urgent: boolean;
  summary: string;
  transcript: string;
  recordingUrl: string | null;
  startedAt: Date | null;
  endedAt: Date | null;
  callerSpoke: boolean;
};

export type SavedCall = { callId: string; leadId: string | null; outcome: "new-lead" | "added-to-lead" | "no-lead"; duplicate: boolean };

export type CallRow = {
  id: string;
  at: Date;
  callerName: string | null;
  callbackPhone: string | null;
  callType: CallType;
  urgent: boolean;
  summary: string;
  transcript: string;
  recordingUrl: string | null;
  leadId: string | null;
  leadNumber: number | null;
  customerId: string | null;
};

// Open = still being worked and touched in the last 30 days: a new call joins it instead of starting another lead.
async function openLeadId(customerId: string): Promise<string | null> {
  const [row] = await sql`select id from leads
    where customer_id = ${customerId} and archived_at is null and stage in ('new', 'contacted', 'quoted')
      and updated_at > now() - interval '30 days'
    order by updated_at desc limit 1`;
  return row?.id ?? null;
}

async function createPhoneLead(customerId: string, input: CallInput): Promise<string> {
  let vehicleId: string | null = null;
  if (input.vehicle) {
    const [vehicle] = await sql`insert into vehicles (customer_id, label) values (${customerId}, ${input.vehicle}) returning id`;
    vehicleId = vehicle.id;
  }
  const message = input.timeframe ? `${input.summary}\nWhen: ${input.timeframe}` : input.summary;
  const [lead] = await sql`insert into leads (customer_id, vehicle_id, services, message, source)
    values (${customerId}, ${vehicleId}, ${input.serviceKeys}, ${message}, 'phone')
    returning id`;
  return lead.id;
}

export async function saveCall(input: CallInput): Promise<SavedCall> {
  // A real caller must never land in throwaway demo data; the webhook then emails the call instead.
  if (DEMO) throw new Error("Demo mode: no database connected, call not stored");

  // Retell can deliver the same call more than once: answer with what the first delivery did.
  const [existing] = await sql`select c.id, c.lead_id,
      (select f.id from calls f where f.lead_id = c.lead_id order by f.created_at, f.id limit 1) as first_call_id
    from calls c where c.retell_call_id = ${input.retellCallId}`;
  if (existing) {
    const outcome = !existing.lead_id ? "no-lead" : existing.first_call_id === existing.id ? "new-lead" : "added-to-lead";
    return { callId: existing.id, leadId: existing.lead_id, outcome, duplicate: true };
  }

  // Customer and lead first, the call row last: a retry after a failure part-way reuses both.
  let customerId: string | null = null;
  let leadId: string | null = null;
  let outcome: SavedCall["outcome"] = "no-lead";
  const isCustomer = input.callType === "inquiry" || input.callType === "existing_customer";
  if (isCustomer && input.callerSpoke && input.callbackPhone) {
    customerId = await upsertCustomer({ name: input.callerName ?? UNKNOWN_CALLER, phone: input.callbackPhone });
    leadId = await openLeadId(customerId);
    if (leadId) {
      outcome = "added-to-lead";
      await sql`update leads set updated_at = now() where id = ${leadId}`;
      await logActivity("lead", leadId, "call", null);
    } else if (input.callType === "inquiry") {
      outcome = "new-lead";
      leadId = await createPhoneLead(customerId, input);
      await logActivity("lead", leadId, "created", null);
    }
  }

  const [row] = await sql`insert into calls (retell_call_id, customer_id, lead_id, from_number, callback_phone, caller_name,
      call_type, urgent, summary, transcript, recording_url, started_at, ended_at)
    values (${input.retellCallId}, ${customerId}, ${leadId}, ${input.fromNumber}, ${input.callbackPhone}, ${input.callerName},
      ${input.callType}, ${input.urgent}, ${input.summary}, ${input.transcript}, ${input.recordingUrl}, ${input.startedAt}, ${input.endedAt})
    on conflict (retell_call_id) do nothing
    returning id`;
  // Lost a race with a parallel delivery of the same call: report that one.
  if (!row) return saveCall(input);
  return { callId: row.id, leadId, outcome, duplicate: false };
}

const toCallRow = (r: Row): CallRow => ({
  id: r.id,
  at: new Date(r.at),
  callerName: r.caller_name,
  callbackPhone: r.callback_phone,
  callType: r.call_type,
  urgent: r.urgent,
  summary: r.summary,
  transcript: r.transcript,
  recordingUrl: r.recording_url,
  leadId: r.lead_id,
  leadNumber: r.lead_number,
  customerId: r.customer_id,
});

// Newest 200 calls, or every call on one lead.
async function queryCalls(leadId: string | null): Promise<CallRow[]> {
  const rows = await sql`select c.id, coalesce(c.started_at, c.created_at) as at, coalesce(cu.name, c.caller_name) as caller_name,
      c.callback_phone, c.call_type, c.urgent, c.summary, c.transcript, c.recording_url, c.lead_id, l.number::int as lead_number, c.customer_id
    from calls c left join customers cu on cu.id = c.customer_id left join leads l on l.id = c.lead_id
    where ${leadId}::uuid is null or c.lead_id = ${leadId}::uuid
    order by at desc limit 200`;
  return rows.map(toCallRow);
}

export const listCalls = () => queryCalls(null);

export async function listLeadCalls(leadId: string): Promise<CallRow[]> {
  if (!isUuid(leadId)) return [];
  return (await queryCalls(leadId)).reverse();
}
