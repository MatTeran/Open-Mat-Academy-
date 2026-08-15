-- Member profiles for Coach roster sync.
-- Keeps sample/mock members in the apps; live auth signups land here and
-- appear alongside mocks in the Coach Members list.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Seed Tracy academy tenant
-- ---------------------------------------------------------------------------
insert into public.academies (id, name)
values ('academy-open-mat', 'Open Mat · Tracy')
on conflict (id) do update
set name = excluded.name,
    updated_at = timezone('utc', now());

-- ---------------------------------------------------------------------------
-- profiles — shared member identity for Member + Coach apps
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  phone text,
  avatar_url text,
  belt text not null default 'white'
    check (belt in ('white', 'blue', 'purple', 'brown', 'black')),
  stripes smallint not null default 0 check (stripes between 0 and 4),
  membership_plan text not null default 'drop_in'
    check (membership_plan in ('unlimited', 'fundamentals', 'kids', 'drop_in')),
  membership_status text not null default 'active'
    check (membership_status in ('active', 'past_due', 'paused', 'canceled')),
  academy_id text not null default 'academy-open-mat'
    references public.academies (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists profiles_academy_name_idx
  on public.profiles (academy_id, full_name);

create index if not exists profiles_email_idx
  on public.profiles (email);

alter table public.profiles enable row level security;

-- Staff at an academy (via memberships) OR legacy JWT coach roles.
create or replace function public.is_academy_staff(target_academy_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_coach_role()
    or exists (
      select 1
      from public.academy_memberships m
      where m.user_id = auth.uid()
        and m.academy_id = target_academy_id
        and m.role in ('coach', 'manager', 'owner', 'admin', 'staff')
    );
$$;

create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_academy_staff(academy_id));

create policy "Users can insert own profile"
  on public.profiles for insert to authenticated
  with check (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Coaches can update academy profiles"
  on public.profiles for update to authenticated
  using (public.is_academy_staff(academy_id))
  with check (public.is_academy_staff(academy_id));

-- Allow members to create their Tracy membership row; coaches can read academy roster links.
create policy "Users can insert own academy membership"
  on public.academy_memberships for insert to authenticated
  with check (user_id = auth.uid());

create policy "Academy staff can read academy memberships"
  on public.academy_memberships for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_manager_role()
    or public.is_academy_staff(academy_id)
  );

-- ---------------------------------------------------------------------------
-- ensure_member_roster_profile — idempotent onboarding for new auth users
-- ---------------------------------------------------------------------------
create or replace function public.ensure_member_roster_profile(
  p_user_id uuid default auth.uid(),
  p_full_name text default null,
  p_email text default null,
  p_academy_id text default 'academy-open-mat'
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_name text;
  v_row public.profiles;
begin
  if p_user_id is null then
    raise exception 'ensure_member_roster_profile requires a user id';
  end if;

  -- Callers may only onboard themselves unless they are academy staff.
  if auth.uid() is distinct from p_user_id
     and not public.is_academy_staff(coalesce(p_academy_id, 'academy-open-mat')) then
    raise exception 'not allowed';
  end if;

  insert into public.academies (id, name)
  values (coalesce(p_academy_id, 'academy-open-mat'), 'Open Mat · Tracy')
  on conflict (id) do nothing;

  select coalesce(p_email, u.email, ''),
         coalesce(
           nullif(trim(p_full_name), ''),
           nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
           split_part(coalesce(p_email, u.email, 'member'), '@', 1)
         )
    into v_email, v_name
  from auth.users u
  where u.id = p_user_id;

  if v_email is null then
    raise exception 'auth user not found';
  end if;

  insert into public.profiles as p (
    id,
    email,
    full_name,
    academy_id,
    belt,
    stripes,
    membership_plan,
    membership_status
  )
  values (
    p_user_id,
    lower(v_email),
    v_name,
    coalesce(p_academy_id, 'academy-open-mat'),
    'white',
    0,
    'drop_in',
    'active'
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(nullif(trim(excluded.full_name), ''), p.full_name),
      updated_at = timezone('utc', now())
  returning * into v_row;

  insert into public.academy_memberships (academy_id, user_id, role)
  values (v_row.academy_id, p_user_id, 'member')
  on conflict (academy_id, user_id) do nothing;

  insert into public.member_development (
    member_id,
    academy_id,
    belt,
    stripes
  )
  values (
    p_user_id,
    v_row.academy_id,
    'white',
    0
  )
  on conflict (member_id, academy_id) do nothing;

  return v_row;
end;
$$;

revoke all on function public.ensure_member_roster_profile(uuid, text, text, text)
  from public;
grant execute on function public.ensure_member_roster_profile(uuid, text, text, text)
  to authenticated;

-- Auto-create roster rows whenever a new auth user is created.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.academies (id, name)
  values ('academy-open-mat', 'Open Mat · Tracy')
  on conflict (id) do nothing;

  insert into public.profiles (
    id,
    email,
    full_name,
    academy_id,
    belt,
    stripes,
    membership_plan,
    membership_status
  )
  values (
    new.id,
    lower(coalesce(new.email, '')),
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      split_part(coalesce(new.email, 'member'), '@', 1)
    ),
    'academy-open-mat',
    'white',
    0,
    'drop_in',
    'active'
  )
  on conflict (id) do nothing;

  insert into public.academy_memberships (academy_id, user_id, role)
  values ('academy-open-mat', new.id, 'member')
  on conflict (academy_id, user_id) do nothing;

  insert into public.member_development (
    member_id,
    academy_id,
    belt,
    stripes
  )
  values (new.id, 'academy-open-mat', 'white', 0)
  on conflict (member_id, academy_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_roster on auth.users;
create trigger on_auth_user_created_roster
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();

comment on table public.profiles is
  'Member identity/roster rows. Coach Members list merges these with local sample mocks.';
