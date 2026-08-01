import type { AuthSession, AuthUser } from '../../types';

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
    },
  },
];

/**
 * Optional owner login from EAS env — only used when Supabase is not configured.
 */
function getOwnerLoginAccount(): DemoAccount | null {
  const email = (process.env.EXPO_PUBLIC_OWNER_LOGIN_EMAIL ?? '')
    .trim()
    .toLowerCase();
  const password = process.env.EXPO_PUBLIC_OWNER_LOGIN_PASSWORD ?? '';
  const fullName =
    process.env.EXPO_PUBLIC_OWNER_LOGIN_NAME?.trim() || 'Mat Teran';

  if (!email || !password) {
    return null;
  }

  return {
    email,
    password,
    label: `Owner — ${fullName}`,
    app: 'member',
    user: {
      id: 'owner-member',
      email,
      fullName,
    },
  };
}

export function findDemoAccount(
  email: string,
  password: string,
  options?: { includeOwnerFallback?: boolean },
): DemoAccount | null {
  const normalized = email.trim().toLowerCase();
  const owner =
    options?.includeOwnerFallback === true ? getOwnerLoginAccount() : null;
  const accounts = owner ? [owner, ...DEMO_ACCOUNTS] : DEMO_ACCOUNTS;
  return (
    accounts.find(
      (account) =>
        account.email === normalized && account.password === password,
    ) ?? null
  );
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
  'Use your academy login — or alex@openmat.demo / demo1234 / Guest';
