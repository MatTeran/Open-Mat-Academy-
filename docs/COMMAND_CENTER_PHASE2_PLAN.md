# Command Center Phase 2 Plan

Status: **Checkpoint 1–13 complete** (awaiting approval before Zendesk live connect).

---

## CURRENT STATE (Phase 1 + Phase 2 checkpoint)

| Area | Status |
| --- | --- |
| App | `apps/platform-web` Next.js 15, port 3001 |
| Auth | Demo cookie or live Supabase + `platform_admins` |
| Shell | Collapsible left nav + Quick Add + search |
| Overview | Real tenant counts; WAU/MAU/MRR unavailable by design |
| Orgs / Academies / Locations | List + DataTable; academy detail tabs |
| Onboarding | Stepper UI + provision form; optional integrations callout |
| Ops schema | Plans, subscriptions, features, branding, media_assets, audit, support |
| Phase 2 schema | Integration providers/connections/credentials/logs, webhooks, api_clients |
| Storage buckets | `academy-branding`, `academy-media` |
| Coach Web | Academy Settings self-service (profile, locations, branding, media, integrations, security) |
| Integrations Hub | Platform + academy UI; Zendesk `connectable: false` |
| Secrets | AES-GCM vault abstraction; memory vault for demo/tests |

---

## PHASE 1 CAPABILITIES

- Platform-only privilege (`platform_admins`)
- Tenant directory + onboarding provision
- Honest KPI unavailable states
- Additive ops tables + docs pack

---

## MISSING / DEFERRED PAST CHECKPOINT

1. Live Zendesk OAuth / API token connect + `testConnection` adapter
2. Webhook delivery worker + secret rotation UI
3. My Gi API key issuance
4. Integration analytics with real traffic
5. Live Supabase wiring for Coach Web settings (demo store today)
6. Storage signed upload from Coach Web

---

## UI CHANGES

- Design tokens: ivory `#F5F3EE`, surface `#FAF9F6`, ink `#20201E`, mute `#6F6C66`, bronze `#9A6735`
- Collapsible sidebar, Quick Add menu, DataTable
- Integrations under Platform + Data → Integrations

---

## SELF-SERVICE CHANGES (Coach Web)

Routes under `(app)/settings/*` for academy owners/managers:

- Profile, Locations, Branding Studio, Media, Integrations, Security (+ scaffolds)

Gated by `canManageAcademy` — never platform admin pages.

---

## INTEGRATION ARCHITECTURE

Tables: `integration_providers`, `integration_connections`, `integration_credentials` (ciphertext only), `integration_logs`, `webhook_*`, `api_clients`

TS: adapter interface; registry; `CredentialVault` (AES-GCM + memory)

UI shows Zendesk as **beta / not connectable** until approval.

---

## SECURITY REQUIREMENTS

- No service-role in browser
- Credentials encrypted; never in audit metadata / client responses
- Academy-scoped RLS on connections/credentials/media
- Platform admins see connection health, never secrets

---

## DATABASE / STORAGE CHANGES

`supabase/migrations/20260815180000_command_center_phase2_integrations.sql`  
`scripts/apply-command-center-phase2.sql`

---

## IMPLEMENTATION ORDER (checkpoint)

1. Audit / plan ✅  
2–7. Design system + Command Center polish ✅  
8–10. Self-service + Branding + Media ✅  
11–13. Integration architecture + vault + Hub UI ✅  
**STOP** — await approval before Zendesk live connect
