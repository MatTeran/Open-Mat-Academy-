# Platform Operations

## Day-to-day

1. Sign in to Command Center (`apps/platform-web`, port 3001)
2. Overview → KPIs and attention list
3. Onboard academy wizard for new gyms
4. Monitor onboarding pipeline
5. Review support / audit / system health

## SQL you should rarely need

Only for bootstrap:

- `scripts/apply-platform-admins-live.sql`
- `scripts/apply-command-center-operations.sql`

Normal academy launch should not require the SQL editor.

## Security reminders

- No service-role in browser
- Platform roles ≠ academy roles
- Private journals/notes stay out of Command Center
