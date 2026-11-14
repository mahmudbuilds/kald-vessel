import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 750,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three-vendor';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) {
            return 'motion-vendor';
          }
          if (id.includes('node_modules/react')) return 'react-vendor';
        },
      },
    },
  },
});
