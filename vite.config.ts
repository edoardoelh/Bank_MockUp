import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/Bank_MockUp/' : '/',
  // Serve fixtures/ as static files so CSS @imports resolve at runtime
  publicDir: resolve(__dirname, 'fixtures'),
});
