import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowLeft,
  Eye,
  Printer,
  Share2,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart as RechartsPieChart, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import sociometricService from '../../services/sociometricService';

interface ReporteConfig {
  tipo: 'resumen' | 'detallado' | 'comparativo' | 'tendencias';
  periodo: 'semana' | 'mes' | 'trimestre' | 'año';
  grupo?: string;
  institucion?: string;
  incluirGraficos: boolean;
  formato: 'pdf' | 'excel' | 'word';
}

const ReportesPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [grupos, setGrupos] = useState<any[]>([]);
  const [instituciones, setInstituciones] = useState<any[]>([]);
  const [reporteConfig, setReporteConfig] = useState<ReporteConfig>({
    tipo: 'resumen',
    periodo: 'mes',
    incluirGraficos: true,
    formato: 'pdf'
  });

  // Datos de ejemplo para los gráficos
  const datosRolesBullying = [
    { name: '6B', agresores: 2, victimas: 3, noImplicados: 20 },
    { name: '8A', agresores: 4, victimas: 5, noImplicados: 21 },
    { name: '8B', agresores: 3, victimas: 4, noImplicados: 21 }
  ];

  const datosEstatusSocial = [
    { name: 'Populares', value: 18, color: '#10B981' },
    { name: 'Promedio', value: 45, color: '#3B82F6' },
    { name: 'Aislados', value: 12, color: '#F59E0B' },
    { name: 'Rechazados', value: 8, color: '#EF4444' }
  ];

  const datosTendencias = [
    { mes: 'Ene', incidentes: 12, alertas: 8 },
    { mes: 'Feb', incidentes: 15, alertas: 12 },
    { mes: 'Mar', incidentes: 8, alertas: 6 },
    { mes: 'Abr', incidentes: 10, alertas: 7 },
    { mes: 'May', incidentes: 6, alertas: 4 },
    { mes: 'Jun', incidentes: 9, alertas: 5 }
  ];

  const datosComparativo = [
    { grupo: '6B', cohesion: 78, densidad: 72, riesgo: 15 },
    { grupo: '8A', cohesion: 65, densidad: 69, riesgo: 25 },
    { grupo: '8B', cohesion: 71, densidad: 65, riesgo: 18 }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gruposData, institucionesData] = await Promise.all([
        sociometricService.getGrupos(),
        sociometricService.getInstituciones()
      ]);
      setGrupos(gruposData);
      setInstituciones(institucionesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const generarReporte = async () => {
    setLoading(true);
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('📊 Reporte generado:', reporteConfig);
      alert(`Reporte ${reporteConfig.tipo} generado exitosamente en formato ${reporteConfig.formato.toUpperCase()}`);
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const exportarDatos = (formato: 'csv' | 'json' | 'excel') => {
    console.log(`📁 Exportando datos en formato ${formato}`);
    alert(`Datos exportados en formato ${formato.toUpperCase()}`);
  };

  return (
    <div className=\"min-h-screen bg-gray-50\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8\">
        
        {/* Header */}
        <div className=\"mb-8\">
          <button
            onClick={() => navigate('/admin')}
            className=\"flex items-center text-gray-600 hover:text-gray-800 mb-4\"
          >
            <ArrowLeft className=\"h-4 w-4 mr-2\" />
            Volver al Panel de Administración
          </button>
          
          <div className=\"flex items-center justify-between\">
            <div>
              <h1 className=\"text-3xl font-bold text-gray-900 flex items-center\">
                <FileText className=\"h-8 w-8 mr-3 text-teal-600\" />
                Reportes y Dashboards
              </h1>
              <p className=\"text-gray-600 mt-2\">
                Generación de reportes avanzados y visualización de datos del Colegio La Salle
              </p>
            </div>
            
            <div className=\"flex gap-3\">
              <button
                onClick={() => exportarDatos('excel')}
                className=\"flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700\"
              >
                <Download className=\"w-4 h-4\" />
                Exportar Excel
              </button>
              
              <button
                onClick={generarReporte}
                disabled={loading}
                className=\"flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50\"
              >
                {loading ? <RefreshCw className=\"w-4 h-4 animate-spin\" /> : <FileText className=\"w-4 h-4\" />}
                {loading ? 'Generando...' : 'Generar Reporte'}
              </button>
            </div>
          </div>
        </div>

        <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-8\">
          
          {/* Panel de Configuración */}
          <div className=\"lg:col-span-1\">
            <div className=\"bg-white rounded-lg shadow p-6 mb-6\">
              <h2 className=\"text-xl font-semibold mb-4 flex items-center\">
                <Filter className=\"w-5 h-5 mr-2 text-teal-600\" />
                Configuración de Reporte
              </h2>
              
              <div className=\"space-y-4\">
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                    Tipo de Reporte
                  </label>
                  <select
                    value={reporteConfig.tipo}
                    onChange={(e) => setReporteConfig({...reporteConfig, tipo: e.target.value as any})}
                    className=\"w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500\"
                  >
                    <option value=\"resumen\">Resumen Ejecutivo</option>
                    <option value=\"detallado\">Análisis Detallado</option>
                    <option value=\"comparativo\">Comparativo por Grupos</option>
                    <option value=\"tendencias\">Tendencias Temporales</option>
                  </select>
                </div>
                
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                    Período
                  </label>
                  <select
                    value={reporteConfig.periodo}
                    onChange={(e) => setReporteConfig({...reporteConfig, periodo: e.target.value as any})}
                    className=\"w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500\"
                  >
                    <option value=\"semana\">Última Semana</option>
                    <option value=\"mes\">Último Mes</option>
                    <option value=\"trimestre\">Último Trimestre</option>
                    <option value=\"año\">Último Año</option>
                  </select>
                </div>
                
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                    Grupo Específico
                  </label>
                  <select
                    value={reporteConfig.grupo || ''}
                    onChange={(e) => setReporteConfig({...reporteConfig, grupo: e.target.value || undefined})}
                    className=\"w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500\"
                  >
                    <option value=\"\">Todos los grupos</option>
                    {grupos.map((grupo) => (
                      <option key={grupo.id} value={grupo.id}>
                        {grupo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                    Formato de Salida
                  </label>
                  <select
                    value={reporteConfig.formato}
                    onChange={(e) => setReporteConfig({...reporteConfig, formato: e.target.value as any})}
                    className=\"w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500\"
                  >
                    <option value=\"pdf\">PDF</option>
                    <option value=\"excel\">Excel</option>
                    <option value=\"word\">Word</option>
                  </select>
                </div>
                
                <div className=\"flex items-center\">
                  <input
                    type=\"checkbox\"
                    id=\"incluirGraficos\"
                    checked={reporteConfig.incluirGraficos}
                    onChange={(e) => setReporteConfig({...reporteConfig, incluirGraficos: e.target.checked})}
                    className=\"mr-2\"
                  />
                  <label htmlFor=\"incluirGraficos\" className=\"text-sm text-gray-700\">
                    Incluir gráficos y visualizaciones
                  </label>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className=\"bg-white rounded-lg shadow p-6\">
              <h3 className=\"text-lg font-semibold mb-4\">Acciones Rápidas</h3>
              
              <div className=\"space-y-3\">
                <button
                  onClick={() => exportarDatos('csv')}
                  className=\"w-full flex items-center gap-2 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50\"
                >
                  <Download className=\"w-4 h-4 text-gray-500\" />
                  <span className=\"text-sm\">Exportar datos CSV</span>
                </button>
                
                <button
                  onClick={() => exportarDatos('json')}
                  className=\"w-full flex items-center gap-2 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50\"
                >
                  <Share2 className=\"w-4 h-4 text-gray-500\" />
                  <span className=\"text-sm\">Exportar datos JSON</span>
                </button>
                
                <button
                  onClick={() => window.print()}
                  className=\"w-full flex items-center gap-2 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50\"
                >
                  <Printer className=\"w-4 h-4 text-gray-500\" />
                  <span className=\"text-sm\">Imprimir dashboard</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Principal */}
          <div className=\"lg:col-span-2 space-y-6\">
            
            {/* Métricas Clave */}
            <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">
              <div className=\"bg-white rounded-lg shadow p-4\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm font-medium text-gray-600\">Total Estudiantes</p>
                    <p className=\"text-2xl font-bold text-gray-900\">83</p>
                  </div>
                  <Users className=\"w-8 h-8 text-blue-500\" />
                </div>
                <p className=\"text-xs text-green-600 mt-1\">+5% vs mes anterior</p>
              </div>

              <div className=\"bg-white rounded-lg shadow p-4\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm font-medium text-gray-600\">Alertas Activas</p>
                    <p className=\"text-2xl font-bold text-red-600\">7</p>
                  </div>
                  <AlertTriangle className=\"w-8 h-8 text-red-500\" />
                </div>
                <p className=\"text-xs text-red-600 mt-1\">+2 desde ayer</p>
              </div>

              <div className=\"bg-white rounded-lg shadow p-4\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm font-medium text-gray-600\">Cohesión Promedio</p>
                    <p className=\"text-2xl font-bold text-green-600\">71%</p>
                  </div>
                  <TrendingUp className=\"w-8 h-8 text-green-500\" />
                </div>
                <p className=\"text-xs text-green-600 mt-1\">+3% vs mes anterior</p>
              </div>

              <div className=\"bg-white rounded-lg shadow p-4\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm font-medium text-gray-600\">Participación</p>
                    <p className=\"text-2xl font-bold text-blue-600\">89%</p>
                  </div>
                  <BarChart3 className=\"w-8 h-8 text-blue-500\" />
                </div>
                <p className=\"text-xs text-blue-600 mt-1\">Estable</p>
              </div>
            </div>

            {/* Gráfico de Roles de Bullying */}
            <div className=\"bg-white rounded-lg shadow p-6\">
              <h3 className=\"text-lg font-semibold mb-4\">Distribución de Roles por Grupo</h3>
              <ResponsiveContainer width=\"100%\" height={300}>
                <BarChart data={datosRolesBullying}>
                  <CartesianGrid strokeDasharray=\"3 3\" />
                  <XAxis dataKey=\"name\" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey=\"agresores\" fill=\"#EF4444\" name=\"Agresores\" />
                  <Bar dataKey=\"victimas\" fill=\"#F59E0B\" name=\"Víctimas\" />
                  <Bar dataKey=\"noImplicados\" fill=\"#10B981\" name=\"No Implicados\" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
              
              {/* Gráfico de Estatus Social */}
              <div className=\"bg-white rounded-lg shadow p-6\">
                <h3 className=\"text-lg font-semibold mb-4\">Estatus Social</h3>
                <ResponsiveContainer width=\"100%\" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={datosEstatusSocial}
                      cx=\"50%\"
                      cy=\"50%\"
                      outerRadius={80}
                      dataKey=\"value\"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {datosEstatusSocial.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de Tendencias */}
              <div className=\"bg-white rounded-lg shadow p-6\">
                <h3 className=\"text-lg font-semibold mb-4\">Tendencias Mensuales</h3>
                <ResponsiveContainer width=\"100%\" height={250}>
                  <LineChart data={datosTendencias}>
                    <CartesianGrid strokeDasharray=\"3 3\" />
                    <XAxis dataKey=\"mes\" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type=\"monotone\" dataKey=\"incidentes\" stroke=\"#EF4444\" name=\"Incidentes\" />
                    <Line type=\"monotone\" dataKey=\"alertas\" stroke=\"#F59E0B\" name=\"Alertas\" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico Comparativo */}
            <div className=\"bg-white rounded-lg shadow p-6\">
              <h3 className=\"text-lg font-semibold mb-4\">Comparativo por Grupos - Colegio La Salle</h3>
              <ResponsiveContainer width=\"100%\" height={300}>
                <AreaChart data={datosComparativo}>
                  <CartesianGrid strokeDasharray=\"3 3\" />
                  <XAxis dataKey=\"grupo\" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type=\"monotone\" dataKey=\"cohesion\" stackId=\"1\" stroke=\"#10B981\" fill=\"#10B981\" fillOpacity={0.6} name=\"Cohesión (%)\" />
                  <Area type=\"monotone\" dataKey=\"densidad\" stackId=\"2\" stroke=\"#3B82F6\" fill=\"#3B82F6\" fillOpacity={0.6} name=\"Densidad (%)\" />
                  <Area type=\"monotone\" dataKey=\"riesgo\" stackId=\"3\" stroke=\"#EF4444\" fill=\"#EF4444\" fillOpacity={0.6} name=\"Riesgo (%)\" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;