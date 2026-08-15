# Platform Analytics

## Available now

From tenant tables (when live):

- Organizations / academies / locations counts
- Practitioner count (`academy_memberships.role = member`)
- Coach-tier count
- Active academies (`academies.status = active`)
- Trial academies (`academy_subscriptions.status = trial`) when operations migration applied

## Unavailable until instrumented

| Metric | Why |
| --- | --- |
| WAU / MAU | No activity event stream yet |
| Classes attended / sessions logged | Need engagement events |
| MRR / ARR / churn / conversion | No payment provider webhooks yet |

Do not fabricate these values. Overview cards show `—` with an explicit reason.

## Dashboards

- `/data/executive`
- `/data/academy-health`
- `/data/engagement`
- `/data/onboarding-funnel`
