-- LIVE FIX v2: hard-reset ALL academy_memberships policies
-- Previous fix may have left a legacy SELECT policy (policies OR together).
-- Run entire script in Supabase SQL Editor.
-- Paste the final "policies_after" result here, then reply "memberships fixed".

-- A) Before
select 'policies_before' as stage,
       policyname,
       cmd,
       roles::text,
       permissive,
       qual as using_expr,
       with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'academy_memberships'
order by policyname;

-- B) Drop EVERY policy on the table
do $$
declare
  r record;
begin
  for r in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'academy_memberships'
  loop
    execute format(
      'drop policy if exists %I on public.academy_memberships',
      r.policyname
    );
  end loop;
end $$;

-- C) Recreate only membership-scoped policies
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

-- D) After (must show exactly 4 policies; SELECT using_expr must mention can_coach_at_academy)
select 'policies_after' as stage,
       policyname,
       cmd,
       roles::text,
       qual as using_expr,
       with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'academy_memberships'
order by cmd, policyname;

-- E) Helper sanity (optional)
select
  public.can_coach_at_academy('academy-test-a') as coach_a_as_sql_editor_uid_null,
  public.can_manage_academy('academy-test-a') as manage_a_as_sql_editor_uid_null;
