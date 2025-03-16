import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    proxy: {
      '/graphql': {
        target: process.env.BACKEND_URL || 'http://localhost:7000',
        changeOrigin: true,
      },
    },
  },
});
