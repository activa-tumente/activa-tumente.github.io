import { useState, useEffect } from 'react';
import { BarChart, AlertTriangle, Users, Shield, Filter, ChevronDown, RefreshCw, School } from 'lucide-react';
import dashboardService, { DatosConvivencia } from '../../services/dashboardService';
import sociometricService from '../../services/sociometricService';
import TasasIncidenciaChart from '../charts/TasasIncidenciaChart';
import EstatusSociometricoChart from '../charts/EstatusSociometricoChart';
import CohesionGrupalChart from '../charts/CohesionGrupalChart';
import DinamicasAcosoChart from '../charts/DinamicasAcosoChart';
import FactoresSituacionalesChart from '../charts/FactoresSituacionalesChart';
import AggressionTypesChart from '../charts/AggressionTypesChart';
import DashboardSection from './DashboardSection';

/**
 * Componente para el análisis de convivencia escolar
 */
const ConvivenciaEscolarAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [datosConvivencia, setDatosConvivencia] = useState<DatosConvivencia | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    tasasIncidencia: true,
    estatusSociometrico: true,
    cohesionGrupal: true,
    dinamicasAcoso: true,
    factoresSituacionales: true,
    tiposAgresion: true
  });

  // Estados para filtros
  const [showFilters, setShowFilters] = useState(false);
  const [instituciones, setInstituciones] = useState<{id: string, nombre: string}[]>([]);
  const [grupos, setGrupos] = useState<{id: string, nombre: string, institucion_id: string}[]>([]);
  const [selectedInstitucion, setSelectedInstitucion] = useState<string>('all');
  const [selectedGrupo, setSelectedGrupo] = useState<string>('all');
  const [filteredGrupos, setFilteredGrupos] = useState<{id: string, nombre: string, institucion_id: string}[]>([]);

  // Función para alternar la expansión de una sección
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Cargar instituciones y grupos
  useEffect(() => {
    const fetchInstituciones = async () => {
      try {
        const data = await sociometricService.getInstituciones();
        setInstituciones(data);
      } catch (error) {
        console.error('Error al cargar instituciones:', error);
      }
    };

    const fetchGrupos = async () => {
      try {
        const data = await sociometricService.getGrupos();
        setGrupos(data);
        setFilteredGrupos(data);
      } catch (error) {
        console.error('Error al cargar grupos:', error);
      }
    };

    fetchInstituciones();
    fetchGrupos();
  }, []);

  // Filtrar grupos cuando cambia la institución seleccionada
  useEffect(() => {
    if (selectedInstitucion === 'all') {
      setFilteredGrupos(grupos);
    } else {
      setFilteredGrupos(grupos.filter(grupo => grupo.institucion_id === selectedInstitucion));
    }
  }, [selectedInstitucion, grupos]);

  // Cargar datos de convivencia escolar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const institucionId = selectedInstitucion !== 'all' ? selectedInstitucion : undefined;
        const grupoId = selectedGrupo !== 'all' ? selectedGrupo : undefined;

        const data = await dashboardService.obtenerDatosConvivencia(institucionId, grupoId);
        setDatosConvivencia(data);

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos de convivencia:', error);
        setError('Error al cargar datos de convivencia. Por favor, intente de nuevo.');
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedInstitucion, selectedGrupo]);

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!datosConvivencia) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">No hay datos disponibles para mostrar.</p>
          </div>
        </div>
      </div>
    );
  }

  // Manejar cambio de institución
  const handleInstitucionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInstitucion(e.target.value);
    setSelectedGrupo('all');
  };

  // Manejar cambio de grupo
  const handleGrupoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGrupo(e.target.value);
  };

  // Manejar aplicación de filtros
  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <School className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-800">
            {selectedInstitucion === 'all' ? 'Todas las instituciones' :
              instituciones.find(i => i.id === selectedInstitucion)?.nombre || 'Institución seleccionada'}
            {selectedGrupo !== 'all' && ` - ${grupos.find(g => g.id === selectedGrupo)?.nombre}`}
          </h2>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          <ChevronDown className="h-4 w-4 ml-2" />
        </button>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="institucion" className="block text-sm font-medium text-gray-700 mb-1">
                Institución
              </label>
              <select
                id="institucion"
                className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedInstitucion}
                onChange={handleInstitucionChange}
              >
                <option value="all">Todas las instituciones</option>
                {instituciones.map((institucion) => (
                  <option key={institucion.id} value={institucion.id}>
                    {institucion.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="grupo" className="block text-sm font-medium text-gray-700 mb-1">
                Grupo
              </label>
              <select
                id="grupo"
                className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedGrupo}
                onChange={handleGrupoChange}
              >
                <option value="all">Todos los grupos</option>
                {filteredGrupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowFilters(false)}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}

      {/* Sección de Tasas de Incidencia General */}
      <DashboardSection
        title="Tasas de Incidencia General"
        icon={<BarChart className="h-5 w-5" />}
        isExpanded={expandedSections.tasasIncidencia}
        onToggle={() => toggleSection('tasasIncidencia')}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TasasIncidenciaChart data={datosConvivencia.tasaIncidencia} />
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-800 mb-4">Interpretación</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Agresores:</span> {Math.round(datosConvivencia.tasaIncidencia.agresores)}% de los estudiantes.
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Víctimas:</span> {Math.round(datosConvivencia.tasaIncidencia.victimas)}% de los estudiantes.
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Agresores-Víctimas:</span> {Math.round(datosConvivencia.tasaIncidencia.agresoresVictimas)}% de los estudiantes.
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">No Implicados:</span> {Math.round(datosConvivencia.tasaIncidencia.otros)}% de los estudiantes.
              </p>
              <p className="text-sm text-gray-600 mt-4">
                <span className="font-semibold">Implicación Total:</span> {Math.round(datosConvivencia.tasaIncidencia.agresores + datosConvivencia.tasaIncidencia.victimas + datosConvivencia.tasaIncidencia.agresoresVictimas)}% de los estudiantes están implicados en situaciones de acoso escolar.
              </p>
            </div>
          </div>
        </div>
      </DashboardSection>

      {/* Sección de Estatus Sociométrico Promedio */}
      <DashboardSection
        title="Estatus Sociométrico Promedio"
        icon={<Users className="h-5 w-5" />}
        isExpanded={expandedSections.estatusSociometrico}
        onToggle={() => toggleSection('estatusSociometrico')}
      >
        <EstatusSociometricoChart data={datosConvivencia.estatusSociometrico} />
      </DashboardSection>

      {/* Sección de Cohesión Grupal Promedio */}
      <DashboardSection
        title="Cohesión Grupal Promedio"
        icon={<Users className="h-5 w-5" />}
        isExpanded={expandedSections.cohesionGrupal}
        onToggle={() => toggleSection('cohesionGrupal')}
      >
        <CohesionGrupalChart data={datosConvivencia.cohesionGrupal} />
      </DashboardSection>

      {/* Sección de Dinámicas de Acoso Predominantes */}
      <DashboardSection
        title="Dinámicas de Acoso Predominantes"
        icon={<AlertTriangle className="h-5 w-5" />}
        isExpanded={expandedSections.dinamicasAcoso}
        onToggle={() => toggleSection('dinamicasAcoso')}
      >
        <DinamicasAcosoChart data={datosConvivencia.dinamicasAcoso} />
      </DashboardSection>

      {/* Sección de Factores Situacionales */}
      <DashboardSection
        title="Factores Situacionales"
        icon={<Shield className="h-5 w-5" />}
        isExpanded={expandedSections.factoresSituacionales}
        onToggle={() => toggleSection('factoresSituacionales')}
      >
        <FactoresSituacionalesChart data={datosConvivencia.factoresSituacionales} />
      </DashboardSection>

      {/* Sección de Tipos de Agresión */}
      <DashboardSection
        title="Tipos de Agresión"
        icon={<AlertTriangle className="h-5 w-5" />}
        isExpanded={expandedSections.tiposAgresion}
        onToggle={() => toggleSection('tiposAgresion')}
      >
        <AggressionTypesChart
          data={[
            { name: 'Físico', value: Math.round(datosConvivencia.factoresSituacionales.formasAgresion['Físico'] || 35) },
            { name: 'Verbal', value: Math.round(datosConvivencia.factoresSituacionales.formasAgresion['Verbal'] || 65) },
            { name: 'Social', value: Math.round(datosConvivencia.factoresSituacionales.formasAgresion['Social'] || 45) },
            { name: 'Cibernético', value: Math.round(datosConvivencia.factoresSituacionales.formasAgresion['Cibernético'] || 25) },
            { name: 'Exclusión', value: Math.round(datosConvivencia.factoresSituacionales.formasAgresion['Exclusión'] || 40) },
            { name: 'Intimidación', value: Math.round(datosConvivencia.factoresSituacionales.formasAgresion['Intimidación'] || 30) }
          ]}
        />
      </DashboardSection>
    </div>
  );
};

export default ConvivenciaEscolarAnalysis;
