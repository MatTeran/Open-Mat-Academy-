import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
    globals: false,
    // Unit tests exercise memory repositories / local fixtures.
    // Clear live Supabase secrets so CI/agents with injected env don't hit PostgREST.
    env: {
      EXPO_PUBLIC_SUPABASE_URL: '',
      EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
      SUPABASE_DB_URL: '',
    },
  },
  define: {
    __DEV__: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native': path.resolve(__dirname, './src/test/react-native-stub.js'),
      '@react-native-async-storage/async-storage': path.resolve(
        __dirname,
        './src/test/react-native-stub.js',
      ),
      'react-native-url-polyfill/auto': path.resolve(
        __dirname,
        './src/test/react-native-stub.js',
      ),
      'expo-linking': path.resolve(__dirname, './src/test/react-native-stub.js'),
      '@openmat/shared/types': path.resolve(
        __dirname,
        '../../packages/shared/src/types/index.ts',
      ),
      '@openmat/shared/services': path.resolve(
        __dirname,
        '../../packages/shared/src/services/index.ts',
      ),
      '@openmat/shared/auth/roles': path.resolve(
        __dirname,
        '../../packages/shared/src/auth/roles.ts',
      ),
    },
  },
});
