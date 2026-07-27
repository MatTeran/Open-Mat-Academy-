import { AuthServiceError } from '../services/supabase/auth';

/**
 * Map raw auth/API failures to short, athlete-friendly copy.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthServiceError) {
    return humanize(error.message);
  }

  if (error instanceof Error) {
    return humanize(error.message);
  }

  return 'Something went wrong. Please try again.';
}

function humanize(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes('not configured')) {
    return 'Supabase is not configured. Add your project keys to .env.';
  }
  if (normalized.includes('invalid login credentials')) {
    return 'Incorrect email or password.';
  }
  if (normalized.includes('email not confirmed')) {
    return 'Confirm your email before signing in.';
  }
  if (normalized.includes('user already registered')) {
    return 'An account with this email already exists.';
  }
  if (normalized.includes('password')) {
    return message;
  }
  if (normalized.includes('rate limit') || normalized.includes('too many')) {
    return 'Too many attempts. Wait a moment and try again.';
  }
  if (normalized.includes('network') || normalized.includes('fetch')) {
    return 'Network error. Check your connection and try again.';
  }

  return message;
}
