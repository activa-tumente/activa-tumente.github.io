import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Users, AlertTriangle, Eye } from 'lucide-react';

interface RealTimeStatsProps {
  className?: string;
}

interface StatItem {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  unit?: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

const RealTimeStats: React.FC<RealTimeStatsProps> = ({ className = '' }) => {
  const [stats, setStats] = useState<StatItem[]>([
    {
      id: 'active-sessions',
      label: 'Sesiones Activas',
      value: 3,
      previousValue: 2,
      icon: Activity,
      color: 'text-green-600',
      trend: 'up'
    },
    {
      id: 'students-online',
      label: 'Estudiantes Conectados',
      value: 12,
      previousValue: 15,
      icon: Users,
      color: 'text-blue-600',
      trend: 'down'
    },
    {
      id: 'alerts-today',
      label: 'Alertas Hoy',
      value: 2,
      previousValue: 4,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      trend: 'down'
    },
    {
      id: 'dashboard-views',
      label: 'Vistas del Dashboard',
      value: 47,
      previousValue: 42,
      icon: Eye,
      color: 'text-purple-600',
      trend: 'up'
    }
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simular actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          const change = Math.random() > 0.5 ? 1 : -1;
          const newValue = Math.max(0, stat.value + (Math.random() > 0.7 ? change : 0));
          
          return {
            ...stat,
            previousValue: stat.value,
            value: newValue,
            trend: newValue > stat.value ? 'up' : newValue < stat.value ? 'down' : 'stable'
          };
        })
      );
      setLastUpdate(new Date());
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: StatItem['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400" />;
    }
  };

  const getTrendColor = (trend: StatItem['trend']) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-500" />
          Estadísticas en Tiempo Real
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Actualizado: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const percentageChange = calculatePercentageChange(stat.value, stat.previousValue);

          return (
            <div
              key={stat.id}
              className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <div className="flex items-center space-x-1">
                  {getTrendIcon(stat.trend)}
                  {percentageChange !== 0 && (
                    <span className={`text-xs font-medium ${getTrendColor(stat.trend)}`}>
                      {percentageChange > 0 ? '+' : ''}{percentageChange}%
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-sm text-gray-500 ml-1">{stat.unit}</span>
                )}
              </div>
              
              <div className="text-xs text-gray-600">
                {stat.label}
              </div>

              {stat.previousValue !== stat.value && (
                <div className="text-xs text-gray-500 mt-1">
                  Anterior: {stat.previousValue}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Indicadores adicionales */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              <span className="text-gray-600">Sistema Operativo</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              <span className="text-gray-600">Base de Datos Conectada</span>
            </div>
          </div>
          
          <button
            onClick={() => {
              setLastUpdate(new Date());
              // Aquí podrías forzar una actualización de datos
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Actualizar ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeStats;