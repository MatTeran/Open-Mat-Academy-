# Command Center Phase 2

Status: **Checkpoint 1–13 complete**. Live Zendesk connect is **gated** pending approval.

## What shipped

- Ivory / bronze design system polish (Command Center)
- Collapsible nav, Quick Add, DataTable, Integrations Hub UI
- Academy Self-Service in Coach Web (`/settings/*`)
- Branding Studio (draft → preview → publish) with contrast warnings
- Media Library (server validation + metadata registration)
- Integration provider registry + credential vault abstraction
- Additive migration `20260815180000_command_center_phase2_integrations.sql`

## Apps

| App | Port | Notes |
| --- | --- | --- |
| `apps/platform-web` | 3001 | My Gi Command Center |
| `apps/coach-web` | 3000 | Academy Settings self-service |

## Checkpoint gate

Do **not** request or store a real Zendesk API token until this checkpoint is approved.

See:

- `COMMAND_CENTER_PHASE2_PLAN.md`
- `INTEGRATIONS_ARCHITECTURE.md`
- `INTEGRATION_SECURITY.md`
- `ACADEMY_SELF_SERVICE.md`
- `ACADEMY_BRANDING.md`
- `MEDIA_MANAGEMENT.md`
