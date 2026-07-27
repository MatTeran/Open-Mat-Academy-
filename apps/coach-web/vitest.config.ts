import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
    globals: false,
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
