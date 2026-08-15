# My Gi Coach

Phase 1 Expo app for academy coaches and staff.

## Run

From the monorepo root:

```bash
npm install
npm run start:coach
```

Or from this package:

```bash
npm start --workspace=@openmat/coach
```

## Shared packages

Uses `@openmat/shared` for:

- Theme (coach palette)
- Auth + Supabase client
- UI primitives (`Screen`, `Card`, `Button`, `Text`, `Input`, `Banner`, `IconBadge`)
- Domain types
- Repository services (classes, attendance, announcements, coach notes, members)

## Phase 1 surfaces

1. Dashboard
2. Class management
3. Digital check-in
4. Member management + private coach notes
5. Announcements
6. Create modal

Guest coach mode works without Supabase credentials.
