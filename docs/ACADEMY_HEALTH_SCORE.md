# Academy Health Score

Configurable weighted score (0–100). **Not** a scientifically validated model.

## Weights

| Signal | Weight |
| --- | --- |
| Coach/admin activity | 20% |
| Class activity | 20% |
| Attendance usage | 20% |
| Member engagement | 20% |
| Subscription health | 10% |
| Onboarding / setup | 10% |

## Bands

- 80–100 Healthy
- 60–79 Watch
- 40–59 At risk
- 0–39 Inactive / critical

Implementation: `apps/platform-web/src/lib/services/healthScore.ts`

Signals that lack real events should be passed as `0` or omitted from UI until instrumentation exists — never invent activity.
