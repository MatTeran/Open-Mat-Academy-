export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  fullName: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresAt: number;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
}
