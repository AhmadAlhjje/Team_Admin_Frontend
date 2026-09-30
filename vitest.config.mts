import { defineConfig } from 'vitest/config';

/** Unit & component tests (`*.test.ts(x)`). Browser flows live in e2e/ (Playwright). */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    // Pure logic runs in Node; component tests opt into jsdom with a file comment.
    environment: 'node',
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**', 'e2e/**'],
    restoreMocks: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
