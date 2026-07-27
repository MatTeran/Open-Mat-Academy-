export type CoachNavItem = {
  href: string;
  label: string;
  /** Feature gate — only coach-tier roles for Phase 1 */
  roles?: Array<'coach' | 'manager' | 'owner' | 'admin' | 'staff'>;
  soon?: boolean;
};

export const COACH_NAV: CoachNavItem[] = [
  { href: '/command-center', label: 'Command Center' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/check-in', label: 'Check-In' },
  { href: '/members', label: 'Members' },
  { href: '/development', label: 'Member Development' },
  { href: '/curriculum', label: 'Curriculum', soon: true },
  { href: '/techniques', label: 'Techniques', soon: true },
  { href: '/challenges', label: 'Challenges', soon: true },
  { href: '/events', label: 'Events', soon: true },
  { href: '/community', label: 'Community', soon: true },
  { href: '/announcements', label: 'Announcements' },
  { href: '/analytics', label: 'Analytics', soon: true },
  { href: '/settings', label: 'Settings', soon: true },
];
