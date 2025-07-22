import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react-router-dom'], // Explicitly include react-router-dom
  },
  server: {
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
    host: true, // Permitir acceso desde la red
    port: 3001, // Usar el puerto que está funcionando
    strictPort: false, // Permitir otros puertos si 3001 está en uso
    open: false, // No abrir automáticamente para evitar conflictos
    // Configuración para manejar rutas SPA
    historyApiFallback: true
  },
  // Configuración para manejar rutas SPA correctamente
  preview: {
    port: 3001,
    strictPort: false
  }
})
