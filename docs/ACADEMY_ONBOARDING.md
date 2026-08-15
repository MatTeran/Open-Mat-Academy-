# Academy Onboarding

## Goal

My Gi ops onboard academies from Command Center **without manual Supabase edits**.

## Flow

1. Open `/onboarding/new`
2. Create or select organization
3. Create academy + primary location
4. Assign owner (existing auth user UUID for live; any id in demo)
5. Choose plan (trial by default — no charge until billing connected)
6. Confirm → provisioning

## Provisioning

- **Demo:** memory tenant directory creates org/academy/location/owner
- **Live:** `provision_academy(...)` SECURITY DEFINER RPC (requires `is_platform_admin()`)

Creates (when migration applied):

- organization (optional)
- academy
- location
- owner `academy_memberships` row
- `academy_subscriptions`
- `academy_onboarding` + milestones
- `academy_branding` draft
- `platform_audit_logs` event

## Pipeline

Statuses: lead → invited → account_created → … → live / stalled  
Percent = completed milestones / total milestones (`calculateOnboardingPercent`).

## Apply SQL

`scripts/apply-command-center-operations.sql`
