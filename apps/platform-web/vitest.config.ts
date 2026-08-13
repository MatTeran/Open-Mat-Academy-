import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
    globals: false,
    env: {
      EXPO_PUBLIC_SUPABASE_URL: '',
      EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: '',
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
      SUPABASE_DB_URL: '',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@openmat/shared/types': path.resolve(
        __dirname,
        '../../packages/shared/src/types/index.ts',
      ),
      '@openmat/shared/auth/platform': path.resolve(
        __dirname,
        '../../packages/shared/src/auth/platform.ts',
      ),
      '@openmat/shared/auth/membership': path.resolve(
        __dirname,
        '../../packages/shared/src/auth/membership.ts',
      ),
    },
  },
});
