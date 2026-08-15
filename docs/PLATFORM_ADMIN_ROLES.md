# Platform Admin Roles

Stored on `platform_admins.role` — **never** academy `owner`/`admin`.

| Role | Directory | Provision / mutate tenants | Manage platform allowlist |
| --- | --- | --- | --- |
| `support` | Read | No | No |
| `ops` | Read/write | Yes | No |
| `superadmin` | Read/write | Yes | Yes |

Helpers: `@openmat/shared/auth/platform`  
SQL: `is_platform_admin()`, `platform_admin_role()`

All allowlist changes and sensitive ops must write `platform_audit_logs`.
