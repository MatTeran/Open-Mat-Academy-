import type { AuthSession, AuthUser, UserRole } from '../types';

/**
 * Offline demo accounts for friend walkthroughs.
 * Works without Supabase — email/password sign-in maps to these personas.
 */
export interface DemoAccount {
  email: string;
  password: string;
  user: AuthUser;
  label: string;
  app: 'member' | 'coach' | 'both';
}

export const DEMO_PASSWORD = 'demo1234';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'alex@openmat.demo',
    password: DEMO_PASSWORD,
    label: 'Member — Alex Chen (Blue 2)',
    app: 'member',
    user: {
      id: 'member-1',
      email: 'alex@openmat.demo',
      fullName: 'Alex Chen',
      role: 'member',
    },
  },
  {
    email: 'jordan@openmat.demo',
    password: DEMO_PASSWORD,
    label: 'Member — Jordan Lee (White 4)',
    app: 'member',
    user: {
      id: 'member-2',
      email: 'jordan@openmat.demo',
      fullName: 'Jordan Lee',
      role: 'member',
    },
  },
  {
    email: 'sam@openmat.demo',
    password: DEMO_PASSWORD,
    label: 'Member — Sam Ortiz (Purple 1)',
    app: 'member',
    user: {
      id: 'member-3',
      email: 'sam@openmat.demo',
      fullName: 'Sam Ortiz',
      role: 'member',
    },
  },
  {
    email: 'coach@openmat.demo',
    password: DEMO_PASSWORD,
    label: 'Coach — Coach Rivera',
    app: 'coach',
    user: {
      id: 'guest-coach-user',
      email: 'coach@openmat.demo',
      fullName: 'Coach Rivera',
      role: 'coach',
    },
  },
  {
    email: 'owner@openmat.demo',
    password: DEMO_PASSWORD,
    label: 'Owner — Mat Teran',
    app: 'coach',
    user: {
      id: 'owner-matan',
      email: 'owner@openmat.demo',
      fullName: 'Mat Teran',
      role: 'owner',
    },
  },
];

export function findDemoAccount(
  email: string,
  password: string,
  appRole?: Extract<UserRole, 'member' | 'coach'>,
): DemoAccount | null {
  const normalized = email.trim().toLowerCase();
  const match = DEMO_ACCOUNTS.find(
    (account) =>
      account.email === normalized && account.password === password,
  );
  if (!match) {
    return null;
  }
  if (appRole === 'member' && match.app === 'coach') {
    return null;
  }
  if (appRole === 'coach' && match.app === 'member') {
    return null;
  }
  return match;
}

export function createDemoSession(userId: string): AuthSession {
  return {
    accessToken: `demo-access-${userId}`,
    refreshToken: `demo-refresh-${userId}`,
    userId,
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  };
}

export const DEMO_HINT_MEMBER =
  'Demo: alex@openmat.demo / demo1234 (or Continue as Guest)';
export const DEMO_HINT_COACH =
  'Demo: coach@openmat.demo / demo1234 (or Continue as Coach Guest)';
