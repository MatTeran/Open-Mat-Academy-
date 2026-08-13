# My Gi Command Center

Platform admin surface for My Gi staff. **Not** the Coach Web `/command-center` page (academy mission control).

## App

- Package: `@openmat/platform-web`
- Path: `apps/platform-web`
- Dev: `npm run start:platform-web` (port **3001**)
- Demo: enabled when Supabase public env keys are missing, or `NEXT_PUBLIC_PLATFORM_WEB_DEMO=1`

## Privilege model

| Layer | Source of truth |
| --- | --- |
| Platform access | `platform_admins` + `is_platform_admin()` |
| Academy access | `academy_memberships` (unchanged) |

Roles: `superadmin` | `ops` | `support`

- `support` — read directory  
- `ops` / `superadmin` — create orgs/academies, assign owners  
- `superadmin` — future: manage platform admin allowlist  

Academy `owner` / `coach` does **not** grant Command Center access.

## Pages

- `/login`
- `/orgs` — organization directory + create
- `/orgs/[orgId]` — academies + create academy
- `/academies/[academyId]` — locations, memberships, assign owner

## Live setup

1. Apply `supabase/migrations/20260813140000_platform_admins.sql`
2. Insert a platform admin for your user id (see `scripts/seed-platform-admin.sql`)
3. Configure `NEXT_PUBLIC_SUPABASE_URL` + publishable key for `platform-web`
4. Wire Supabase SSR session (next slice) — demo mode ships today

## Security notes

- Never put `SUPABASE_SERVICE_ROLE_KEY` in client bundles
- Platform RLS policies are additive; academy membership RLS remains in force for non-platform users
