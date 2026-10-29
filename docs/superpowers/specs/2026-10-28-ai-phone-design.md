# KAR FX AI Phone — design

Date: 2026-10-28 · Status: waiting for approval

## Why

Most detailing customers reach the shop by phone. Carlos is usually working on a car and can't
pick up, and a caller who reaches voicemail often just calls the next shop. The owner wants the
shop's calls answered by AI and calls this the most important part of the system: "be able to
receive calls with ai thats the most important" and "make it the most efficient system based
around the calls."

Success means **every missed call becomes a lead in the admin**. Each lead holds what Carlos
needs to call back and give a quote, and he never has to listen to a voicemail to get it.

This comes before the rest of the Shopmonkey-style admin (estimates, jobs, invoices in
`2026-10-25-shop-admin-design.md`). It builds on that design's step 1: customers, vehicles,
leads and the leads board.

## How a call goes

1. A customer calls the shop's number, (919) 526-0818. Carlos's phone rings as it does today.
2. If he doesn't answer within a few rings, or his phone is busy or off, the carrier forwards the
   call to the shop's Retell number. The AI takes the place of voicemail. Customers never see or
   dial the Retell number.
3. The AI greets the caller. The greeting gives the shop's name, says this is the shop's virtual
   assistant, and says the call is recorded.
4. It answers common questions using only what the website already says: services, location,
   that visits are by appointment, that RestorFX Raleigh is the same shop, the Best of Business
   2025 award, and the 5.0 Google rating.
5. It collects:
   - the caller's name
   - the vehicle: year, make, model and color
   - what they want done
   - how soon they want it
   - the best callback number, confirming the number they're calling from
   - anything else they want Carlos to know
6. It closes with the shop's existing promise: Carlos will call back within 24 hours on weekdays.
7. After the caller hangs up, Retell analyzes the call and sends it to the admin. The admin
   saves the customer, the vehicle, a lead (source "Phone call") and the call itself, then
   emails an alert.
8. Carlos opens the lead and reads the summary, or plays the recording. He taps the number to
   call back, then moves the lead to Contacted.

The leads board is still the to-do list. The New column is the list of people to call back, so
the system adds no second to-do list.

## Goals (this version)

1. Missed calls are answered by AI around the clock, on the shop's existing number.
2. Every real inquiry becomes a lead with a summary, vehicle, services, timing and callback number.
3. Carlos gets an email alert within a minute of the call ending.
4. The lead page shows the call: time, summary, recording and transcript.
5. A Calls page in the admin lists every call, including calls that didn't become leads, such as
   spam, vendors or hang-ups.

## Not in this version

- Text messages, either to alert Carlos or to confirm with the caller. US business texting needs
  carrier registration that takes 1–3 weeks. This is step 2 below.
- Booking a time on the call. That needs the admin schedule, step 3 of the admin design.
- Recognizing returning callers by name or vehicle.
- Live transfer to Carlos. He just didn't answer, so transferring back to him gets nowhere.
- Spanish or other languages.
- Outbound calls of any kind.
- A full voicemail inbox or call routing menu ("press 1 for…").

## Must never happen

- **The AI gives a price**, offers a discount, or promises a date or appointment. If asked, it
  says Carlos gives every quote himself after hearing about the vehicle.
- **The AI says it's a person.**
- **The AI reveals anything that isn't on the public website**, such as other customers or
  personal numbers. In this version the AI has no access to the admin database: it can't look
  anything up and can't change anything.
- **A call gets lost.** Saving works like the quote form: save to the database first, then
  always send the email. If both fail, return an error so Retell retries. Retell also keeps
  every call in its own dashboard as a backup.
- **Duplicate leads.** The same call delivered twice must not create two leads, and neither
  must the same person calling twice about the same thing.
- **Fake calls in the admin.** Every webhook is checked against Retell's signature, and
  anything else is refused.
- **Spam and robocalls on the leads board.**

## Constraints

- **Retell AI**, chosen by the owner on 2026-10-28.
  - Prices on that date: about $0.09–0.11 a minute all-in (Retell's $0.055 infrastructure fee,
    a $0.015 voice, a fast model and $0.015 phone line), plus $2 a month for the number.
  - New accounts get $10 of free credit.
  - Roughly $40 a month at 150 calls of about 2.5 minutes.
- **The existing number stays.** Nothing is ported. The owner turns on "forward when not
  answered" (no answer, busy and unreachable) to the Retell number with the carrier's code.
  - The carrier is not known yet. Verizon usually uses `*71`; AT&T and T-Mobile usually use
    `**004*`; app-based lines have a setting.
  - The developer confirms the exact code before the owner dials it.
  - This replaces the line's voicemail.
- **Same app.** The webhook is a route in the existing `karfxcustom` Next.js 14 app, using the
  same database (Neon, not connected yet), Resend email (key not confirmed) and Vercel deploys.
- **The owner does every signup:** Retell account, card, phone number and `RETELL_API_KEY` in
  Vercel. The developer never handles keys in chat.
- **Recording:** North Carolina only needs one party's consent, but callers may be in other
  states, so the greeting always says the call is recorded.

## Decided by the owner

- AI call answering comes first, before the other shop management features.
- Retell AI is the voice service.
- The current phone number stays.

## Calls made without the owner (check these)

- **The AI answers only missed calls**, not every call, so Carlos still takes every call he can.
  Forwarding every call to the AI instead is a one-code change on the line.
- **No live transfer** to Carlos.
- **Alerts go by email first.** They go to `LEAD_NOTIFICATION_EMAIL`, which must be an inbox
  Carlos checks on his phone. Texts come in step 2.
- **Only real inquiries become leads.** Spam, robocalls, hang-ups and vendor calls are logged
  only on the Calls page.
  - Spam, robocalls and empty hang-ups send no email.
  - A vendor or other call is still emailed, marked as not a lead.
- **A repeat caller doesn't get a second lead.** If the caller already has an open lead (New,
  Contacted or Quoted) from the last 30 days, the call is added to that lead. The alert says
  "called again".
- **Recordings play from Retell's link.** The summary, transcript and fields are saved in the
  shop's database for good.
  - Retell's data storage is set to keep everything, without expiring links. Expiring links
    would stop the recording from playing after 24 hours.
  - If Retell later shortens how long it keeps recordings, the fix is to copy them to Vercel
    Blob.
- **No shop hours.** The website lists no hours, so the AI doesn't state any. It says visits are
  by appointment and Carlos will call back.
- **English only.**
- **The AI says up front that it's a virtual assistant.**

## How it's built

**Webhook:** `POST /api/phone/retell`, Node runtime.

- Read the raw body and verify `x-retell-signature` with the Retell API key: use the
  `retell-sdk` `verify`, or match its algorithm exactly. Never skip the check. Refuse with 401.
- Act only on `call_analyzed`, which carries the full call and its analysis. Answer every other
  event with 204 straight away.
- Retell waits 10 seconds for a 2xx, retries up to 3 times, and can send duplicates.
  `retell_call_id` is unique in the database, so a repeat delivery changes nothing and still
  returns 2xx.

**Post-call fields:** configured in Retell, read from `call_analysis` and the call object.

| Field | Type | Use |
|---|---|---|
| `call_summary` | Retell built-in | Lead message and alert |
| `caller_name` | string | Customer name |
| `callback_number` | string | Customer phone. Falls back to `from_number`; must pass `normalizePhone` |
| `vehicle` | string | Vehicle row, as in `createManualLead` |
| `service_keys` | string | Comma-separated keys from the website's list (`protection/ppf`, …). Unknown keys are dropped, checked against `SERVICE_CATEGORIES` |
| `timeframe` | string | Added to the lead message ("When: …") |
| `call_type` | enum | `inquiry`, `existing_customer`, `vendor`, `spam`, `other` |
| `urgent` | boolean | Alert subject starts with "Urgent" |

Two things to verify on the first test call:

- Whether the carrier passes the original caller's number through forwarding as `from_number`.
- That the analysis fields arrive where the Retell docs say.

**Database:** migration `002`, new table `calls`.

- Columns: `id`, `retell_call_id` (unique), `customer_id` (null), `lead_id` (null),
  `from_number`, `callback_phone`, `call_type`, `urgent`, `summary`, `transcript`,
  `recording_url`, `started_at`, `ended_at` and `created_at`.
- Leads already allow source `phone`.
- Activity is logged as `lead created` or `lead call`, with the website-style null user.

**Rules:**

- **Inquiry** (wants work done, new or returning customer) **with a usable phone number:**
  - Upsert the customer by phone. A missing name becomes "Unknown caller", and a later call
    with a name fills it in.
  - Add the vehicle if one was given.
  - Attach the call to an open lead from the last 30 days, or create a new lead.
  - Email the alert.
- **Existing customer** (about a job already booked or done: status, pickup, a problem):
  - Upsert the customer and attach the call to their open lead if there is one.
  - Never create a lead.
  - Email the alert.
- **No usable number** (blocked caller ID and no number given): save the call with no customer
  or lead, and email it, because Carlos may know who it was.
- **Spam or empty hang-up** (no caller speech): save the call, send no email, create no lead.
- **Vendor or other:** save the call and email it, marked as not a lead.

**No database (demo mode or an outage):** email only, the same fallback as `/api/quote`. If both
the database and the email fail, return 500 so Retell retries.

**Email:** Resend, the same sender as the quote form, with the idempotency key
`call-alert-{retell_call_id}` so a Retell retry after a slow response never sends a second email.

- Subject: "Missed call — {name} — {first service or 'Not sure yet'}".
- Body:
  - Summary, vehicle, timing and urgency.
  - The callback number as a `tel:` link.
  - A link to the lead in the admin.
- Move `emailFrame` and `escapeHtml` out of the quote route into a shared helper. All caller
  text is escaped, since it is caller-supplied.

**Admin:**

- The lead page shows its calls: time, summary, an `<audio>` player for the recording, and the
  transcript in a fold-out.
- A new **Calls** page at `/admin/calls`, linked in the rail, lists every call newest first.
  Each row shows time, caller, type and summary, with a link to its lead.
- Times are in Eastern time.

**The AI's instructions:** kept in the repo, built from `BUSINESS_INFO` and `SERVICE_CATEGORIES`
so they never drift from the website, and pasted into or pushed to the Retell agent.

- The tone follows Carlos's warm, needs-first texting style.
- The rules in "Must never happen" are written into the instructions word for word.

**Tests**, in the style of `tests/admin/quote-route.test.ts`:

- bad signature → 401, nothing saved
- events other than `call_analyzed` are ignored
- the same call sent twice → one call, one lead
- new inquiry → customer, vehicle and lead (source `phone`), plus an email
- repeat caller with an open lead → no new lead, the call is attached
- existing customer with no open lead → call saved on the customer, no lead
- the same call retried → one email
- spam → call saved, no lead, no email
- blocked number → call saved and emailed, no customer
- unknown service keys are dropped
- no database → email only
- caller text in the email is escaped

## Setup the owner does (with the developer's step-by-step help)

1. Connect the database (admin step 1). Calls are only emailed until this is done.
2. Add the Resend key and verify the domain, then set `LEAD_NOTIFICATION_EMAIL` to Carlos's inbox.
3. Retell:
   - Sign up, add a card and buy a number.
   - Paste in the AI's instructions and add the post-call fields above.
   - Set the webhook URL to `https://karfxcustoms.com/api/phone/retell` and set data storage to
     keep everything.
   - Add `RETELL_API_KEY` to Vercel.
4. Call the Retell number directly 10 times with typical questions. Tune the instructions and
   pick the voice and the fastest model that keeps to the rules.
5. Dial the carrier's forwarding code on the shop line.
6. Call the shop number, let it ring out, and check that the lead and email arrive.

## Rollout

1. **Calls into the admin, with email alerts.** This document.
2. **Texts.** After the carrier registration, Carlos gets a text alert and the caller gets a
   confirmation ("Thanks for calling KAR FX, Carlos will call you back…").
3. **Smarter calls.** Recognize returning callers, and book drop-off times once the admin
   schedule exists.

## Left to the builder

- The exact wording of the instructions and greeting, within the rules above.
- The voice and model choice, after test calls.
- The layout of the Calls page and the lead page's call section.
- Whether the instructions are pasted into Retell or pushed by a small script.
