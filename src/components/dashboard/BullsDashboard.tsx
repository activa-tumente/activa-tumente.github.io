import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, MapPin, Brain, FileText, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import ExportButton from './ExportButton';
import DashboardFilters, { FilterState } from './DashboardFilters';
import NotificationPanel from './NotificationPanel';
import RealTimeStats from './RealTimeStats';
import HelpPanel from './HelpPanel';
import AnalysisProgress from './AnalysisProgress';
import bullsAnalysisService from '../../services/bullsAnalysisService';
import sociometricService from '../../services/sociometricService';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import Dimension1Tab from './tabs/Dimension1Tab';
import Dimension2Tab from './tabs/Dimension2Tab';
import Dimension3Tab from './tabs/Dimension3Tab';
import ConclusionsTab from './tabs/ConclusionsTab';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

interface BullsDashboardProps {
  className?: string;
}

const BullsDashboard: React.FC<BullsDashboardProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [selectedGroup, setSelectedGroup] = useState<'all' | string>('all');
  const [reporteData, setReporteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [gruposDisponibles, setGruposDisponibles] = useState<any[]>([]);
  const [eleccionesData, setEleccionesData] = useState<any[]>([]);
  const [rechazosData, setRechazosData] = useState<any[]>([]);
  const [bullyingRolesData, setBullyingRolesData] = useState<any[]>([]);
  const [formasAgresionData, setFormasAgresionData] = useState<any[]>([]);
  const [lugaresAgresionData, setLugaresAgresionData] = useState<any[]>([]);
  const [frecuenciaData, setFrecuenciaData] = useState<any[]>([]);

  const tabs = [
    { id: 'general', label: 'Información General', icon: FileText },
    { id: 'dimension1', label: 'Aceptación/Rechazo', icon: Users },
    { id: 'dimension2', label: 'Dinámica Bullying', icon: AlertTriangle },
    { id: 'dimension3', label: 'Variables Situacionales', icon: MapPin },
    { id: 'conclusions', label: 'Conclusiones', icon: Brain }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const grupoId = selectedGroup === 'all' ? undefined : selectedGroup;

        // Cargar grupos primero para el filtro
        if (gruposDisponibles.length === 0) {
          const grupos = await sociometricService.getGrupos();
          setGruposDisponibles(grupos);
        }

        // Cargar todos los datos en paralelo
        const [stats, reporte] = await Promise.all([
          sociometricService.getEstadisticasGenerales(undefined, grupoId),
          bullsAnalysisService.generarReporteCompleto(grupoId),
        ]);

        setEstadisticas(stats);
        setReporteData(reporte);

        // Extraer datos del reporte para las visualizaciones
        // Esto asume que 'generarReporteCompleto' devuelve una estructura que contiene estos datos.
        // Se necesitará ajustar según la respuesta real del servicio.
        setEleccionesData(reporte?.dimension1?.elecciones?.top5 || []);
        setRechazosData(reporte?.dimension1?.rechazos?.top5 || []);
        setBullyingRolesData(reporte?.dimension2?.roles?.perfiles || []);
        setFormasAgresionData(reporte?.dimension3?.formasAgresion?.distribucion || []);
        setLugaresAgresionData(reporte?.dimension3?.lugaresAgresion?.distribucion || []);
        setFrecuenciaData(reporte?.dimension3?.frecuencia?.distribucion || []);

      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('No se pudieron cargar los datos del dashboard. Por favor, intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedGroup, filters]);

  // Generar KPI data dinámicamente
  const getKpiData = () => {
    if (!estadisticas) {
      return [
        { label: 'Total Estudiantes', value: '0', icon: Users, color: 'bg-blue-500' },
        { label: 'Respuestas Válidas', value: '0', subtitle: '(0%)', icon: Users, color: 'bg-green-500' },
        { label: 'Rango de Edad', value: 'No disponible', icon: Users, color: 'bg-purple-500' },
        { label: 'Total Grupos', value: '0', icon: Users, color: 'bg-orange-500' }
      ];
    }

    return [
      {
        label: 'Total Estudiantes',
        value: estadisticas.totalEstudiantes.toString(),
        icon: Users,
        color: 'bg-blue-500'
      },
      {
        label: 'Respuestas Válidas',
        value: estadisticas.respuestasValidas.toString(),
        subtitle: `(${estadisticas.porcentajeRespuestas}%)`,
        icon: Users,
        color: 'bg-green-500'
      },
      {
        label: 'Rango de Edad',
        value: estadisticas.rangoEdad,
        icon: Users,
        color: 'bg-purple-500'
      },
      {
        label: selectedGroup === 'all' ? 'Total Grupos' : 'Grupo Seleccionado',
        value: selectedGroup === 'all'
          ? estadisticas.totalGrupos.toString()
          : estadisticas.gruposNombres.join(', ') || 'N/A',
        icon: Users,
        color: 'bg-orange-500'
      }
    ];
  };

  // Los datos ahora vienen filtrados del backend, no es necesario filtrar en el frontend.
  const filteredElecciones = eleccionesData;
  const filteredRechazos = rechazosData;
  const filteredBullyingRoles = bullyingRolesData;

  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard: Análisis Test BULL-S (Colegio La SALLE)
              </h1>
              <p className="text-gray-600 mt-1">
                Evaluación de la Agresividad entre Escolares - {
                  selectedGroup === 'all'
                    ? `${estadisticas?.totalGrupos || 3} grupos activos (6B, 8A, 8B)`
                    : `Grupo ${estadisticas?.gruposNombres.join(', ') || 'Seleccionado'}`
                } - {estadisticas?.totalEstudiantes || 83} estudiantes
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <DashboardFilters onFiltersChange={setFilters} />
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los grupos</option>
                {gruposDisponibles.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.nombre}
                  </option>
                ))}
              </select>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Actualizar datos"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <NotificationPanel
                notifications={[
                  {
                    id: '1',
                    type: 'error',
                    title: 'Situación Crítica Detectada',
                    message: 'Paulina Bermúdez (6A) presenta 50% de rechazo social. Requiere intervención inmediata.',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    read: false,
                    actionable: true,
                    action: {
                      label: 'Ver detalles',
                      onClick: () => setActiveTab('dimension1')
                    }
                  },
                  {
                    id: '2',
                    type: 'warning',
                    title: 'Comportamiento Agresivo',
                    message: 'Isabella León (6B) muestra patrones de agresión sistemática.',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                    read: false,
                    actionable: true,
                    action: {
                      label: 'Ver análisis',
                      onClick: () => setActiveTab('dimension2')
                    }
                  },
                  {
                    id: '3',
                    type: 'info',
                    title: 'Análisis Completado',
                    message: 'El análisis sociométrico ha sido completado exitosamente.',
                    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                    read: true
                  }
                ]}
              />
              <HelpPanel currentTab={activeTab} />
              <ExportButton grupoId={selectedGroup === 'all' ? undefined : selectedGroup} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center p-8">
            <p>Cargando datos...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'general' && (
              <GeneralInfoTab
                loading={loading}
                reporteData={reporteData}
                selectedGroup={selectedGroup}
                getKpiData={getKpiData}
                estadisticas={estadisticas}
              />
            )}
            {activeTab === 'dimension1' && (
              <Dimension1Tab
                eleccionesData={filteredElecciones}
                rechazosData={filteredRechazos}
              />
            )}
            {activeTab === 'dimension2' && (
              <Dimension2Tab
                bullyingRolesData={filteredBullyingRoles}
              />
            )}
            {activeTab === 'dimension3' && (
              <Dimension3Tab
                formasAgresionData={formasAgresionData}
                lugaresAgresionData={lugaresAgresionData}
                frecuenciaData={frecuenciaData}
              />
            )}
            {activeTab === 'conclusions' && (
              <ConclusionsTab />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default BullsDashboard;