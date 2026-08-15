/**
 * Academy health score (0–100). Explicit, adjustable weights.
 * Not scientifically validated — configuration for My Gi ops.
 */

export type HealthBand = 'healthy' | 'watch' | 'at_risk' | 'inactive';

export const HEALTH_WEIGHTS = {
  coachAdminActivity: 0.2,
  classActivity: 0.2,
  attendanceUsage: 0.2,
  memberEngagement: 0.2,
  subscriptionHealth: 0.1,
  onboardingSetup: 0.1,
} as const;

export interface HealthSignals {
  coachAdminActivity: number; // 0-100
  classActivity: number;
  attendanceUsage: number;
  memberEngagement: number;
  subscriptionHealth: number;
  onboardingSetup: number;
}

export function classifyHealth(score: number): HealthBand {
  if (score >= 80) return 'healthy';
  if (score >= 60) return 'watch';
  if (score >= 40) return 'at_risk';
  return 'inactive';
}

export function calculateHealthScore(signals: HealthSignals): {
  score: number;
  band: HealthBand;
  breakdown: Array<{ key: keyof HealthSignals; weight: number; value: number; contribution: number }>;
} {
  const breakdown = (Object.keys(HEALTH_WEIGHTS) as Array<keyof HealthSignals>).map(
    (key) => {
      const weight = HEALTH_WEIGHTS[key];
      const value = clamp(signals[key]);
      return { key, weight, value, contribution: weight * value };
    },
  );
  const score = Math.round(breakdown.reduce((sum, row) => sum + row.contribution, 0));
  return { score, band: classifyHealth(score), breakdown };
}

function clamp(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, n));
}
