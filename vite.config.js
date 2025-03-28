import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this matches server.js
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
