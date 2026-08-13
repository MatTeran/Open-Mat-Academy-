-- LIVE FIX: academy_memberships cross-tenant SELECT leak
-- Run in Supabase SQL Editor, then reply "memberships fixed"

-- 1) Show current policies (for the record)
select pol.polname as policy_name,
       pol.polcmd as cmd,
       pg_get_expr(pol.polqual, pol.polrelid) as using_expr,
       pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expr
from pg_policy pol
join pg_class cls on cls.oid = pol.polrelid
join pg_namespace nsp on nsp.oid = cls.relnamespace
where nsp.nspname = 'public'
  and cls.relname = 'academy_memberships'
order by pol.polname;

-- 2) Replace SELECT policies
drop policy if exists "Users can read own academy memberships" on public.academy_memberships;
drop policy if exists "Users can read relevant academy memberships" on public.academy_memberships;
drop policy if exists "Coaches can read academy memberships" on public.academy_memberships;
drop policy if exists "Members can read academy memberships" on public.academy_memberships;
drop policy if exists "Users can read academy memberships in scope" on public.academy_memberships;

create policy "Users can read academy memberships in scope"
  on public.academy_memberships for select to authenticated
  using (
    user_id = auth.uid()
    or public.can_coach_at_academy(academy_id)
  );

-- 3) Confirm replacement
select pol.polname as policy_name,
       pg_get_expr(pol.polqual, pol.polrelid) as using_expr
from pg_policy pol
join pg_class cls on cls.oid = pol.polrelid
join pg_namespace nsp on nsp.oid = cls.relnamespace
where nsp.nspname = 'public'
  and cls.relname = 'academy_memberships'
  and pol.polcmd = 'r'
order by pol.polname;
