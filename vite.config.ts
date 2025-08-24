import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
            },
          },
        ],
      },
      includeAssets: ['favicon.svg', 'icon-*.svg', 'icon-*.png'],
      manifest: {
        name: 'Simulador de Planificación de Procesos',
        short_name: 'Process Scheduler',
        description:
          'Simulador interactivo de algoritmos de planificación de procesos FCFS vs Shortest Process',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'es',
        categories: ['education', 'productivity'],
        icons: [
          {
            src: '/icon-72.svg',
            sizes: '72x72',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icon-96.svg',
            sizes: '96x96',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icon-144.svg',
            sizes: '144x144',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Nueva Simulación FCFS',
            short_name: 'FCFS',
            description: 'Iniciar simulación con algoritmo FCFS',
            url: '/?algorithm=fcfs',
            icons: [{ src: '/icon-192.svg', sizes: '192x192' }],
          },
          {
            name: 'Nueva Simulación SJF',
            short_name: 'SJF',
            description: 'Iniciar simulación con algoritmo Shortest Job First',
            url: '/?algorithm=sjf',
            icons: [{ src: '/icon-192.svg', sizes: '192x192' }],
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lucide-react'],
        },
      },
    },
    // Optimizaciones para PWA
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Configuración para PWA
  define: {
    __VUE_PROD_DEVTOOLS__: false,
  },
  // Optimización de assets
  assetsInclude: [
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
    '**/*.ico',
  ],
  // Configuración de base path para PWA
  base: './',
});
