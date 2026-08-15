-- Fix academy_memberships SELECT leak.
-- Coaches must only read memberships for academies they coach at.
-- Drop ALL policies first — permissive policies OR together, so a leftover
-- JWT-scoped SELECT policy (e.g. is_coach_role()) re-opens every row.

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
