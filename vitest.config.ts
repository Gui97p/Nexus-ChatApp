import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './test/setup.test.ts',
    exclude: ['node_modules', './test/setup.test.ts'],
  },
});
