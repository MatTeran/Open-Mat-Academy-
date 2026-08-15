# Phase 3 — My Gi Command Center (foundation)

Status: implementation in progress on `apps/platform-web`.

## Goals

- Platform operators can view the org → academy → location directory
- Create organizations / academies / locations (ops+)
- Assign academy owners via `academy_memberships` (ops+)
- Platform privilege is **separate** from academy `owner`/`admin`

## Non-goals (this slice)

- Full billing / Stripe
- Second real production academy onboarding beyond create+seed owner
- Open Mat → My Gi rename pass
- Replacing coach-web `/command-center` (that remains academy mission control)

## Naming

| Product | App | Audience |
| --- | --- | --- |
| Coach Command Center | `apps/coach-web` `/command-center` | Academy coaches |
| My Gi Command Center | `apps/platform-web` | My Gi platform staff |

## Schema

`platform_admins(user_id, role)` with roles `superadmin` | `ops` | `support`.

SQL helper: `is_platform_admin()` — used only for platform RLS, never as academy permission.

## App slices

1. Demo login + session cookie  
2. Organizations directory  
3. Organization detail (academies)  
4. Academy detail (locations + memberships + assign owner)  
5. Unit tests for platform helpers + directory memory repo  

## Security

- No service-role keys in the browser  
- Live writes require authenticated platform admin JWT + RLS  
- Demo mode uses in-memory fixtures only  
