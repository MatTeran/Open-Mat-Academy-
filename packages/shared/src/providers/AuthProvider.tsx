import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  COACH_GUEST_STORAGE_KEY,
  COACH_GUEST_USER,
  GUEST_STORAGE_KEY,
  GUEST_USER,
  createGuestSession,
  readGuestFlag,
  writeGuestFlag,
} from '../auth';
import {
  createDemoSession,
  findDemoAccount,
} from '../demo/accounts';
import {
  getSession,
  onAuthStateChange,
  resetPasswordForEmail,
  signInWithEmail,
  signOut as signOutRequest,
  signUpWithEmail,
} from '../services/supabase/auth';
import { isSupabaseConfigured } from '../services/supabase/client';
import type {
  AuthCredentials,
  AuthSession,
  AuthStatus,
  AuthUser,
  RegisterPayload,
  UserRole,
} from '../types';

interface AuthContextValue {
  status: AuthStatus;
  session: AuthSession | null;
  user: AuthUser | null;
  isConfigured: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (
    payload: RegisterPayload,
  ) => Promise<{ needsEmailConfirmation: boolean }>;
  continueAsGuest: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps extends PropsWithChildren {
  /** Defaults guest role/persona for Member vs Coach demos. */
  appRole?: Extract<UserRole, 'member' | 'coach'>;
}

export function AuthProvider({
  children,
  appRole = 'member',
}: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const isGuestRef = useRef(false);
  const isConfigured = isSupabaseConfigured();
  const guestKey =
    appRole === 'coach' ? COACH_GUEST_STORAGE_KEY : GUEST_STORAGE_KEY;
  const guestUser = appRole === 'coach' ? COACH_GUEST_USER : GUEST_USER;

  const enterGuestMode = useCallback(async () => {
    isGuestRef.current = true;
    setIsGuest(true);
    setUser(guestUser);
    setSession(createGuestSession(guestUser.id));
    setStatus('authenticated');
    await writeGuestFlag(true, guestKey);
  }, [guestKey, guestUser]);

  const clearGuestMode = useCallback(async () => {
    isGuestRef.current = false;
    setIsGuest(false);
    await writeGuestFlag(false, guestKey);
  }, [guestKey]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const bootstrap = async () => {
      const guestEnabled = await readGuestFlag(guestKey);
      if (!isMounted) {
        return;
      }

      if (guestEnabled) {
        isGuestRef.current = true;
        setIsGuest(true);
        setUser(guestUser);
        setSession(createGuestSession(guestUser.id));
        setStatus('authenticated');
        return;
      }

      if (!isConfigured) {
        setStatus('unauthenticated');
        return;
      }

      try {
        const current = await getSession();
        if (!isMounted || isGuestRef.current) {
          return;
        }
        setSession(current.session);
        setUser(current.user);
        setStatus(current.session ? 'authenticated' : 'unauthenticated');
      } catch {
        if (isMounted && !isGuestRef.current) {
          setStatus('unauthenticated');
        }
      }

      unsubscribe = onAuthStateChange(({ session: nextSession, user: nextUser }) => {
        if (!isMounted || isGuestRef.current) {
          return;
        }
        setSession(nextSession);
        setUser(nextUser);
        setStatus(nextSession ? 'authenticated' : 'unauthenticated');
      });
    };

    void bootstrap();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [guestKey, guestUser, isConfigured]);

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    await clearGuestMode();

    const demo = findDemoAccount(credentials.email, credentials.password, appRole);
    if (demo) {
      setUser(demo.user);
      setSession(createDemoSession(demo.user.id));
      setStatus('authenticated');
      return;
    }

    if (!isConfigured) {
      throw new Error(
        appRole === 'coach'
          ? 'Use coach@openmat.demo / demo1234 or Continue as Coach Guest.'
          : 'Use alex@openmat.demo / demo1234 or Continue as Guest.',
      );
    }

    const result = await signInWithEmail(credentials);
    setSession(result.session);
    setUser(
      appRole === 'coach' && !result.user.role
        ? { ...result.user, role: 'coach' }
        : result.user,
    );
    setStatus('authenticated');
  }, [appRole, clearGuestMode, isConfigured]);

  const signUp = useCallback(
    async (payload: RegisterPayload) => {
      await clearGuestMode();
      const result = await signUpWithEmail(payload);
      if (result.session && result.user) {
        setSession(result.session);
        setUser(
          appRole === 'coach' && !result.user.role
            ? { ...result.user, role: 'coach' }
            : result.user,
        );
        setStatus('authenticated');
      }
      return { needsEmailConfirmation: result.needsEmailConfirmation };
    },
    [appRole, clearGuestMode],
  );

  const resetPassword = useCallback(async (email: string) => {
    await resetPasswordForEmail(email);
  }, []);

  const signOut = useCallback(async () => {
    const wasGuest = isGuestRef.current;
    await clearGuestMode();
    if (!wasGuest && isConfigured) {
      try {
        await signOutRequest();
      } catch {
        // Always clear local session.
      }
    }
    setSession(null);
    setUser(null);
    setStatus('unauthenticated');
  }, [clearGuestMode, isConfigured]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user,
      isConfigured,
      isAuthenticated: status === 'authenticated',
      isGuest,
      isLoading: status === 'loading',
      signIn,
      signUp,
      continueAsGuest: enterGuestMode,
      resetPassword,
      signOut,
    }),
    [
      enterGuestMode,
      isConfigured,
      isGuest,
      resetPassword,
      session,
      signIn,
      signOut,
      signUp,
      status,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
