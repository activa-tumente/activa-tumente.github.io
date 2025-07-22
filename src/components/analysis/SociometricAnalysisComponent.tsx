import React, { useState, useEffect } from 'react';
import { Download, Eye, FileText, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import sociometricAnalysisService from '../../services/sociometricAnalysisService';
import sociogramVisualizationService from '../../services/sociogramVisualizationService';
import reportGenerationService from '../../services/reportGenerationService';
import type { SociogramNode, SociogramEdge, SocialCluster, RedFlag, NetworkMetrics } from '../../services/sociometricAnalysisService';
import type { ReportData } from '../../services/reportGenerationService';

interface SociometricAnalysisProps {
  groupId: string;
  groupName: string;
}

interface AnalysisState {
  loading: boolean;
  error: string | null;
  nodes: SociogramNode[];
  edges: SociogramEdge[];
  clusters: SocialCluster[];
  metrics: NetworkMetrics;
  redFlags: RedFlag[];
  reportData: ReportData | null;
}

const SociometricAnalysisComponent: React.FC<SociometricAnalysisProps> = ({
  groupId,
  groupName
}) => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    loading: false,
    error: null,
    nodes: [],
    edges: [],
    clusters: [],
    metrics: { density: 0, reciprocity: 0, transitivity: 0, averagePathLength: 0, modularity: 0 },
    redFlags: [],
    reportData: null
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'sociogram' | 'individuals' | 'alerts' | 'report'>('overview');

  /**
   * Ejecutar análisis sociométrico completo
   */
  const runAnalysis = async () => {
    setAnalysisState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log(`Iniciando análisis sociométrico para grupo: ${groupId}`);
      
      // 1. Procesar respuestas BULL-S
      const socialNetworkAnalysis = await sociometricAnalysisService.processBullSResponses(groupId);
      
      // 2. Generar informe completo
      const reportData = await reportGenerationService.generateComprehensiveReport(
        groupId,
        socialNetworkAnalysis.nodes,
        socialNetworkAnalysis.edges,
        socialNetworkAnalysis.clusters,
        socialNetworkAnalysis.metrics,
        socialNetworkAnalysis.redFlags
      );

      setAnalysisState({
        loading: false,
        error: null,
        nodes: socialNetworkAnalysis.nodes,
        edges: socialNetworkAnalysis.edges,
        clusters: socialNetworkAnalysis.clusters,
        metrics: socialNetworkAnalysis.metrics,
        redFlags: socialNetworkAnalysis.redFlags,
        reportData
      });

      console.log('Análisis completado exitosamente');
    } catch (error) {
      console.error('Error en análisis sociométrico:', error);
      setAnalysisState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido en el análisis'
      }));
    }
  };

  /**
   * Generar sociograma visual
   */
  const generateSociogram = () => {
    if (analysisState.nodes.length === 0) return;

    sociogramVisualizationService.createD3Sociogram(
      'sociogram-container',
      analysisState.nodes,
      analysisState.edges,
      analysisState.clusters
    );
  };

  /**
   * Exportar sociograma como imagen
   */
  const exportSociogram = () => {
    sociogramVisualizationService.exportSociogramAsImage(
      'sociogram-container',
      `sociograma-${groupName}-${new Date().toISOString().split('T')[0]}.png`
    );
  };

  /**
   * Exportar datos del sociograma
   */
  const exportSociogramData = () => {
    sociogramVisualizationService.exportSociogramData(
      analysisState.nodes,
      analysisState.edges,
      analysisState.clusters,
      `sociograma-datos-${groupName}-${new Date().toISOString().split('T')[0]}.json`
    );
  };

  /**
   * Exportar informe HTML
   */
  const exportReport = () => {
    if (!analysisState.reportData) return;
    
    reportGenerationService.exportHTMLReport(
      analysisState.reportData,
      `informe-sociometrico-${groupName}-${new Date().toISOString().split('T')[0]}.html`
    );
  };

  /**
   * Generar sociograma cuando cambie la pestaña
   */
  useEffect(() => {
    if (activeTab === 'sociogram' && analysisState.nodes.length > 0) {
      setTimeout(generateSociogram, 100);
    }
  }, [activeTab, analysisState.nodes]);

  /**
   * Obtener color para estatus social
   */
  const getStatusColor = (status: SociogramNode['socialStatus']) => {
    const colors = {
      popular: 'text-green-600 bg-green-100',
      promedio: 'text-blue-600 bg-blue-100',
      aislado: 'text-orange-600 bg-orange-100',
      rechazado: 'text-red-600 bg-red-100',
      controvertido: 'text-purple-600 bg-purple-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  /**
   * Obtener color para severidad de alerta
   */
  const getSeverityColor = (severity: RedFlag['severity']) => {
    const colors = {
      critico: 'text-red-800 bg-red-100 border-red-200',
      alto: 'text-red-700 bg-red-50 border-red-200',
      medio: 'text-orange-700 bg-orange-50 border-orange-200',
      bajo: 'text-yellow-700 bg-yellow-50 border-yellow-200'
    };
    return colors[severity] || 'text-gray-700 bg-gray-50 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Análisis Sociométrico - {groupName}
          </h2>
          <p className="text-gray-600 mt-1">
            Evaluación de dinámicas sociales y detección de patrones de bullying
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={runAnalysis}
            disabled={analysisState.loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {analysisState.loading ? 'Analizando...' : 'Ejecutar Análisis'}
          </button>
          
          {analysisState.reportData && (
            <button
              onClick={exportReport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Informe
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {analysisState.loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg text-gray-600">Procesando datos sociométricos...</span>
        </div>
      )}

      {/* Error State */}
      {analysisState.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Error en el análisis</span>
          </div>
          <p className="text-red-700 mt-2">{analysisState.error}</p>
          <button
            onClick={runAnalysis}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Results */}
      {analysisState.nodes.length > 0 && (
        <>
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Resumen General', icon: Eye },
                { id: 'sociogram', label: 'Sociograma', icon: Users },
                { id: 'individuals', label: 'Análisis Individual', icon: Users },
                { id: 'alerts', label: 'Señales de Alerta', icon: AlertTriangle },
                { id: 'report', label: 'Informe Completo', icon: FileText }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
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

          {/* Tab Content */}
          <div className="tab-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="text-3xl font-bold">{analysisState.metrics.density.toFixed(1)}%</div>
                    <div className="text-blue-100">Densidad de Red</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="text-3xl font-bold">{analysisState.metrics.reciprocity.toFixed(1)}%</div>
                    <div className="text-green-100">Reciprocidad</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="text-3xl font-bold">{analysisState.clusters.length}</div>
                    <div className="text-purple-100">Grupos Sociales</div>
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
                    <div className="text-3xl font-bold">{analysisState.redFlags.length}</div>
                    <div className="text-red-100">Señales de Alerta</div>
                  </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Distribución de Estatus Social</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {['popular', 'promedio', 'aislado', 'rechazado', 'controvertido'].map(status => {
                      const count = analysisState.nodes.filter(n => n.socialStatus === status).length;
                      const percentage = ((count / analysisState.nodes.length) * 100).toFixed(1);
                      return (
                        <div key={status} className="text-center">
                          <div className={`text-2xl font-bold px-3 py-2 rounded-lg ${getStatusColor(status as SociogramNode['socialStatus'])}`}>
                            {count}
                          </div>
                          <div className="text-sm text-gray-600 mt-1 capitalize">{status}</div>
                          <div className="text-xs text-gray-500">{percentage}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Critical Alerts Summary */}
                {analysisState.redFlags.filter(f => f.severity === 'critico' || f.severity === 'alto').length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-4">Atención Prioritaria Requerida</h3>
                    <div className="space-y-3">
                      {analysisState.redFlags
                        .filter(f => f.severity === 'critico' || f.severity === 'alto')
                        .slice(0, 3)
                        .map((flag, index) => {
                          const student = analysisState.nodes.find(n => n.id === flag.studentId);
                          return (
                            <div key={index} className="flex items-start space-x-3">
                              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                              <div>
                                <div className="font-medium text-red-800">
                                  {student?.name} - {flag.type.replace(/-/g, ' ')}
                                </div>
                                <div className="text-red-700 text-sm">{flag.description}</div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sociogram Tab */}
            {activeTab === 'sociogram' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Sociograma Interactivo</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={exportSociogram}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Imagen
                    </button>
                    <button
                      onClick={exportSociogramData}
                      className="flex items-center px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Datos
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div id="sociogram-container" className="w-full h-96 border border-gray-300 rounded bg-white">
                    {/* El sociograma se renderizará aquí */}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>Instrucciones:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Haz clic en un nodo para ver detalles del estudiante</li>
                    <li>Pasa el cursor sobre un nodo para resaltar sus conexiones</li>
                    <li>Los colores representan diferentes estatus sociales</li>
                    <li>Las líneas sólidas son elecciones, las punteadas son rechazos</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Individuals Tab */}
            {activeTab === 'individuals' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Análisis Individual de Estudiantes</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysisState.nodes.map(node => (
                    <div key={node.id} className={`border rounded-lg p-4 ${getStatusColor(node.socialStatus)} border-l-4`}>
                      <div className="font-semibold text-lg mb-2">{node.name}</div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Estatus Social:</span>
                          <span className="font-medium capitalize">{node.socialStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rol de Bullying:</span>
                          <span className="font-medium">{node.bullyingRole}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Popularidad:</span>
                          <span className="font-medium">{node.popularityScore.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rechazo:</span>
                          <span className="font-medium">{node.rejectionScore.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Aislamiento:</span>
                          <span className="font-medium">{node.isolationIndex.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Centralidad:</span>
                          <span className="font-medium">{node.centralityMeasure.toFixed(1)}%</span>
                        </div>
                      </div>

                      {/* Indicadores de riesgo */}
                      {(node.isolationIndex > 70 || node.rejectionScore > 30 || node.bullyingRole !== 'no-implicado') && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center text-red-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Requiere atención</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Señales de Alerta Identificadas</h3>
                
                {analysisState.redFlags.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No se identificaron señales de alerta críticas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysisState.redFlags.map((flag, index) => {
                      const student = analysisState.nodes.find(n => n.id === flag.studentId);
                      return (
                        <div key={index} className={`border rounded-lg p-6 ${getSeverityColor(flag.severity)}`}>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {student?.name || 'Estudiante no identificado'}
                              </h4>
                              <div className="text-sm opacity-75 capitalize">
                                {flag.type.replace(/-/g, ' ')} - Severidad: {flag.severity}
                              </div>
                            </div>
                            <AlertTriangle className="h-6 w-6" />
                          </div>
                          
                          <p className="mb-4">{flag.description}</p>
                          
                          <div>
                            <h5 className="font-medium mb-2">Recomendaciones:</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {flag.recommendations.map((rec, recIndex) => (
                                <li key={recIndex}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Report Tab */}
            {activeTab === 'report' && analysisState.reportData && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Informe Completo</h3>
                  <button
                    onClick={exportReport}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Informe HTML
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Resumen Ejecutivo</h4>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {reportGenerationService.generateExecutiveSummary(analysisState.reportData)}
                  </pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Recomendaciones Prioritarias</h4>
                    <div className="space-y-3">
                      {analysisState.reportData.recommendations.slice(0, 5).map((rec, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <div className="font-medium">{rec.title}</div>
                          <div className="text-sm text-gray-600">{rec.description}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Prioridad: {rec.priority} | Cronograma: {rec.timeline}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Plan de Monitoreo</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="font-medium text-sm">Frecuencia:</div>
                        <div className="text-sm text-gray-600">{analysisState.reportData.interventionPlan.monitoring.frequency}</div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Próximas Revisiones:</div>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {analysisState.reportData.interventionPlan.monitoring.reviewDates.slice(0, 3).map((date, index) => (
                            <li key={index}>{new Date(date).toLocaleDateString('es-ES')}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SociometricAnalysisComponent;