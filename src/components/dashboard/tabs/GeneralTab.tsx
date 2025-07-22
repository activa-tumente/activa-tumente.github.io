import React from 'react';
import { Users } from 'lucide-react';
import AnalysisProgress from '../AnalysisProgress';
import RealTimeStats from '../RealTimeStats';

interface Kpi {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
}

interface GeneralTabProps {
  loading: boolean;
  reporteData: any;
  selectedGroup: string | 'all';
  getKpiData: () => Kpi[];
  estadisticas: any;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ 
  loading, 
  reporteData, 
  selectedGroup, 
  getKpiData,
  estadisticas
}) => {
  return (
    <div className="space-y-6">
      <AnalysisProgress loading={loading} reporteData={reporteData} />
      <RealTimeStats grupoId={selectedGroup === 'all' ? undefined : selectedGroup} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getKpiData().map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${kpi.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {kpi.value} {kpi.subtitle && <span className="text-sm text-gray-500">{kpi.subtitle}</span>}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción del Estudio</h3>
        <p className="text-gray-700 mb-4">
          Este análisis presenta los resultados del Test BULL-S aplicado a estudiantes del colegio, 
          una herramienta diseñada para evaluar las dinámicas de agresividad y bullying entre escolares. 
          El test analiza tres dimensiones principales: relaciones de aceptación/rechazo entre los estudiantes, 
          dinámica de bullying (agresores y víctimas), y variables situacionales del fenómeno.
        </p>
        <p className="text-gray-700">
          Los datos han sido recogidos mediante cuestionarios completados por {estadisticas?.respuestasValidas || 0} estudiantes 
          de {estadisticas?.totalGrupos || 0} grupos activos, con edades {estadisticas?.rangoEdad || 'no disponibles'}. 
          El análisis identifica patrones de relaciones, perfiles de posibles agresores y víctimas, 
          así como características principales de las agresiones.
          {estadisticas?.porcentajeRespuestas && estadisticas.porcentajeRespuestas > 0 && (
            <span className="font-medium"> Tasa de respuesta: {estadisticas.porcentajeRespuestas}%</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default GeneralTab;