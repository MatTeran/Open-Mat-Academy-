-- Fix academy_memberships SELECT leak.
-- Coaches must only read memberships for academies they coach at.
-- Drop all existing SELECT policies first (legacy JWT policies may still be present).

drop policy if exists "Users can read own academy memberships" on public.academy_memberships;
drop policy if exists "Users can read relevant academy memberships" on public.academy_memberships;
drop policy if exists "Coaches can read academy memberships" on public.academy_memberships;
drop policy if exists "Members can read academy memberships" on public.academy_memberships;

create policy "Users can read academy memberships in scope"
  on public.academy_memberships for select to authenticated
  using (
    user_id = auth.uid()
    or public.can_coach_at_academy(academy_id)
  );
