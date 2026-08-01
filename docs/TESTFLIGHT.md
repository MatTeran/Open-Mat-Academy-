# Open Mat → TestFlight setup

This repo is wired for **EAS Build + EAS Submit** so both iOS apps can land on TestFlight:

| App | Path | iOS Bundle ID | ASC App ID |
| --- | --- | --- | --- |
| Member (User) | repo root | `com.openmat.academy` | `6797066496` |
| Coach | `apps/coach` | `OpenMatCoach` | `6797064049` |

> Coach Android package remains `com.openmat.coach`. iOS uses `OpenMatCoach` to match the existing App Store Connect app.

## What you need (credentials)

We cannot finish the upload from this cloud agent without these:

1. **Expo account** — create/login at [expo.dev](https://expo.dev)
   - Generate an access token: Expo → Account settings → Access tokens
   - Provide as `EXPO_TOKEN`
2. **Apple Developer Program** membership (paid team)
   - Team ID (10-character, e.g. `ABCD123456`) from [developer.apple.com/account](https://developer.apple.com/account)
3. **App Store Connect**
   - Create two iOS apps (or let EAS create them on first submit):
     - Open Mat Academy → `com.openmat.academy`
     - Open Mat Coach → `com.openmat.coach`
   - Copy each numeric **Apple ID / ascAppId** from App Information
4. **Preferred for CI / non-interactive submit:** App Store Connect API key
   - Keys → App Store Connect API → Generate
   - Provide: `ASC_API_KEY_PATH` (`.p8`), `ASC_API_KEY_ID`, `ASC_API_ISSUER_ID`

## One-time project init (after Expo login)

```bash
# Member
export EXPO_TOKEN=...
npx eas-cli login   # or rely on EXPO_TOKEN
npx eas-cli init --id   # creates Expo project + writes projectId into app.json

# Coach
cd apps/coach
npx eas-cli init --id
cd ../..
```

Then replace placeholders in:

- `app.json` / `apps/coach/app.json` → `extra.eas.projectId`, `owner`, `updates.url`
- `eas.json` / `apps/coach/eas.json` → `appleTeamId`, `ascAppId`

## Build + submit to TestFlight

```bash
# Member (User) app
npm run eas:member:build:ios
npm run eas:member:submit:ios
# or one shot:
npm run eas:member:testflight

# Coach app
npm run eas:coach:build:ios
npm run eas:coach:submit:ios
# or one shot:
npm run eas:coach:testflight
```

`production` builds use `"distribution": "store"` (required for TestFlight).

After Apple finishes processing (often 5–30 minutes), open **App Store Connect → TestFlight**, add internal testers, and install via the TestFlight app.

## First-submit checklist (Apple)

- [ ] Privacy Policy URL set in App Store Connect
- [ ] App icon / screenshots (can add after first build)
- [ ] Export compliance / encryption answers (usually “No” for standard HTTPS)
- [ ] Location usage strings already present on Member (`NSLocation*`)
- [ ] Push notification entitlement if enabling remote push (Member has notifications plugin)

## Notes

- Build numbers auto-increment via `"autoIncrement": true` + `"appVersionSource": "remote"`.
- Native signing credentials can be managed by EAS (recommended) the first time you build.
- Coach-web is **not** a TestFlight target (it's Next.js). Only Member + Coach mobile go to TestFlight.
