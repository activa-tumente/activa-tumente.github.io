import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Users, BookOpen, Activity, Heart } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

/**
 * Página de selección de dashboards
 * Permite al usuario elegir entre los diferentes dashboards disponibles
 */
const DashboardsSelectionPage: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar grupos disponibles
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        
        // Obtener grupos con respuestas usando la función serverless
        const { data, error } = await supabase.rpc('get_groups_with_responses');
        
        if (error) throw error;
        
        setGroups(data || []);
      } catch (err: any) {
        console.error('Error al cargar grupos:', err);
        setError(err.message || 'Error al cargar los grupos');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Dashboards disponibles
  const dashboards = [
    {
      id: 'general',
      name: 'Dashboard General',
      description: 'Visión global de indicadores y estadísticas',
      icon: <BarChart className="h-8 w-8 text-blue-600" />,
      path: '/admin/dashboard-general'
    },
    {
      id: 'byGroup',
      name: 'Dashboard por Grupo',
      description: 'Análisis detallado por grupo con sociograma',
      icon: <Users className="h-8 w-8 text-green-600" />,
      path: '/admin/dashboards-por-grupo'
    },
    {
      id: 'bullying',
      name: 'Dashboard de Bullying',
      description: 'Indicadores de acoso escolar y casos críticos',
      icon: <Activity className="h-8 w-8 text-red-600" />,
      path: '/admin/grupo/:groupId/bullying'
    },
    {
      id: 'academic',
      name: 'Dashboard Académico',
      description: 'Rendimiento académico y asistencia',
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      path: '/admin/grupo/:groupId/academico'
    },
    {
      id: 'social',
      name: 'Dashboard Social',
      description: 'Relaciones sociales y clima escolar',
      icon: <Heart className="h-8 w-8 text-pink-600" />,
      path: '/admin/grupo/:groupId/social'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboards Disponibles</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map((dashboard) => (
          <div 
            key={dashboard.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                {dashboard.icon}
                <h2 className="text-xl font-semibold ml-3 text-gray-800">{dashboard.name}</h2>
              </div>
              <p className="text-gray-600 mb-6">{dashboard.description}</p>
              
              {dashboard.id === 'general' || dashboard.id === 'byGroup' ? (
                <Link 
                  to={dashboard.path}
                  className="block w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 px-4 rounded text-center transition-colors duration-300"
                >
                  Acceder
                </Link>
              ) : loading ? (
                <button 
                  disabled 
                  className="block w-full bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded text-center cursor-not-allowed"
                >
                  Cargando grupos...
                </button>
              ) : groups.length === 0 ? (
                <button 
                  disabled 
                  className="block w-full bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded text-center cursor-not-allowed"
                >
                  No hay grupos disponibles
                </button>
              ) : (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar grupo:</label>
                  <select 
                    className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 mb-3"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        const path = dashboard.path.replace(':groupId', e.target.value);
                        window.location.href = path;
                      }
                    }}
                  >
                    <option value="" disabled>Seleccione un grupo</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.nombre} - {group.institucion_nombre || 'Sin institución'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardsSelectionPage;