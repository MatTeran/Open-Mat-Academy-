-- Phase 2 follow-up: table privileges for PostgREST clients.
-- RLS policies target `authenticated`, but Postgres also requires GRANTs.
-- Without these, every REST call returns 42501 permission denied before RLS runs.

grant usage on schema public to authenticated;

grant select, insert, update, delete on table
  public.organizations,
  public.academies,
  public.locations,
  public.academy_memberships,
  public.announcements,
  public.coach_classes,
  public.attendance,
  public.coach_notes,
  public.techniques,
  public.coach_challenges,
  public.coach_achievements,
  public.coach_events,
  public.event_rsvps,
  public.media_albums,
  public.media_items,
  public.notification_drafts,
  public.member_development,
  public.promotion_history,
  public.competition_profiles,
  public.academy_roles,
  public.audit_logs
to authenticated;

-- Sequences used by identity columns (if any present)
do $$
declare
  seq regclass;
begin
  for seq in
    select c.oid::regclass
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'S'
  loop
    execute format('grant usage, select on sequence %s to authenticated', seq);
  end loop;
end $$;
