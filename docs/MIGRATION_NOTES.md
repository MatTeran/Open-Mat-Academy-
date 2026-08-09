# Migration Notes — Phase 2 Multi-Tenant Foundation

## File

`supabase/migrations/20260809180000_multi_tenant_foundation.sql`

## Nature

Additive and backward-compatible:

- No table drops
- No academy id renames (`academy-open-mat` retained)
- Existing Open Mat academy experience continues

## What it does

1. Creates `organizations` and `locations`
2. Adds `organization_id` / `slug` / `status` / `primary_location_id` on `academies`
3. Backfills Open Mat org + academy + Tracy location
4. Adds `location_id` to `coach_classes` and `coach_events`
5. Adds `academy_id` to `coach_notes`, `promotion_history`, `academy_roles`
6. Installs membership-scoped SQL helpers
7. Replaces overly broad RLS policies

## Backfilled rows

| Row | Id |
| --- | --- |
| Organization | `org-open-mat` |
| Academy | `academy-open-mat` |
| Location | `location-tracy-naglee` |

Existing Open Mat class/event/note/promotion/role rows are stamped with Tracy location / `academy-open-mat` where null.

## Apply

```bash
# Against your Supabase project (local or linked)
supabase db push
# or run the SQL file in the Supabase SQL editor
```

## Rollback guidance

Prefer forward-fix migrations. If urgently needed:

1. Restore prior RLS policies from Phase 1–2 migrations (not recommended once multi-tenant data exists).
2. Do not delete `organizations` / `locations` if app code already depends on them.

## App impact

- Coach Web demo session includes membership context for `academy-open-mat`
- Coach mobile continues using `COACH_ACADEMY_ID` / `COACH_LOCATION_ID`
- Member app UX unchanged

## Not included

- My Gi Command Center
- Second production academy
- Billing
- Open Mat → My Gi rename pass
