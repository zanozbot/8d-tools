import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['dist/**/*', 'node_modules/**/*'],
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
});
