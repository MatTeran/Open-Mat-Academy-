# Integration Operations

## Platform monitoring

Command Center:

- Platform → Integrations — provider catalog
- Data → Integrations — KPIs (empty until live traffic)

## Investigating failures

1. Check connection status / last error summary (sanitized)
2. Review `integration_logs` for operation + error_code
3. Test connection (server-side) after re-auth
4. Never request that operators paste secrets into tickets/logs

## Notifications (planned)

- Connection failed / reauthorization required
- Webhook failure rate elevated
- API key nearing expiration

## Audit actions (planned expansion)

Integration connected/disconnected/reauthorized, credential updated, webhook created/disabled/secret rotated, API key created/revoked — **without** secret values.
