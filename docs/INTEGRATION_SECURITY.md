# Integration Security

## Rules

- Never store integration secrets as plaintext JSON in `configuration`
- Never return secrets to the browser after submit
- Never log tokens / passwords / signing secrets
- Never put secrets in audit metadata
- Credentials decrypt only server-side at execution time

## Credential vault

`CredentialVault` (`AesGcmCredentialVault`):

- Env: `INTEGRATION_CREDENTIALS_MASTER_KEY` (32-byte base64 preferred)
- Fail closed if missing (except demo/`VITEST` memory vault)
- Public view: `maskedHint`, `updatedAt`, `secretAvailable` only

Production should migrate the master key to a KMS (AWS KMS / GCP KMS / Vault) behind the same interface.

## Tenant isolation

- Connections and credentials carry `academy_id`
- RLS: `can_manage_academy(academy_id)` or `is_platform_admin()`
- Platform admins see health, never ciphertext via normal UI DTOs

## Zendesk checkpoint

Live OAuth / API token connect is disabled (`connectable: false`) until approval. Do not paste real tokens into demo forms.
