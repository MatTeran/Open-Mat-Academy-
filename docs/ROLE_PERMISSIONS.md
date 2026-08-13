# Role & Permission Model

## Academy membership roles

Stored on `academy_memberships.role` (source of truth):

| Role | Read academy content | Coach write | Manage (delete / memberships / locations) |
| --- | --- | --- | --- |
| `member` | Yes | No | No |
| `staff` | Yes | Yes | No |
| `coach` | Yes | Yes | No |
| `manager` | Yes | Yes | Yes |
| `owner` | Yes | Yes | Yes |
| `admin` (legacy) | Yes | Yes | Yes (maps to owner-tier) |

A user may hold **different roles in different academies**.

## App helpers (`@openmat/shared/auth/membership`)

| Helper | Meaning |
| --- | --- |
| `isAcademyMember` | Has any membership row for academy |
| `hasAcademyRole` | Membership role ∈ given list |
| `canAccessAcademy` | Alias of membership check |
| `canCoachAtAcademy` | owner/manager/coach/staff/admin |
| `canManageAcademy` | owner/manager/admin |
| `resolveAcademySessionContext` | Pick active academy + role |
| `sharesCoachableAcademyWith` | Coach shares academy with subject |

Legacy JWT helpers in `auth/roles.ts` remain for demo UI gates only.

## Database helpers (RLS)

| Function | Meaning |
| --- | --- |
| `is_academy_member(academy_id)` | Membership exists |
| `has_academy_role(academy_id, VARIADIC roles)` | Role match |
| `can_coach_at_academy(academy_id)` | Coach-tier write |
| `can_manage_academy(academy_id)` | Manager-tier |
| `shares_academy_with(user_id)` | Coach shares academy with practitioner |
| `class_academy_id` / `event_academy_id` | Child-table resolvers |

## Platform roles

Stored on `platform_admins.role` (My Gi Command Center only):

| Role | Directory read | Create org/academy / assign owner | Manage platform allowlist |
| --- | --- | --- | --- |
| `support` | Yes | No | No |
| `ops` | Yes | Yes | No |
| `superadmin` | Yes | Yes | Yes (future UI) |

Helpers: `isPlatformAdmin`, `canManagePlatformTenants`, `canAssignPlatformAdmins` in `@openmat/shared/auth/platform`.

SQL: `is_platform_admin()`, `platform_admin_role()`.

Do **not** overload academy `admin`/`owner` for platform administration.

## Leadership tags vs login roles

`academy_roles` (`assistant_coach`, `kids_coach`, …) are **operational tags**, not login permissions. They are academy-scoped and distinct from `academy_memberships.role`.
