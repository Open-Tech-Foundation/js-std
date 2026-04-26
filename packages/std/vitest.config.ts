import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    color: !process.env.CI,
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});
