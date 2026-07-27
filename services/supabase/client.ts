import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { assertSupabaseConfigured, env } from '../../lib/env';

let client: SupabaseClient | null = null;

/**
 * Shared Supabase client with AsyncStorage session persistence.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!assertSupabaseConfigured()) {
    return null;
  }

  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }

  return client;
}

export function isSupabaseConfigured(): boolean {
  return assertSupabaseConfigured();
}
