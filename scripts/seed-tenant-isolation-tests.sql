-- TEST-ONLY tenant isolation seed (safe for Phase 2 verification)
-- Creates synthetic academies A/B + memberships + sample class/note rows.
-- Does NOT modify production Open Mat members.

begin;

-- Ensure service_role can help with verification automation
grant select, insert, update, delete on public.organizations to service_role;
grant select, insert, update, delete on public.academies to service_role;
grant select, insert, update, delete on public.locations to service_role;
grant select, insert, update, delete on public.academy_memberships to service_role;
grant select, insert, update, delete on public.coach_classes to service_role;
grant select, insert, update, delete on public.coach_notes to service_role;
grant select, insert, update, delete on public.announcements to service_role;
grant select, insert, update, delete on public.attendance to service_role;
grant select, insert, update, delete on public.audit_logs to service_role;
grant usage on schema public to service_role;
grant execute on function public.is_academy_member(text) to service_role;
grant execute on function public.can_coach_at_academy(text) to service_role;
grant execute on function public.can_manage_academy(text) to service_role;
grant execute on function public.has_academy_role(text, variadic text[]) to service_role;
grant execute on function public.can_access_academy(text) to service_role;
grant execute on function public.shares_academy_with(uuid) to service_role;
grant execute on function public.class_academy_id(uuid) to service_role;
grant execute on function public.event_academy_id(uuid) to service_role;

insert into public.organizations (id, name, slug, status)
values
  ('org-test-a', 'Tenant Test Org A', 'tenant-test-org-a', 'active'),
  ('org-test-b', 'Tenant Test Org B', 'tenant-test-org-b', 'active')
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  status = excluded.status,
  updated_at = timezone('utc', now());

insert into public.academies (id, name, organization_id, slug, status)
values
  ('academy-test-a', 'Tenant Test Academy A', 'org-test-a', 'tenant-test-academy-a', 'active'),
  ('academy-test-b', 'Tenant Test Academy B', 'org-test-b', 'tenant-test-academy-b', 'active')
on conflict (id) do update set
  name = excluded.name,
  organization_id = excluded.organization_id,
  slug = excluded.slug,
  status = excluded.status,
  updated_at = timezone('utc', now());

insert into public.locations (
  id, academy_id, name, address_line_1, city, state, postal_code, country, timezone, is_active
) values
  ('location-test-a', 'academy-test-a', 'Test Academy A Main', '100 Test A St', 'Testville', 'CA', '90001', 'United States', 'America/Los_Angeles', true),
  ('location-test-b', 'academy-test-b', 'Test Academy B Main', '200 Test B St', 'Trialtown', 'CA', '90002', 'United States', 'America/Los_Angeles', true)
on conflict (id) do update set
  name = excluded.name,
  academy_id = excluded.academy_id,
  updated_at = timezone('utc', now());

update public.academies set primary_location_id = 'location-test-a', updated_at = timezone('utc', now()) where id = 'academy-test-a';
update public.academies set primary_location_id = 'location-test-b', updated_at = timezone('utc', now()) where id = 'academy-test-b';

-- Clear prior test memberships/classes/notes for these emails' users
delete from public.academy_memberships
where user_id in (
  'a1229632-721a-411d-bc38-caaf2bc60846'::uuid, '618c790a-64ba-47af-b7c1-e4424fcb2e7e'::uuid, 'f561b89b-5a28-4662-912d-032045bd9b85'::uuid,
  'e7aace12-8e2f-4be2-9a53-234766d866bd'::uuid, 'eb676d15-f640-4e51-a78c-b9fe2aa9cc52'::uuid, 'd0d71543-b967-4b12-8d86-d41bd84b1704'::uuid
);

delete from public.coach_notes
where id in (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2'::uuid
);

delete from public.coach_classes
where id in (
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid
);

insert into public.academy_memberships (academy_id, user_id, role) values
  ('academy-test-a', 'a1229632-721a-411d-bc38-caaf2bc60846'::uuid, 'coach'),
  ('academy-test-b', '618c790a-64ba-47af-b7c1-e4424fcb2e7e'::uuid, 'coach'),
  ('academy-test-a', 'f561b89b-5a28-4662-912d-032045bd9b85'::uuid, 'owner'),
  ('academy-test-a', 'e7aace12-8e2f-4be2-9a53-234766d866bd'::uuid, 'coach'),
  ('academy-test-b', 'e7aace12-8e2f-4be2-9a53-234766d866bd'::uuid, 'coach'),
  ('academy-test-a', 'eb676d15-f640-4e51-a78c-b9fe2aa9cc52'::uuid, 'member'),
  ('academy-test-b', 'd0d71543-b967-4b12-8d86-d41bd84b1704'::uuid, 'member')
on conflict (academy_id, user_id) do update set role = excluded.role;

insert into public.coach_classes (
  id, title, description, date, start_time, end_time,
  instructor_id, instructor_name, gi_type, level, audience, capacity,
  status, is_open_mat, is_seminar, recurrence, academy_id, location_id
) values
(
  '11111111-1111-1111-1111-111111111111',
  'Tenant A Fundamentals',
  'TEST ONLY academy A class',
  current_date,
  '10:00', '11:00',
  'a1229632-721a-411d-bc38-caaf2bc60846'::uuid, 'Coach A Test',
  'gi', 'adult_bjj', 'adults', 20,
  'scheduled', false, false, 'none',
  'academy-test-a', 'location-test-a'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Tenant B Fundamentals',
  'TEST ONLY academy B class',
  current_date,
  '10:00', '11:00',
  '618c790a-64ba-47af-b7c1-e4424fcb2e7e'::uuid, 'Coach B Test',
  'gi', 'adult_bjj', 'adults', 20,
  'scheduled', false, false, 'none',
  'academy-test-b', 'location-test-b'
)
on conflict (id) do update set
  title = excluded.title,
  academy_id = excluded.academy_id,
  location_id = excluded.location_id,
  updated_at = timezone('utc', now());

insert into public.coach_notes (
  id, member_id, author_id, author_name, body, is_private, academy_id
) values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid,
  'eb676d15-f640-4e51-a78c-b9fe2aa9cc52'::uuid,
  'a1229632-721a-411d-bc38-caaf2bc60846'::uuid,
  'Coach A Test',
  'PRIVATE TEST NOTE A - academy A only',
  true,
  'academy-test-a'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2'::uuid,
  'd0d71543-b967-4b12-8d86-d41bd84b1704'::uuid,
  '618c790a-64ba-47af-b7c1-e4424fcb2e7e'::uuid,
  'Coach B Test',
  'PRIVATE TEST NOTE B - academy B only',
  true,
  'academy-test-b'
)
on conflict (id) do update set
  body = excluded.body,
  academy_id = excluded.academy_id,
  updated_at = timezone('utc', now());

commit;

-- Verification snapshot
select 'memberships' as kind, academy_id, role, user_id::text
from public.academy_memberships
where academy_id in ('academy-test-a','academy-test-b')
order by academy_id, role;

select 'classes' as kind, id::text, academy_id, title
from public.coach_classes
where id in (
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid
);

select 'notes' as kind, id::text, academy_id, left(body, 40) as body
from public.coach_notes
where id in (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2'::uuid
);
