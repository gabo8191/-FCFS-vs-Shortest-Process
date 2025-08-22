import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      includeAssets: [
        'favicon.svg',
        'icon-72.svg',
        'icon-96.svg',
        'icon-144.svg',
        'icon-192.svg',
        'icon-512.svg',
      ],
      manifest: {
        name: 'Simulador de Planificación de Procesos',
        short_name: 'Process Scheduler',
        description:
          'Visualizador interactivo de algoritmos de planificación de procesos FCFS vs Shortest Process en tiempo real',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon-72.svg',
            sizes: '72x72',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon-96.svg',
            sizes: '96x96',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon-144.svg',
            sizes: '144x144',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Iniciar Simulación',
            short_name: 'Simular',
            description: 'Iniciar nueva simulación de procesos',
            url: '/',
            icons: [
              {
                src: 'icon-96.svg',
                sizes: '96x96',
                type: 'image/svg+xml',
              },
            ],
          },
        ],
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
