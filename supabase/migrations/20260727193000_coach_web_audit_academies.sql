-- Open Mat Coach Web — audit logging + academy tenant helpers
-- Additive only. Does not duplicate member_development / promotion_history.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Academies (minimal tenant model if not already present)
-- ---------------------------------------------------------------------------
create table if not exists public.academies (
  id text primary key,
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.academy_memberships (
  id uuid primary key default gen_random_uuid(),
  academy_id text not null references public.academies (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (
    role in ('member', 'coach', 'manager', 'owner', 'admin', 'staff')
  ),
  created_at timestamptz not null default timezone('utc', now()),
  unique (academy_id, user_id)
);

create index if not exists academy_memberships_user_idx
  on public.academy_memberships (user_id);

alter table public.academies enable row level security;
alter table public.academy_memberships enable row level security;

create policy "Users can read academies they belong to"
  on public.academies for select to authenticated
  using (
    exists (
      select 1 from public.academy_memberships m
      where m.academy_id = academies.id and m.user_id = auth.uid()
    )
  );

create policy "Users can read own academy memberships"
  on public.academy_memberships for select to authenticated
  using (user_id = auth.uid() or public.is_manager_role());

-- ---------------------------------------------------------------------------
-- Audit logs — append-oriented for high-impact coach actions
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  academy_id text not null,
  actor_id uuid not null references auth.users (id) on delete restrict,
  actor_name text not null,
  action text not null check (
    action in (
      'belt_promotion',
      'stripe_promotion',
      'promotion_correction',
      'attendance_deletion',
      'class_cancellation',
      'member_role_change',
      'announcement_publish',
      'permission_change'
    )
  ),
  target_type text not null,
  target_id text not null,
  previous jsonb,
  next jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists audit_logs_academy_created_idx
  on public.audit_logs (academy_id, created_at desc);

create index if not exists audit_logs_actor_idx
  on public.audit_logs (actor_id, created_at desc);

create index if not exists audit_logs_target_idx
  on public.audit_logs (target_type, target_id);

alter table public.audit_logs enable row level security;

create policy "Coaches can read academy audit logs"
  on public.audit_logs for select to authenticated
  using (public.is_coach_role());

create policy "Coaches can insert audit logs"
  on public.audit_logs for insert to authenticated
  with check (public.is_coach_role() and actor_id = auth.uid());

-- No update/delete for normal coaches — corrections are manager-only append events.
create policy "Managers cannot rewrite audit history"
  on public.audit_logs for update to authenticated
  using (false);

create policy "Managers cannot delete audit history"
  on public.audit_logs for delete to authenticated
  using (false);

comment on table public.audit_logs is
  'Append-only high-impact action log for Coach Web and mobile.';
