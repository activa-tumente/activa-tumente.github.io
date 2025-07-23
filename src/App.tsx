import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLayout from './auth/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import NotFoundPage from './pages/NotFoundPage';

import UserProfileBadgeExamplePage from './pages/UserProfileBadgeExamplePage';
import ServerlessFunctionsPage from './pages/ServerlessFunctionsPage';
import LinkIdentityPage from './pages/LinkIdentityPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthRedirect from './components/auth/AuthRedirect';
import { AuthProvider } from './lib/auth/AuthContext';
import { PermissionsProvider } from './lib/auth/PermissionsContext';
import { DashboardProvider } from './lib/context/DashboardContext';

// Nuevas páginas de autenticación
import StudentLoginPageSimple from './pages/auth/StudentLoginPageSimple';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import ServerlessLoginPage from './pages/auth/ServerlessLoginPage';
import ReportsPage from './pages/admin/ReportsPage';
import BullsDashboardPage from './pages/admin/BullsDashboardPage';

// Componentes de redirección
import DashboardRedirect from './components/dashboard/DashboardRedirect';
import DashboardRouteResolver from './components/dashboard/DashboardRouteResolver';

// Importaciones directas en lugar de lazy loading
import DashboardsSelectionPage from './pages/DashboardsSelectionPage';
// Dashboards reorganizados
import GeneralDashboardPage from './pages/dashboards/GeneralDashboardPage';
import BullyingDashboardPage from './pages/dashboards/BullyingDashboardPage';
import AcademicDashboardPage from './pages/dashboards/AcademicDashboardPage';
import SocialDashboardPage from './pages/dashboards/SocialDashboardPage';
import ConvivenciaEscolarDashboardPage from './pages/dashboards/ConvivenciaEscolarDashboardPage';
import UserProfilePage from './pages/admin/UserProfilePage';
import SupabaseDiagnosticsPage from './pages/admin/diagnostics/SupabaseDiagnosticsPage';
// Removidos temporalmente hasta que existan los archivos
// import UserManagementPage from "./pages/admin/UserManagementPage";
// import RolesPermissionsPage from "./pages/admin/RolesPermissionsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import InstitucionesPage from "./pages/admin/InstitucionesPage";
import GruposPage from "./pages/admin/GruposPage";
import EstudiantesPage from "./pages/admin/EstudiantesPage";
import UsuariosPage from "./pages/admin/UsuariosPage";
import ConfiguracionesPage from "./pages/admin/ConfiguracionesPage";
import SociometricAnalysisPage from "./pages/admin/SociometricAnalysisPage";

/**
 * Componente principal de la aplicación
 * Define la estructura de rutas y proveedores de contexto
 */
function App() {
  console.log('App.tsx: Renderizando aplicación con Router...');

  return (
    <AuthProvider>
      <PermissionsProvider>
        <Router>
          <Routes>
            {/* Rutas de autenticación accesibles sin autenticación */}
            <Route path="/auth/student" element={<StudentLoginPageSimple />} />
            <Route path="/auth/admin" element={<AdminLoginPage />} />
            <Route path="/auth/serverless" element={<ServerlessLoginPage />} />
            <Route path="/auth/redirect" element={<AuthRedirect />} />

            {/* Ruta principal - HomePage sin protección para mostrar opciones de login */}
            <Route path="/" element={<HomePage />} />

            {/* Rutas protegidas para estudiantes */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute>
                  <StudentLayout />
                </ProtectedRoute>
              }
            />

            {/* Rutas protegidas para administradores */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard de Administración */}
              <Route index element={<Navigate to="/admin/dashboard" replace />} />

              {/* Removidos temporalmente hasta que existan los archivos
              <Route path="usuarios" element={<UserManagementPage />} />
              <Route path="roles-permisos" element={<RolesPermissionsPage />} />
              */}

              {/* Panel Principal de Administración */}
              <Route path="dashboard" element={<AdminDashboardPage />} />
              
              {/* Módulos de Gestión */}
              <Route path="instituciones" element={<InstitucionesPage />} />
              <Route path="grupos" element={<GruposPage />} />
              <Route path="estudiantes" element={<EstudiantesPage />} />
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="configuraciones" element={<ConfiguracionesPage />} />
              <Route path="analisis-sociometrico" element={<SociometricAnalysisPage />} />

              {/* Selección de Dashboards */}
              <Route path="dashboards" element={<DashboardsSelectionPage />} />

              {/* Dashboard General */}
              <Route path="dashboard-general" element={<DashboardsSelectionPage />} />

              {/* Dashboard de Convivencia Escolar */}
              <Route path="dashboard-convivencia" element={<ConvivenciaEscolarDashboardPage />} />

              {/* Dashboards por Grupo */}
              <Route path="dashboards-por-grupo" element={<DashboardRedirect />} />

              {/* Dashboard de Convivencia Escolar - Temporalmente deshabilitado */}
              {/* <Route path="dashboard/convivencia/*" element={
                <Suspense fallback={<LoadingSpinner message="Cargando dashboard de convivencia escolar..." />}>
                  <ConvivenciaEscolarDashboardRoutes />
                </Suspense>
              } /> */}

              {/* Perfil de usuario */}
              <Route path="profile" element={<UserProfilePage />} />

              {/* Página de diagnóstico de Supabase */}
              <Route path="diagnostics/supabase" element={<SupabaseDiagnosticsPage />} />

              {/* Página de informes */}
              <Route path="reports" element={<ReportsPage />} />

              {/* Dashboard BULL-S completo */}
              <Route path="bulls-dashboard" element={<BullsDashboardPage />} />

              {/* Dashboards disponibles - Usando rutas anidadas con IDs */}
              <Route path="grupo/:groupId/*" element={
                <DashboardProvider>
                  <Outlet />
                </DashboardProvider>
              }>
                <Route index element={<GeneralDashboardPage />} />
                <Route path="general" element={<GeneralDashboardPage />} />
                <Route path="bullying" element={<BullyingDashboardPage />} />
                <Route path="academico" element={<AcademicDashboardPage />} />
                <Route path="social" element={<SocialDashboardPage />} />
                <Route path="convivencia" element={<Navigate to="/admin/dashboard/convivencia" replace />} />
              </Route>

              {/* Dashboards disponibles - Usando rutas amigables */}
              <Route path="dashboard/:institutionSlug/:groupSlug/*" element={
                <DashboardRouteResolver />
              }>
                <Route path="general" element={<GeneralDashboardPage />} />
                <Route path="bullying" element={<BullyingDashboardPage />} />
                <Route path="academico" element={<AcademicDashboardPage />} />
                <Route path="social" element={<SocialDashboardPage />} />
              </Route>
            </Route>

            {/* Ruta para la página de ejemplo de UserProfileBadge */}
            <Route
              path="/examples/user-profile-badge"
              element={
                <ProtectedRoute>
                  <UserProfileBadgeExamplePage />
                </ProtectedRoute>
              }
            />

            {/* Ruta para la página de funciones serverless */}
            <Route
              path="/serverless"
              element={
                <ProtectedRoute>
                  <ServerlessFunctionsPage />
                </ProtectedRoute>
              }
            />

            {/* Ruta para la página de vinculación de identidades */}
            <Route
              path="/link-identity"
              element={
                <ProtectedRoute>
                  <LinkIdentityPage />
                </ProtectedRoute>
              }
            />

            {/* Ruta para página de acceso denegado */}
            <Route path="/acceso-denegado" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                  <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                  <p className="text-gray-700 mb-4">
                    No tienes los permisos necesarios para acceder a esta página.
                  </p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900"
                  >
                    Volver al inicio
                  </button>
                </div>
              </div>
            } />

            {/* Ruta de prueba */}
            <Route path="/test" element={<div className="p-8">Página de prueba - Si puedes ver esto, el enrutador está funcionando correctamente.</div>} />

            {/* Ruta para página no encontrada */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </PermissionsProvider>
    </AuthProvider>
  );
}

export default App;