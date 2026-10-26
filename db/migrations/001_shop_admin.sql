-- Shop admin step 1: logins, customers, vehicles, leads.
-- Records are archived (archived_at), never deleted.

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
create index login_failures_email_at on login_failures (email, at);

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
