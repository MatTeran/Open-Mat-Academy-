-- Seed My Gi Command Center platform admin(s).
-- Requires platform_admins table (apply-platform-admins-live.sql / migration).

-- Test ops user used for live Command Center verification:
insert into public.platform_admins (user_id, role)
values ('443cb189-f73e-4b42-ba6c-8effb79733af'::uuid, 'ops')
on conflict (user_id) do update
  set role = excluded.role,
      updated_at = timezone('utc', now());

-- Optional: add your own auth user as superadmin
-- insert into public.platform_admins (user_id, role)
-- values ('YOUR-AUTH-USER-UUID'::uuid, 'superadmin')
-- on conflict (user_id) do update set role = excluded.role;

select user_id, role from public.platform_admins order by created_at;
