import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  actionable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AlertPanelProps {
  alerts: Alert[];
  onDismiss?: (alertId: string) => void;
  className?: string;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onDismiss, className = '' }) => {
  if (alerts.length === 0) return null;

  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: AlertCircle,
          iconColor: 'text-red-500',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: Info,
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        };
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-500',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        };
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {alerts.map((alert) => {
        const styles = getAlertStyles(alert.type);
        const Icon = styles.icon;

        return (
          <div
            key={alert.id}
            className={`border rounded-lg p-4 ${styles.container}`}
          >
            <div className="flex items-start">
              <Icon className={`h-5 w-5 ${styles.iconColor} mt-0.5 mr-3 flex-shrink-0`} />
              
              <div className="flex-1">
                <h4 className={`text-sm font-semibold ${styles.titleColor} mb-1`}>
                  {alert.title}
                </h4>
                <p className={`text-sm ${styles.messageColor}`}>
                  {alert.message}
                </p>
                
                {alert.action && (
                  <button
                    onClick={alert.action.onClick}
                    className={`mt-3 text-sm font-medium underline ${styles.titleColor} hover:no-underline`}
                  >
                    {alert.action.label}
                  </button>
                )}
              </div>

              {onDismiss && (
                <button
                  onClick={() => onDismiss(alert.id)}
                  className={`ml-3 ${styles.iconColor} hover:opacity-75`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Hook para generar alertas basadas en datos del análisis
export const useAnalysisAlerts = (reporteData: any): Alert[] => {
  if (!reporteData) return [];

  const alerts: Alert[] = [];

  // Alerta por agresores identificados
  const agresores = reporteData.roles_bullying?.filter((rol: any) => 
    rol.maltrato > 20 || rol.fuerte > 25
  ) || [];

  if (agresores.length > 0) {
    alerts.push({
      id: 'agresores-detectados',
      type: 'warning',
      title: 'Agresores Identificados',
      message: `Se han identificado ${agresores.length} estudiantes con comportamientos agresivos que requieren intervención inmediata.`,
      actionable: true,
      action: {
        label: 'Ver detalles',
        onClick: () => console.log('Mostrar detalles de agresores')
      }
    });
  }

  // Alerta por víctimas vulnerables
  const victimas = reporteData.roles_bullying?.filter((rol: any) => 
    rol.victima > 15 || rol.cobarde > 30
  ) || [];

  if (victimas.length > 0) {
    alerts.push({
      id: 'victimas-vulnerables',
      type: 'error',
      title: 'Víctimas en Situación de Riesgo',
      message: `${victimas.length} estudiantes están en situación de vulnerabilidad y necesitan apoyo psicológico urgente.`,
      actionable: true,
      action: {
        label: 'Generar plan de apoyo',
        onClick: () => console.log('Generar plan de apoyo')
      }
    });
  }

  // Alerta por baja cohesión grupal
  const cohesionBaja = reporteData.resumen?.grupos_analizados?.some((grupo: any) => 
    grupo.porcentaje_participacion < 70
  );

  if (cohesionBaja) {
    alerts.push({
      id: 'cohesion-baja',
      type: 'warning',
      title: 'Baja Cohesión Grupal',
      message: 'Se detecta fragmentación social y formación de subgrupos aislados que facilitan dinámicas de exclusión.',
      actionable: true,
      action: {
        label: 'Ver recomendaciones',
        onClick: () => console.log('Mostrar recomendaciones de cohesión')
      }
    });
  }

  // Alerta por alta frecuencia de agresiones
  const agresionFrecuente = reporteData.variables_situacionales?.frecuenciaAgresion?.some((freq: any) => 
    (freq.categoria === 'Diariamente' && freq.porcentaje > 10) ||
    (freq.categoria === '1-2 veces/semana' && freq.porcentaje > 30)
  );

  if (agresionFrecuente) {
    alerts.push({
      id: 'agresion-frecuente',
      type: 'error',
      title: 'Alta Frecuencia de Agresiones',
      message: 'Se detecta un patrón sistemático de agresiones que requiere intervención inmediata del equipo directivo.',
      actionable: true,
      action: {
        label: 'Activar protocolo',
        onClick: () => console.log('Activar protocolo de emergencia')
      }
    });
  }

  // Alerta informativa sobre el progreso del análisis
  if (reporteData.resumen?.total_estudiantes > 0) {
    alerts.push({
      id: 'analisis-completado',
      type: 'success',
      title: 'Análisis Completado',
      message: `Se ha completado el análisis de ${reporteData.resumen.total_estudiantes} estudiantes. Los datos están listos para revisión.`,
      actionable: false
    });
  }

  return alerts;
};

export default AlertPanel;