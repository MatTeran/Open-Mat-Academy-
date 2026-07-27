/**
 * Typed access to Expo public environment variables.
 * Copy `.env.example` → `.env` and fill in real credentials.
 */
function readEnv(key: string): string | undefined {
  return process.env[key];
}

const supabasePublishableKey =
  readEnv('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ??
  readEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY') ??
  '';

export const env = {
  supabaseUrl: readEnv('EXPO_PUBLIC_SUPABASE_URL') ?? '',
  /** Publishable key (sb_publishable_...) or legacy anon JWT */
  supabaseAnonKey: supabasePublishableKey,
  stripePublishableKey: readEnv('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY') ?? '',
  isDev: __DEV__,
} as const;

export function assertSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function assertStripeConfigured(): boolean {
  return Boolean(env.stripePublishableKey);
}
