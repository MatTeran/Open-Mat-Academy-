# Phase 2 — My Gi Multi-Tenant Foundation Plan

Status: approved direction from architecture audit. Implementation is **additive and backward-compatible**. No Command Center. No second production academy. No Open Mat → My Gi rename pass.

## Goal

Keep the current Open Mat / My Gi single-academy experience working while making the data model and RLS safe for multiple independent academies later.

```
Organization → Academy → Location → Users / Coaches / Classes / Events
```

Practitioner journey/XP remains **user-owned**, not permanently owned by one academy.

---

## 1. Tables to add

| Table | Purpose |
| --- | --- |
| `organizations` | Top-level tenant group (academy chains / independent orgs) |
| `locations` | Physical sites under an academy |

## 2. Columns to add

| Table | Column(s) | Notes |
| --- | --- | --- |
| `academies` | `organization_id`, `slug`, `status`, `primary_location_id` (nullable) | Keep existing `id` text PK (`academy-open-mat`) |
| `coach_classes` | `location_id` nullable FK → `locations` | Operational relevance |
| `coach_events` | `location_id` nullable FK → `locations` | Free-text `location` kept for display |
| `coach_notes` | `academy_id` | Required for tenant RLS (missing today) |
| `promotion_history` | `academy_id` | Required for tenant RLS |
| `academy_roles` | `academy_id` | Leadership tags are academy-scoped; unique becomes `(member_id, academy_id, role)` |

**Not forced onto personal journey data:** workout logs, journey XP (still app-side / future user-scoped tables).

**`competition_profiles`:** remains `unique(member_id)` (practitioner-owned). Access via shared membership, not `academy_id` ownership.

**`attendance` / `event_rsvps`:** no new `academy_id`; isolate via parent `coach_classes` / `coach_events`.

## 3. Existing rows requiring backfill

| Entity | Action |
| --- | --- |
| Organization | Insert `org-open-mat` — “Open Mat Academy” |
| Academy | Upsert `academy-open-mat` linked to `org-open-mat` (no duplicate) |
| Location | Insert Tracy Naglee Rd location; set as academy primary |
| `coach_classes.location_id` | Set to Tracy location where `academy_id = academy-open-mat` |
| `coach_events.location_id` | Same |
| `coach_notes.academy_id` | Default `academy-open-mat` for nulls |
| `promotion_history.academy_id` | Default `academy-open-mat` for nulls |
| `academy_roles.academy_id` | Default `academy-open-mat` for nulls |

Memberships: cannot invent `auth.users` rows in SQL. Demo/guest remains memory-backed. Live projects should ensure staff have `academy_memberships` rows (documented).

## 4. Foreign keys

- `organizations` ← `academies.organization_id`
- `academies` ← `locations.academy_id`
- `locations` ← `academies.primary_location_id` (nullable, deferred/circular-safe)
- `locations` ← `coach_classes.location_id`, `coach_events.location_id`
- `academies` ← `coach_notes.academy_id`, `promotion_history.academy_id`, `academy_roles.academy_id`

## 5. Indexes

- `organizations(slug)` unique
- `locations(academy_id)`, `locations(academy_id, is_active)`
- `coach_classes(location_id)`, `coach_events(location_id)`
- `coach_notes(academy_id)`, `promotion_history(academy_id)`, `academy_roles(academy_id)`
- Existing `academy_memberships(user_id)` retained

## 6. RLS policies to replace

Drop/replace all policies that use:

- `using (true)` on tenant tables
- `is_coach_role()` / `is_manager_role()` **without** academy membership checks

Affected: announcements, coach_classes, attendance, coach_notes, techniques, coach_challenges, coach_achievements, coach_events, event_rsvps, media_*, notification_drafts, member_development, promotion_history, competition_profiles, academy_roles, audit_logs, academies, academy_memberships.

Legacy JWT helpers remain for demo UX only; **RLS will not trust them alone**.

## 7. RLS policies to add

Membership-scoped patterns:

- **Member read** of academy content: `is_academy_member(academy_id)` (published announcements, classes, events, techniques, etc.)
- **Coach write**: `can_coach_at_academy(academy_id)` (owner/manager/coach/staff/admin membership roles)
- **Manager delete/sensitive**: `can_manage_academy(academy_id)` (owner/manager/admin)
- **Own rows**: members read own attendance / RSVPs / development; coaches of shared academy for private notes
- **competition_profiles**: own OR coach shares at least one academy with subject member
- **attendance**: via `coach_classes.academy_id`
- **event_rsvps**: via `coach_events.academy_id`

## 8. Role model changes

| Layer | Role source |
| --- | --- |
| Academy permissions | `academy_memberships.role` — **source of truth** |
| JWT `role` | Optional UX hint / demo fallback only |
| Platform admin | Deferred (Command Center) |

Roles: `owner` | `manager` | `coach` | `staff` | `member` (+ legacy `admin` maps to owner-tier in helpers).

A user may hold different roles in different academies.

## 9. Repository changes

- Filter/list by session `academyId` for coach repos (classes, announcements, etc.)
- Memory repos used in demo accept multi-academy seeds; default seed remains `academy-open-mat`
- Pass `academyId` when creating coach notes / promotions
- Types: `Organization`, `Location`, `AcademyMembership`, academy-scoped permission helpers

## 10. App-session changes

- Coach Web: session includes memberships; `academyId` from active membership (default first coach-tier membership, fallback `academy-open-mat` in demo)
- Coach Mobile: same default academy context; no academy switcher UI
- Member app: unchanged UX; academy constants remain for Tracy content

## 11. Automated isolation tests

Without requiring a live Supabase project in CI:

1. **Unit tests** for membership-scoped TS helpers (Academy A vs B)
2. **Memory repository tests** proving cross-academy filtering for classes/notes
3. **SQL policy matrix** documented + helper SQL unit coverage via documented expected predicates
4. Synthetic academies: `academy-test-a`, `academy-test-b` (test-only IDs in fixtures — not production onboarding)

Assertions:

1. Coach A cannot read B classes  
2. Coach A cannot modify B classes  
3. Coach A cannot read B coach notes  
4. Owner A cannot access unrelated B  
5. Member A cannot access another member’s private notes  
6. Dual-membership user only sees permitted data per academy context  
7. Open Mat (`academy-open-mat`) workflows still function  

## Out of scope

- My Gi Command Center app  
- Second real academy onboarding  
- Rebrand rename pass  
- Billing logic  
- Destructive drops of tables/columns  

## Migration file

Single additive migration:

`supabase/migrations/20260809180000_multi_tenant_foundation.sql`
