# My Gi — Local Development

Use this workflow for day-to-day UI work. **Do not cut a TestFlight build** for normal JavaScript/TypeScript/layout changes.

TestFlight remains for milestone / external beta / native-config changes. See [TESTFLIGHT.md](./TESTFLIGHT.md).

---

## Architecture (current)

| Item | Value |
| --- | --- |
| Framework | **Expo** (managed workflow) |
| Expo SDK | **54** |
| React Native | **0.81.5** |
| Entry app | Member app at **repo root** |
| Native folders | **No checked-in `/ios` or `/android`** (generated only when needed; gitignored) |
| Local runtime | **Expo Go** (preferred for UI) |
| Production | **EAS Build** → App Store Connect → TestFlight |
| Bundle ID | `com.openmat.academy` |
| Monorepo | Member (root) · Coach (`apps/coach`) · Coach Web (`apps/coach-web`) |

### Why Expo Go works for UI

The member app is structured for Expo Go. Native-capable packages such as Reanimated, Gesture Handler, SVG, Linear Gradient, fonts, haptics, location, and notifications are used via Expo-compatible APIs.

`@stripe/stripe-react-native` is listed as a dependency but **is not mounted** in `App.tsx` (only a JS config stub exists). Until StripeProvider is wired, Expo Go remains the correct daily driver.

`eas.json` already has a `development` profile (`developmentClient: true`) for a future custom Dev Client if you later need Stripe native payments or other modules Expo Go cannot load. That is **optional** and separate from production TestFlight.

---

## One-time setup

```bash
cd /path/to/Open-Mat-Academy-
npm install
cp .env.example .env
```

Edit `.env` with your Supabase keys when you want real auth/backend. For pure UI work you can still launch and use **Guest / demo** login without a working Supabase project.

Restart Metro after any `.env` change:

```bash
npm run dev:clear
```

---

## LOCAL DEVELOPMENT

### Start the Metro / Expo server

```bash
npm run dev
```

Equivalent:

```bash
npx expo start
# or
npm start
```

Clear cache if something looks stale:

```bash
npm run dev:clear
```

Tunnel (useful when the phone is on a different network):

```bash
npm run dev:tunnel
```

---

## iOS SIMULATOR

Requires a Mac with Xcode + Simulator installed.

```bash
npm run ios
```

Or from an already-running `npm run dev` session, press:

```text
i
```

That opens the Member app in the iOS Simulator via Expo Go (installs Expo Go in the simulator if needed).

---

## ANDROID EMULATOR

Requires Android Studio with an AVD running (or start one from Device Manager).

```bash
npm run android
```

Or from `npm run dev`, press:

```text
a
```

---

## PHYSICAL IPHONE (Expo Go)

This project uses **Expo Go** for physical-device UI development.

1. Install **Expo Go** from the App Store on your iPhone.
2. Put phone and computer on the **same Wi‑Fi** (or use tunnel).
3. Start the server:

   ```bash
   npm run dev
   ```

4. Scan the QR code shown in the terminal with:
   - **iOS Camera** app, or
   - Expo Go → **Scan QR code**
5. The Member app loads. Save files in Cursor → **Fast Refresh** updates the UI in seconds.

If LAN discovery fails:

```bash
npm run dev:tunnel
```

Then scan the new QR code.

### Demo login (no backend required)

See [DEMO.md](../DEMO.md). Example:

- Email: `alex@openmat.demo`
- Password: `demo1234`
- Or tap **Continue as Guest**

---

## FAST REFRESH

While Metro is running:

1. Change a file in Cursor (colors, components, screens, etc.).
2. Save.
3. Simulator / Expo Go updates automatically.

Works well for:

- Colors, typography, spacing
- Cards, buttons, icons
- Navigation structure (usually)
- Animations (Reanimated)
- Gradients (`expo-linear-gradient`)
- Layout / charts / images / SVG medals

If a change does not appear:

```bash
# In the Metro terminal
r          # reload
# or restart with a clean cache
npm run dev:clear
```

Full app reloads (not just Fast Refresh) are normal after edits to:

- `app.json` / plugins
- native config
- some Babel / Metro config
- environment variables

---

## ENVIRONMENT & BACKEND

Local Expo loads **client** variables from `.env` (`EXPO_PUBLIC_*`).

| Service | Local source | Notes |
| --- | --- | --- |
| Supabase Auth / DB | `.env` → `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same project as production if you paste production keys |
| Stripe | Optional `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Not wired in UI root yet |
| Demo / Guest | In-app mocks | Works offline without Supabase |
| Push / Location | Expo Go capabilities | Full production push behavior still validated on TestFlight |
| EAS production env | Expo dashboard “production” env | Used by cloud builds, not by `npm run dev` |

**Important:** If your local `.env` points at the production Supabase project, local logins and writes hit **real production data**. Do not create a new database as part of this workflow unless you intentionally set up separate Dev / Staging projects later.

Recommended later (not required now):

1. Development Supabase project  
2. Staging  
3. Production  

---

## TROUBLESHOOTING

### Metro cache / weird UI

```bash
npm run dev:clear
```

### “Unable to resolve module” after pulling

```bash
rm -rf node_modules
npm install
npm run dev:clear
```

### Simulator won’t open

- Confirm Xcode Command Line Tools: `xcode-select -p`
- Open Simulator once from Xcode → Open Developer Tool → Simulator
- Then `npm run ios`

### Phone can’t connect

- Same Wi‑Fi as the computer, or use `npm run dev:tunnel`
- Disable VPN temporarily
- Ensure firewall allows Node / Expo

### Env vars not updating

- Edit `.env`
- Restart with `npm run dev:clear`
- Never commit `.env` (gitignored)

### Native dependency / plugin change

If you add a module that Expo Go cannot load (e.g. wire `@stripe/stripe-react-native` with `StripeProvider`):

1. Add `expo-dev-client`
2. Build once with EAS profile `development` (already defined in `eas.json`)
3. Install that Dev Client on your phone
4. Continue using `npm run dev` against the Dev Client

Until then, stay on Expo Go.

---

## TESTFLIGHT — when you still need it

Use TestFlight / release builds when:

- External testers need a signed build
- Native dependencies or config plugins change
- Push notification entitlements / permissions change
- You need production signing validation
- You ship a milestone (e.g. Version W.1) for beta review

**Not required for:**

- Home / Progress / Gallery UI polish
- Copy, colors, spacing, typography
- Most navigation and mock-data changes

Production commands (unchanged):

```bash
npm run eas:member:testflight
```

Details: [TESTFLIGHT.md](./TESTFLIGHT.md).

---

## Daily workflow (cheat sheet)

```text
Terminal:
  npm run dev

Then:
  press i  → iOS Simulator
  press a  → Android Emulator
  scan QR  → physical iPhone (Expo Go)

Cursor:
  edit → save → Fast Refresh → review → repeat

Milestone only:
  npm run eas:member:testflight
```

### Helpful scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start Expo / Metro |
| `npm run dev:clear` | Start with cleared Metro cache |
| `npm run dev:tunnel` | Start with tunnel (remote networks) |
| `npm run ios` | Start + open iOS Simulator |
| `npm run android` | Start + open Android Emulator |
| `npm run typecheck` | TypeScript check (member) |
| `npm run lint` | Alias of typecheck |
| `npm run eas:member:testflight` | Production iOS build + submit |
