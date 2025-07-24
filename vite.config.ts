import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // Con HashRouter no necesitamos base path específico
  base: './',
  plugins: [react()],

  // Optimizaciones de build
  build: {
    // Configuración de minificación
    minify: 'esbuild',

    // Configuración de sourcemaps (deshabilitado para producción)
    sourcemap: false,

    // Target para compatibilidad
    target: 'es2015',

    // Configuración de chunks para optimizar el bundle
    rollupOptions: {
      output: {
        // Configuración de chunks
        manualChunks: {
          // Vendor chunks - librerías principales
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // Feature chunks - funcionalidades específicas
          'ui-vendor': ['lucide-react', 'framer-motion', 'clsx'],
          'charts-vendor': ['recharts'],
          'pdf-vendor': ['html2canvas', 'jspdf', 'jspdf-autotable'],
          'forms-vendor': ['react-select']
        },
        // Nombres de archivos más limpios
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },

    // Configuración de tamaño de chunks
    chunkSizeWarningLimit: 1000
  },

  // Optimizaciones de desarrollo
  server: {
    port: 3001,
    host: true,
    strictPort: false,
    open: false,
    hmr: {
      port: 3001,
      overlay: false,
      clientPort: 3001
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/functions': {
        target: 'https://eckuozleqbbcecaycmjt.supabase.co',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    },
    cors: true
    // Con HashRouter no necesitamos historyApiFallback
  },

  // Configuración de preview
  preview: {
    port: 3001,
    strictPort: false
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@types': path.resolve(__dirname, './src/types'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@layouts': path.resolve(__dirname, './src/layouts')
    },
  },

  // Optimizaciones de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react',
      'framer-motion',
      'recharts',
      'clsx',
      'html2canvas',
      'jspdf'
    ],
    exclude: ['@testing-library/react']
  },

  esbuild: {
    target: 'es2015'
  },
}))
