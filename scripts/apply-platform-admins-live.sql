-- Phase 3 foundation: My Gi platform admins (Command Center)
-- Separate from academy_memberships. Additive only.

create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'support' check (
    role in ('superadmin', 'ops', 'support')
  ),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists platform_admins_role_idx
  on public.platform_admins (role);

alter table public.platform_admins enable row level security;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.platform_admins p
    where p.user_id = auth.uid()
  );
$$;

create or replace function public.platform_admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.platform_admins p
  where p.user_id = auth.uid()
  limit 1;
$$;

revoke all on function public.is_platform_admin() from public;
revoke all on function public.platform_admin_role() from public;
grant execute on function public.is_platform_admin() to authenticated;
grant execute on function public.platform_admin_role() to authenticated;

grant select on table public.platform_admins to authenticated;
grant select, insert, update, delete on table
  public.organizations,
  public.academies,
  public.locations,
  public.academy_memberships
to authenticated;

-- platform_admins: only platform admins can read the allowlist
drop policy if exists "Platform admins can read platform admins" on public.platform_admins;
create policy "Platform admins can read platform admins"
  on public.platform_admins for select to authenticated
  using (public.is_platform_admin());

-- Extend tenant directory reads for platform operators
drop policy if exists "Platform admins can read all organizations" on public.organizations;
create policy "Platform admins can read all organizations"
  on public.organizations for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write organizations" on public.organizations;
create policy "Platform admins can write organizations"
  on public.organizations for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read all academies" on public.academies;
create policy "Platform admins can read all academies"
  on public.academies for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write academies" on public.academies;
create policy "Platform admins can write academies"
  on public.academies for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read all locations" on public.locations;
create policy "Platform admins can read all locations"
  on public.locations for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write locations" on public.locations;
create policy "Platform admins can write locations"
  on public.locations for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Platform admins can read all memberships" on public.academy_memberships;
create policy "Platform admins can read all memberships"
  on public.academy_memberships for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Platform admins can write memberships" on public.academy_memberships;
create policy "Platform admins can write memberships"
  on public.academy_memberships for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

comment on table public.platform_admins is
  'My Gi Command Center allowlist. Separate from academy_memberships.';
comment on function public.is_platform_admin() is
  'True when auth.uid() is in platform_admins. Not an academy role.';

-- service_role for automation / verification
grant select, insert, update, delete on public.platform_admins to service_role;
grant execute on function public.is_platform_admin() to service_role;
grant execute on function public.platform_admin_role() to service_role;

-- Seed Command Center ops user (created via Auth Admin API)
insert into public.platform_admins (user_id, role)
values ('443cb189-f73e-4b42-ba6c-8effb79733af'::uuid, 'ops')
on conflict (user_id) do update
  set role = excluded.role,
      updated_at = timezone('utc', now());

select user_id, role, created_at
from public.platform_admins
order by created_at;
