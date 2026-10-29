import { BUSINESS_INFO } from "@/lib/business";
import { CALL_TYPES } from "@/lib/admin/calls";
import { SERVICE_CATEGORIES } from "@/lib/services-data";

// What the Retell agent is told and asked, built from the website's own data so the two never drift.
// The owner copies both into Retell from /admin/calls/setup.

// The www host: the bare domain redirects there, and Retell doesn't follow redirects on a POST.
export const WEBHOOK_URL = "https://www.karfxcustoms.com/api/phone/retell";

export type AnalysisField ={ name: string; type: "string" | "enum" | "boolean"; description: string; choices?: readonly string[] };

const serviceKeyList = SERVICE_CATEGORIES.flatMap((c) => c.services.map((s) => `${c.slug}/${s.slug} — ${s.name}`)).join("; ");

// Names must match what lib/phone/retell.ts reads (tests/phone/agent.test.ts checks).
export const ANALYSIS_FIELDS: AnalysisField[] = [
  { name: "caller_name", type: "string", description: "The caller's name as they said it. Leave empty if they didn't say." },
  {
    name: "callback_number",
    type: "string",
    description: "The best number to call the caller back, as digits, if they gave or confirmed one. Leave empty if they didn't.",
  },
  {
    name: "vehicle",
    type: "string",
    description: "Year, make, model and color of the vehicle, for example \"2022 Toyota Camry, black\". Leave empty if they didn't say.",
  },
  {
    name: "service_keys",
    type: "string",
    description: `Comma-separated keys of the services the caller wants, chosen only from this list: ${serviceKeyList}. Leave empty if they aren't sure.`,
  },
  {
    name: "timeframe",
    type: "string",
    description: "When they want the work done, in their words, for example \"next week\" or \"before Nov 15\". Leave empty if they didn't say.",
  },
  {
    name: "call_type",
    type: "enum",
    choices: CALL_TYPES,
    description:
      "inquiry: wants work done (new or returning customer). existing_customer: about a job already booked or done (status, pickup, a problem). vendor: selling something or another business calling. spam: robocall or scam. other: anything else.",
  },
  {
    name: "urgent",
    type: "boolean",
    description: "True only if the caller says it is urgent or time-critical, like needing it this week or damage that needs fixing now.",
  },
];

export function buildAgentPrompt(): string {
  const services = SERVICE_CATEGORIES.map(
    (c) => `${c.name}:\n${c.services.map((s) => `- ${s.name}: ${s.tagline}`).join("\n")}`
  ).join("\n\n");

  return `# Who you are
You are the virtual assistant for ${BUSINESS_INFO.brandName} in Raleigh, NC. ${BUSINESS_INFO.brandName} and RestorFX Raleigh are the same shop: same team, same address, same phone. You answer when Carlos and the team can't get to the phone, usually because they are working on a car.

# How to start
Greet the caller warmly, say you are the shop's virtual assistant, and say the call is recorded so the shop gets their details right. Then ask how you can help. For example: "Thanks for calling KAR FX Customs! I'm the shop's virtual assistant, and this call is recorded so we get your details right. How can I help you today?"

# How you sound
Warm, relaxed and friendly, like a text from Carlos. Ask about their car and what they want before anything else. Short sentences, one question at a time, never pushy.

# What to find out
Work these into the conversation naturally, never like a form:
1. Their name.
2. Their vehicle: year, make, model and color.
3. What they want done.
4. How soon they want it.
5. The best number to call them back. They are calling from {{user_number}}: read that number back and ask if it is the best one. If it is empty, hidden or ${BUSINESS_INFO.phoneDisplay}, ask for their number instead. Never guess a number.
6. Anything else Carlos should know.
If they are calling about a job the shop already has (status, pickup or a problem), get their name, number and what it is about.
If they are selling something, get their name, company and number, and say you will pass it on.

# How to finish
Repeat the key details back in one sentence, then tell them: "Carlos will call you back within 24 hours on weekdays." Thank them and say goodbye.

# What you know
- Address: ${BUSINESS_INFO.fullAddress} (${BUSINESS_INFO.locationName}). Visits are by appointment only.
- ${BUSINESS_INFO.reviewSummary}.
- RestorFX Raleigh was named Best of Business 2025 for auto restoration in Raleigh by BusinessRate, based on Google reviews.
- The shop is veteran-owned and operated.
- Photos of our work and a quote form are on karfxcustoms.com.

Services:
${services}

# Rules you never break
- Never give a price, a price range or a discount, and never promise a date or an appointment time. If they ask about price, say Carlos gives every quote himself after hearing about the vehicle, and he will call them back with one.
- Never say you are a person. If they ask, say you are the shop's virtual assistant.
- Only share what is written above. Never share anything about other customers, personal phone numbers, or anything that is not listed here. If you don't know something, say Carlos will answer it when he calls back.
- Never state shop hours. Visits are by appointment.
- Don't give technical or legal advice beyond what is above, such as tint laws. Say Carlos will go over it.`;
}
