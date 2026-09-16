# My Gi — Friend Demo Guide

Offline sample data + demo logins so you can walk a friend through both apps without Supabase.

## Quick start

```bash
npm install
npm run start:member   # Member (User) app — Expo Go
npm run start:coach    # Coach app — Expo Go (separate terminal)
```

Scan the QR codes in [`assets/demo/`](./assets/demo/) (regenerate with `npm run demo:qr` while tunnels are running).

## Demo accounts

Password for all accounts: **`demo1234`**

### Member (User) App

| Email | Persona | What to show |
| --- | --- | --- |
| `alex@openmat.demo` | Alex Chen — Blue 2 | Full athlete hub (default / prefilled) |
| `jordan@openmat.demo` | Jordan Lee — White 4 | Near blue-belt evaluation story |
| `sam@openmat.demo` | Sam Ortiz — Purple 1 | Higher-belt competitor / assistant path |

Or tap **Continue as Guest** → loads as **Alex Chen**.

### Coach App

| Email | Persona | What to show |
| --- | --- | --- |
| `coach@openmat.demo` | Coach Rivera | Dashboard, check-in, members, announcements |
| `owner@openmat.demo` | Mat Teran (Owner) | Same coach surfaces with owner role |

Or tap **Continue as Coach Guest** → **Coach Rivera**.

## Sample academy roster (Coach)

Members seeded for the demo (shared story with the Member app):

- Alex Chen (Blue 2) — competition team, checked in today
- Jordan Lee (White 4) — late check-in, blue-belt track
- Sam Ortiz (Purple 1) — assistant coaching notes
- Riley Brooks (White 2) — waitlist today
- Casey Nguyen (Blue 1) — marked absent
- Morgan Diaz (Blue 0) — past-due membership
- Ava Park (White 1) — kids program
- Diego Alvarez (Purple 2) — competition gold
- Maya Chen (Blue 3) — sibling of Alex, reserved advanced

Plus weekly classes, attendance, announcements, journey/XP, community feed, and workout logs.

## Suggested 5-minute walkthrough

1. **Member QR** → sign in as Alex → Home (next class, journey) → Schedule → Log → Community → Profile  
2. **Coach QR** → sign in as Coach Rivera → Dashboard → Check-In → Members (open Alex) → Announcements  
3. Point out the same names appear in both apps (one academy story)

## QR codes

| App | File | URL file |
| --- | --- | --- |
| Member | `assets/demo/member-qr.png` | `assets/demo/member-expo-url.txt` |
| Coach | `assets/demo/coach-qr.png` | `assets/demo/coach-expo-url.txt` |

Regenerate live tunnel QRs:

```bash
# Terminal A
npm run start:member:tunnel
# Terminal B
npm run start:coach:tunnel
# Then
npm run demo:qr
```

Requires Expo Go on the friend’s phone (SDK 54).
