# Open Mat Academy

Premium Brazilian Jiu-Jitsu academy apps for **Open Mat Academy** (Tracy, CA).

Cloned and rebranded from Dark Mat with the official Gracie Fighter / Open Mat Academy black-and-white identity. Built with React Native, Expo SDK 54, TypeScript, Supabase, NativeWind, React Navigation, Stripe, and React Query.

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

| Token | Value |
| --- | --- |
| Primary background | `#000000` |
| Secondary background | `#111111` |
| Accent | `#FFFFFF` |
| Text | `#FFFFFF` |
| Secondary text | `#A0A0A0` |
| Error | `#FF4D4D` |
| Success | `#22C55E` |

- **Brand name:** Open Mat  
- **Academy:** Open Mat Academy  
- **Logo:** Official Gracie Fighter / Open Mat Academy seal (black & white)  
- **Typography:** Syne (display) + Outfit (UI)

## Scripts

- `npm start` / `npm run start:member` — Member Expo app
- `npm run start:coach` — Coach Expo app
- `npm run start:coach-web` — Coach Web (Next.js)
- `npm run typecheck:all` — Member + Coach + Coach Web TypeScript
- `npm run test:coach-web` — Coach Web unit tests

## Friend demo

See [DEMO.md](./DEMO.md) for sample users, walkthrough tips, and Expo Go QR codes.

## Getting started

```bash
npm install
cp .env.example .env
npm start
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
