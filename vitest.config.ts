import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
// coverage: {
//   reporter: ['text', 'html'], // Text in der Konsole, HTML für ausführliche Reports
//   exclude: ['node_modules/', 'src/setupTests.ts'], // Optional
// }

});
