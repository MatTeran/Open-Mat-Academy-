# Webhooks

## Status

Schema foundation shipped (`webhook_endpoints`, `webhook_deliveries`). Delivery worker, signing UI, and retries land after checkpoint.

## Planned events

- `academy.member.joined` / `left` / `promoted`
- `academy.class.created` / `completed`
- `academy.attendance.recorded`
- `academy.event.created` / `academy.event.registration.created`
- `academy.coach.invited`
- `academy.location.created`

## Security

- HTTPS destinations only
- HMAC signature over event id, type, timestamp, academy id, payload
- Signing secret sealed in credential vault; shown once; rotatable
- No arbitrary JavaScript execution

## Delivery

Track attempt, HTTP status, duration, result. Exponential backoff with finite retries. Inspect failures in Academy Settings → Integrations → Webhooks.
