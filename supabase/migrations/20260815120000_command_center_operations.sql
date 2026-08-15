-- Command Center operations schema (plans, entitlements, onboarding, branding, support)
-- Additive only. Requires organizations, academies, locations, academy_memberships, is_platform_admin().

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1) platform_plans
-- ---------------------------------------------------------------------------
create table if not exists public.platform_plans (
  id text primary key,
  name text not null,
  slug text not null unique,
  billing_interval text not null default 'none' check (
    billing_interval in ('monthly', 'annual', 'none')
  ),
  rank int not null default 0,
  is_active boolean not null default true,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists platform_plans_active_rank_idx
  on public.platform_plans (is_active, rank);

alter table public.platform_plans enable row level security;

insert into public.platform_plans (id, name, slug, billing_interval, rank, is_active, description)
values
  ('trial', 'Trial', 'trial', 'none', 0, true, 'Time-limited evaluation with core features enabled.'),
  ('starter', 'Starter', 'starter', 'monthly', 10, true, 'Essentials for a single-location academy getting started.'),
  ('professional', 'Professional', 'professional', 'monthly', 20, true, 'Full coaching toolkit with analytics and events.'),
  ('academy_plus', 'Academy Plus', 'academy-plus', 'monthly', 30, true, 'Multi-location branding and community for growing academies.'),
  ('enterprise', 'Enterprise', 'enterprise', 'annual', 40, true, 'Full platform access including AI insights and priority ops support.')
on conflict (id) do update
  set name = excluded.name,
      slug = excluded.slug,
      billing_interval = excluded.billing_interval,
      rank = excluded.rank,
      is_active = excluded.is_active,
      description = excluded.description,
      updated_at = timezone('utc', now());

-- ---------------------------------------------------------------------------
-- 2) academy_subscriptions
-- ---------------------------------------------------------------------------
create table if not exists public.academy_subscriptions (
  id uuid primary key default gen_random_uuid(),
  academy_id text not null unique references public.academies (id) on delete cascade,
  plan_id text not null references public.platform_plans (id),
  status text not null default 'trial' check (
    status in ('trial', 'active', 'past_due', 'cancelled', 'suspended')
  ),
  billing_interval text,
  trial_starts_at timestamptz,
  trial_ends_at timestamptz,
  starts_at timestamptz,
  renews_at timestamptz,
  provider_customer_id text,
  provider_subscription_id text,
  mrr_cents int,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists academy_subscriptions_status_idx
  on public.academy_subscriptions (status);

create index if not exists academy_subscriptions_plan_idx
  on public.academy_subscriptions (plan_id);

create index if not exists academy_subscriptions_created_idx
  on public.academy_subscriptions (created_at desc);

alter table public.academy_subscriptions enable row level security;

-- ---------------------------------------------------------------------------
-- 3) platform_features
-- ---------------------------------------------------------------------------
create table if not exists public.platform_features (
  id text primary key,
  name text not null,
  description text,
  global_state text not null default 'off' check (
    global_state in ('off', 'beta', 'ga')
  ),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists platform_features_global_state_idx
  on public.platform_features (global_state);

alter table public.platform_features enable row level security;

insert into public.platform_features (id, name, description, global_state)
values
  ('attendance', 'Attendance', 'Class check-in and attendance tracking.', 'ga'),
  ('schedule', 'Schedule', 'Class and open-mat scheduling.', 'ga'),
  ('journey', 'Journey', 'Member development / belt journey.', 'ga'),
  ('techniques', 'Techniques', 'Technique library and curriculum media.', 'ga'),
  ('coach_analytics', 'Coach Analytics', 'Coach dashboards and performance insights.', 'ga'),
  ('events', 'Events', 'Academy events and RSVPs.', 'ga'),
  ('announcements', 'Announcements', 'Push and in-app academy announcements.', 'ga'),
  ('community', 'Community', 'Member community / social surfaces.', 'beta'),
  ('custom_branding', 'Custom Branding', 'Academy logos, colors, and hero imagery.', 'ga'),
  ('multiple_locations', 'Multiple Locations', 'Manage more than one location per academy.', 'ga'),
  ('ai_insights', 'AI Insights', 'AI-assisted coaching and ops insights.', 'beta')
on conflict (id) do update
  set name = excluded.name,
      description = excluded.description,
      global_state = excluded.global_state,
      updated_at = timezone('utc', now());

-- ---------------------------------------------------------------------------
-- 4) plan_feature_defaults
-- ---------------------------------------------------------------------------
create table if not exists public.plan_feature_defaults (
  plan_id text not null references public.platform_plans (id) on delete cascade,
  feature_id text not null references public.platform_features (id) on delete cascade,
  enabled boolean not null default false,
  primary key (plan_id, feature_id)
);

create index if not exists plan_feature_defaults_feature_idx
  on public.plan_feature_defaults (feature_id);

alter table public.plan_feature_defaults enable row level security;

-- Seed: trial / starter limited; professional+ progressively fuller
insert into public.plan_feature_defaults (plan_id, feature_id, enabled)
values
  -- trial
  ('trial', 'attendance', true),
  ('trial', 'schedule', true),
  ('trial', 'journey', true),
  ('trial', 'techniques', true),
  ('trial', 'coach_analytics', false),
  ('trial', 'events', false),
  ('trial', 'announcements', true),
  ('trial', 'community', false),
  ('trial', 'custom_branding', false),
  ('trial', 'multiple_locations', false),
  ('trial', 'ai_insights', false),
  -- starter
  ('starter', 'attendance', true),
  ('starter', 'schedule', true),
  ('starter', 'journey', true),
  ('starter', 'techniques', true),
  ('starter', 'coach_analytics', false),
  ('starter', 'events', true),
  ('starter', 'announcements', true),
  ('starter', 'community', false),
  ('starter', 'custom_branding', false),
  ('starter', 'multiple_locations', false),
  ('starter', 'ai_insights', false),
  -- professional
  ('professional', 'attendance', true),
  ('professional', 'schedule', true),
  ('professional', 'journey', true),
  ('professional', 'techniques', true),
  ('professional', 'coach_analytics', true),
  ('professional', 'events', true),
  ('professional', 'announcements', true),
  ('professional', 'community', true),
  ('professional', 'custom_branding', true),
  ('professional', 'multiple_locations', false),
  ('professional', 'ai_insights', false),
  -- academy_plus
  ('academy_plus', 'attendance', true),
  ('academy_plus', 'schedule', true),
  ('academy_plus', 'journey', true),
  ('academy_plus', 'techniques', true),
  ('academy_plus', 'coach_analytics', true),
  ('academy_plus', 'events', true),
  ('academy_plus', 'announcements', true),
  ('academy_plus', 'community', true),
  ('academy_plus', 'custom_branding', true),
  ('academy_plus', 'multiple_locations', true),
  ('academy_plus', 'ai_insights', false),
  -- enterprise
  ('enterprise', 'attendance', true),
  ('enterprise', 'schedule', true),
  ('enterprise', 'journey', true),
  ('enterprise', 'techniques', true),
  ('enterprise', 'coach_analytics', true),
  ('enterprise', 'events', true),
  ('enterprise', 'announcements', true),
  ('enterprise', 'community', true),
  ('enterprise', 'custom_branding', true),
  ('enterprise', 'multiple_locations', true),
  ('enterprise', 'ai_insights', true)
on conflict (plan_id, feature_id) do update
  set enabled = excluded.enabled;

-- ---------------------------------------------------------------------------
-- 5) academy_feature_overrides
-- ---------------------------------------------------------------------------
create table if not exists public.academy_feature_overrides (
  academy_id text not null references public.academies (id) on delete cascade,
  feature_id text not null references public.platform_features (id) on delete cascade,
  enabled boolean not null,
  primary key (academy_id, feature_id)
);

create index if not exists academy_feature_overrides_feature_idx
  on public.academy_feature_overrides (feature_id);

alter table public.academy_feature_overrides enable row level security;

-- ---------------------------------------------------------------------------
-- 6) academy_onboarding
-- ---------------------------------------------------------------------------
create table if not exists public.academy_onboarding (
  academy_id text primary key references public.academies (id) on delete cascade,
  status text not null default 'lead' check (
    status in (
      'lead',
      'invited',
      'account_created',
      'branding_incomplete',
      'configuring',
      'staff_invited',
      'schedule_ready',
      'students_invited',
      'activated',
      'live',
      'stalled'
    )
  ),
  percent_complete int not null default 0 check (percent_complete between 0 and 100),
  recommended_next_action text,
  stalled_at timestamptz,
  activated_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists academy_onboarding_status_idx
  on public.academy_onboarding (status);

create index if not exists academy_onboarding_percent_idx
  on public.academy_onboarding (percent_complete);

create index if not exists academy_onboarding_created_idx
  on public.academy_onboarding (created_at desc);

alter table public.academy_onboarding enable row level security;

-- ---------------------------------------------------------------------------
-- 7) academy_onboarding_milestones
-- ---------------------------------------------------------------------------
create table if not exists public.academy_onboarding_milestones (
  id uuid primary key default gen_random_uuid(),
  academy_id text not null references public.academies (id) on delete cascade,
  milestone_key text not null,
  label text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (academy_id, milestone_key)
);

create index if not exists academy_onboarding_milestones_academy_idx
  on public.academy_onboarding_milestones (academy_id, completed);

alter table public.academy_onboarding_milestones enable row level security;

-- ---------------------------------------------------------------------------
-- 8) media_assets (before branding FKs are optional; created early for reuse)
-- ---------------------------------------------------------------------------
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  academy_id text references public.academies (id) on delete set null,
  location_id text references public.locations (id) on delete set null,
  uploaded_by uuid references auth.users (id) on delete set null,
  storage_path text not null,
  media_type text not null check (
    media_type in (
      'academy_logo',
      'academy_icon',
      'academy_mobile_hero',
      'academy_desktop_hero',
      'location_photo',
      'coach_profile',
      'event_image',
      'curriculum_media',
      'other'
    )
  ),
  mime_type text,
  file_size int,
  width int,
  height int,
  status text not null default 'active' check (
    status in ('active', 'archived', 'deleted')
  ),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists media_assets_academy_idx
  on public.media_assets (academy_id, created_at desc);

create index if not exists media_assets_location_idx
  on public.media_assets (location_id);

create index if not exists media_assets_status_idx
  on public.media_assets (status);

create index if not exists media_assets_type_idx
  on public.media_assets (media_type);

alter table public.media_assets enable row level security;

-- ---------------------------------------------------------------------------
-- 9) academy_branding
-- ---------------------------------------------------------------------------
create table if not exists public.academy_branding (
  academy_id text primary key references public.academies (id) on delete cascade,
  workflow_status text not null default 'draft' check (
    workflow_status in ('draft', 'preview', 'published')
  ),
  display_name text,
  location_display_text text,
  primary_color text,
  secondary_color text,
  accent_color text,
  logo_asset_id uuid references public.media_assets (id) on delete set null,
  icon_asset_id uuid references public.media_assets (id) on delete set null,
  mobile_hero_asset_id uuid references public.media_assets (id) on delete set null,
  desktop_hero_asset_id uuid references public.media_assets (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists academy_branding_workflow_idx
  on public.academy_branding (workflow_status);

alter table public.academy_branding enable row level security;

-- ---------------------------------------------------------------------------
-- 10) platform_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.platform_audit_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  actor_user_id uuid,
  actor_platform_role text,
  organization_id text,
  academy_id text,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists platform_audit_logs_created_idx
  on public.platform_audit_logs (created_at desc);

create index if not exists platform_audit_logs_academy_idx
  on public.platform_audit_logs (academy_id, created_at desc);

create index if not exists platform_audit_logs_organization_idx
  on public.platform_audit_logs (organization_id, created_at desc);

create index if not exists platform_audit_logs_actor_idx
  on public.platform_audit_logs (actor_user_id, created_at desc);

create index if not exists platform_audit_logs_action_idx
  on public.platform_audit_logs (action);

alter table public.platform_audit_logs enable row level security;

-- ---------------------------------------------------------------------------
-- 11) academy_support_cases
-- ---------------------------------------------------------------------------
create table if not exists public.academy_support_cases (
  id uuid primary key default gen_random_uuid(),
  academy_id text not null references public.academies (id) on delete cascade,
  status text not null default 'open' check (
    status in ('open', 'pending', 'resolved', 'closed')
  ),
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'urgent')
  ),
  subject text not null,
  assigned_platform_admin uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists academy_support_cases_academy_idx
  on public.academy_support_cases (academy_id, created_at desc);

create index if not exists academy_support_cases_status_idx
  on public.academy_support_cases (status);

create index if not exists academy_support_cases_priority_idx
  on public.academy_support_cases (priority);

create index if not exists academy_support_cases_assigned_idx
  on public.academy_support_cases (assigned_platform_admin);

alter table public.academy_support_cases enable row level security;

-- ---------------------------------------------------------------------------
-- 12) academy_support_notes
-- ---------------------------------------------------------------------------
create table if not exists public.academy_support_notes (
  id uuid primary key default gen_random_uuid(),
  academy_id text not null references public.academies (id) on delete cascade,
  case_id uuid references public.academy_support_cases (id) on delete cascade,
  author_user_id uuid references auth.users (id) on delete set null,
  body text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists academy_support_notes_academy_idx
  on public.academy_support_notes (academy_id, created_at desc);

create index if not exists academy_support_notes_case_idx
  on public.academy_support_notes (case_id, created_at desc);

alter table public.academy_support_notes enable row level security;

-- ---------------------------------------------------------------------------
-- 13) platform_notifications
-- ---------------------------------------------------------------------------
create table if not exists public.platform_notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  severity text not null default 'info' check (
    severity in ('info', 'warning', 'critical')
  ),
  academy_id text,
  organization_id text,
  is_read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists platform_notifications_created_idx
  on public.platform_notifications (created_at desc);

create index if not exists platform_notifications_academy_idx
  on public.platform_notifications (academy_id, created_at desc);

create index if not exists platform_notifications_organization_idx
  on public.platform_notifications (organization_id, created_at desc);

create index if not exists platform_notifications_unread_idx
  on public.platform_notifications (is_read, created_at desc);

alter table public.platform_notifications enable row level security;

-- ---------------------------------------------------------------------------
-- RLS policies — platform admins via is_platform_admin()
-- ---------------------------------------------------------------------------
drop policy if exists "Platform admins can read platform plans" on public.platform_plans;
create policy "Platform admins can read platform plans"
  on public.platform_plans for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write platform plans" on public.platform_plans;
create policy "Platform admins can write platform plans"
  on public.platform_plans for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read academy subscriptions" on public.academy_subscriptions;
create policy "Platform admins can read academy subscriptions"
  on public.academy_subscriptions for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write academy subscriptions" on public.academy_subscriptions;
create policy "Platform admins can write academy subscriptions"
  on public.academy_subscriptions for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read platform features" on public.platform_features;
create policy "Platform admins can read platform features"
  on public.platform_features for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write platform features" on public.platform_features;
create policy "Platform admins can write platform features"
  on public.platform_features for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read plan feature defaults" on public.plan_feature_defaults;
create policy "Platform admins can read plan feature defaults"
  on public.plan_feature_defaults for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write plan feature defaults" on public.plan_feature_defaults;
create policy "Platform admins can write plan feature defaults"
  on public.plan_feature_defaults for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read academy feature overrides" on public.academy_feature_overrides;
create policy "Platform admins can read academy feature overrides"
  on public.academy_feature_overrides for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write academy feature overrides" on public.academy_feature_overrides;
create policy "Platform admins can write academy feature overrides"
  on public.academy_feature_overrides for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read academy onboarding" on public.academy_onboarding;
create policy "Platform admins can read academy onboarding"
  on public.academy_onboarding for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write academy onboarding" on public.academy_onboarding;
create policy "Platform admins can write academy onboarding"
  on public.academy_onboarding for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read onboarding milestones" on public.academy_onboarding_milestones;
create policy "Platform admins can read onboarding milestones"
  on public.academy_onboarding_milestones for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write onboarding milestones" on public.academy_onboarding_milestones;
create policy "Platform admins can write onboarding milestones"
  on public.academy_onboarding_milestones for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read media assets" on public.media_assets;
create policy "Platform admins can read media assets"
  on public.media_assets for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write media assets" on public.media_assets;
create policy "Platform admins can write media assets"
  on public.media_assets for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read academy branding" on public.academy_branding;
create policy "Platform admins can read academy branding"
  on public.academy_branding for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write academy branding" on public.academy_branding;
create policy "Platform admins can write academy branding"
  on public.academy_branding for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read platform audit logs" on public.platform_audit_logs;
create policy "Platform admins can read platform audit logs"
  on public.platform_audit_logs for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write platform audit logs" on public.platform_audit_logs;
create policy "Platform admins can write platform audit logs"
  on public.platform_audit_logs for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read support cases" on public.academy_support_cases;
create policy "Platform admins can read support cases"
  on public.academy_support_cases for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write support cases" on public.academy_support_cases;
create policy "Platform admins can write support cases"
  on public.academy_support_cases for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read support notes" on public.academy_support_notes;
create policy "Platform admins can read support notes"
  on public.academy_support_notes for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write support notes" on public.academy_support_notes;
create policy "Platform admins can write support notes"
  on public.academy_support_notes for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read platform notifications" on public.platform_notifications;
create policy "Platform admins can read platform notifications"
  on public.platform_notifications for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write platform notifications" on public.platform_notifications;
create policy "Platform admins can write platform notifications"
  on public.platform_notifications for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- ---------------------------------------------------------------------------
-- Table privileges
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on table
  public.platform_plans,
  public.academy_subscriptions,
  public.platform_features,
  public.plan_feature_defaults,
  public.academy_feature_overrides,
  public.academy_onboarding,
  public.academy_onboarding_milestones,
  public.media_assets,
  public.academy_branding,
  public.platform_audit_logs,
  public.academy_support_cases,
  public.academy_support_notes,
  public.platform_notifications
to authenticated;

grant select, insert, update, delete on table
  public.platform_plans,
  public.academy_subscriptions,
  public.platform_features,
  public.plan_feature_defaults,
  public.academy_feature_overrides,
  public.academy_onboarding,
  public.academy_onboarding_milestones,
  public.media_assets,
  public.academy_branding,
  public.platform_audit_logs,
  public.academy_support_cases,
  public.academy_support_notes,
  public.platform_notifications
to service_role;

-- ---------------------------------------------------------------------------
-- Helpers: recalculate_onboarding_percent
-- ---------------------------------------------------------------------------
create or replace function public.recalculate_onboarding_percent(p_academy_id text)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total int;
  v_done int;
  v_percent int;
  v_next text;
begin
  select count(*)::int,
         count(*) filter (where completed)::int
    into v_total, v_done
  from public.academy_onboarding_milestones
  where academy_id = p_academy_id;

  if v_total is null or v_total = 0 then
    v_percent := 0;
  else
    v_percent := least(100, greatest(0, round((v_done::numeric / v_total::numeric) * 100.0)::int));
  end if;

  select m.label
    into v_next
  from public.academy_onboarding_milestones m
  where m.academy_id = p_academy_id
    and m.completed = false
  order by m.milestone_key
  limit 1;

  update public.academy_onboarding
  set percent_complete = v_percent,
      recommended_next_action = coalesce(v_next, 'All milestones complete'),
      updated_at = timezone('utc', now())
  where academy_id = p_academy_id;

  return v_percent;
end;
$$;

revoke all on function public.recalculate_onboarding_percent(text) from public;
grant execute on function public.recalculate_onboarding_percent(text) to authenticated;
grant execute on function public.recalculate_onboarding_percent(text) to service_role;

-- ---------------------------------------------------------------------------
-- Helpers: provision_academy
-- Creates org (optional), academy, location, owner membership, subscription,
-- onboarding + milestones, branding draft, and a platform audit log entry.
-- ---------------------------------------------------------------------------
create or replace function public.provision_academy(
  p_create_org boolean,
  p_organization_id text,
  p_organization_name text,
  p_organization_slug text,
  p_academy_id text,
  p_academy_name text,
  p_academy_slug text,
  p_location_id text,
  p_location_name text,
  p_address_line_1 text,
  p_city text,
  p_state text,
  p_postal_code text,
  p_country text,
  p_timezone text,
  p_owner_user_id uuid,
  p_plan_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id text;
  v_academy_id text;
  v_location_id text;
  v_plan_id text;
  v_subscription_id uuid;
  v_billing_interval text;
  v_now timestamptz := timezone('utc', now());
  v_trial_ends timestamptz;
  v_percent int;
  v_actor_role text;
begin
  if not public.is_platform_admin() then
    raise exception 'not authorized: platform admin required'
      using errcode = '42501';
  end if;

  if p_academy_id is null or length(trim(p_academy_id)) = 0 then
    raise exception 'p_academy_id is required';
  end if;
  if p_academy_name is null or length(trim(p_academy_name)) = 0 then
    raise exception 'p_academy_name is required';
  end if;
  if p_location_id is null or length(trim(p_location_id)) = 0 then
    raise exception 'p_location_id is required';
  end if;
  if p_location_name is null or length(trim(p_location_name)) = 0 then
    raise exception 'p_location_name is required';
  end if;

  v_academy_id := trim(p_academy_id);
  v_location_id := trim(p_location_id);
  v_plan_id := coalesce(nullif(trim(p_plan_id), ''), 'trial');
  v_trial_ends := v_now + interval '14 days';

  if not exists (select 1 from public.platform_plans where id = v_plan_id and is_active) then
    raise exception 'unknown or inactive plan_id: %', v_plan_id;
  end if;

  select billing_interval into v_billing_interval
  from public.platform_plans
  where id = v_plan_id;

  select public.platform_admin_role() into v_actor_role;

  -- Organization
  if coalesce(p_create_org, false) then
    if p_organization_id is null or length(trim(p_organization_id)) = 0 then
      raise exception 'p_organization_id is required when p_create_org is true';
    end if;
    if p_organization_name is null or length(trim(p_organization_name)) = 0 then
      raise exception 'p_organization_name is required when p_create_org is true';
    end if;
    if p_organization_slug is null or length(trim(p_organization_slug)) = 0 then
      raise exception 'p_organization_slug is required when p_create_org is true';
    end if;

    v_org_id := trim(p_organization_id);

    insert into public.organizations (id, name, slug, status, created_at, updated_at)
    values (v_org_id, trim(p_organization_name), trim(p_organization_slug), 'active', v_now, v_now)
    on conflict (id) do update
      set name = excluded.name,
          slug = excluded.slug,
          status = 'active',
          updated_at = v_now;
  else
    if p_organization_id is null or length(trim(p_organization_id)) = 0 then
      raise exception 'p_organization_id is required when p_create_org is false';
    end if;
    v_org_id := trim(p_organization_id);
    if not exists (select 1 from public.organizations where id = v_org_id) then
      raise exception 'organization not found: %', v_org_id;
    end if;
  end if;

  -- Academy
  insert into public.academies (
    id, name, organization_id, slug, status, created_at, updated_at
  )
  values (
    v_academy_id,
    trim(p_academy_name),
    v_org_id,
    nullif(trim(coalesce(p_academy_slug, '')), ''),
    'active',
    v_now,
    v_now
  )
  on conflict (id) do update
    set name = excluded.name,
        organization_id = excluded.organization_id,
        slug = coalesce(excluded.slug, public.academies.slug),
        status = 'active',
        updated_at = v_now;

  -- Location
  insert into public.locations (
    id,
    academy_id,
    name,
    address_line_1,
    city,
    state,
    postal_code,
    country,
    timezone,
    is_active,
    created_at,
    updated_at
  )
  values (
    v_location_id,
    v_academy_id,
    trim(p_location_name),
    nullif(trim(coalesce(p_address_line_1, '')), ''),
    nullif(trim(coalesce(p_city, '')), ''),
    nullif(trim(coalesce(p_state, '')), ''),
    nullif(trim(coalesce(p_postal_code, '')), ''),
    coalesce(nullif(trim(coalesce(p_country, '')), ''), 'United States'),
    coalesce(nullif(trim(coalesce(p_timezone, '')), ''), 'America/Los_Angeles'),
    true,
    v_now,
    v_now
  )
  on conflict (id) do update
    set academy_id = excluded.academy_id,
        name = excluded.name,
        address_line_1 = excluded.address_line_1,
        city = excluded.city,
        state = excluded.state,
        postal_code = excluded.postal_code,
        country = excluded.country,
        timezone = excluded.timezone,
        is_active = true,
        updated_at = v_now;

  update public.academies
  set primary_location_id = v_location_id,
      updated_at = v_now
  where id = v_academy_id
    and (primary_location_id is null or primary_location_id = v_location_id);

  -- Owner membership (optional)
  if p_owner_user_id is not null then
    insert into public.academy_memberships (academy_id, user_id, role, created_at)
    values (v_academy_id, p_owner_user_id, 'owner', v_now)
    on conflict (academy_id, user_id) do update
      set role = 'owner';
  end if;

  -- Subscription (one per academy)
  insert into public.academy_subscriptions (
    academy_id,
    plan_id,
    status,
    billing_interval,
    trial_starts_at,
    trial_ends_at,
    starts_at,
    mrr_cents,
    created_at,
    updated_at
  )
  values (
    v_academy_id,
    v_plan_id,
    case when v_plan_id = 'trial' then 'trial' else 'active' end,
    v_billing_interval,
    case when v_plan_id = 'trial' then v_now else null end,
    case when v_plan_id = 'trial' then v_trial_ends else null end,
    case when v_plan_id = 'trial' then null else v_now end,
    null,
    v_now,
    v_now
  )
  on conflict (academy_id) do update
    set plan_id = excluded.plan_id,
        status = excluded.status,
        billing_interval = excluded.billing_interval,
        trial_starts_at = excluded.trial_starts_at,
        trial_ends_at = excluded.trial_ends_at,
        starts_at = excluded.starts_at,
        updated_at = v_now
  returning id into v_subscription_id;

  if v_subscription_id is null then
    select id into v_subscription_id
    from public.academy_subscriptions
    where academy_id = v_academy_id;
  end if;

  -- Onboarding row
  insert into public.academy_onboarding (
    academy_id,
    status,
    percent_complete,
    recommended_next_action,
    created_at,
    updated_at
  )
  values (
    v_academy_id,
    case when p_owner_user_id is not null then 'account_created' else 'invited' end,
    0,
    'Complete academy branding',
    v_now,
    v_now
  )
  on conflict (academy_id) do update
    set status = excluded.status,
        updated_at = v_now;

  -- Default milestones
  insert into public.academy_onboarding_milestones (
    academy_id, milestone_key, label, completed, completed_at
  )
  values
    (v_academy_id, 'academy_created', 'Academy created', true, v_now),
    (v_academy_id, 'location_configured', 'Primary location configured', true, v_now),
    (
      v_academy_id,
      'owner_assigned',
      'Owner assigned',
      (p_owner_user_id is not null),
      case when p_owner_user_id is not null then v_now else null end
    ),
    (v_academy_id, 'branding_published', 'Branding published', false, null),
    (v_academy_id, 'staff_invited', 'Staff invited', false, null),
    (v_academy_id, 'schedule_ready', 'Schedule ready', false, null),
    (v_academy_id, 'students_invited', 'Students invited', false, null),
    (v_academy_id, 'go_live', 'Academy live', false, null)
  on conflict (academy_id, milestone_key) do update
    set label = excluded.label,
        completed = excluded.completed,
        completed_at = excluded.completed_at;

  v_percent := public.recalculate_onboarding_percent(v_academy_id);

  update public.academy_onboarding
  set status = case
        when v_percent >= 100 then 'live'
        when p_owner_user_id is not null then 'branding_incomplete'
        else 'invited'
      end,
      updated_at = v_now
  where academy_id = v_academy_id;

  -- Branding draft
  insert into public.academy_branding (
    academy_id,
    workflow_status,
    display_name,
    location_display_text,
    created_at,
    updated_at
  )
  values (
    v_academy_id,
    'draft',
    trim(p_academy_name),
    trim(p_location_name),
    v_now,
    v_now
  )
  on conflict (academy_id) do update
    set display_name = coalesce(public.academy_branding.display_name, excluded.display_name),
        location_display_text = coalesce(public.academy_branding.location_display_text, excluded.location_display_text),
        updated_at = v_now;

  -- Audit log
  insert into public.platform_audit_logs (
    created_at,
    actor_user_id,
    actor_platform_role,
    organization_id,
    academy_id,
    action,
    target_type,
    target_id,
    metadata
  )
  values (
    v_now,
    auth.uid(),
    v_actor_role,
    v_org_id,
    v_academy_id,
    'provision_academy',
    'academy',
    v_academy_id,
    jsonb_build_object(
      'organization_id', v_org_id,
      'location_id', v_location_id,
      'plan_id', v_plan_id,
      'subscription_id', v_subscription_id,
      'owner_user_id', p_owner_user_id,
      'create_org', coalesce(p_create_org, false)
    )
  );

  return jsonb_build_object(
    'organization_id', v_org_id,
    'academy_id', v_academy_id,
    'location_id', v_location_id,
    'plan_id', v_plan_id,
    'subscription_id', v_subscription_id,
    'owner_user_id', p_owner_user_id,
    'onboarding_percent', v_percent
  );
end;
$$;

revoke all on function public.provision_academy(
  boolean, text, text, text, text, text, text, text, text, text, text, text, text, text, text, uuid, text
) from public;
grant execute on function public.provision_academy(
  boolean, text, text, text, text, text, text, text, text, text, text, text, text, text, text, uuid, text
) to authenticated;
grant execute on function public.provision_academy(
  boolean, text, text, text, text, text, text, text, text, text, text, text, text, text, text, uuid, text
) to service_role;

comment on function public.recalculate_onboarding_percent(text) is
  'Recompute academy_onboarding.percent_complete from milestones; returns percent.';
comment on function public.provision_academy(
  boolean, text, text, text, text, text, text, text, text, text, text, text, text, text, text, uuid, text
) is
  'Platform-admin gated academy provisioning RPC for My Gi Command Center.';

comment on table public.platform_plans is 'My Gi Command Center commercial plans.';
comment on table public.academy_subscriptions is 'Per-academy plan subscription. mrr_cents only when real billing exists.';
comment on table public.platform_features is 'Global feature catalog for plan entitlements.';
comment on table public.platform_audit_logs is 'Command Center audit trail (distinct from coach audit_logs).';
comment on table public.media_assets is 'Metadata for academy branding and media stored in Storage buckets.';

-- ---------------------------------------------------------------------------
-- Storage buckets (private). Academy self-service policies come later.
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public)
    values
      ('academy-branding', 'academy-branding', false),
      ('academy-media', 'academy-media', false)
    on conflict (id) do update
      set name = excluded.name,
          public = excluded.public;
  end if;
end $$;

-- Platform admin full access on branding/media buckets (v1).
-- Academy member path-scoped read/write intentionally deferred.
do $$
begin
  if to_regclass('storage.objects') is not null then
    execute 'drop policy if exists "Platform admins manage academy-branding" on storage.objects';
    execute $policy$
      create policy "Platform admins manage academy-branding"
        on storage.objects for all to authenticated
        using (bucket_id = 'academy-branding' and public.is_platform_admin())
        with check (bucket_id = 'academy-branding' and public.is_platform_admin())
    $policy$;

    execute 'drop policy if exists "Platform admins manage academy-media" on storage.objects';
    execute $policy$
      create policy "Platform admins manage academy-media"
        on storage.objects for all to authenticated
        using (bucket_id = 'academy-media' and public.is_platform_admin())
        with check (bucket_id = 'academy-media' and public.is_platform_admin())
    $policy$;
  end if;
end $$;

-- v1 note: academy coach/member storage self-service (folder path membership checks)
-- is intentionally omitted; add later with can_coach_at_academy / is_academy_member.
