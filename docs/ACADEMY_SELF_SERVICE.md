# Academy Self-Service

Academy owners/managers configure their academy without My Gi staff for routine setup.

## Where

Coach Web → **Academy Settings** (`/settings`)

Navigation:

- Overview
- Academy Profile
- Locations
- Branding
- Media Library
- Staff / Members / Schedule (scaffolded)
- Integrations
- Billing / Features / Invitations (scaffolded)
- Security

## Authorization

- Gated by `canManageAcademy(memberships, academyId)` (owner / admin / manager)
- Coaches may browse; mutations require manager tier
- Never elevates to platform admin

## Profile & locations

Demo mode uses an in-process academy-scoped store. Live mode writes to `academies` / `locations` under RLS (`can_manage_academy`).

Deactivating a location sets `active = false` without deleting historical data.

## Demo

Coach Web demo session is an **owner** so Settings is exercisable locally.
