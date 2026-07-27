-- Open Mat Coach Phase 2 schema
-- Techniques, challenges, achievements, events, media, notification drafts.
-- Journey XP remains system-owned (no coach write path).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Techniques
-- ---------------------------------------------------------------------------
create table if not exists public.techniques (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  difficulty text not null check (
    difficulty in ('beginner', 'intermediate', 'advanced', 'competition')
  ),
  position text not null check (
    position in (
      'guard', 'mount', 'side_control', 'back', 'standing', 'turtle',
      'knee_on_belly', 'other'
    )
  ),
  tags text[] not null default '{}',
  common_mistakes text[] not null default '{}',
  video_uri text,
  image_uris text[] not null default '{}',
  is_favorite boolean not null default false,
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  academy_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists techniques_academy_idx on public.techniques (academy_id, updated_at desc);

alter table public.techniques enable row level security;

create policy "Authenticated users can read techniques"
  on public.techniques for select to authenticated using (true);

create policy "Coaches can manage techniques"
  on public.techniques for all to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

-- ---------------------------------------------------------------------------
-- Challenges
-- ---------------------------------------------------------------------------
create table if not exists public.coach_challenges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  kind text not null check (
    kind in ('attendance', 'competition', 'open_mat', 'kids', 'womens', 'custom')
  ),
  period text not null check (period in ('weekly', 'monthly')),
  xp_reward integer not null check (xp_reward >= 0),
  badge_id text,
  badge_name text,
  start_date date not null,
  end_date date not null,
  eligible_member_ids uuid[],
  eligible_all boolean not null default true,
  participant_count integer not null default 0,
  completion_count integer not null default 0,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'completed', 'archived')
  ),
  academy_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.coach_challenges enable row level security;

create policy "Authenticated users can read challenges"
  on public.coach_challenges for select to authenticated using (true);

create policy "Coaches can manage challenges"
  on public.coach_challenges for all to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

-- ---------------------------------------------------------------------------
-- Achievements / badges
-- ---------------------------------------------------------------------------
create table if not exists public.coach_achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (
    category in ('attendance', 'competition', 'academy', 'special')
  ),
  rarity text not null check (
    rarity in ('common', 'rare', 'elite', 'legendary')
  ),
  icon text not null,
  tint text not null,
  xp_reward integer not null default 0,
  requirement_label text not null,
  awarded_count integer not null default 0,
  is_active boolean not null default true,
  academy_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.coach_achievements enable row level security;

create policy "Authenticated users can read achievements"
  on public.coach_achievements for select to authenticated using (true);

create policy "Coaches can manage achievements"
  on public.coach_achievements for all to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

-- ---------------------------------------------------------------------------
-- Events + RSVP
-- ---------------------------------------------------------------------------
create table if not exists public.coach_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  type text not null check (
    type in (
      'seminar', 'competition', 'holiday_closure', 'promotion',
      'academy_bbq', 'open_mat', 'other'
    )
  ),
  status text not null default 'draft' check (
    status in ('draft', 'published', 'cancelled', 'completed')
  ),
  location text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  capacity integer,
  rsvp_count integer not null default 0,
  waitlist_count integer not null default 0,
  allow_rsvp boolean not null default true,
  academy_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.coach_events (id) on delete cascade,
  member_id uuid not null references auth.users (id) on delete cascade,
  member_name text not null,
  status text not null check (status in ('going', 'waitlist', 'declined')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (event_id, member_id)
);

alter table public.coach_events enable row level security;
alter table public.event_rsvps enable row level security;

create policy "Authenticated users can read events"
  on public.coach_events for select to authenticated using (true);

create policy "Coaches can manage events"
  on public.coach_events for all to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

create policy "Users can read own RSVPs or coaches all"
  on public.event_rsvps for select to authenticated
  using (member_id = auth.uid() or public.is_coach_role());

create policy "Users can upsert own RSVPs"
  on public.event_rsvps for insert to authenticated
  with check (member_id = auth.uid());

create policy "Users can update own RSVPs"
  on public.event_rsvps for update to authenticated
  using (member_id = auth.uid())
  with check (member_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Media library
-- ---------------------------------------------------------------------------
create table if not exists public.media_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  cover_uri text,
  item_count integer not null default 0,
  class_id uuid,
  event_id uuid references public.coach_events (id) on delete set null,
  academy_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references public.media_albums (id) on delete set null,
  kind text not null check (kind in ('photo', 'video')),
  title text not null,
  uri text not null,
  thumbnail_uri text,
  class_id uuid,
  event_id uuid references public.coach_events (id) on delete set null,
  tags text[] not null default '{}',
  member_share_enabled boolean not null default false,
  uploaded_by text not null,
  academy_id text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.media_albums enable row level security;
alter table public.media_items enable row level security;

create policy "Authenticated users can read media albums"
  on public.media_albums for select to authenticated using (true);

create policy "Coaches can manage media albums"
  on public.media_albums for all to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

create policy "Authenticated users can read media items"
  on public.media_items for select to authenticated using (true);

create policy "Coaches can manage media items"
  on public.media_items for all to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

-- ---------------------------------------------------------------------------
-- Notification drafts (no delivery backend in Phase 2)
-- ---------------------------------------------------------------------------
create table if not exists public.notification_drafts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (
    kind in (
      'announcement', 'challenge_reminder', 'event_reminder',
      'technique_of_the_week', 'competition_reminder'
    )
  ),
  title text not null,
  body text not null,
  audience text not null check (
    audience in ('all', 'adults', 'kids', 'competitors', 'coaches')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'scheduled', 'sent_simulated')
  ),
  scheduled_at timestamptz,
  related_entity_id text,
  author_id uuid references auth.users (id) on delete set null,
  academy_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.notification_drafts enable row level security;

create policy "Coaches can manage notification drafts"
  on public.notification_drafts for all to authenticated
  using (public.is_coach_role())
  with check (public.is_coach_role());

-- Note: member journey XP tables are intentionally omitted as coach-writable.
-- Journey remains trustworthy and system-owned.
