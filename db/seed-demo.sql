-- Sample data for demo mode (live site with no database connected yet). Everyone here is made up.
-- Fixed ids keep every server instance showing the same records.

insert into users (id, email, name, role, password_hash) values
  ('00000000-0000-4000-8000-000000000001', 'sales@restorfxraleigh.com', 'KAR FX Owner', 'owner', '!demo-no-password'),
  ('00000000-0000-4000-8000-000000000002', 'tech@karfx.example', 'Shop Tech', 'tech', '!demo-no-password');

insert into customers (id, name, phone, phone_digits, email, notes, created_at) values
  ('00000000-0000-4000-8000-000000000101', 'Jordan Pierce', '(919) 555-0142', '19195550142', 'jordan.pierce@example.com', '', now() - interval '18 minutes'),
  ('00000000-0000-4000-8000-000000000102', 'Alicia Moreno', '(984) 555-0119', '19845550119', 'alicia.moreno@example.com', '', now() - interval '2 hours'),
  ('00000000-0000-4000-8000-000000000103', 'Derek Owens', '(919) 555-0177', '19195550177', null, 'Prefers texts.', now() - interval '1 day'),
  ('00000000-0000-4000-8000-000000000104', 'Nora Kim', '(919) 555-0124', '19195550124', 'nora.kim@example.com', '', now() - interval '2 days'),
  ('00000000-0000-4000-8000-000000000105', 'Grace Pruitt', '(919) 555-0186', '19195550186', 'grace.pruitt@example.com', '', now() - interval '4 days'),
  ('00000000-0000-4000-8000-000000000106', 'Omar Haddad', '(984) 555-0175', '19845550175', 'omar.haddad@example.com', 'Repeat customer.', now() - interval '7 days'),
  ('00000000-0000-4000-8000-000000000107', 'Ben Whitfield', '(919) 555-0158', '19195550158', 'ben.w@example.com', '', now() - interval '14 days');

insert into vehicles (id, customer_id, label) values
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000101', '2025 Porsche 911 Carrera T · white'),
  ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000102', '2023 Tesla Model Y · gray'),
  ('00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000103', '2019 Ford F-150 · black'),
  ('00000000-0000-4000-8000-000000000204', '00000000-0000-4000-8000-000000000104', '2022 BMW M4 · blue'),
  ('00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000105', '2017 Honda Accord · silver'),
  ('00000000-0000-4000-8000-000000000206', '00000000-0000-4000-8000-000000000106', '2024 Cadillac Escalade · black');

insert into leads (id, customer_id, vehicle_id, services, message, notes, source, stage, created_at, updated_at) values
  ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000201',
    '{protection/ppf,protection/ceramic-coats}', 'Picking it up from the dealer Nov 3 and want it protected before the first drive.', '', 'website', 'new',
    now() - interval '18 minutes', now() - interval '18 minutes'),
  ('00000000-0000-4000-8000-000000000302', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000202',
    '{protection/window-tint}', 'What tint percentage is legal in NC for the front windows?', '', 'instagram', 'new',
    now() - interval '2 hours', now() - interval '2 hours'),
  ('00000000-0000-4000-8000-000000000303', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000203',
    '{wraps-styling/chrome-delete,protection/headlight-tint}', '', 'Wants the whole truck blacked out.', 'google', 'new',
    now() - interval '1 day', now() - interval '1 day'),
  ('00000000-0000-4000-8000-000000000304', '00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000204',
    '{wraps-styling/color-change-wrap}', '', 'Coming in Wednesday at 2 PM to look at satin blue and gray samples.', 'website', 'contacted',
    now() - interval '2 days', now() - interval '1 day'),
  ('00000000-0000-4000-8000-000000000305', '00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000205',
    '{detailing/interior-exterior}', 'Clear coat is peeling on the roof and trunk.', 'RestorFX quote sent.', 'referral', 'quoted',
    now() - interval '4 days', now() - interval '3 days'),
  ('00000000-0000-4000-8000-000000000306', '00000000-0000-4000-8000-000000000106', '00000000-0000-4000-8000-000000000206',
    '{wheels-calipers-lighting/starlight-headliner,wheels-calipers-lighting/ambient-lighting}', '', 'Booked for Thursday and Friday.', 'phone', 'won',
    now() - interval '7 days', now() - interval '5 days'),
  ('00000000-0000-4000-8000-000000000307', '00000000-0000-4000-8000-000000000107', null,
    '{detailing/interior-exterior}', '', 'Went with a mobile detailer.', 'website', 'lost',
    now() - interval '14 days', now() - interval '12 days');
