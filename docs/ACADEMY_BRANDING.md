# Academy Branding

Academy-level branding lets each gym feel native inside My Gi without separate apps.

## Storage

Table: `academy_branding`  
Workflow: `draft` → `preview` → `published`

Fields: display name, location display text, primary/secondary/accent colors, logo/icon/hero asset ids.

## Media

Assets live in Supabase Storage buckets:

- `academy-branding`
- `academy-media`

Metadata: `media_assets` (never store binaries in Postgres rows).

## Command Center

Branding Studio UI is scaffolded under Platform → Media / academy detail. Publish requires platform ops (academy self-service via Coach Web is Phase 2).

## Accessibility

Academy colors must not defeat contrast requirements for core UI chrome.
