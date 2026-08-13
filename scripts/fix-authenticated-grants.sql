-- LIVE FIX: run in Supabase SQL Editor after Phase 2 migration + seed.
-- Unblocks authenticated REST access so membership-scoped RLS can enforce isolation.

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

-- Quick check (should return has_select = true for authenticated)
select
  has_table_privilege('authenticated', 'public.coach_classes', 'select') as coach_classes_select,
  has_table_privilege('authenticated', 'public.coach_notes', 'select') as coach_notes_select,
  has_table_privilege('authenticated', 'public.academy_memberships', 'select') as memberships_select,
  has_table_privilege('authenticated', 'public.academies', 'select') as academies_select;
