-- My Gi Coach — Member Development schema
-- Official academy progression records (belt, stripes, competition, roles).
-- Journey XP is intentionally separate and NEVER drives promotions.
-- Coach notes remain private (coach/manager/owner only).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Role helpers (extend Phase 1 coach gate)
-- ---------------------------------------------------------------------------
create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(auth.jwt() -> 'user_metadata' ->> 'role', ''),
    nullif(auth.jwt() -> 'app_metadata' ->> 'role', ''),
    'member'
  );
$$;

-- Coaches, managers, owners (+ legacy admin/staff) may write development data.
create or replace function public.is_coach_role()
returns boolean
language sql
stable
as $$
  select public.current_user_role() in (
    'coach', 'manager', 'owner', 'admin', 'staff'
  );
$$;

create or replace function public.is_manager_role()
returns boolean
language sql
stable
as $$
  select public.current_user_role() in ('manager', 'owner', 'admin');
$$;

-- ---------------------------------------------------------------------------
-- member_development — current belt record (one row per member per academy)
-- ---------------------------------------------------------------------------
create table if not exists public.member_development (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users (id) on delete cascade,
  academy_id text not null,
  belt text not null check (belt in ('white', 'blue', 'purple', 'brown', 'black')),
  stripes smallint not null check (stripes between 0 and 4),
  promotion_date date,
  promoted_by_id uuid references auth.users (id) on delete set null,
  promoted_by_name text,
  time_at_belt_started_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (member_id, academy_id)
);

create index if not exists member_development_academy_idx
  on public.member_development (academy_id, belt, stripes);

create index if not exists member_development_member_idx
  on public.member_development (member_id);

alter table public.member_development enable row level security;

create policy "Members can read own development"
  on public.member_development for select to authenticated
  using (member_id = auth.uid() or public.is_coach_role());

create policy "Coaches can insert development"
  on public.member_development for insert to authenticated
  with check (public.is_coach_role());

create policy "Coaches can update development"
  on public.member_development for update to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

create policy "Managers can delete development"
  on public.member_development for delete to authenticated
  using (public.is_manager_role());

-- ---------------------------------------------------------------------------
-- promotion_history — chronological official record (newest first in app)
-- ---------------------------------------------------------------------------
create table if not exists public.promotion_history (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('stripe', 'belt')),
  belt text not null check (belt in ('white', 'blue', 'purple', 'brown', 'black')),
  stripe smallint not null check (stripe between 0 and 4),
  date date not null,
  coach_id uuid not null references auth.users (id) on delete restrict,
  coach_name text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists promotion_history_member_date_idx
  on public.promotion_history (member_id, date desc, created_at desc);

create index if not exists promotion_history_coach_idx
  on public.promotion_history (coach_id);

alter table public.promotion_history enable row level security;

create policy "Members can read own promotion history"
  on public.promotion_history for select to authenticated
  using (member_id = auth.uid() or public.is_coach_role());

create policy "Coaches can insert promotion history"
  on public.promotion_history for insert to authenticated
  with check (public.is_coach_role() and coach_id = auth.uid());

create policy "Managers can update promotion history"
  on public.promotion_history for update to authenticated
  using (public.is_manager_role())
  with check (public.is_manager_role());

create policy "Managers can delete promotion history"
  on public.promotion_history for delete to authenticated
  using (public.is_manager_role());

-- ---------------------------------------------------------------------------
-- competition_profiles — separate from belt rank
-- ---------------------------------------------------------------------------
create table if not exists public.competition_profiles (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users (id) on delete cascade,
  preferred_rule_set text not null check (
    preferred_rule_set in ('ibjjf', 'jjwl', 'naga', 'grappling_industries')
  ),
  division text not null check (division in ('adult', 'masters', 'juvenile')),
  weight_class text not null default '',
  preferred_weight_kg numeric(5, 2),
  team_status text not null default 'inactive' check (
    team_status in ('active', 'inactive')
  ),
  experience text not null default 'beginner' check (
    experience in ('beginner', 'intermediate', 'advanced')
  ),
  eligibility_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (member_id)
);

create index if not exists competition_profiles_team_idx
  on public.competition_profiles (team_status, experience);

alter table public.competition_profiles enable row level security;

create policy "Members can read own competition profile"
  on public.competition_profiles for select to authenticated
  using (member_id = auth.uid() or public.is_coach_role());

create policy "Coaches can manage competition profiles"
  on public.competition_profiles for all to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

-- ---------------------------------------------------------------------------
-- academy_roles — multi-select academy leadership / volunteer roles
-- ---------------------------------------------------------------------------
create table if not exists public.academy_roles (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (
    role in (
      'assistant_coach',
      'kids_coach',
      'competition_team',
      'academy_ambassador',
      'volunteer',
      'front_desk'
    )
  ),
  assigned_at timestamptz not null default timezone('utc', now()),
  assigned_by_id uuid not null references auth.users (id) on delete restrict,
  assigned_by_name text not null,
  unique (member_id, role)
);

create index if not exists academy_roles_member_idx
  on public.academy_roles (member_id);

create index if not exists academy_roles_role_idx
  on public.academy_roles (role);

alter table public.academy_roles enable row level security;

create policy "Members can read own academy roles"
  on public.academy_roles for select to authenticated
  using (member_id = auth.uid() or public.is_coach_role());

create policy "Coaches can manage academy roles"
  on public.academy_roles for all to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

-- ---------------------------------------------------------------------------
-- coach_notes search support (table already exists from Phase 1)
-- Private forever — members must never SELECT these rows.
-- ---------------------------------------------------------------------------
do $$
begin
  create extension if not exists pg_trgm;
exception
  when others then
    null;
end $$;

do $$
begin
  create index if not exists coach_notes_body_trgm_idx
    on public.coach_notes using gin (body gin_trgm_ops);
exception
  when others then
    null;
end $$;

create index if not exists coach_notes_body_lower_idx
  on public.coach_notes (member_id, lower(body));

comment on table public.member_development is
  'Official academy belt record. Never auto-promoted from Journey XP.';
comment on table public.promotion_history is
  'Coach-authored promotion timeline. Members may read their own history.';
comment on table public.coach_notes is
  'Private coach notes. Never exposed to the Member app.';
