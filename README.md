# My Gi

Premium Brazilian Jiu-Jitsu academy apps for **My Gi** (Tracy, CA).

Cloned and rebranded from Open Mat with the official Gracie Fighter / My Gi black-and-white identity. Built with React Native, Expo SDK 54, TypeScript, Supabase, NativeWind, React Navigation, Stripe, and React Query.

> **Note:** Mobile apps target **Expo SDK 54** so they open in the App Store / Play Store Expo Go app.

## What's included

| App | Path | Description |
| --- | --- | --- |
| **Member (User) App** | repo root | Athlete experience — schedule, workout log, journey, community, profile |
| **Coach App** | `apps/coach` | Coach mobile — dashboard, check-in, members, announcements, command center |
| **Coach Web** | `apps/coach-web` | Next.js desktop dashboard for coaches/staff |
| **Shared** | `packages/shared` | Theme tokens, types, auth roles, repositories |

```
apps/coach/           Coach Expo app
apps/coach-web/       Coach Next.js desktop dashboard
packages/shared/      Shared theme tokens, types, auth roles, repositories
supabase/migrations/  Coach + Member Development + audit tables
docs/                 Architecture notes
```

## Brand

Black & white athletic identity matching the official Gracie Fighter / My Gi seal.

| Token | Value |
| --- | --- |
| Primary background | `#000000` |
| Secondary background | `#111111` |
| Accent | `#FFFFFF` |
| Text | `#FFFFFF` |
| Secondary text | `#A0A0A0` |
| Error | `#FF4D4D` |
| Success | `#22C55E` |

- **Brand name:** My Gi  
- **Academy:** My Gi  
- **Logo:** Official Gracie Fighter / My Gi seal (black & white)  
- **Typography:** Syne (display) + Outfit (UI)

## Scripts

- `npm run dev` / `npm start` / `npm run start:member` — Member Expo app (local Fast Refresh)
- `npm run ios` / `npm run android` — open iOS Simulator / Android Emulator
- `npm run start:coach` — Coach Expo app
- `npm run start:coach-web` — Coach Web (Next.js)
- `npm run typecheck:all` — Member + Coach + Coach Web TypeScript
- `npm run test:coach-web` — Coach Web unit tests
- `npm run eas:member:testflight` — Production iOS build + TestFlight submit

## Local development (UI / Fast Refresh)

See **[docs/LOCAL_DEVELOPMENT.md](./docs/LOCAL_DEVELOPMENT.md)** for the recommended Cursor → Expo Go → Simulator/device workflow. Use TestFlight only for milestones and external beta.

## Friend demo

See [DEMO.md](./DEMO.md) for sample users, walkthrough tips, and Expo Go QR codes.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

### Supabase auth setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy **Project URL** and **anon public** key into `.env`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
```

3. In Supabase → **Authentication → URL Configuration**, add redirect URLs:
   - `openmat://`
   - `openmat://auth/reset`
   - `openmat-coach://` (Coach app)
   - Expo Go URLs as needed for local testing
4. Restart Expo after changing `.env` (`npx expo start --clear`)

Auth features included:

- Email/password **Login** and **Register**
- **Forgot Password** reset email
- Form validation, loading states, inline errors
- **Persistent sessions** via AsyncStorage
- Auto-route to **Home** after login
- Sign out from **Profile**
- Guest / demo mode for exploring without backend credentials

## Navigation map (Member)

1. **Auth stack** — Splash → Login / Register / Forgot Password
2. **Main tabs** — Home · Schedule · Workout Log · Community · Profile
