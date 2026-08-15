# Integrations Architecture

Generic provider framework — **not** Zendesk-specific throughout the app.

## Concepts

| Concept | Purpose |
| --- | --- |
| `IntegrationProvider` | Platform catalog row (`integration_providers`) |
| `IntegrationConnection` | Academy-scoped connection (`integration_connections`) |
| `IntegrationCredential` | Encrypted secrets (`integration_credentials`) |
| `IntegrationLog` | Sanitized activity (`integration_logs`) |
| `WebhookEndpoint` / `WebhookDelivery` | Outbound My Gi events (foundation) |
| `ApiClient` | Future academy-facing API keys (hashed) |

## TypeScript

- `@openmat/shared/integrations/providers` — registry + adapter interface
- `@openmat/shared/integrations/credentialVault` — seal/open; public DTO never includes secrets

## Adapter contract

```ts
interface IntegrationProviderAdapter {
  readonly id: IntegrationProviderId;
  testConnection(config: Record<string, unknown>): Promise<TestConnectionResult>;
  getConnectionHealth?(connectionId: string): Promise<ConnectionHealth>;
}
```

Zendesk implements this **after** checkpoint approval.

## UI levels

1. **Platform** — Command Center → Platform → Integrations (catalog + health)
2. **Academy** — Coach Web → Settings → Integrations (per-academy connect)

## Status values

`not_connected` · `connecting` · `connected` · `degraded` · `error` · `reauthorization_required` · `disabled`

## Adding a future provider

1. Insert `integration_providers` row
2. Add registry meta in `providers.ts`
3. Implement adapter
4. Wire entitlement feature flag
5. Add tests with mocked provider — no real credentials in CI
