export type SettingsNavItem = {
  href: string;
  label: string;
  description?: string;
};

export const ACADEMY_SETTINGS_NAV: SettingsNavItem[] = [
  { href: '/settings', label: 'Overview', description: 'Academy operating snapshot' },
  { href: '/settings/profile', label: 'Academy Profile' },
  { href: '/settings/locations', label: 'Locations' },
  { href: '/settings/branding', label: 'Branding' },
  { href: '/settings/media', label: 'Media Library' },
  { href: '/settings/staff', label: 'Staff' },
  { href: '/settings/members', label: 'Members' },
  { href: '/settings/schedule', label: 'Schedule' },
  { href: '/settings/integrations', label: 'Integrations' },
  { href: '/settings/billing', label: 'Billing' },
  { href: '/settings/features', label: 'Features' },
  { href: '/settings/invitations', label: 'Invitations' },
  { href: '/settings/security', label: 'Security' },
];
