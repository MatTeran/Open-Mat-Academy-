-- Seed a My Gi Command Center platform admin.
-- Replace the UUID with a real auth.users id before running.

-- Example:
-- insert into public.platform_admins (user_id, role)
-- values ('00000000-0000-0000-0000-000000000000'::uuid, 'ops')
-- on conflict (user_id) do update
--   set role = excluded.role,
--       updated_at = timezone('utc', now());

select
  'Replace the UUID in this script with your auth user id, then uncomment the insert.' as next_step;
