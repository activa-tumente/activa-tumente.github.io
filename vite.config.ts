import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  // Configuración base condicional: solo para producción en GitHub Pages
  base: command === 'build' ? '/Bull-S/' : '/',
  plugins: [react()],

  // Optimizaciones de build simplificadas
  build: {
    // Configuración de minificación simplificada
    minify: 'esbuild',

    // Configuración de sourcemaps
    sourcemap: false,

    // Target para compatibilidad
    target: 'es2015'
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
      // Sometimes needed in container environments if file watching is unreliable
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
    cors: true,
    // Configuración para manejar rutas SPA
    historyApiFallback: true
  },

  // Configuración para manejar rutas SPA correctamente
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
