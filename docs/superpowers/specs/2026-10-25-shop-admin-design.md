# KAR FX Shop Admin — design

Date: 2026-10-25 · Status: questions answered, waiting for approval

## Why

KAR FX Customs runs on spreadsheets, docs and memory (the developer's understanding; the
shop's exact process isn't documented). Quote requests from karfxcustoms.com are emailed to
the shop but nothing tracks them after that. The owner wants a Shopmonkey-style system the
shop actually runs on: real customers, real estimates, real payments. The owner approved the
first-version scope below on 2026-10-25 (through the developer).

A clickable demo with sample data exists: https://claude.ai/artifact/L4Kaq4aFrSH8xbfQpd8fT4.
It sets the look and the flow; the real build follows it unless this document says otherwise.

## Who uses it

- **Owner / manager:** sees and edits everything, manages prices, users and settings.
- **Techs:** see the jobs assigned to them, change job status, add photos and notes. They
  can't see money totals for other jobs, invoices, or settings.
- **Customers:** never log in. They open a private link to approve an estimate or pay an invoice.

Mostly used on a phone in the bay and on a laptop at the front desk.

## Goals (first version)

1. **Leads.** Every website quote request becomes a lead automatically. Calls, DMs and
   walk-ins are added by hand in under a minute. Stages: New → Contacted → Quoted → Won / Lost.
2. **Customers and vehicles.** One record per person, any number of vehicles, full job history.
3. **Price list.** The owner keeps a list of services with prices, editable any time. Starts
   with the service names already on the website; prices are filled in by the owner.
4. **Estimates.** Built from the price list plus free-form lines. Sent as a private link by
   email, or by a "Text link" button that opens the shop phone's Messages app with the link
   filled in. The customer approves on a public page by typing their name; the time and name
   are recorded.
5. **Jobs (repair orders).** An approved estimate becomes a job: Approved → In shop → Ready →
   Picked up. Each job has a bay, a tech, a start date and length in days, notes, and
   before/after photos.
6. **Schedule.** Week view of the bays showing the jobs on each day.
7. **Invoices and payment.** Picking up a job creates the invoice. The customer pays by card
   from a private link; the invoice marks itself paid. The owner can also mark it paid by
   cash, check or Zelle.
8. **Logins** with the two roles above.

## Not in the first version

Parts inventory and ordering, tech time clock and payroll, QuickBooks sync, marketing or
reminder texts, reports beyond simple totals, two-way texting inside the app, a full email
inbox (the shop has no working mailbox yet), multi-location, customer logins, inspection
checklists, PDF invoices, importing old customer data.

## Must never happen

- **Losing a lead or a payment record.** Anything shown as saved is in the database first.
  Records are archived, never deleted.
- **Exposing customer data.** Everything under /admin needs a login. Public links use long
  random tokens and show only that one estimate or invoice.
- **Being slower than a spreadsheet.** Adding a lead or a simple estimate takes under a minute
  on a phone.
- **Copying Shopmonkey.** Same kind of features, KAR FX's own design, names and wording.

## Constraints

- Lives inside the existing `karfxcustom` Next.js 14 app at `karfxcustoms.com/admin`, so the
  website and the admin share the service data and the quote form writes straight into the
  database. Deploys through the existing GitHub → Vercel pipeline.
- Database: Postgres from the Vercel Marketplace (Neon), free tier to start.
- Photos: Vercel Blob.
- Email: Resend, already wired into `/api/quote`; needs `karfxcustoms.com` verified and a key.
- Texting: first version uses the phone's own Messages app (an `sms:` link), which needs no
  carrier registration. In-app texting later means Twilio plus a 1–3 week carrier
  registration.
- Payments: Stripe Checkout with a webhook that marks the invoice paid. No deposits in the
  first version; the full amount is paid from the invoice.
- Sales tax: 7.25% (Wake County, NC) as an editable setting, with a taxable flag per line.
- Money is stored as whole cents. Repair order and invoice numbers come from database
  sequences (RO-1001…, INV-0001…).
- Hosting moves to Vercel Pro ($20/month), since the free Hobby plan is for non-commercial
  use. The developer upgrades the account.

## Decided

- **Same app, `/admin` routes**, server components and server actions.
- **Auth:** email + password, hashed with scrypt from Node's `crypto`, sessions stored in the
  database behind an httpOnly cookie. The owner creates tech accounts.
- **Tables:** users, sessions, customers, vehicles, leads, services, estimates (status,
  public token, approved_at, approved_name), line_items (description, qty, unit_cents,
  taxable), jobs (stage, bay, tech, start_date, days, notes), photos, invoices (number,
  status, token, payment method, paid_at, Stripe session id), activity (who did what, when).
- **Website quote form:** `/api/quote` saves the lead, customer and vehicle first, then
  sends the email. If the email fails, the lead is still saved.
- **Bays** are an editable list in settings (the demo shows three).
- **Look:** follows the demo: black rail, gold accent, Bodoni Moda and Jost, light and dark.

## Calls made without the owner (check these)

- Techs can see the customer's name, phone and vehicle on their own jobs, but no prices.
- The approval page also has a Decline button with an optional reason; a declined estimate
  goes back to the owner, who decides whether the lead is lost.
- Editing an estimate after it was approved marks it unapproved and needs a new approval.
- Every line is taxable by default (NC taxes repair and installation work); the owner can
  untick a line.
- The owner resets tech passwords; the developer resets the owner's.
- Times are shown in Eastern time (America/New_York).
- Turn on the database provider's backups from day one, and move to a paid tier once real
  money is flowing.

## Left to the builder

Component structure, ORM or plain SQL, the exact schedule and board interactions, and the
testing approach (money math, approval and payment links, and role checks need tests).

## Rollout

Each step ships on its own and is usable before the next one starts.

1. Database, logins, customers, vehicles and leads; the quote form writes leads.
2. Price list, estimates and the customer approval page.
3. Jobs, schedule and photos.
4. Invoices and card payments.

## Answers (2026-10-25, from the developer for the owner)

1. **Payments:** Stripe, with a new account. No deposits for now.
2. **Logins:** only the owner's account at first. Tech accounts and the tech role are built
   in step 1 but not used until the owner adds techs.
3. **Lead email:** new leads and customer replies go to the developer's email, set as
   `LEAD_NOTIFICATION_EMAIL` in Vercel (not written into the code), until the shop has a
   working mailbox.
4. **Hosting:** yes to Vercel Pro.
