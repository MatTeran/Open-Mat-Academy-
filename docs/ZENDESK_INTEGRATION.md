# Zendesk Integration

## Status

**Not live.** Provider is registered as `beta` with `connectable: false` until the Phase 2 checkpoint is approved.

## Planned V1

- Connect via OAuth when practical, or manual subdomain + email + API token
- Test connection before enabling
- Create support request with academy/user context (no journals / secrets)
- Health: last success/failure, sanitized errors
- Activity via `integration_logs`

## Context allowed on tickets

Academy name/id, organization id, location, user id, app, app version, platform, timestamp, screen, issue category, user description, subscription plan.

## Context forbidden

Private journal content, passwords, API credentials, auth tokens, sensitive private notes.

## Docs to verify before implementation

Official Zendesk API authentication docs (current OAuth / API token requirements) — do not assume outdated methods.
