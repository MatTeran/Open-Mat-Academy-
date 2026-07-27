/**
 * Typed access to public environment variables.
 * Supports Expo (`EXPO_PUBLIC_*`) and Next.js (`NEXT_PUBLIC_*`).
 */
function readEnv(key: string): string | undefined {
  if (typeof process === 'undefined' || !process.env) {
    return undefined;
  }
  return process.env[key];
}

const supabasePublishableKey =
  readEnv('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ??
  readEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY') ??
  readEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ??
  readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ??
  '';

const supabaseUrl =
  readEnv('EXPO_PUBLIC_SUPABASE_URL') ??
  readEnv('NEXT_PUBLIC_SUPABASE_URL') ??
  '';

function readDevFlag(): boolean {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env.NODE_ENV !== 'production';
  }
  try {
    // Expo defines __DEV__ at runtime; avoid TS hard dependency for web.
    return Boolean((globalThis as { __DEV__?: boolean }).__DEV__);
  } catch {
    return false;
  }
}

export const env = {
  supabaseUrl,
  supabaseAnonKey: supabasePublishableKey,
  stripePublishableKey:
    readEnv('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY') ??
    readEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY') ??
    '',
  isDev: readDevFlag(),
} as const;

export function assertSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function assertStripeConfigured(): boolean {
  return Boolean(env.stripePublishableKey);
}
