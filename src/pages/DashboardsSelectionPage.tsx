import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Book,
  Users,
  AlertCircle,
  Search,
  School,
  Loader,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../lib/auth/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { cacheService } from '../lib/cacheService';
import InstitutionsSummary from '../components/dashboard/InstitutionsSummary';

interface Group {
  id: string;
  nombre: string;
  institucion_id: string;
  institucion_nombre?: string;
  estudiantes_count?: number;
}

interface Institution {
  id: string;
  nombre: string;
}

// Tiempos de caché y timeout
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const LOAD_TIMEOUT = 15000; // 15 segundos

/**
 * Componente para seleccionar entre diferentes grupos y dashboards
 * Optimizado para evitar parpadeo y bucles infinitos
 */
const DashboardsSelectionPage = () => {
  const navigate = useNavigate();
  const { profile = {} } = useAuth() || {};

  // Referencias para prevenir efectos secundarios
  const isMounted = useRef(true);
  const loadingCountRef = useRef(new Set<string>());
  const initialLoadDone = useRef(false);

  // Estados para datos
  const [groups, setGroups] = useState<Group[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDbInfo, setShowDbInfo] = useState(false);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');

  // Dashboards disponibles
  const dashboardTypes = [
    {
      id: 'general',
      title: 'Dashboard General',
      description: 'Visualiza estadísticas generales y resumen de datos del sistema.',
      icon: <BarChart2 className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-100',
      path: (groupId: string) => `/admin/dashboard/${groupId}/general`
    },
    {
      id: 'bullying',
      title: 'Dashboard de Bullying',
      description: 'Análisis detallado de indicadores y métricas relacionadas con situaciones de bullying.',
      icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
      color: 'bg-orange-100',
      path: (groupId: string) => `/admin/dashboard/${groupId}/bullying`
    },
    {
      id: 'academic',
      title: 'Rendimiento Académico',
      description: 'Seguimiento del rendimiento académico y factores relacionados.',
      icon: <Book className="h-6 w-6 text-green-600" />,
      color: 'bg-green-100',
      path: (groupId: string) => `/admin/dashboard/${groupId}/academic`,
      disabled: true
    },
    {
      id: 'social',
      title: 'Relaciones Sociales',
      description: 'Análisis de redes sociales y dinámicas de grupo entre estudiantes.',
      icon: <Users className="h-6 w-6 text-purple-600" />,
      color: 'bg-purple-100',
      path: (groupId: string) => `/admin/dashboard/${groupId}/social`,
      disabled: true
    }
  ];

  // Limpiar referencias al desmontar el componente
  useEffect(() => {
    // Marcar como montado al inicio
    isMounted.current = true;

    // Limpiar al desmontar
    return () => {
      isMounted.current = false;
      // Limpiar cualquier timeout pendiente aquí si es necesario
    };
  }, []);

  // Filtrar los dashboards según el rol del usuario
  const getFilteredDashboards = useCallback(() => {
    // Si es administrador, muestra todos
    if (profile?.role === 'Administrador') return dashboardTypes;

    // Si es psicólogo, muestra todos excepto el académico
    if (profile?.role === 'Psicologo') {
      return dashboardTypes.filter(d => d.id !== 'academic');
    }

    // Si es profesor, muestra solo general y académico
    if (profile?.role === 'Profesor') {
      return dashboardTypes.filter(d => ['general', 'academic'].includes(d.id));
    }

    // Para otros roles, muestra solo el general
    return dashboardTypes.filter(d => d.id === 'general');
  }, [profile]);

  // Función optimizada para contar estudiantes por institución
  // Versión segura que evita parpadeos
  const fetchStudentCount = useCallback(async (groupId: string): Promise<number> => {
    // Verificar si ya estamos obteniendo el conteo para este grupo
    if (loadingCountRef.current.has(groupId)) {
      return 0; // Evitar solicitudes duplicadas
    }

    const cacheKey = `student_count_${groupId}`;

    try {
      // Marcar como en proceso de carga
      loadingCountRef.current.add(groupId);

      // Verificar si ya tenemos el valor en caché
      const cachedCount = cacheService.get<number>(cacheKey);
      if (cachedCount !== null) {
        return cachedCount;
      }

      // Buscar primero el institucion_id para este grupo
      const { data: groupData, error: groupError } = await supabase
        .from('grupos')
        .select('institucion_id')
        .eq('id', groupId)
        .single();

      if (groupError || !groupData) {
        return 0;
      }

      const institucionId = groupData.institucion_id;

      // Ahora contar estudiantes de esta institución
      const { data, error } = await supabase
        .from('estudiantes')
        .select('id')
        .eq('institucion_id', institucionId);

      if (error) {
        return 0;
      }

      const count = data?.length || 0;

      // Guardar en caché
      cacheService.set(cacheKey, count, CACHE_DURATION);
      return count;
    } catch (error) {
      console.warn(`Error al obtener conteo para grupo ${groupId}:`, error);
      return 0;
    } finally {
      // Marcar como completado
      loadingCountRef.current.delete(groupId);
    }
  }, []);

  // Función para actualizar los conteos de manera segura
  // Esta versión no actualiza el estado si el componente se desmontó
  const updateGroupStudentCount = useCallback(async (group: Group) => {
    try {
      const count = await fetchStudentCount(group.id);

      // Solo actualizar si el componente sigue montado
      if (isMounted.current) {
        setGroups(prevGroups =>
          prevGroups.map(g =>
            g.id === group.id
              ? { ...g, estudiantes_count: count }
              : g
          )
        );
      }
    } catch (err) {
      console.warn(`No se pudo actualizar el conteo para el grupo ${group.id}`);
    }
  }, [fetchStudentCount]);

  // Cargar los grupos e instituciones (solo una vez)
  useEffect(() => {
    // Evitar cargar múltiples veces
    if (initialLoadDone.current) return;

    const fetchData = async () => {
      // Tiempo de inicio para el timeout
      const startTime = Date.now();

      try {
        setLoading(true);
        setError(null);

        // 1. Obtener instituciones
        const { data: institutionsData, error: institutionsError } = await supabase
          .from('instituciones_educativas')
          .select('id, nombre')
          .order('nombre');

        if (institutionsError) {
          throw institutionsError;
        }

        if (!isMounted.current) return;
        setInstitutions(institutionsData || []);

        // 2. Obtener grupos
        const { data: groupsData, error: groupsError } = await supabase
          .from('grupos')
          .select(`
            id,
            nombre,
            institucion_id,
            instituciones_educativas(nombre)
          `)
          .order('nombre');

        if (groupsError) {
          throw groupsError;
        }

        if (!isMounted.current) return;

        // 3. Transformar los datos
        const transformedGroups = groupsData.map(group => ({
          id: group.id,
          nombre: group.nombre,
          institucion_id: group.institucion_id,
          institucion_nombre: group.instituciones_educativas?.[0]?.nombre,
          estudiantes_count: undefined
        }));

        // 4. Establecer los grupos
        setGroups(transformedGroups);

        // 5. Cargar estudiantes de manera limitada y escalonada
        // Solo si no ha pasado demasiado tiempo
        if (Date.now() - startTime < 5000) {
          setTimeout(() => {
            // Solo procesar si el componente sigue montado
            if (!isMounted.current) return;

            // Limitar a los primeros grupos para evitar sobrecarga
            const initialBatch = transformedGroups.slice(0, 3);
            initialBatch.forEach(group => {
              updateGroupStudentCount(group);
            });
          }, 500);
        }

        // Marcar como cargado
        initialLoadDone.current = true;
      } catch (err: any) {
        if (!isMounted.current) return;

        console.error('Error al cargar datos:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    // Establecer un timeout para evitar carga infinita
    const timeoutId = setTimeout(() => {
      if (loading && isMounted.current) {
        setLoading(false);
        setError('La carga de datos está tomando demasiado tiempo. Por favor, recarga la página.');
      }
    }, LOAD_TIMEOUT);

    fetchData();

    // Limpiar el timeout al desmontar
    return () => clearTimeout(timeoutId);
  }, [updateGroupStudentCount]);

  // Filtrar grupos según búsqueda e institución seleccionada
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.institucion_nombre && group.institucion_nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesInstitution = selectedInstitution === 'all' ||
      group.institucion_id === selectedInstitution;

    return matchesSearch && matchesInstitution;
  });

  // Navegar a un dashboard específico para un grupo
  const navigateToDashboard = (groupId: string, dashboardId: string) => {
    const dashboard = dashboardTypes.find(d => d.id === dashboardId);
    if (dashboard) {
      if (dashboard.disabled) {
        // Mostrar mensaje de próximamente o deshabilitar el botón
        return;
      }
      // Guardar el ID del grupo actual en localStorage para futuras referencias
      localStorage.setItem('lastVisitedGroupId', groupId);
      navigate(dashboard.path(groupId));
    }
  };

  // Renderizar un mensaje de carga
  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando grupos y dashboards disponibles...</p>
        </div>
      </div>
    );
  }

  // Si hay error, intentamos cargar la página normal de todos modos
  // El error se manejará de forma silenciosa

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboards Disponibles</h1>

      {/* Resumen de colegios inscritos */}
      <InstitutionsSummary className="mb-6" />

      {/* Panel de información opcional */}
      <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div
          className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
          onClick={() => setShowDbInfo(!showDbInfo)}
        >
          <div className="flex items-center">
            <Info className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">
              Información sobre estudiantes
            </h2>
          </div>
          <div>
            {showDbInfo ?
              <ChevronUp className="h-5 w-5 text-gray-600" /> :
              <ChevronDown className="h-5 w-5 text-gray-600" />
            }
          </div>
        </div>

        {showDbInfo && (
          <div className="p-4 border-t border-gray-200">
            <p className="text-gray-600 mb-2">
              El conteo de estudiantes muestra el total de estudiantes en la institución.
            </p>
            <p className="text-gray-600">
              Los dashboards mostrarán información detallada según el grupo seleccionado.
            </p>
          </div>
        )}
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <p className="mb-4 text-gray-600">
          Selecciona un grupo para visualizar los dashboards disponibles. Los datos mostrados dependerán del grupo seleccionado.
        </p>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar grupo
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Buscar por nombre de grupo o institución"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
              Institución
            </label>
            <select
              id="institution"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
            >
              <option value="all">Todas las instituciones</option>
              {institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de grupos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center mb-2">
                  <School className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">{group.nombre}</h2>
                </div>
                <p className="text-sm text-gray-600">{group.institucion_nombre}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {loadingCountRef.current.has(group.id) ? (
                    <span className="flex items-center">
                      <Loader className="h-3 w-3 animate-spin text-blue-500 mr-1" />
                      Consultando estudiantes...
                    </span>
                  ) : (
                    group.estudiantes_count !== undefined
                      ? `${group.estudiantes_count} estudiantes en la institución`
                      : 'Información no disponible'
                  )}
                </p>
              </div>
              <div className="p-4 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Dashboards disponibles:</h3>
                <div className="space-y-2">
                  {getFilteredDashboards().map((dashboard) => (
                    <button
                      key={`${group.id}-${dashboard.id}`}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
                        dashboard.disabled
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : `${dashboard.color} text-gray-800 hover:bg-opacity-80`
                      }`}
                      onClick={() => navigateToDashboard(group.id, dashboard.id)}
                      disabled={dashboard.disabled}
                    >
                      <span className="flex items-center">
                        {dashboard.icon}
                        <span className="ml-2">{dashboard.title}</span>
                      </span>
                      {dashboard.disabled && <span className="text-xs bg-gray-200 px-2 py-1 rounded">Próximamente</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No se encontraron grupos</h3>
            <p className="text-gray-500">
              {searchTerm || selectedInstitution !== 'all'
                ? 'No hay grupos que coincidan con los criterios de búsqueda. Intenta ajustar los filtros.'
                : 'No hay grupos disponibles en el sistema.'}
            </p>
          </div>
        )}
      </div>

      {/* Información general de dashboards */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Acerca de los Dashboards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardTypes.map((dashboard) => (
            <div key={dashboard.id} className={`p-4 rounded-lg ${dashboard.color}`}>
              <div className="flex items-center mb-2">
                {dashboard.icon}
                <h3 className="ml-2 text-lg font-medium">{dashboard.title}</h3>
              </div>
              <p className="text-gray-700">{dashboard.description}</p>
              {dashboard.disabled && (
                <p className="mt-2 text-sm text-gray-500 italic">
                  Esta funcionalidad estará disponible próximamente.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardsSelectionPage;