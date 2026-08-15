/** Default onboarding milestones used for percent calculation. */
export const ONBOARDING_MILESTONES = [
  { key: 'organization_created', label: 'Organization created' },
  { key: 'academy_created', label: 'Academy created' },
  { key: 'owner_accepted', label: 'Owner accepted invitation' },
  { key: 'logo_uploaded', label: 'Logo uploaded' },
  { key: 'hero_uploaded', label: 'Hero image uploaded' },
  { key: 'location_completed', label: 'Location completed' },
  { key: 'plan_selected', label: 'Plan selected' },
  { key: 'features_configured', label: 'Features configured' },
  { key: 'coach_invited', label: 'Coach invited' },
  { key: 'schedule_created', label: 'Weekly schedule created' },
  { key: 'student_invited', label: 'First student invited' },
  { key: 'class_created', label: 'First class created' },
  { key: 'attendance_recorded', label: 'First attendance recorded' },
] as const;

export function calculateOnboardingPercent(
  completedKeys: Iterable<string>,
): number {
  const done = new Set(completedKeys);
  const total = ONBOARDING_MILESTONES.length;
  const completed = ONBOARDING_MILESTONES.filter((m) => done.has(m.key)).length;
  return Math.round((completed / total) * 100);
}
