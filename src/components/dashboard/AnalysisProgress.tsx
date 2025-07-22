import React from 'react';
import { CheckCircle, Clock, AlertCircle, Users, FileText, BarChart3, Activity } from 'lucide-react';

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'error';
  progress: number;
  icon: React.ComponentType<any>;
}

interface AnalysisProgressProps {
  loading?: boolean;
  reporteData?: any;
  className?: string;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ 
  loading = false, 
  reporteData,
  className = '' 
}) => {
  const getAnalysisSteps = (): AnalysisStep[] => {
    const hasData = !!reporteData;
    const hasStudents = reporteData?.estudiantes?.length > 0;
    const hasRoles = reporteData?.roles_bullying?.length > 0;
    const hasVariables = reporteData?.variables_situacionales?.formasAgresion?.length > 0;

    return [
      {
        id: 'data-collection',
        title: 'Recolección de Datos',
        description: 'Obtención de respuestas del cuestionario BULL-S',
        status: hasStudents ? 'completed' : loading ? 'in-progress' : 'pending',
        progress: hasStudents ? 100 : loading ? 50 : 0,
        icon: Users
      },
      {
        id: 'sociometric-analysis',
        title: 'Análisis Sociométrico',
        description: 'Evaluación de relaciones de aceptación y rechazo',
        status: hasData ? 'completed' : hasStudents ? 'in-progress' : 'pending',
        progress: hasData ? 100 : hasStudents ? 75 : 0,
        icon: BarChart3
      },
      {
        id: 'bullying-roles',
        title: 'Identificación de Roles',
        description: 'Detección de agresores, víctimas y observadores',
        status: hasRoles ? 'completed' : hasData ? 'in-progress' : 'pending',
        progress: hasRoles ? 100 : hasData ? 60 : 0,
        icon: AlertCircle
      },
      {
        id: 'situational-variables',
        title: 'Variables Situacionales',
        description: 'Análisis de formas, lugares y frecuencia de agresiones',
        status: hasVariables ? 'completed' : hasRoles ? 'in-progress' : 'pending',
        progress: hasVariables ? 100 : hasRoles ? 40 : 0,
        icon: FileText
      }
    ];
  };

  const steps = getAnalysisSteps();
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalProgress = (completedSteps / steps.length) * 100;

  const getStatusIcon = (status: AnalysisStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status: AnalysisStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'in-progress':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-500" />
            Progreso del Análisis
          </h3>
          <span className="text-sm text-gray-600">
            {completedSteps} de {steps.length} completados
          </span>
        </div>
        
        {/* Barra de progreso general */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        <div className="text-right mt-1">
          <span className="text-sm font-medium text-gray-900">{Math.round(totalProgress)}%</span>
        </div>
      </div>

      {/* Lista de pasos */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              {/* Línea conectora */}
              {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200" />
              )}
              
              <div className={`flex items-start p-4 rounded-lg border ${getStatusColor(step.status)}`}>
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-current">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold">{step.title}</h4>
                    {getStatusIcon(step.status)}
                  </div>
                  
                  <p className="text-sm opacity-75 mb-2">{step.description}</p>
                  
                  {/* Barra de progreso individual */}
                  {step.progress > 0 && step.status !== 'pending' && (
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-1.5">
                      <div 
                        className="bg-current h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen de estado */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {loading ? 'Procesando datos...' : 'Análisis actualizado'}
          </div>
          
          {reporteData?.resumen?.fecha_generacion && (
            <div className="text-gray-500">
              Última actualización: {new Date(reporteData.resumen.fecha_generacion).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgress;