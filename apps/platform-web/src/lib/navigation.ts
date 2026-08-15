export type NavItem = {
  href: string;
  label: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const PLATFORM_NAV: NavSection[] = [
  {
    title: 'My Gi',
    items: [{ href: '/overview', label: 'Overview' }],
  },
  {
    title: 'Academies',
    items: [
      { href: '/orgs', label: 'Organizations' },
      { href: '/academies', label: 'Academies' },
      { href: '/locations', label: 'Locations' },
      { href: '/onboarding', label: 'Onboarding' },
    ],
  },
  {
    title: 'People',
    items: [
      { href: '/users', label: 'Users' },
      { href: '/coaches', label: 'Coaches' },
      { href: '/platform-admins', label: 'Platform Admins' },
    ],
  },
  {
    title: 'Business',
    items: [
      { href: '/subscriptions', label: 'Subscriptions' },
      { href: '/plans', label: 'Plans' },
    ],
  },
  {
    title: 'Data',
    items: [
      { href: '/data/executive', label: 'Executive' },
      { href: '/data/academy-health', label: 'Academy Health' },
      { href: '/data/engagement', label: 'Engagement' },
      { href: '/data/onboarding-funnel', label: 'Onboarding Funnel' },
      { href: '/data/integrations', label: 'Integrations' },
    ],
  },
  {
    title: 'Platform',
    items: [
      { href: '/features', label: 'Features' },
      { href: '/media', label: 'Media' },
      { href: '/integrations', label: 'Integrations' },
      { href: '/content', label: 'Content' },
      { href: '/notifications', label: 'Notifications' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { href: '/support', label: 'Support' },
      { href: '/audit', label: 'Audit Logs' },
      { href: '/system-health', label: 'System Health' },
    ],
  },
  {
    title: 'Account',
    items: [{ href: '/settings', label: 'Settings' }],
  },
];
