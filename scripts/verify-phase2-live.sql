-- Phase 2 live verification (run in Supabase SQL Editor as postgres)
-- Safe / read-only. Paste the result grids back to the agent.

-- 1) Core objects exist
select
  to_regclass('public.organizations') is not null as has_organizations,
  to_regclass('public.locations') is not null as has_locations,
  exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'academies' and column_name = 'organization_id'
  ) as has_academies_organization_id,
  exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'coach_classes' and column_name = 'location_id'
  ) as has_coach_classes_location_id,
  exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'coach_notes' and column_name = 'academy_id'
  ) as has_coach_notes_academy_id,
  exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'is_academy_member'
  ) as has_is_academy_member,
  exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'can_coach_at_academy'
  ) as has_can_coach_at_academy;

-- 2) Backfill rows
select id, name, slug, status from public.organizations where id = 'org-open-mat';
select id, name, organization_id, slug, status, primary_location_id
from public.academies where id = 'academy-open-mat';
select id, academy_id, name, city, state, address_line_1
from public.locations where id = 'location-tracy-naglee';

-- 3) No broad USING (true) policies on key tenant tables
select schemaname, tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'organizations','academies','locations','academy_memberships',
    'announcements','coach_classes','attendance','coach_notes',
    'techniques','coach_challenges','coach_achievements','coach_events',
    'event_rsvps','media_albums','media_items','notification_drafts',
    'member_development','promotion_history','competition_profiles',
    'academy_roles','audit_logs'
  )
  and (
    qual = 'true'
    or with_check = 'true'
  )
order by tablename, policyname;

-- 4) Sample policy count (membership-scoped era should have many policies)
select tablename, count(*) as policy_count
from pg_policies
where schemaname = 'public'
  and tablename in (
    'organizations','locations','coach_classes','coach_notes','announcements'
  )
group by tablename
order by tablename;
