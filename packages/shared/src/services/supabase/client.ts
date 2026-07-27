import { createClient, type SupabaseClient, type SupportedStorage } from '@supabase/supabase-js';

import { assertSupabaseConfigured, env } from '../../env';

let client: SupabaseClient | null = null;
let authStorage: SupportedStorage | undefined;
let detectSessionInUrl = false;

/**
 * Platform entry points configure persistence.
 * - Mobile: AsyncStorage + detectSessionInUrl false
 * - Web: cookie/local storage adapter + detectSessionInUrl true when needed
 */
export function configureSupabaseAuth(options: {
  storage?: SupportedStorage;
  detectSessionInUrl?: boolean;
}): void {
  authStorage = options.storage;
  if (typeof options.detectSessionInUrl === 'boolean') {
    detectSessionInUrl = options.detectSessionInUrl;
  }
  client = null;
}

/**
 * Shared Supabase client. Storage is optional so Node/Next can boot without RN.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!assertSupabaseConfigured()) {
    return null;
  }

  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        storage: authStorage,
        autoRefreshToken: true,
        persistSession: Boolean(authStorage),
        detectSessionInUrl,
      },
    });
  }

  return client;
}

export function isSupabaseConfigured(): boolean {
  return assertSupabaseConfigured();
}
