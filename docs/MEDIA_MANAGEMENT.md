# Media Management

## Principles

- Binaries in Storage, metadata in `media_assets`
- Academy-scoped isolation via `academy_id` + RLS
- Platform admins list via Command Center → Media
- Academy owners upload via Coach Web → Settings → Media Library

## Types

`academy_logo`, `academy_icon`, `academy_mobile_hero`, `academy_desktop_hero`, `location_photo`, `coach_profile`, `event_image`, `curriculum_media`, `other`

## Validation

Shared helper `@openmat/shared/integrations/mediaValidation`:

- Allowlisted image MIME types only
- Reject executables / scripts / HTML / SVG
- Enforce max size per type
- Server-side validation required (never client-only)

## Buckets

Created by `20260815120000_command_center_operations.sql`:

- `academy-branding` (private)
- `academy-media` (private)

Phase 2 migration expands manager RLS on `media_assets` via `can_manage_academy`.
