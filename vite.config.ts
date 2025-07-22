import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  // Configuración base condicional: solo para producción en GitHub Pages
  base: command === 'build' ? '/Bull-S/' : '/',
  plugins: [react()],

  // Optimizaciones de build
  build: {
    // Configuración de chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion', 'recharts'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'utils-vendor': ['clsx', 'html2canvas', 'jspdf'],

          // Feature chunks
          'auth': [
            './src/lib/auth/AuthContext.tsx',
            './src/lib/auth/PermissionsContext.tsx',
            './src/components/auth/LoginForm.tsx',
            './src/components/auth/ProtectedRoute.tsx'
          ],
          'dashboard': [
            './src/components/dashboard/DashboardBase.tsx',
            './src/components/dashboard/BullsDashboard.tsx',
            './src/services/dashboardService.ts'
          ],
          'questionnaire': [
            './src/pages/student/QuestionnairePage.tsx',
            './src/components/questionnaire/QuestionnaireNavigation.tsx',
            './src/lib/questionnaireData.ts'
          ],
          'reports': [
            './src/services/reportService.ts',
            './src/services/reportGenerationService.ts',
            './src/utils/reportGenerator.ts'
          ],
          'admin': [
            './src/pages/admin/AdminDashboardPage.tsx',
            './src/pages/admin/UsuariosPage.tsx',
            './src/pages/admin/EstudiantesPage.tsx',
            './src/pages/admin/GruposPage.tsx'
          ],
          'analysis': [
            './src/services/sociometricAnalysisService.ts',
            './src/services/bullsAnalysisService.ts',
            './src/components/analysis/SociometricAnalysisComponent.tsx'
          ]
        }
      }
    },

    // Configuración de minificación simplificada
    minify: 'esbuild',

    // Configuración de sourcemaps
    sourcemap: false,

    // Configuración de assets
    assetsInlineLimit: 4096,

    // Configuración de CSS
    cssCodeSplit: true,

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
