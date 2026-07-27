# Open Mat Coach Web

Desktop-first Coach dashboard (Next.js App Router) in the Open Mat monorepo.

## Stack

- Next.js 15 (App Router) + TypeScript strict
- Tailwind CSS (web design system; not React Native Web)
- Shared domain via `@openmat/shared/types`, `/services`, `/auth/roles`
- Demo auth cookie when Supabase env is unset

## Scripts

```bash
npm run start:coach-web   # from repo root
npm run typecheck:coach-web
npm run test:coach-web
```

## Routes (Phase 1)

| Route | Purpose |
| --- | --- |
| `/login` | Coach/manager/owner sign-in (demo) |
| `/command-center` | Default mission control |
| `/members` | Data table |
| `/members/[id]` | Profile tabs |
| `/members/[id]/add-stripe` | Guided stripe promotion |
| `/members/[id]/promote-belt` | Guided belt promotion |
| `/development` | Development index |
| `/schedule` | Day/week/list schedule |
| `/schedule/[id]` | Roster |
| `/check-in` | Desktop check-in |
| `/announcements` | Draft/publish/archive |

## Permissions

Members cannot access Coach Web. Server layout calls `requireCoachSession()`; RLS remains the source of truth for live Supabase.

## Architecture notes

See `docs/COACH_WEB_ARCHITECTURE.md`.
