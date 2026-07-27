/**
 * Mobile entry wiring for shared Supabase client.
 * Import once from Expo app roots so AsyncStorage persistence is enabled.
 */
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { configureSupabaseAuth } from './client';

let configured = false;

export function ensureMobileSupabaseConfigured(): void {
  if (configured) {
    return;
  }
  configureSupabaseAuth({
    storage: AsyncStorage,
    detectSessionInUrl: false,
  });
  configured = true;
}

ensureMobileSupabaseConfigured();
