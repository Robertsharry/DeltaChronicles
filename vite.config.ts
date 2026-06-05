import { defineConfig } from 'vitest/config';

// Browser game — no backend. `npm run build` emits a self-contained dist/ folder
// (index.html + hashed JS + the public/ assets, including public/sprites/*.png).
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 0,
    // The dex still embeds a lot of base64 sprite art inline, so the main chunk is
    // large by design. Raise the warning threshold rather than code-splitting it.
    chunkSizeWarningLimit: 6000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts'],
  },
});
