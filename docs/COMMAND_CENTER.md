# My Gi Command Center

Platform operations OS for My Gi staff. **Not** Coach Web `/command-center` (academy mission control).

## App

- Package: `@openmat/platform-web`
- Path: `apps/platform-web`
- Dev: `npm run start:platform-web` (port **3001**)
- Plan: `docs/COMMAND_CENTER_V1_PLAN.md`

## Navigation

Overview · Organizations · Academies · Locations · Onboarding · Users · Coaches · Platform Admins · Subscriptions · Plans · Data (Executive / Health / Engagement / Funnel) · Features · Media · Content · Notifications · Support · Audit · System Health · Settings

## Privilege model

See `docs/PLATFORM_ADMIN_ROLES.md`. Academy `owner`/`coach` never grants access.

## Live setup

1. `scripts/apply-platform-admins-live.sql`
2. `scripts/apply-command-center-operations.sql`
3. `apps/platform-web/.env.local` with `NEXT_PUBLIC_PLATFORM_WEB_DEMO=0`
4. Sign in as platform ops

### Test ops login

- Email: `platform.ops@mygi.test`
- Password: `PlatformOps!23456`

## Onboarding without SQL

Use `/onboarding/new` — see `docs/ACADEMY_ONBOARDING.md`.

## Security

- No service-role in browser
- Platform RLS via `is_platform_admin()`
- Private journals/notes excluded from Command Center
