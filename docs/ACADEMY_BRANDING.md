# Academy Branding

Academy-level branding lets each gym feel native inside My Gi without separate apps.

## Storage

Table: `academy_branding`  
Workflow: `draft` → `preview` → `published`

Fields: display name, location display text, primary/secondary/accent colors, logo/icon/hero asset ids.

## Branding Studio (Phase 2)

Coach Web → Academy Settings → Branding

- Edit draft without affecting live experience
- Contrast warnings via `validateBrandColors`
- Device previews (mobile / tablet / desktop) using reusable preview panels — not fake screenshots
- Publish copies draft into the published snapshot used by the live experience

My Gi core navigation and safety-critical chrome remain platform-controlled.

## Media

Assets live in Supabase Storage buckets:

- `academy-branding`
- `academy-media`

Metadata: `media_assets` (never store binaries in Postgres rows).

## Accessibility

Academy colors must not defeat contrast requirements for core UI chrome. Warnings are advisory in V1; blocking gates can be added later.
