-- AI phone: every call the Retell assistant answers. Kept for good, never deleted.

create table calls (
  id uuid primary key default gen_random_uuid(),
  retell_call_id text not null unique,      -- webhook idempotency key
  customer_id uuid references customers(id),
  lead_id uuid references leads(id),
  from_number text,                         -- caller ID as Retell sent it
  callback_phone text,                      -- "(919) 555-0142", null when unusable
  caller_name text,                         -- as the AI heard it, even with no customer
  call_type text not null check (call_type in ('inquiry', 'existing_customer', 'vendor', 'spam', 'other')),
  urgent boolean not null default false,
  summary text not null default '',
  transcript text not null default '',
  recording_url text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);
create index calls_created_at on calls (created_at desc);
create index calls_lead on calls (lead_id);
