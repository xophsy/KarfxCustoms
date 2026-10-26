# Shop Admin Step 1 (Leads, Customers, Logins) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `karfxcustoms.com/admin` with owner/tech logins, customers, vehicles and a leads board, and make every website quote request land in the database before any email is sent.

**Architecture:** Same Next.js 14 app. Postgres (Neon, via the Vercel Marketplace) accessed with plain SQL through `@neondatabase/serverless`. Admin pages are server components with server actions; every page and action checks the session server-side. A small client wrapper keeps the public navbar and footer off `/admin`.

**Tech Stack:** Next.js 14 app router, TypeScript, Tailwind, `@neondatabase/serverless`, Node `crypto` (scrypt, randomBytes, sha256), Vitest.

**Spec:** `docs/superpowers/specs/2026-10-25-shop-admin-design.md` (approved 2026-10-25). Look and flow follow the demo at https://claude.ai/artifact/L4Kaq4aFrSH8xbfQpd8fT4.

## Global Constraints

- Everything under `/admin` requires a login, checked on the server for every page and action (not only by middleware).
- Anything shown as saved is in the database first. Records are archived (`archived_at`), never deleted.
- Roles: `owner` sees everything; `tech` cannot open `/admin/team` or run owner actions. Only the owner account is created at launch.
- Lead stages, exactly: `new`, `contacted`, `quoted`, `won`, `lost`.
- Lead email goes to `process.env.LEAD_NOTIFICATION_EMAIL`; no personal address is written into code or docs.
- Times shown in `America/New_York`.
- Adding a lead by hand takes under a minute on a phone: one form, name and phone required, everything else optional.
- Look: Tailwind `gold-*` / `surface-*` tokens and the existing `font-display` (Bodoni Moda) and `font-body` (Jost); black rail with gold accent, as in the demo.
- Copy is KAR FX's own; nothing named or styled after Shopmonkey.

## Review Focus

1. **Returning customer or a retried submit:** the same phone in any format reuses one customer; the same `submissionId` never creates a second lead. → tests in Task 5.
2. **Database down or `DATABASE_URL` missing:** the website quote form still emails and logs the lead and tells the customer it worked if the email went out; admin pages show an error message instead of crashing. → tests in Task 5, error boundary in Task 6.
3. **Password guessing:** after 10 failed logins for one email in 15 minutes, further attempts fail without checking the password; the message never reveals whether the email exists. → tests in Task 4.
4. **Deactivated user, expired or forged session, tech hitting owner URLs:** all end at `/admin/login` or a 403, enforced server-side. → tests in Task 4 and Task 8.
5. **Phone formats:** `(919) 555-0142`, `919.555.0142`, `+1 919 555 0142` and `19195550142` are the same customer; fewer than 10 digits is rejected for manual leads. → tests in Task 1.

---

## Before Task 1 (developer does this once)

- In Vercel → karfxcustom → Storage, create a Neon Postgres database (free tier). This adds `DATABASE_URL` to the project's env vars.
- In Neon, turn on the longest point-in-time restore window the plan allows (backups from day one, per the spec).
- In Neon, create a branch named `test` and copy its connection string.
- Locally: `vercel env pull .env.local`, then add `TEST_DATABASE_URL=<test branch URL>` and `SESSION_PEPPER=<32+ random characters>` to `.env.local`. Add `SESSION_PEPPER` to Vercel as well.

## File Structure

| File | Responsibility |
|---|---|
| `vitest.config.ts` | Test runner with the `@/` alias, loads `.env.local` |
| `lib/admin/phone.ts` | Normalize phone numbers for matching |
| `lib/admin/password.ts` | scrypt hash/verify |
| `db/migrations/001_shop_admin.sql` | Tables for step 1 |
| `scripts/migrate.mjs` | Apply pending migrations to `DATABASE_URL` (or `--test`) |
| `scripts/create-user.mjs` | Create the owner account from the terminal |
| `lib/admin/db.ts` | Shared `sql` client, clear error when unconfigured |
| `components/SiteChrome.tsx` | Public navbar/main/footer, skipped on `/admin` |
| `lib/admin/session.ts` | Sessions, `requireUser`, login lockout |
| `middleware.ts` | Cheap cookie-presence redirect for `/admin/*` |
| `app/admin/login/page.tsx`, `app/admin/login/actions.ts` | Login and logout |
| `lib/admin/leads.ts` | Lead and customer writes/reads |
| `app/api/quote/route.ts` (modify) | Save lead first, then email |
| `app/admin/layout.tsx`, `app/admin/error.tsx`, `components/admin/AdminRail.tsx` | Admin shell |
| `app/admin/leads/**` | Board, new lead, lead detail |
| `lib/admin/customers.ts`, `app/admin/customers/**` | Customer list, detail, vehicles |
| `lib/admin/users.ts`, `app/admin/team/**` | Owner manages logins |
| `tests/admin/*.test.ts` | Unit and database tests |

Database tests use `describe.skipIf(!process.env.TEST_DATABASE_URL)` and run `scripts/migrate.mjs --test` in `beforeAll`, truncating step 1 tables in `beforeEach`.

---

### Task 1: Test runner and phone normalization

**Files:**
- Create: `vitest.config.ts`, `lib/admin/phone.ts`, `tests/admin/phone.test.ts`
- Modify: `package.json` (add `"test": "vitest run"`; dev dependency `vitest@2.1.9`)

**Interfaces:**
- Produces: `normalizePhone(raw: string): string | null`: digits only; 10 digits → prefixed `1`; 11 digits starting `1` kept; anything else → `null`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { normalizePhone } from "@/lib/admin/phone";

describe("normalizePhone", () => {
  it.each(["(919) 555-0142", "919.555.0142", "+1 919 555 0142", "19195550142"])("%s → 19195550142", (raw) => {
    expect(normalizePhone(raw)).toBe("19195550142");
  });
  it("rejects short or long numbers", () => {
    expect(normalizePhone("555-0142")).toBeNull();
    expect(normalizePhone("291955501421")).toBeNull();
    expect(normalizePhone("")).toBeNull();
  });
});
```

- [ ] **Step 2: Run `npm test -- phone`.** Expected: FAIL, module not found.
- [ ] **Step 3: Install `vitest@2.1.9`, add `vitest.config.ts` (alias `@` → project root, `test.env` from `loadEnv("test", process.cwd(), "")`), implement `normalizePhone`.**
- [ ] **Step 4: Run `npm test -- phone`.** Expected: PASS (5 tests).
- [ ] **Step 5: Commit** `test: add vitest and phone normalization`.

### Task 2: Password hashing

**Files:**
- Create: `lib/admin/password.ts`, `tests/admin/password.test.ts`

**Interfaces:**
- Produces: `hashPassword(plain: string): Promise<string>` returning `scrypt$16384$8$1$<saltB64>$<hashB64>` (16-byte salt, 64-byte key); `verifyPassword(plain: string, stored: string): Promise<boolean>` using `crypto.timingSafeEqual`, returning `false` (never throwing) for malformed `stored`.

- [ ] **Step 1: Write the failing tests**

```ts
it("verifies the right password and rejects others", async () => {
  const stored = await hashPassword("correct horse battery");
  expect(stored.startsWith("scrypt$16384$8$1$")).toBe(true);
  expect(await verifyPassword("correct horse battery", stored)).toBe(true);
  expect(await verifyPassword("correct horse batterY", stored)).toBe(false);
});
it("salts every hash", async () => {
  expect(await hashPassword("same")).not.toBe(await hashPassword("same"));
});
it("returns false for a malformed hash", async () => {
  expect(await verifyPassword("x", "not-a-hash")).toBe(false);
});
```

- [ ] **Step 2: Run `npm test -- password`.** Expected: FAIL.
- [ ] **Step 3: Implement with `crypto.scrypt` (promisified) and `crypto.randomBytes`.** Passwords shorter than 10 characters are rejected by the callers (Tasks 4 and 8), not here.
- [ ] **Step 4: Run `npm test -- password`.** Expected: PASS.
- [ ] **Step 5: Commit** `feat(admin): scrypt password hashing`.

### Task 3: Schema, migrations, database client, and keeping site chrome off /admin

**Files:**
- Create: `db/migrations/001_shop_admin.sql`, `scripts/migrate.mjs`, `lib/admin/db.ts`, `components/SiteChrome.tsx`, `tests/admin/schema.test.ts`
- Modify: `app/layout.tsx` (replace `<Navbar />`, `<main …>` and `<ConditionalFooter />` with `<SiteChrome>{children}</SiteChrome>`), `package.json` (dependency `@neondatabase/serverless@0.10.4`; scripts `"db:migrate": "node scripts/migrate.mjs"`)

**Interfaces:**
- Produces: `sql` from `lib/admin/db.ts`: `neon(process.env.DATABASE_URL)`, created on first use; throws `Error("DATABASE_URL is not set")` when missing. `scripts/migrate.mjs [--test]` applies every `db/migrations/*.sql` not yet in `schema_migrations(name text primary key, applied_at timestamptz)`, each file in one transaction via `Pool`.
- Produces the tables every later task uses (this SQL is the decision; copy it):

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  name text not null,
  role text not null check (role in ('owner', 'tech')),
  password_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table sessions (
  token_hash text primary key,              -- sha256 of the cookie value
  user_id uuid not null references users(id),
  expires_at timestamptz not null
);
create table login_failures (email text not null, at timestamptz not null default now());
create index on login_failures (email, at);
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,                      -- as typed, for display
  phone_digits text not null,               -- normalizePhone() result
  email text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  archived_at timestamptz
);
create unique index customers_phone_live on customers (phone_digits) where archived_at is null;
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id),
  label text not null,                      -- "2024 Maserati MC20 · white"
  created_at timestamptz not null default now(),
  archived_at timestamptz
);
create table leads (
  id uuid primary key default gen_random_uuid(),
  number bigint generated always as identity (start with 201),
  customer_id uuid not null references customers(id),
  vehicle_id uuid references vehicles(id),
  services text[] not null default '{}',    -- "categorySlug/serviceSlug"
  message text not null default '',         -- what the customer wrote
  notes text not null default '',           -- internal
  source text not null check (source in ('website', 'phone', 'walk-in', 'instagram', 'google', 'referral', 'email', 'other')),
  stage text not null default 'new' check (stage in ('new', 'contacted', 'quoted', 'won', 'lost')),
  submission_id uuid unique,                -- website idempotency key
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
create table activity (
  id bigint generated always as identity primary key,
  entity text not null,                     -- 'lead' | 'customer' | 'user'
  entity_id uuid not null,
  action text not null,                     -- 'created' | 'stage:contacted' | 'edited' ...
  user_id uuid references users(id),        -- null = website
  at timestamptz not null default now()
);
```

- `SiteChrome` (client): if `usePathname()` starts with `/admin`, render `children` only; otherwise render exactly what the root layout renders today (`Navbar`, `<main id="main-content" className="min-h-screen pb-20 pt-20 md:pb-0">`, `ConditionalFooter`).

- [ ] **Step 1: Write the failing test** `tests/admin/schema.test.ts` (database test): after migrating, `select table_name from information_schema.tables where table_schema='public'` contains `users, sessions, login_failures, customers, vehicles, leads, activity, schema_migrations`; running the migrator a second time applies nothing and does not throw.
- [ ] **Step 2: Run `npm test -- schema`.** Expected: FAIL.
- [ ] **Step 3: Write the SQL, `migrate.mjs` and `db.ts`; add `SiteChrome` and swap it into `app/layout.tsx`.**
- [ ] **Step 4: Run `npm test -- schema`.** Expected: PASS. Run `npm run build`. Expected: build succeeds and the route list is unchanged apart from new routes.
- [ ] **Step 5: Commit** `feat(admin): database schema, migrator and site chrome split`.

### Task 4: Sessions, login, lockout and route protection

**Files:**
- Create: `lib/admin/session.ts`, `middleware.ts`, `app/admin/login/page.tsx`, `app/admin/login/actions.ts`, `scripts/create-user.mjs`, `tests/admin/session.test.ts`

**Interfaces:**
- Consumes: `sql`, `hashPassword`, `verifyPassword`.
- Produces:
  - `type AdminUser = { id: string; email: string; name: string; role: "owner" | "tech" }`
  - `attemptLogin(email: string, password: string): Promise<{ ok: true; token: string } | { ok: false; error: "Email or password is wrong." | "Too many attempts. Try again in 15 minutes." }>`: lowercases email; if ≥ 10 `login_failures` rows for it in the last 15 minutes, returns the lockout error without checking the password; inactive users fail like a wrong password; success deletes that email's failures and creates a 30-day session.
  - `userForToken(token: string | undefined): Promise<AdminUser | null>`: looks up `sha256(token + SESSION_PEPPER)`; null when missing, expired or the user is inactive.
  - `requireUser(role?: "owner"): Promise<AdminUser>`: reads cookie `kfx_session`; redirects to `/admin/login` when no user; calls `notFound()` when `role === "owner"` and the user is a tech.
  - `logout(): Promise<void>` deletes the session row and cookie.
- Cookie `kfx_session`: 32 random bytes base64url, `httpOnly`, `secure` in production, `sameSite: "lax"`, `path: "/admin"`, 30 days.
- `middleware.ts` matcher `/admin/:path*`: if no `kfx_session` cookie and path isn't `/admin/login`, redirect to `/admin/login`. (Real checks happen in `requireUser`.)
- `scripts/create-user.mjs <email> "<name>" <owner|tech>`: inserts the user with a random 16-character password and prints it once. If the email already exists, it resets that user's password instead, deletes their sessions and prints the new one (this is how the developer resets the owner).

- [ ] **Step 1: Write the failing database tests**

```ts
it("logs in with the right password and resolves the session", async () => {
  await createTestUser("owner@example.com", "a-strong-password", "owner");
  const r = await attemptLogin("Owner@Example.com", "a-strong-password");
  expect(r.ok).toBe(true);
  expect((await userForToken(r.ok ? r.token : ""))?.role).toBe("owner");
});
it("gives the same error for unknown email and wrong password", async () => {
  expect(await attemptLogin("nobody@example.com", "x")).toEqual({ ok: false, error: "Email or password is wrong." });
});
it("locks out after 10 failures even with the right password", async () => {
  for (let i = 0; i < 10; i++) await attemptLogin("owner@example.com", "wrong");
  expect(await attemptLogin("owner@example.com", "a-strong-password")).toEqual({ ok: false, error: "Too many attempts. Try again in 15 minutes." });
});
it("rejects expired sessions, forged tokens and deactivated users", async () => {
  const r = await attemptLogin("owner@example.com", "a-strong-password");
  const token = r.ok ? r.token : "";
  expect(await userForToken(randomBytes(32).toString("base64url"))).toBeNull();
  await sql`update sessions set expires_at = now() - interval '1 minute'`;
  expect(await userForToken(token)).toBeNull();
  await sql`update sessions set expires_at = now() + interval '1 day'`;
  await sql`update users set active = false`;
  expect(await userForToken(token)).toBeNull();
});
```

`createTestUser` lives in `tests/admin/helpers.ts` and inserts directly with `hashPassword`.
- [ ] **Step 2: Run `npm test -- session`.** Expected: FAIL.
- [ ] **Step 3: Implement `session.ts`, the login page (email, password, one submit button, error text from the action), the actions, middleware and `create-user.mjs`.**
- [ ] **Step 4: Run `npm test -- session`.** Expected: PASS. Then `npm run dev`, create a local owner with the script, sign in at `/admin/login`, and check that `/admin/leads` without the cookie redirects to login.
- [ ] **Step 5: Commit** `feat(admin): logins with sessions and lockout`.

### Task 5: Website leads saved before email

**Files:**
- Create: `lib/admin/leads.ts`, `tests/admin/leads.test.ts`, `tests/admin/quote-route.test.ts`
- Modify: `app/api/quote/route.ts`

**Interfaces:**
- Consumes: `sql`, `normalizePhone`.
- Produces:
  - `type LeadStage = "new" | "contacted" | "quoted" | "won" | "lost"`
  - `upsertCustomer(input: { name: string; phone: string; email?: string }): Promise<string>`: returns the customer id; throws `Error("Enter a 10-digit phone number.")` when `normalizePhone` returns null; `insert … on conflict (phone_digits) where archived_at is null do update` keeping the existing name and filling `email` only if it was empty.
  - `saveWebsiteLead(input: { name: string; phone: string; email: string; message: string; services: string[]; source: string; submissionId: string }): Promise<{ leadId: string; number: number; created: boolean }>`: `upsertCustomer`, then `insert … on conflict (submission_id) do nothing`; returns `created: false` and the existing lead on a retry. (Two statements are fine: the customer upsert is safe to repeat.) `services` are `"categorySlug/serviceSlug"` strings built from the already-validated request. `source` other than `restorfx` maps to `'website'`; `restorfx` maps to `'referral'`.
  - Route order: validate (unchanged) → `saveWebsiteLead` in try/catch (on failure `console.error` with the lead) → email (unchanged). Response: `200` if the lead was saved **or** the notification email was sent; `503` only when both failed. A missing `RESEND_API_KEY` no longer fails the request when the lead was saved.

- [ ] **Step 1: Write the failing tests**

```ts
// leads.test.ts (database)
it("reuses one customer across phone formats", async () => {
  await saveWebsiteLead({ ...lead, phone: "(919) 555-0142", submissionId: uuidA });
  await saveWebsiteLead({ ...lead, phone: "+1 919 555 0142", submissionId: uuidB });
  expect((await sql`select count(*)::int as n from customers`)[0].n).toBe(1);
  expect((await sql`select count(*)::int as n from leads`)[0].n).toBe(2);
});
it("creates one lead per submissionId", async () => {
  const a = await saveWebsiteLead({ ...lead, submissionId: uuidA });
  const b = await saveWebsiteLead({ ...lead, submissionId: uuidA });
  expect(b).toEqual({ ...a, created: false });
});

// quote-route.test.ts (unit; vi.mock("@/lib/admin/leads") and vi.mock("resend"))
it("returns 200 when the lead is saved even without RESEND_API_KEY", …);
it("returns 200 when the database fails but the email is sent", …);
it("returns 503 when both fail", …);
```

- [ ] **Step 2: Run `npm test -- leads quote-route`.** Expected: FAIL.
- [ ] **Step 3: Implement `saveWebsiteLead` and the route change.**
- [ ] **Step 4: Run `npm test`.** Expected: all PASS. Submit the local quote form once; the row appears in `leads`.
- [ ] **Step 5: Commit** `feat(admin): save website quote requests as leads`.

### Task 6: Admin shell and leads board

**Files:**
- Create: `app/admin/layout.tsx`, `app/admin/page.tsx` (redirects to `/admin/leads`), `app/admin/error.tsx`, `components/admin/AdminRail.tsx`, `app/admin/leads/page.tsx`, `app/admin/leads/new/page.tsx`, `app/admin/leads/[id]/page.tsx`, `app/admin/leads/actions.ts`
- Modify: `lib/admin/leads.ts`, `tests/admin/leads.test.ts`

**Interfaces:**
- Consumes: `requireUser`, `upsertCustomer`, `LeadStage` (Task 5).
- Produces in `lib/admin/leads.ts`:
  - `listLeads(): Promise<LeadRow[]>` (not archived, newest first) with `LeadRow = { id; number; stage; source; services: string[]; message; notes; createdAt: Date; customer: { id; name; phone } }`
  - `getLead(id: string): Promise<LeadRow | null>`
  - `createManualLead(input: { name; phone; email?; vehicle?; service?; source; notes? }, userId: string): Promise<string>`: requires `name` and a valid `normalizePhone(phone)`; creates the vehicle when given.
  - `setLeadStage(id: string, stage: LeadStage, userId: string): Promise<void>` and `saveLeadNotes(id, notes, userId)`; both write an `activity` row.
- Rail (client, `AdminRail.tsx`): wordmark "KAR FX", "Shop admin", links Leads and Customers, Team for owners only, the signed-in name and a Log out button. Phones: rail becomes a top bar with swipeable links, as in the demo.
- Board: five columns in stage order; card = `L-{number}`, customer name, services (service names looked up from `SERVICE_CATEGORIES`), source, relative age in Eastern time. Detail: phone with Copy, email, message, services, internal notes form, and one button per allowed stage move: New → Contacted or Lost; Contacted → Quoted or Lost; Quoted → Won or Lost; Lost → New; Won has none. (Estimates arrive in step 2, so Quoted is set by hand for now.)
- `error.tsx`: "Something went wrong loading the admin. Try again, and if it keeps happening, check that the database is connected." with a Retry button.

- [ ] **Step 1: Write the failing database tests:** `createManualLead` rejects `phone: "555-0142"` with `Error("Enter a 10-digit phone number.")`; `setLeadStage(id, "contacted", uid)` updates `stage` and `updated_at` and inserts one `activity` row with `action = 'stage:contacted'`.
- [ ] **Step 2: Run `npm test -- leads`.** Expected: FAIL.
- [ ] **Step 3: Implement the data functions, server actions (each starts with `await requireUser()`), and pages.**
- [ ] **Step 4: Run `npm test`.** Expected: PASS. In the browser at 375px and 1280px: add a lead by phone in under a minute, move it through stages, and confirm the public site at `/` still shows its navbar and `/admin/leads` doesn't.
- [ ] **Step 5: Commit** `feat(admin): leads board, detail and manual leads`.

### Task 7: Customers and vehicles

**Files:**
- Create: `lib/admin/customers.ts`, `app/admin/customers/page.tsx`, `app/admin/customers/[id]/page.tsx`, `app/admin/customers/actions.ts`, `tests/admin/customers.test.ts`

**Interfaces:**
- Consumes: `requireUser`, `normalizePhone`.
- Produces:
  - `listCustomers(q?: string): Promise<CustomerRow[]>`: case-insensitive match on name or email, or on `phone_digits` when `q` contains digits; not archived; ordered by name; at most 200 rows.
  - `getCustomer(id): Promise<CustomerDetail | null>` with vehicles and leads.
  - `updateCustomer(id, { name; phone; email; notes }, userId)`: a phone that belongs to another live customer fails with `Error("Another customer already has this phone number.")`.
  - `addVehicle(customerId, label, userId)`, `archiveVehicle(vehicleId, userId)`.

- [ ] **Step 1: Write the failing database tests:** search by `"555-0142"` finds `(919) 555-0142`; updating a customer to another customer's phone throws the message above; `archiveVehicle` hides the vehicle from `getCustomer` but keeps the row.
- [ ] **Step 2: Run `npm test -- customers`.** Expected: FAIL.
- [ ] **Step 3: Implement the functions, actions and pages** (list with one search box; detail with edit form, vehicles list with Add and Archive, and the customer's leads).
- [ ] **Step 4: Run `npm test`.** Expected: PASS. Check both pages at 375px and 1280px.
- [ ] **Step 5: Commit** `feat(admin): customers and vehicles`.

### Task 8: Team page (owner only)

**Files:**
- Create: `lib/admin/users.ts`, `app/admin/team/page.tsx`, `app/admin/team/actions.ts`, `tests/admin/users.test.ts`

**Interfaces:**
- Consumes: `requireUser("owner")`, `hashPassword`.
- Produces: `listUsers()`, `createUser({ email; name; role }, password)` (password ≥ 10 characters, else `Error("Use at least 10 characters.")`), `resetPassword(userId, password)` (also deletes that user's sessions), `setActive(userId, active)` (deactivating deletes their sessions; the last active owner can't be deactivated: `Error("Keep at least one active owner.")`).

- [ ] **Step 1: Write the failing tests:** the three error cases above; a tech calling any team action gets `notFound()` (assert the thrown Next.js not-found error); `resetPassword` makes the old session token resolve to `null`.
- [ ] **Step 2: Run `npm test -- users`.** Expected: FAIL.
- [ ] **Step 3: Implement.** The page lists people with role and status, and has an Add form, a Reset password form per person, and Deactivate/Reactivate.
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Commit** `feat(admin): owner manages logins`.

### Task 9: Production launch

- [ ] **Step 1:** `npm run build` and `npm test` pass locally.
- [ ] **Step 2:** Confirm Vercel env vars exist for Production: `DATABASE_URL`, `SESSION_PEPPER`, `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`.
- [ ] **Step 3:** Run `DATABASE_URL=<production URL> npm run db:migrate`. Expected: `001_shop_admin.sql applied`.
- [ ] **Step 4:** Run `scripts/create-user.mjs` against production for the owner; hand the password to the developer to pass on.
- [ ] **Step 5:** Push to `main` (after the developer approves), wait for the deploy, then: sign in at `https://www.karfxcustoms.com/admin`, submit one real-looking test quote from the site, confirm it appears on the board and in the email, then archive it.
