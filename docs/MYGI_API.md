# My Gi API

## Status

Foundation only (`api_clients` table). Do **not** expose Supabase directly as the public API.

## Planned model

- My Gi issues credentials **to** the academy
- Store **hash** of API key; show raw key once
- Scopes: `academy:read`, `locations:read`, `members:read`, `classes:read|write`, `attendance:read|write`, `events:read|write`
- Track created/last used/expires/revoked
- Rate limiting on the controlled API surface

## Security

Least privilege scopes only where underlying authorization can enforce them. Cross-academy access must fail.
