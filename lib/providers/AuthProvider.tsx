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
  createGuestSession,
  GUEST_USER,
  readGuestFlag,
  writeGuestFlag,
} from '../auth/guest';
import { createDemoSession, findDemoAccount } from '../demo/accounts';
import {
  getSession,
  onAuthStateChange,
  resetPasswordForEmail,
  signInWithEmail,
  signOut as signOutRequest,
  signUpWithEmail,
} from '../../services/supabase/auth';
import { isSupabaseConfigured } from '../../services/supabase/client';
import type {
  AuthCredentials,
  AuthSession,
  AuthStatus,
  AuthUser,
  RegisterPayload,
} from '../../types';

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

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const isGuestRef = useRef(false);
  const isConfigured = isSupabaseConfigured();

  const enterGuestMode = useCallback(async () => {
    isGuestRef.current = true;
    setIsGuest(true);
    setUser(GUEST_USER);
    setSession(createGuestSession());
    setStatus('authenticated');
    await writeGuestFlag(true);
  }, []);

  const clearGuestMode = useCallback(async () => {
    isGuestRef.current = false;
    setIsGuest(false);
    await writeGuestFlag(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    async function bootstrap() {
      const guestEnabled = await readGuestFlag();
      if (!isMounted) {
        return;
      }

      if (guestEnabled) {
        isGuestRef.current = true;
        setIsGuest(true);
        setUser(GUEST_USER);
        setSession(createGuestSession());
        setStatus('authenticated');
        return;
      }

      if (!isConfigured) {
        setStatus('unauthenticated');
        return;
      }

      try {
        const current = await getSession();
        if (!isMounted) {
          return;
        }

        setSession(current.session);
        setUser(current.user);
        setStatus(current.session ? 'authenticated' : 'unauthenticated');

        unsubscribe = onAuthStateChange(
          ({ session: nextSession, user: nextUser }) => {
            // Guest demo sessions are local — ignore Supabase auth noise.
            if (isGuestRef.current) {
              return;
            }
            setSession(nextSession);
            setUser(nextUser);
            setStatus(nextSession ? 'authenticated' : 'unauthenticated');
          },
        );
      } catch {
        if (isMounted) {
          setSession(null);
          setUser(null);
          setStatus('unauthenticated');
        }
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [isConfigured]);

  const signIn = useCallback(
    async (credentials: AuthCredentials) => {
      await clearGuestMode();

      // Offline @openmat.demo personas always work. Owner env fallback only
      // when Supabase is not configured — real emails hit Supabase Auth.
      const demo = findDemoAccount(credentials.email, credentials.password, {
        includeOwnerFallback: !isConfigured,
      });
      if (demo) {
        setUser(demo.user);
        setSession(createDemoSession(demo.user.id));
        setStatus('authenticated');
        return;
      }

      if (!isConfigured) {
        throw new Error(
          'Supabase is not connected in this build. Use alex@openmat.demo / demo1234 or Continue as Guest.',
        );
      }

      const result = await signInWithEmail(credentials);
      setSession(result.session);
      setUser(result.user);
      setStatus('authenticated');
    },
    [clearGuestMode, isConfigured],
  );

  const signUp = useCallback(
    async (payload: RegisterPayload) => {
      await clearGuestMode();
      const result = await signUpWithEmail(payload);
      if (result.session && result.user) {
        setSession(result.session);
        setUser(result.user);
        setStatus('authenticated');
      }
      return { needsEmailConfirmation: result.needsEmailConfirmation };
    },
    [clearGuestMode],
  );

  const continueAsGuest = useCallback(async () => {
    await enterGuestMode();
  }, [enterGuestMode]);

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
        // Local sign-out still proceeds if remote logout fails.
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
      continueAsGuest,
      resetPassword,
      signOut,
    }),
    [
      continueAsGuest,
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
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return context;
}
