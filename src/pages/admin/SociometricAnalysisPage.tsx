import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Download, 
  AlertTriangle, 
  Users, 
  Network,
  FileText,
  Eye,
  TrendingUp,
  Target,
  Shield
} from 'lucide-react';
import SociogramChart from '../../components/charts/SociogramChart';
import bullsAnalysisService, { 
  SociometricAnalysis, 
  BullsEvaluationData,
  SociometricNode 
} from '../../services/bullsAnalysisService';
import sociometricService from '../../services/sociometricService';

const SociometricAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('1');
  const [grupos, setGrupos] = useState<any[]>([]);
  const [analysisData, setAnalysisData] = useState<SociometricAnalysis | null>(null);
  const [evaluationData, setEvaluationData] = useState<BullsEvaluationData | null>(null);
  const [selectedNode, setSelectedNode] = useState<SociometricNode | null>(null);
  const [activeTab, setActiveTab] = useState<'sociogram' | 'metrics' | 'risks' | 'report'>('sociogram');

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      runAnalysis();
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    try {
      const gruposData = await sociometricService.getGrupos();
      setGrupos(gruposData);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const runAnalysis = async () => {
    try {
      setLoading(true);
      
      // Try to parse real data first, fallback to example data
      let data = await bullsAnalysisService.parseBullsData(selectedGroup);
      
      if (!data || data.respuestas.length === 0) {
        console.log('No real data found, generating example data');
        data = bullsAnalysisService.generateExampleData(selectedGroup);
      }
      
      setEvaluationData(data);
      
      // Process sociometric analysis
      const analysis = await bullsAnalysisService.processSociometricData(data);
      setAnalysisData(analysis);
      
      // Export analysis data
      await bullsAnalysisService.exportAnalysisData(analysis, data);
      
    } catch (error) {
      console.error('Error running analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node: SociometricNode) => {
    setSelectedNode(node);
  };

  const exportReport = async () => {
    if (!analysisData || !evaluationData) return;
    
    try {
      const report = await bullsAnalysisService.generateAnalysisReport(analysisData, evaluationData);
      
      // Create and download report file
      const blob = new Blob([report], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analisis_sociometrico_${evaluationData.grupo_nombre}_${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'popular': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'isolated': return 'text-gray-600 bg-gray-100';
      case 'controversial': return 'text-orange-600 bg-orange-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Panel de Administración
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Network className="h-8 w-8 mr-3 text-indigo-600" />
                Análisis Sociométrico BULL-S
              </h1>
              <p className="text-gray-600 mt-2">
                Análisis de relaciones sociales y detección de riesgos de bullying
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {grupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    Grupo {grupo.nombre}
                  </option>
                ))}
              </select>
              
              <button
                onClick={runAnalysis}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {loading ? 'Analizando...' : 'Actualizar'}
              </button>
              
              <button
                onClick={exportReport}
                disabled={!analysisData}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {analysisData && evaluationData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Estudiantes</p>
                  <p className="text-2xl font-bold text-gray-900">{evaluationData.estudiantes.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Alto Riesgo</p>
                  <p className="text-2xl font-bold text-red-600">
                    {analysisData.riskIndicators.highRiskStudents.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Cohesión Grupal</p>
                  <p className="text-2xl font-bold text-green-600">
                    {analysisData.groupMetrics.cohesionIndex}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-orange-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Aislamiento</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {analysisData.groupMetrics.isolationRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white border-b mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'sociogram', label: 'Sociograma', icon: Network },
              { id: 'metrics', label: 'Métricas', icon: TrendingUp },
              { id: 'risks', label: 'Indicadores de Riesgo', icon: AlertTriangle },
              { id: 'report', label: 'Reporte', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
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

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Procesando análisis sociométrico...</span>
          </div>
        ) : analysisData && evaluationData ? (
          <div>
            {/* Sociogram Tab */}
            {activeTab === 'sociogram' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sociograma - Grupo {evaluationData.grupo_nombre}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {analysisData.nodes.length} estudiantes, {analysisData.edges.length} relaciones
                  </div>
                </div>
                
                <SociogramChart
                  nodes={analysisData.nodes}
                  edges={analysisData.edges}
                  clusters={analysisData.clusters}
                  width={1000}
                  height={600}
                  onNodeClick={handleNodeClick}
                />
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Métricas Grupales</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-900">Índice de Cohesión</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {analysisData.groupMetrics.cohesionIndex}%
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-900">Densidad de Red</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {analysisData.groupMetrics.densityIndex}%
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-medium text-purple-900">Tasa de Reciprocidad</h3>
                      <p className="text-2xl font-bold text-purple-600">
                        {analysisData.groupMetrics.reciprocityRate}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Clusters Sociales</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisData.clusters.map((cluster, index) => (
                      <div key={cluster.id} className="p-4 border rounded-lg">
                        <h3 className="font-medium text-gray-900">Cluster {index + 1}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {cluster.size} miembros, cohesión: {cluster.cohesionScore.toFixed(1)}%
                        </p>
                        <div className="text-xs text-gray-500">
                          Miembros: {cluster.members.map(id => 
                            analysisData.nodes.find(n => n.id === id)?.name
                          ).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Risk Indicators Tab */}
            {activeTab === 'risks' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Estudiantes de Alto Riesgo</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Estudiante
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Estatus Social
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Riesgo Bullying
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Riesgo Victimización
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Popularidad
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Rechazo
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analysisData.nodes
                          .filter(node => 
                            node.bullyingRisk === 'high' || 
                            node.victimizationRisk === 'high' ||
                            node.socialStatus === 'rejected' ||
                            node.socialStatus === 'isolated'
                          )
                          .map((node) => (
                            <tr key={node.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {node.fullName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {node.age} años, {node.gender === 'M' ? 'Masculino' : 'Femenino'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(node.socialStatus)}`}>
                                  {node.socialStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(node.bullyingRisk)}`}>
                                  {node.bullyingRisk}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(node.victimizationRisk)}`}>
                                  {node.victimizationRisk}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {node.popularityScore}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {node.rejectionScore}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recomendaciones</h2>
                  <div className="space-y-3">
                    {analysisData.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <p className="text-sm text-yellow-800">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Report Tab */}
            {activeTab === 'report' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Reporte de Análisis</h2>
                  <button
                    onClick={exportReport}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Download className="w-4 h-4" />
                    Descargar Reporte
                  </button>
                </div>
                
                <div className="prose max-w-none">
                  <h3>Resumen Ejecutivo</h3>
                  <ul>
                    <li>Total de estudiantes analizados: {evaluationData.estudiantes.length}</li>
                    <li>Respuestas procesadas: {evaluationData.respuestas.length}</li>
                    <li>Índice de cohesión grupal: {analysisData.groupMetrics.cohesionIndex}%</li>
                    <li>Tasa de aislamiento: {analysisData.groupMetrics.isolationRate}%</li>
                  </ul>

                  <h3>Indicadores de Riesgo Críticos</h3>
                  <ul>
                    <li>Estudiantes de alto riesgo: {analysisData.riskIndicators.highRiskStudents.length}</li>
                    <li>Potenciales víctimas: {analysisData.riskIndicators.potentialVictims.length}</li>
                    <li>Potenciales agresores: {analysisData.riskIndicators.potentialAggressors.length}</li>
                    <li>Estudiantes aislados: {analysisData.riskIndicators.isolatedStudents.length}</li>
                  </ul>

                  <h3>Análisis de Red Social</h3>
                  <ul>
                    <li>Densidad de la red: {analysisData.groupMetrics.densityIndex}%</li>
                    <li>Tasa de reciprocidad: {analysisData.groupMetrics.reciprocityRate}%</li>
                    <li>Clusters sociales identificados: {analysisData.clusters.length}</li>
                  </ul>

                  <h3>Recomendaciones Prioritarias</h3>
                  <ul>
                    {analysisData.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Network className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Selecciona un grupo para comenzar el análisis</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SociometricAnalysisPage;