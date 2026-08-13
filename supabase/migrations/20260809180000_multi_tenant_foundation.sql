-- Phase 2: My Gi multi-tenant foundation
-- Additive + backward compatible. Keeps academy-open-mat as the live academy id.
-- RLS becomes membership-scoped. JWT role helpers are no longer sufficient alone.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1) Organizations
-- ---------------------------------------------------------------------------
create table if not exists public.organizations (
  id text primary key,
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (
    status in ('active', 'suspended', 'archived')
  ),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.organizations enable row level security;

-- ---------------------------------------------------------------------------
-- 2) Academies: organization link + metadata (keep existing text ids)
-- ---------------------------------------------------------------------------
alter table public.academies
  add column if not exists organization_id text references public.organizations (id),
  add column if not exists slug text,
  add column if not exists status text not null default 'active',
  add column if not exists primary_location_id text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'academies_status_check'
  ) then
    alter table public.academies
      add constraint academies_status_check
      check (status in ('active', 'suspended', 'archived'));
  end if;
end $$;

create unique index if not exists academies_slug_uidx on public.academies (slug)
  where slug is not null;

create index if not exists academies_organization_idx
  on public.academies (organization_id);

-- ---------------------------------------------------------------------------
-- 3) Locations
-- ---------------------------------------------------------------------------
create table if not exists public.locations (
  id text primary key,
  academy_id text not null references public.academies (id) on delete cascade,
  name text not null,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  postal_code text,
  country text not null default 'United States',
  timezone text not null default 'America/Los_Angeles',
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists locations_academy_idx
  on public.locations (academy_id, is_active);

alter table public.locations enable row level security;

-- Deferred FK for academies.primary_location_id (locations must exist first)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'academies_primary_location_fk'
  ) then
    alter table public.academies
      add constraint academies_primary_location_fk
      foreign key (primary_location_id) references public.locations (id)
      on delete set null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 4) Backfill Open Mat organization / academy / Tracy location
-- ---------------------------------------------------------------------------
insert into public.organizations (id, name, slug, status)
values ('org-open-mat', 'Open Mat Academy', 'open-mat-academy', 'active')
on conflict (id) do update
  set name = excluded.name,
      slug = excluded.slug,
      status = excluded.status,
      updated_at = timezone('utc', now());

insert into public.academies (id, name, organization_id, slug, status)
values (
  'academy-open-mat',
  'Open Mat Academy',
  'org-open-mat',
  'open-mat-academy',
  'active'
)
on conflict (id) do update
  set name = excluded.name,
      organization_id = excluded.organization_id,
      slug = coalesce(public.academies.slug, excluded.slug),
      status = coalesce(public.academies.status, excluded.status),
      updated_at = timezone('utc', now());

-- Ensure any pre-existing academy rows without org get the Open Mat org only when id matches.
update public.academies
set organization_id = 'org-open-mat',
    slug = coalesce(slug, 'open-mat-academy'),
    updated_at = timezone('utc', now())
where id = 'academy-open-mat' and organization_id is null;

insert into public.locations (
  id,
  academy_id,
  name,
  address_line_1,
  address_line_2,
  city,
  state,
  postal_code,
  country,
  timezone,
  latitude,
  longitude,
  is_active
)
values (
  'location-tracy-naglee',
  'academy-open-mat',
  'Open Mat Academy — Tracy',
  '3200 Naglee Rd',
  'STE #106',
  'Tracy',
  'CA',
  '95304',
  'United States',
  'America/Los_Angeles',
  37.739700,
  -121.425200,
  true
)
on conflict (id) do update
  set name = excluded.name,
      address_line_1 = excluded.address_line_1,
      address_line_2 = excluded.address_line_2,
      city = excluded.city,
      state = excluded.state,
      postal_code = excluded.postal_code,
      timezone = excluded.timezone,
      latitude = excluded.latitude,
      longitude = excluded.longitude,
      is_active = excluded.is_active,
      updated_at = timezone('utc', now());

update public.academies
set primary_location_id = 'location-tracy-naglee',
    updated_at = timezone('utc', now())
where id = 'academy-open-mat'
  and (primary_location_id is null or primary_location_id = 'location-tracy-naglee');

-- ---------------------------------------------------------------------------
-- 5) Location on operational tables
-- ---------------------------------------------------------------------------
alter table public.coach_classes
  add column if not exists location_id text references public.locations (id) on delete set null;

alter table public.coach_events
  add column if not exists location_id text references public.locations (id) on delete set null;

create index if not exists coach_classes_location_idx on public.coach_classes (location_id);
create index if not exists coach_events_location_idx on public.coach_events (location_id);

update public.coach_classes
set location_id = 'location-tracy-naglee'
where academy_id = 'academy-open-mat' and location_id is null;

update public.coach_events
set location_id = 'location-tracy-naglee'
where academy_id = 'academy-open-mat' and location_id is null;

-- ---------------------------------------------------------------------------
-- 6) Academy id on tables that lacked it (required for tenant RLS)
-- ---------------------------------------------------------------------------
alter table public.coach_notes
  add column if not exists academy_id text;

alter table public.promotion_history
  add column if not exists academy_id text;

alter table public.academy_roles
  add column if not exists academy_id text;

update public.coach_notes
set academy_id = 'academy-open-mat'
where academy_id is null;

update public.promotion_history
set academy_id = 'academy-open-mat'
where academy_id is null;

update public.academy_roles
set academy_id = 'academy-open-mat'
where academy_id is null;

-- Attach FKs once backfilled
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'coach_notes_academy_id_fkey'
  ) then
    alter table public.coach_notes
      add constraint coach_notes_academy_id_fkey
      foreign key (academy_id) references public.academies (id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'promotion_history_academy_id_fkey'
  ) then
    alter table public.promotion_history
      add constraint promotion_history_academy_id_fkey
      foreign key (academy_id) references public.academies (id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'academy_roles_academy_id_fkey'
  ) then
    alter table public.academy_roles
      add constraint academy_roles_academy_id_fkey
      foreign key (academy_id) references public.academies (id) on delete cascade;
  end if;
end $$;

alter table public.coach_notes alter column academy_id set not null;
alter table public.promotion_history alter column academy_id set not null;
alter table public.academy_roles alter column academy_id set not null;

create index if not exists coach_notes_academy_idx on public.coach_notes (academy_id);
create index if not exists promotion_history_academy_idx on public.promotion_history (academy_id);
create index if not exists academy_roles_academy_idx on public.academy_roles (academy_id);

-- Replace academy_roles uniqueness to be academy-scoped
do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'academy_roles_member_id_role_key'
  ) then
    alter table public.academy_roles drop constraint academy_roles_member_id_role_key;
  end if;
exception
  when undefined_object then null;
end $$;

create unique index if not exists academy_roles_member_academy_role_uidx
  on public.academy_roles (member_id, academy_id, role);

-- ---------------------------------------------------------------------------
-- 7) Membership-scoped authorization helpers (SECURITY DEFINER)
-- ---------------------------------------------------------------------------
create or replace function public.is_academy_member(p_academy_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.academy_memberships m
    where m.academy_id = p_academy_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.academy_membership_role(p_academy_id text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select m.role
  from public.academy_memberships m
  where m.academy_id = p_academy_id
    and m.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.has_academy_role(p_academy_id text, variadic p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.academy_memberships m
    where m.academy_id = p_academy_id
      and m.user_id = auth.uid()
      and m.role = any (p_roles)
  );
$$;

-- Coach-tier write access at an academy (includes legacy admin)
create or replace function public.can_coach_at_academy(p_academy_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_academy_role(
    p_academy_id,
    'owner', 'manager', 'coach', 'staff', 'admin'
  );
$$;

-- Manager/owner tier
create or replace function public.can_manage_academy(p_academy_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_academy_role(
    p_academy_id,
    'owner', 'manager', 'admin'
  );
$$;

create or replace function public.can_access_academy(p_academy_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_academy_member(p_academy_id);
$$;

-- Shared-academy check for practitioner-owned rows (e.g. competition_profiles)
create or replace function public.shares_academy_with(p_other_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.academy_memberships mine
    join public.academy_memberships theirs
      on theirs.academy_id = mine.academy_id
    where mine.user_id = auth.uid()
      and theirs.user_id = p_other_user_id
      and mine.role in ('owner', 'manager', 'coach', 'staff', 'admin')
  );
$$;

-- Class / event academy resolvers for child tables
create or replace function public.class_academy_id(p_class_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select c.academy_id from public.coach_classes c where c.id = p_class_id;
$$;

create or replace function public.event_academy_id(p_event_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select e.academy_id from public.coach_events e where e.id = p_event_id;
$$;

revoke all on function public.is_academy_member(text) from public;
revoke all on function public.academy_membership_role(text) from public;
revoke all on function public.has_academy_role(text, variadic text[]) from public;
revoke all on function public.can_coach_at_academy(text) from public;
revoke all on function public.can_manage_academy(text) from public;
revoke all on function public.can_access_academy(text) from public;
revoke all on function public.shares_academy_with(uuid) from public;
revoke all on function public.class_academy_id(uuid) from public;
revoke all on function public.event_academy_id(uuid) from public;

grant execute on function public.is_academy_member(text) to authenticated;
grant execute on function public.academy_membership_role(text) to authenticated;
grant execute on function public.has_academy_role(text, variadic text[]) to authenticated;
grant execute on function public.can_coach_at_academy(text) to authenticated;
grant execute on function public.can_manage_academy(text) to authenticated;
grant execute on function public.can_access_academy(text) to authenticated;
grant execute on function public.shares_academy_with(uuid) to authenticated;
grant execute on function public.class_academy_id(uuid) to authenticated;
grant execute on function public.event_academy_id(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 8) Drop overly broad policies, replace with membership-scoped policies
-- ---------------------------------------------------------------------------

-- organizations
drop policy if exists "Users can read organizations they belong to" on public.organizations;
create policy "Users can read organizations they belong to"
  on public.organizations for select to authenticated
  using (
    exists (
      select 1
      from public.academies a
      join public.academy_memberships m on m.academy_id = a.id
      where a.organization_id = organizations.id
        and m.user_id = auth.uid()
    )
  );

-- academies
drop policy if exists "Users can read academies they belong to" on public.academies;
create policy "Users can read academies they belong to"
  on public.academies for select to authenticated
  using (public.is_academy_member(id));

-- locations
drop policy if exists "Members can read academy locations" on public.locations;
drop policy if exists "Managers can manage academy locations" on public.locations;
create policy "Members can read academy locations"
  on public.locations for select to authenticated
  using (public.is_academy_member(academy_id));

create policy "Managers can insert academy locations"
  on public.locations for insert to authenticated
  with check (public.can_manage_academy(academy_id));

create policy "Managers can update academy locations"
  on public.locations for update to authenticated
  using (public.can_manage_academy(academy_id))
  with check (public.can_manage_academy(academy_id));

create policy "Managers can delete academy locations"
  on public.locations for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- academy_memberships
-- Coaches/managers may read the roster for academies they coach at; members see self only.
drop policy if exists "Users can read own academy memberships" on public.academy_memberships;
drop policy if exists "Users can read relevant academy memberships" on public.academy_memberships;
create policy "Users can read academy memberships in scope"
  on public.academy_memberships for select to authenticated
  using (
    user_id = auth.uid()
    or public.can_coach_at_academy(academy_id)
  );

create policy "Managers can insert academy memberships"
  on public.academy_memberships for insert to authenticated
  with check (public.can_manage_academy(academy_id));

create policy "Managers can update academy memberships"
  on public.academy_memberships for update to authenticated
  using (public.can_manage_academy(academy_id))
  with check (public.can_manage_academy(academy_id));

create policy "Managers can delete academy memberships"
  on public.academy_memberships for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- announcements
drop policy if exists "Published announcements are readable by authenticated users" on public.announcements;
drop policy if exists "Coaches can insert announcements" on public.announcements;
drop policy if exists "Coaches can update announcements" on public.announcements;

create policy "Members can read published or own announcements"
  on public.announcements for select to authenticated
  using (
    public.is_academy_member(academy_id)
    and (
      status = 'published'
      or author_id = auth.uid()
      or public.can_coach_at_academy(academy_id)
    )
  );

create policy "Coaches can insert announcements"
  on public.announcements for insert to authenticated
  with check (
    public.can_coach_at_academy(academy_id)
    and author_id = auth.uid()
  );

create policy "Coaches can update announcements"
  on public.announcements for update to authenticated
  using (public.can_coach_at_academy(academy_id))
  with check (public.can_coach_at_academy(academy_id));

create policy "Managers can delete announcements"
  on public.announcements for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- coach_classes
drop policy if exists "Authenticated users can read classes" on public.coach_classes;
drop policy if exists "Coaches can manage classes" on public.coach_classes;

create policy "Members can read academy classes"
  on public.coach_classes for select to authenticated
  using (public.is_academy_member(academy_id));

create policy "Coaches can insert classes"
  on public.coach_classes for insert to authenticated
  with check (public.can_coach_at_academy(academy_id));

create policy "Coaches can update classes"
  on public.coach_classes for update to authenticated
  using (public.can_coach_at_academy(academy_id))
  with check (public.can_coach_at_academy(academy_id));

create policy "Managers can delete classes"
  on public.coach_classes for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- attendance (via class academy)
drop policy if exists "Coaches can read attendance" on public.attendance;
drop policy if exists "Coaches can write attendance" on public.attendance;

create policy "Members can read own attendance; coaches academy roster"
  on public.attendance for select to authenticated
  using (
    member_id = auth.uid()
    or public.can_coach_at_academy(public.class_academy_id(class_id))
  );

create policy "Coaches can insert attendance"
  on public.attendance for insert to authenticated
  with check (public.can_coach_at_academy(public.class_academy_id(class_id)));

create policy "Coaches can update attendance"
  on public.attendance for update to authenticated
  using (public.can_coach_at_academy(public.class_academy_id(class_id)))
  with check (public.can_coach_at_academy(public.class_academy_id(class_id)));

create policy "Managers can delete attendance"
  on public.attendance for delete to authenticated
  using (public.can_manage_academy(public.class_academy_id(class_id)));

-- coach_notes
drop policy if exists "Only coaches can read private notes" on public.coach_notes;
drop policy if exists "Only coaches can write private notes" on public.coach_notes;

create policy "Coaches can read academy private notes"
  on public.coach_notes for select to authenticated
  using (public.can_coach_at_academy(academy_id));

create policy "Coaches can insert academy private notes"
  on public.coach_notes for insert to authenticated
  with check (
    public.can_coach_at_academy(academy_id)
    and author_id = auth.uid()
  );

create policy "Coaches can update academy private notes"
  on public.coach_notes for update to authenticated
  using (public.can_coach_at_academy(academy_id))
  with check (public.can_coach_at_academy(academy_id));

create policy "Managers can delete academy private notes"
  on public.coach_notes for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- techniques
drop policy if exists "Authenticated users can read techniques" on public.techniques;
drop policy if exists "Coaches can manage techniques" on public.techniques;

create policy "Members can read academy techniques"
  on public.techniques for select to authenticated
  using (public.is_academy_member(academy_id));

create policy "Coaches can insert techniques"
  on public.techniques for insert to authenticated
  with check (public.can_coach_at_academy(academy_id));

create policy "Coaches can update techniques"
  on public.techniques for update to authenticated
  using (public.can_coach_at_academy(academy_id))
  with check (public.can_coach_at_academy(academy_id));

create policy "Managers can delete techniques"
  on public.techniques for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- coach_challenges
drop policy if exists "Authenticated users can read challenges" on public.coach_challenges;
drop policy if exists "Coaches can manage challenges" on public.coach_challenges;

create policy "Members can read academy challenges"
  on public.coach_challenges for select to authenticated
  using (public.is_academy_member(academy_id));

create policy "Coaches can insert challenges"
  on public.coach_challenges for insert to authenticated
  with check (public.can_coach_at_academy(academy_id));

create policy "Coaches can update challenges"
  on public.coach_challenges for update to authenticated
  using (public.can_coach_at_academy(academy_id))
  with check (public.can_coach_at_academy(academy_id));

create policy "Managers can delete challenges"
  on public.coach_challenges for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- coach_achievements
drop policy if exists "Authenticated users can read achievements" on public.coach_achievements;
drop policy if exists "Coaches can manage achievements" on public.coach_achievements;

create policy "Members can read academy achievements"
  on public.coach_achievements for select to authenticated
  using (public.is_academy_member(academy_id));

create policy "Coaches can insert achievements"
  on public.coach_achievements for insert to authenticated
  with check (public.can_coach_at_academy(academy_id));

create policy "Coaches can update achievements"
  on public.coach_achievements for update to authenticated
  using (public.can_coach_at_academy(academy_id))
  with check (public.can_coach_at_academy(academy_id));

create policy "Managers can delete achievements"
  on public.coach_achievements for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- coach_events
drop policy if exists "Authenticated users can read events" on public.coach_events;
drop policy if exists "Coaches can manage events" on public.coach_events;

create policy "Members can read academy events"
  on public.coach_events for select to authenticated
  using (
    public.is_academy_member(academy_id)
    and (
      status = 'published'
      or public.can_coach_at_academy(academy_id)
    )
  );

create policy "Coaches can insert events"
  on public.coach_events for insert to authenticated
  with check (public.can_coach_at_academy(academy_id));

create policy "Coaches can update events"
  on public.coach_events for update to authenticated
  using (public.can_coach_at_academy(academy_id))
  with check (public.can_coach_at_academy(academy_id));

create policy "Managers can delete events"
  on public.coach_events for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- event_rsvps
drop policy if exists "Users can read own RSVPs or coaches all" on public.event_rsvps;
drop policy if exists "Users can upsert own RSVPs" on public.event_rsvps;
drop policy if exists "Users can update own RSVPs" on public.event_rsvps;

create policy "Users can read own RSVPs or academy coaches"
  on public.event_rsvps for select to authenticated
  using (
    member_id = auth.uid()
    or public.can_coach_at_academy(public.event_academy_id(event_id))
  );

create policy "Members can insert own RSVPs for accessible events"
  on public.event_rsvps for insert to authenticated
  with check (
    member_id = auth.uid()
    and public.is_academy_member(public.event_academy_id(event_id))
  );

create policy "Members can update own RSVPs"
  on public.event_rsvps for update to authenticated
  using (
    member_id = auth.uid()
    and public.is_academy_member(public.event_academy_id(event_id))
  )
  with check (
    member_id = auth.uid()
    and public.is_academy_member(public.event_academy_id(event_id))
  );

create policy "Managers can delete RSVPs"
  on public.event_rsvps for delete to authenticated
  using (public.can_manage_academy(public.event_academy_id(event_id)));

-- media_albums
drop policy if exists "Authenticated users can read media albums" on public.media_albums;
drop policy if exists "Coaches can manage media albums" on public.media_albums;

create policy "Members can read academy media albums"
  on public.media_albums for select to authenticated
  using (public.is_academy_member(academy_id));

create policy "Coaches can insert media albums"
  on public.media_albums for insert to authenticated
  with check (public.can_coach_at_academy(academy_id));

create policy "Coaches can update media albums"
  on public.media_albums for update to authenticated
  using (public.can_coach_at_academy(academy_id))
  with check (public.can_coach_at_academy(academy_id));

create policy "Managers can delete media albums"
  on public.media_albums for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- media_items
drop policy if exists "Authenticated users can read media items" on public.media_items;
drop policy if exists "Coaches can manage media items" on public.media_items;

create policy "Members can read academy media items"
  on public.media_items for select to authenticated
  using (public.is_academy_member(academy_id));

create policy "Coaches can insert media items"
  on public.media_items for insert to authenticated
  with check (public.can_coach_at_academy(academy_id));

create policy "Coaches can update media items"
  on public.media_items for update to authenticated
  using (public.can_coach_at_academy(academy_id))
  with check (public.can_coach_at_academy(academy_id));

create policy "Managers can delete media items"
  on public.media_items for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- notification_drafts
drop policy if exists "Coaches can manage notification drafts" on public.notification_drafts;

create policy "Coaches can select notification drafts"
  on public.notification_drafts for select to authenticated
  using (public.can_coach_at_academy(academy_id));

create policy "Coaches can insert notification drafts"
  on public.notification_drafts for insert to authenticated
  with check (public.can_coach_at_academy(academy_id));

create policy "Coaches can update notification drafts"
  on public.notification_drafts for update to authenticated
  using (public.can_coach_at_academy(academy_id))
  with check (public.can_coach_at_academy(academy_id));

create policy "Managers can delete notification drafts"
  on public.notification_drafts for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- member_development
drop policy if exists "Members can read own development" on public.member_development;
drop policy if exists "Coaches can insert development" on public.member_development;
drop policy if exists "Coaches can update development" on public.member_development;
drop policy if exists "Managers can delete development" on public.member_development;

create policy "Members can read own development; coaches academy"
  on public.member_development for select to authenticated
  using (
    member_id = auth.uid()
    or public.can_coach_at_academy(academy_id)
  );

create policy "Coaches can insert development"
  on public.member_development for insert to authenticated
  with check (public.can_coach_at_academy(academy_id));

create policy "Coaches can update development"
  on public.member_development for update to authenticated
  using (public.can_coach_at_academy(academy_id))
  with check (public.can_coach_at_academy(academy_id));

create policy "Managers can delete development"
  on public.member_development for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- promotion_history
drop policy if exists "Members can read own promotion history" on public.promotion_history;
drop policy if exists "Coaches can insert promotion history" on public.promotion_history;
drop policy if exists "Managers can update promotion history" on public.promotion_history;
drop policy if exists "Managers can delete promotion history" on public.promotion_history;

create policy "Members can read own promotion history; coaches academy"
  on public.promotion_history for select to authenticated
  using (
    member_id = auth.uid()
    or public.can_coach_at_academy(academy_id)
  );

create policy "Coaches can insert promotion history"
  on public.promotion_history for insert to authenticated
  with check (
    public.can_coach_at_academy(academy_id)
    and coach_id = auth.uid()
  );

create policy "Managers can update promotion history"
  on public.promotion_history for update to authenticated
  using (public.can_manage_academy(academy_id))
  with check (public.can_manage_academy(academy_id));

create policy "Managers can delete promotion history"
  on public.promotion_history for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- competition_profiles (practitioner-owned; coach access via shared academy)
drop policy if exists "Members can read own competition profile" on public.competition_profiles;
drop policy if exists "Coaches can manage competition profiles" on public.competition_profiles;

create policy "Members can read own competition profile; shared coaches"
  on public.competition_profiles for select to authenticated
  using (
    member_id = auth.uid()
    or public.shares_academy_with(member_id)
  );

create policy "Coaches can insert competition profiles for shared members"
  on public.competition_profiles for insert to authenticated
  with check (
    member_id = auth.uid()
    or public.shares_academy_with(member_id)
  );

create policy "Coaches can update competition profiles for shared members"
  on public.competition_profiles for update to authenticated
  using (
    member_id = auth.uid()
    or public.shares_academy_with(member_id)
  )
  with check (
    member_id = auth.uid()
    or public.shares_academy_with(member_id)
  );

create policy "Managers sharing academy can delete competition profiles"
  on public.competition_profiles for delete to authenticated
  using (
    exists (
      select 1
      from public.academy_memberships mine
      join public.academy_memberships theirs
        on theirs.academy_id = mine.academy_id
      where mine.user_id = auth.uid()
        and theirs.user_id = competition_profiles.member_id
        and mine.role in ('owner', 'manager', 'admin')
    )
  );

-- academy_roles (leadership tags)
drop policy if exists "Members can read own academy roles" on public.academy_roles;
drop policy if exists "Coaches can manage academy roles" on public.academy_roles;

create policy "Members can read own academy roles; coaches academy"
  on public.academy_roles for select to authenticated
  using (
    member_id = auth.uid()
    or public.can_coach_at_academy(academy_id)
  );

create policy "Coaches can insert academy roles"
  on public.academy_roles for insert to authenticated
  with check (public.can_coach_at_academy(academy_id));

create policy "Coaches can update academy roles"
  on public.academy_roles for update to authenticated
  using (public.can_coach_at_academy(academy_id))
  with check (public.can_coach_at_academy(academy_id));

create policy "Managers can delete academy roles"
  on public.academy_roles for delete to authenticated
  using (public.can_manage_academy(academy_id));

-- audit_logs
drop policy if exists "Coaches can read academy audit logs" on public.audit_logs;
drop policy if exists "Coaches can insert audit logs" on public.audit_logs;
drop policy if exists "Managers cannot rewrite audit history" on public.audit_logs;
drop policy if exists "Managers cannot delete audit history" on public.audit_logs;

create policy "Coaches can read own academy audit logs"
  on public.audit_logs for select to authenticated
  using (public.can_coach_at_academy(academy_id));

create policy "Coaches can insert academy audit logs"
  on public.audit_logs for insert to authenticated
  with check (
    public.can_coach_at_academy(academy_id)
    and actor_id = auth.uid()
  );

create policy "Audit logs are immutable"
  on public.audit_logs for update to authenticated
  using (false);

create policy "Audit logs cannot be deleted"
  on public.audit_logs for delete to authenticated
  using (false);

-- Keep JWT helpers for demo compatibility, but document they are NOT tenant security.
comment on function public.is_coach_role() is
  'Legacy JWT role helper. Do not use for tenant isolation; use can_coach_at_academy().';
comment on function public.is_manager_role() is
  'Legacy JWT role helper. Do not use for tenant isolation; use can_manage_academy().';
comment on table public.organizations is
  'Top-level My Gi tenant grouping. Academies belong to one organization.';
comment on table public.locations is
  'Physical academy sites. Classes/events may reference a location.';
comment on function public.is_academy_member(text) is
  'True when auth.uid() has an academy_memberships row for the academy.';
