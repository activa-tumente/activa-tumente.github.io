import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  FileText, 
  Settings, 
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Shield,
  Database,
  Activity
} from 'lucide-react';
import sociometricService from '../../services/sociometricService';

interface AdminStats {
  totalInstituciones: number;
  totalGrupos: number;
  totalEstudiantes: number;
  respuestasRecientes: number;
  alertasCriticas: number;
}

/**
 * Página principal del panel de administración
 * Muestra opciones para gestionar instituciones, grupos y estudiantes
 */
const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalInstituciones: 0,
    totalGrupos: 0,
    totalEstudiantes: 0,
    respuestasRecientes: 0,
    alertasCriticas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas generales
      const estadisticas = await sociometricService.getEstadisticasGenerales();
      const instituciones = await sociometricService.getInstituciones();
      
      setStats({
        totalInstituciones: instituciones.length,
        totalGrupos: estadisticas.totalGrupos,
        totalEstudiantes: estadisticas.totalEstudiantes,
        respuestasRecientes: estadisticas.respuestasValidas,
        alertasCriticas: 0 // TODO: Implementar conteo de alertas críticas
      });
    } catch (error) {
      console.error('Error al cargar estadísticas de administración:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminModules = [
    {
      title: 'Gestión de Instituciones',
      description: 'Administrar colegios y centros educativos',
      icon: Building2,
      color: 'bg-blue-500',
      path: '/admin/instituciones',
      stats: `${stats.totalInstituciones} instituciones`
    },
    {
      title: 'Gestión de Grupos',
      description: 'Administrar grupos y cursos por institución',
      icon: GraduationCap,
      color: 'bg-green-500',
      path: '/admin/grupos',
      stats: `${stats.totalGrupos} grupos activos`
    },
    {
      title: 'Gestión de Estudiantes',
      description: 'Administrar estudiantes por grupo',
      icon: Users,
      color: 'bg-purple-500',
      path: '/admin/estudiantes',
      stats: `${stats.totalEstudiantes} estudiantes`
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios del sistema',
      icon: Shield,
      color: 'bg-orange-500',
      path: '/admin/usuarios',
      stats: 'Administradores y docentes'
    },
    {
      title: 'Análisis Sociométrico',
      description: 'Ejecutar y revisar análisis BULL-S',
      icon: BarChart3,
      color: 'bg-indigo-500',
      path: '/admin/analisis-sociometrico',
      stats: `${stats.respuestasRecientes} respuestas`
    },
    {
      title: 'Reportes y Dashboards',
      description: 'Visualizar reportes y estadísticas',
      icon: FileText,
      color: 'bg-teal-500',
      path: '/admin/reportes',
      stats: 'Dashboards interactivos'
    },
    {
      title: 'Configuraciones',
      description: 'Configurar parámetros del sistema',
      icon: Settings,
      color: 'bg-gray-500',
      path: '/admin/configuraciones',
      stats: 'Sistema y preferencias'
    },
    {
      title: 'Diagnósticos',
      description: 'Monitorear estado del sistema',
      icon: Activity,
      color: 'bg-red-500',
      path: '/admin/diagnostics/supabase',
      stats: 'Estado de conexiones'
    }
  ];

  const quickStats = [
    {
      label: 'Instituciones',
      value: stats.totalInstituciones,
      icon: Building2,
      color: 'text-blue-600 bg-blue-100',
      change: '+0%'
    },
    {
      label: 'Grupos Activos',
      value: stats.totalGrupos,
      icon: GraduationCap,
      color: 'text-green-600 bg-green-100',
      change: '+0%'
    },
    {
      label: 'Estudiantes',
      value: stats.totalEstudiantes,
      icon: Users,
      color: 'text-purple-600 bg-purple-100',
      change: '+0%'
    },
    {
      label: 'Respuestas Recientes',
      value: stats.respuestasRecientes,
      icon: TrendingUp,
      color: 'text-teal-600 bg-teal-100',
      change: '+0%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración BULL-S
          </h1>
          <p className="text-gray-600">
            Sistema de gestión para análisis sociométrico y detección de bullying escolar
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-semibold text-gray-900">
                        {loading ? '...' : stat.value}
                      </p>
                      <span className="ml-2 text-sm text-gray-500">{stat.change}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alertas Críticas */}
        {stats.alertasCriticas > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Atención:</strong> Hay {stats.alertasCriticas} alertas críticas que requieren revisión inmediata.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Módulos de Administración */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Módulos de Administración</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {adminModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate(module.path)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center mb-4">
                    <div className={`flex-shrink-0 p-3 rounded-lg ${module.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {module.description}
                  </p>
                  <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    {module.stats}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Database className="h-5 w-5 text-blue-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Sistema iniciado</p>
                <p className="text-xs text-gray-500">Conexión a base de datos establecida</p>
              </div>
              <span className="text-xs text-gray-400">Hace unos minutos</span>
            </div>
            
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">La actividad reciente se mostrará aquí</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;