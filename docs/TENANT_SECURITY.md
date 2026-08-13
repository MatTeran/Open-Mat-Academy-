# Tenant Security

## Strategy

Every academy-scoped table is protected by **Row Level Security** that checks `academy_memberships` for `auth.uid()`. Broad policies such as `using (true)` or JWT-only `is_coach_role()` were replaced in Phase 2.

UI hiding is not security. Enforcement is in Postgres RLS + server/repository academy filters.

## Policy matrix (Phase 2)

| TABLE | SELECT | INSERT | UPDATE | DELETE | TENANT CHECK | ROLE CHECK |
| --- | --- | --- | --- | --- | --- | --- |
| organizations | members of org academies | — | — | — | via academies↔memberships | membership |
| academies | member | — | — | — | `is_academy_member(id)` | membership |
| locations | member | manager | manager | manager | `academy_id` | coach/manage |
| academy_memberships | self or coach-at-academy | manager | manager | manager | `academy_id` | coach read / manage write |
| announcements | member (published/own/coach) | coach | coach | manager | `academy_id` | coach/manage |
| coach_classes | member | coach | coach | manager | `academy_id` | coach/manage |
| attendance | own or coach | coach | coach | manager | via `class_academy_id` | coach/manage |
| coach_notes | coach | coach (author) | coach | manager | `academy_id` | coach/manage |
| techniques | member | coach | coach | manager | `academy_id` | coach/manage |
| coach_challenges | member | coach | coach | manager | `academy_id` | coach/manage |
| coach_achievements | member | coach | coach | manager | `academy_id` | coach/manage |
| coach_events | member (published/coach) | coach | coach | manager | `academy_id` | coach/manage |
| event_rsvps | own or coach | member (own) | member (own) | manager | via `event_academy_id` | membership/coach |
| media_albums | member | coach | coach | manager | `academy_id` | coach/manage |
| media_items | member | coach | coach | manager | `academy_id` | coach/manage |
| notification_drafts | coach | coach | coach | manager | `academy_id` | coach/manage |
| member_development | own or coach | coach | coach | manager | `academy_id` | coach/manage |
| promotion_history | own or coach | coach (self author) | manager | manager | `academy_id` | coach/manage |
| competition_profiles | own or shared coach | own/shared coach | own/shared coach | shared manager | shared membership | coach/manage |
| academy_roles | own or coach | coach | coach | manager | `academy_id` | coach/manage |
| audit_logs | coach | coach (self actor) | denied | denied | `academy_id` | coach |

## Flags / remaining risks

1. **Live memberships must exist** for real Supabase users — demo/guest uses memory fallback and does not insert `auth.users`.
2. **Member roster repository** is still memory-backed (`profiles` table not yet shared).
3. **Member development Supabase repository** is still a stub (memory fallback).
4. **Platform admin** path not implemented — do not grant service-role keys to client apps.
5. Apply migration to the live Supabase project before relying on RLS in production.
6. Legacy `is_coach_role()` / `is_manager_role()` remain defined but must not be reintroduced into tenant policies.
7. **Table GRANTs required** — RLS policies alone are not enough. `authenticated` must have `SELECT/INSERT/UPDATE/DELETE` on tenant tables (see `20260813120000_grant_authenticated_table_privileges.sql`). Without grants, PostgREST returns `42501` before RLS runs.
8. **academy_memberships SELECT** must use `can_coach_at_academy(academy_id)` (or tighter), never JWT-only `is_coach_role()` / `is_manager_role()`. A JWT coach role with an unscoped policy exposes every academy roster.

## Isolation tests

See `apps/coach-web/src/__tests__/tenancy.test.ts` (synthetic `academy-test-a` / `academy-test-b`).
