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

1. In Supabase SQL Editor, run `scripts/apply-platform-admins-live.sql`  
   (creates `platform_admins`, RLS helpers, seeds test ops user)
2. Copy `apps/platform-web/.env.example` → `.env.local` with your project URL + publishable key  
   Set `NEXT_PUBLIC_PLATFORM_WEB_DEMO=0`
3. `npm run start:platform-web` → sign in with platform ops credentials

### Test ops login (seeded by apply script)

- Email: `platform.ops@mygi.test`
- Password: `PlatformOps!23456`

Live mode reads/writes the same `organizations`, `academies`, `locations`, and `academy_memberships` tables used by Coach and Member apps.

## Security notes

- Never put `SUPABASE_SERVICE_ROLE_KEY` in client bundles
- Platform RLS policies are additive; academy membership RLS remains in force for non-platform users
- Academy `owner`/`coach` JWT roles do **not** grant Command Center access
