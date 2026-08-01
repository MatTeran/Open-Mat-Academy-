-- Open Mat Coach Phase 1 schema
-- Announcements, attendance, coach notes, and coach class management.
-- Designed to coexist with the Member app without changing member UX.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: role claim preparation for future RLS
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

create or replace function public.is_coach_role()
returns boolean
language sql
stable
as $$
  select public.current_user_role() in ('coach', 'admin', 'staff');
$$;

-- ---------------------------------------------------------------------------
-- Announcements
-- ---------------------------------------------------------------------------
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  category text not null check (
    category in ('general', 'schedule', 'competition', 'promotion', 'facility', 'urgent')
  ),
  audience text not null check (
    audience in ('all', 'adults', 'kids', 'competitors', 'coaches')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'scheduled', 'published', 'archived')
  ),
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  academy_id text not null,
  scheduled_at timestamptz,
  published_at timestamptz,
  push_enabled boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists announcements_academy_created_idx
  on public.announcements (academy_id, created_at desc);

create index if not exists announcements_status_idx
  on public.announcements (status);

alter table public.announcements enable row level security;

create policy "Published announcements are readable by authenticated users"
  on public.announcements
  for select
  to authenticated
  using (status = 'published' or author_id = auth.uid() or public.is_coach_role());

create policy "Coaches can insert announcements"
  on public.announcements
  for insert
  to authenticated
  with check (public.is_coach_role() and author_id = auth.uid());

create policy "Coaches can update announcements"
  on public.announcements
  for update
  to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

-- ---------------------------------------------------------------------------
-- Coach classes
-- ---------------------------------------------------------------------------
create table if not exists public.coach_classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date not null,
  start_time text not null,
  end_time text not null,
  instructor_id uuid not null references auth.users (id) on delete restrict,
  instructor_name text not null,
  gi_type text not null check (gi_type in ('gi', 'no_gi', 'gi_no_gi', 'none')),
  level text not null check (
    level in (
      'adult_bjj',
      'youth_bjj',
      'pee_wee_bjj',
      'womens_bjj',
      'boxing',
      'muay_thai',
      'wrestling',
      'peak_performance',
      'taekwondo',
      'open_mat',
      'seminar'
    )
  ),
  audience text not null check (audience in ('kids', 'adults', 'all')),
  capacity integer not null check (capacity > 0),
  reserved_count integer not null default 0,
  checked_in_count integer not null default 0,
  waitlist_count integer not null default 0,
  first_time_visitor_count integer not null default 0,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'cancelled')
  ),
  is_open_mat boolean not null default false,
  is_seminar boolean not null default false,
  recurrence text not null default 'none' check (
    recurrence in ('none', 'daily', 'weekly', 'biweekly')
  ),
  academy_id text not null,
  cancelled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists coach_classes_date_idx
  on public.coach_classes (date, start_time);

create index if not exists coach_classes_academy_idx
  on public.coach_classes (academy_id);

alter table public.coach_classes enable row level security;

create policy "Authenticated users can read classes"
  on public.coach_classes
  for select
  to authenticated
  using (true);

create policy "Coaches can manage classes"
  on public.coach_classes
  for all
  to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

-- ---------------------------------------------------------------------------
-- Attendance
-- ---------------------------------------------------------------------------
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.coach_classes (id) on delete cascade,
  member_id uuid references auth.users (id) on delete set null,
  member_name text not null,
  member_email text,
  status text not null check (
    status in ('present', 'absent', 'late', 'visitor', 'walk_in', 'reserved', 'waitlist')
  ),
  checked_in_at timestamptz,
  notes text,
  is_first_visit boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists attendance_class_idx
  on public.attendance (class_id, created_at);

create index if not exists attendance_member_idx
  on public.attendance (member_id);

alter table public.attendance enable row level security;

create policy "Coaches can read attendance"
  on public.attendance
  for select
  to authenticated
  using (public.is_coach_role() or member_id = auth.uid());

create policy "Coaches can write attendance"
  on public.attendance
  for all
  to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

-- ---------------------------------------------------------------------------
-- Private coach notes (never exposed to Member app queries by default)
-- ---------------------------------------------------------------------------
create table if not exists public.coach_notes (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  body text not null,
  is_private boolean not null default true check (is_private = true),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists coach_notes_member_idx
  on public.coach_notes (member_id, created_at desc);

alter table public.coach_notes enable row level security;

create policy "Only coaches can read private notes"
  on public.coach_notes
  for select
  to authenticated
  using (public.is_coach_role());

create policy "Only coaches can write private notes"
  on public.coach_notes
  for all
  to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role() and author_id = auth.uid());
