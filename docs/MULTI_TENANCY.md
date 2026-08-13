# My Gi Multi-Tenancy

## Hierarchy

```
Organization
  └── Academy
        └── Location
              └── Users / Coaches / Classes / Events
```

| Level | Stable Open Mat ids |
| --- | --- |
| Organization | `org-open-mat` |
| Academy | `academy-open-mat` |
| Location | `location-tracy-naglee` (Tracy, CA) |

## Principles

1. **Academy memberships** (`academy_memberships`) are the source of truth for academy permissions.
2. JWT `role` is a demo/UX hint only — not sufficient for tenant isolation.
3. Practitioner journey/XP remains **user-owned**, not permanently owned by one academy.
4. Official belt records (`member_development`) are academy-scoped; a practitioner may have one development row per academy.
5. Private coach notes are academy-scoped and never exposed to Member app queries.

## Resolving academy context in apps

1. Load `academy_memberships` for `auth.uid()`.
2. Choose active academy (preferred id, else first coach-tier membership).
3. Pass `academyId` into repositories / mutations.
4. Demo/guest fallback: `academy-open-mat` via `resolveAcademySessionContext()`.

Coach Web session fields: `organizationId`, `academyId`, `locationId`, `memberships`, `membershipRole`.

No academy switcher UI in Phase 2 — single-academy UX preserved.

## Adding another academy later (safely)

1. Insert `organizations` / `academies` / `locations` rows.
2. Create `academy_memberships` for staff and members.
3. Confirm RLS helpers (`is_academy_member`, `can_coach_at_academy`) gate all tenant tables.
4. Run isolation tests with synthetic academies before production onboarding.
5. Do **not** rely on JWT global role for cross-academy access.

## Migration

See `supabase/migrations/20260809180000_multi_tenant_foundation.sql` and `docs/MIGRATION_NOTES.md`.
