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

-- Calls the AI phone answered (made up, like everything here). Demo calls have no recordings.
insert into calls (id, retell_call_id, customer_id, lead_id, from_number, callback_phone, caller_name, call_type, urgent, summary, transcript, started_at, ended_at, created_at) values
  ('00000000-0000-4000-8000-000000000401', 'demo_call_1', '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000301',
    '+19195550142', '(919) 555-0142', 'Jordan Pierce', 'inquiry', false,
    'Jordan called about the PPF request. Picks up the 911 from the dealer Nov 3 and wants full front PPF plus a ceramic coating before driving it much. Asked roughly how long the work takes; told Carlos will go over timing and price on the callback.',
    E'Agent: Thanks for calling KAR FX Customs! I''m the shop''s virtual assistant, and this call is recorded so we get your details right. How can I help you today?\nUser: Hi, I sent a quote request for my new 911 and wanted to follow up.\nAgent: Happy to help! Is it the 2025 911 Carrera T?\nUser: Yes, white. I pick it up November 3rd.\nAgent: Got it. Carlos will call you back within 24 hours on weekdays.',
    now() - interval '12 minutes', now() - interval '10 minutes', now() - interval '10 minutes'),
  ('00000000-0000-4000-8000-000000000402', 'demo_call_2', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000303',
    '+19195550177', '(919) 555-0177', 'Derek Owens', 'inquiry', true,
    'Derek wants the chrome delete and headlight tint on his black F-150 done before a truck show on Saturday. Asked for a call back today if possible.',
    E'Agent: Thanks for calling KAR FX Customs! I''m the shop''s virtual assistant, and this call is recorded so we get your details right. How can I help you today?\nUser: It''s Derek, about blacking out my F-150. I have a show Saturday.\nAgent: Got it, Derek. Carlos will call you back within 24 hours on weekdays.',
    now() - interval '55 minutes', now() - interval '53 minutes', now() - interval '53 minutes'),
  ('00000000-0000-4000-8000-000000000403', 'demo_call_3', null, null,
    '+17045550133', '(704) 555-0133', 'Rachel at Carolina Film Supply', 'vendor', false,
    'Rachel from Carolina Film Supply wants to set up a time to show new PPF and tint film lines.',
    E'Agent: Thanks for calling KAR FX Customs! How can I help you today?\nUser: Hi, this is Rachel with Carolina Film Supply. I''d love to show you our new film lines.\nAgent: I''ll pass that on to Carlos.',
    now() - interval '3 hours', now() - interval '3 hours', now() - interval '3 hours'),
  ('00000000-0000-4000-8000-000000000404', 'demo_call_4', null, null,
    '+18005550199', null, null, 'spam', false,
    'Recorded message about an extended car warranty. Nobody spoke.',
    'Agent: Thanks for calling KAR FX Customs! How can I help you today?',
    now() - interval '1 day', now() - interval '1 day', now() - interval '1 day');
