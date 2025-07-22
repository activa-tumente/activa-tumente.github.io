import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock, Database, Wifi, Server, Users, Shield } from 'lucide-react';

interface SystemStatusProps {
  className?: string;
}

interface StatusItem {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning' | 'loading';
  description: string;
  icon: React.ComponentType<any>;
  lastCheck: Date;
  details?: string;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ className = '' }) => {
  const [systemStatus, setSystemStatus] = useState<StatusItem[]>([
    {
      id: 'database',
      name: 'Base de Datos',
      status: 'online',
      description: 'Conexión a Supabase activa',
      icon: Database,
      lastCheck: new Date(),
      details: 'Latencia: 45ms'
    },
    {
      id: 'auth',
      name: 'Sistema de Autenticación',
      status: 'online',
      description: 'Servicios de autenticación funcionando',
      icon: Shield,
      lastCheck: new Date(),
      details: '3 usuarios activos'
    },
    {
      id: 'analysis',
      name: 'Motor de Análisis',
      status: 'online',
      description: 'Procesamiento BULL-S operativo',
      icon: Users,
      lastCheck: new Date(),
      details: 'Último análisis: hace 5 min'
    },
    {
      id: 'api',
      name: 'API Services',
      status: 'online',
      description: 'Endpoints de API respondiendo',
      icon: Server,
      lastCheck: new Date(),
      details: 'Tiempo de respuesta: 120ms'
    }
  ]);

  const [overallStatus, setOverallStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  useEffect(() => {
    // Simular verificación de estado del sistema
    const checkSystemStatus = () => {
      const offlineCount = systemStatus.filter(item => item.status === 'offline').length;
      const warningCount = systemStatus.filter(item => item.status === 'warning').length;

      if (offlineCount > 0) {
        setOverallStatus('critical');
      } else if (warningCount > 0) {
        setOverallStatus('warning');
      } else {
        setOverallStatus('healthy');
      }
    };

    checkSystemStatus();

    // Actualizar estado cada 30 segundos
    const interval = setInterval(() => {
      setSystemStatus(prev => prev.map(item => ({
        ...item,
        lastCheck: new Date(),
        // Simular cambios ocasionales de estado
        status: Math.random() > 0.95 ? 'warning' : item.status
      })));
      checkSystemStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [systemStatus]);

  const getStatusIcon = (status: StatusItem['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'loading':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusColor = (status: StatusItem['status']) => {
    switch (status) {
      case 'online':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'offline':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'loading':
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'healthy':
        return 'text-green-700 bg-green-100';
      case 'warning':
        return 'text-yellow-700 bg-yellow-100';
      case 'critical':
        return 'text-red-700 bg-red-100';
    }
  };

  const getOverallStatusText = () => {
    switch (overallStatus) {
      case 'healthy':
        return 'Todos los sistemas operativos';
      case 'warning':
        return 'Algunos servicios con advertencias';
      case 'critical':
        return 'Servicios críticos fuera de línea';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Wifi className="h-5 w-5 mr-2 text-blue-500" />
          Estado del Sistema
        </h3>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getOverallStatusColor()}`}>
          {getOverallStatusText()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systemStatus.map((item) => {
          const Icon = item.icon;
          
          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <Icon className="h-5 w-5 mr-2" />
                  <h4 className="font-medium">{item.name}</h4>
                </div>
                {getStatusIcon(item.status)}
              </div>
              
              <p className="text-sm opacity-75 mb-2">{item.description}</p>
              
              {item.details && (
                <p className="text-xs opacity-60 mb-2">{item.details}</p>
              )}
              
              <div className="flex items-center justify-between text-xs opacity-60">
                <span>Última verificación:</span>
                <span>{item.lastCheck.toLocaleTimeString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Métricas adicionales */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <div className="text-xs text-gray-500">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-xs text-gray-500">Estudiantes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-xs text-gray-500">Análisis hoy</div>
          </div>
        </div>
      </div>

      {/* Botón de actualización manual */}
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setSystemStatus(prev => prev.map(item => ({
              ...item,
              lastCheck: new Date()
            })));
          }}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Verificar estado ahora
        </button>
      </div>
    </div>
  );
};

export default SystemStatus;