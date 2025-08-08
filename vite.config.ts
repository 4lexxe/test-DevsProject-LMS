import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173
  },
  plugins: [react()],

  // Configuracion para produccion
  build: {
    outDir: 'dist',
    sourcemap: false, // Deshabilita los sourcemaps para producción
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar'],
        },
      },
      external: [],
    },
  },

  /* Configuracion de alias */
  resolve: { 
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
