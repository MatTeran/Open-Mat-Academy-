# Media Management

## Principles

- Binaries in Storage, metadata in `media_assets`
- Academy-scoped isolation via `academy_id` + RLS
- Platform admins manage via Command Center; academy self-service later

## Types

`academy_logo`, `academy_icon`, `academy_mobile_hero`, `academy_desktop_hero`, `location_photo`, `coach_profile`, `event_image`, `curriculum_media`, `other`

## Validation (app layer)

- Allow image MIME types only for branding uploads
- Reject executables
- Enforce size/dimension guidance in UI copy

## Buckets

Created by `20260815120000_command_center_operations.sql`:

- `academy-branding` (private)
- `academy-media` (private)

V1 storage policies favor platform admins; expand carefully for academy coaches without cross-tenant leaks.
