# Stage 1 — Coach Web Architecture Assessment

> Non-destructive path approved for implementation: **do not rename** the Member root app or `apps/coach`. Add `apps/coach-web` beside them. Split shared packages only where React Native coupling blocks Next.js.

## Current architecture summary

| Area | Reality today |
| --- | --- |
| Package manager | **npm workspaces** (`apps/*`, `packages/*`) + lockfile |
| Monorepo? | **Yes (partial)** — Coach Expo in `apps/coach`, shared in `packages/shared`, Member Expo still at **repo root** |
| Member app | Root Expo SDK 54 app (`App.tsx`, `screens/`, `services/`, NativeWind) |
| Coach mobile | `apps/coach` (`@openmat/coach`) depending on `@openmat/shared` |
| Shared package | `@openmat/shared` — types, auth/roles, repositories, theme tokens, **RN UI primitives**, RN Auth/Theme providers |
| Supabase | Migrations under `supabase/migrations/` (Phase 1–2 + Member Development). Client in shared uses **AsyncStorage + RN URL polyfill** |
| Generated DB types | **Not present** yet (hand-written domain types) |
| Tests | **No** jest/vitest/playwright configured |
| Turborepo / pnpm | **Not used** — keep npm workspaces |

### Reusable today (domain)

- Types: members, classes, attendance, announcements, command center, member development, auth roles
- Repositories (memory-first): members, classes, attendance, announcements, memberDevelopment, commandCenter, coachNotes
- Permission helpers: `hasCoachAccess`, `canEditMemberDevelopment`, etc.
- Design tokens in `theme/colors.ts` / `spacing.ts`

### Coupled to React Native (not web-safe as-is)

- `packages/shared/src/ui/*` — `StyleSheet` / `View` / Expo icons
- `providers/ThemeProvider.tsx`, `AuthProvider.tsx` — RN Appearance / AsyncStorage
- `services/supabase/client.ts` — AsyncStorage + `react-native-url-polyfill`
- `auth/guest.ts` — AsyncStorage
- `theme/typography.ts` — imports `TextStyle` from `react-native`
- Coach mobile screens/components — presentation only

### Migration risks

1. Importing `@openmat/shared` barrel pulls RN UI into Next.js → bundle/SSR failure
2. Hard RN deps in Supabase client block Node/Edge
3. Renaming Member → `apps/member-mobile` breaks Expo paths, CI, and mental model without payoff now
4. Splitting `@openmat/shared` into many packages in one pass risks Coach mobile breakage
5. No audit_logs / academies tables yet — need additive migrations, not duplicates of existing coach tables

## Proposed target architecture (incremental)

```
apps/
  coach/                 # keep — Coach mobile (Expo)
  coach-web/             # NEW — Next.js App Router dashboard
packages/
  shared/                # keep — evolve exports; no big-bang split yet
supabase/migrations/
docs/
```

Ideal long-term (later, with approval):

```
apps/member-mobile | coach-mobile | coach-web
packages/types | auth | api | theme | validation | ui-native | ui-web
```

**Not doing now:** renaming Member/Coach mobile, introducing Turborepo/pnpm, React Native Web.

## Implementation plan (stages)

1. ~~Assessment~~  
2. Web-compat shared fixes + Next.js shell (auth, sidebar)  
3. Command Center  
4. Members table + profile  
5. Member Development / promotions  
6. Schedule + roster/check-in  
7. Announcements  
8. Tests, a11y, cleanup  

## Minimal shared changes required (explained)

| Change | Why necessary |
| --- | --- |
| Platform-agnostic Supabase client factory | Next.js cannot import AsyncStorage/RN polyfill at module top-level |
| Typography without `react-native` `TextStyle` | `@openmat/shared/theme` must be importable from web |
| Env reads `NEXT_PUBLIC_*` as well as `EXPO_PUBLIC_*` | Web env convention |
| `resolveRole` includes `manager` / `owner` | Matches Member Development roles |
| Prefer subpath imports (`/types`, `/services`, `/theme`) from web | Avoid RN UI barrel |

No working mobile files are moved or renamed in this phase.
