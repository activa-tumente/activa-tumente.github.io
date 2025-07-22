import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { AlertCircle, CheckCircle, RefreshCw, Database, Clock, Shield, Zap } from 'lucide-react';

interface LatencyResult {
  operation: string;
  latency: number;
  success: boolean;
  error?: string;
}

/**
 * Componente para medir la latencia de conexión con Supabase
 */
const SupabaseLatencyChecker: React.FC = () => {
  const [results, setResults] = useState<LatencyResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [averageLatency, setAverageLatency] = useState<number | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor' | null>(null);

  // Función para medir la latencia de una operación
  const measureLatency = async (
    operation: string,
    callback: () => Promise<{ success: boolean; error?: string }>
  ): Promise<LatencyResult> => {
    const startTime = Date.now();
    try {
      const result = await callback();
      const latency = Date.now() - startTime;
      return {
        operation,
        latency,
        success: result.success,
        error: result.error
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        operation,
        latency,
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  };

  // Verificar la latencia de conexión a Supabase
  const checkLatency = async () => {
    setIsChecking(true);
    setResults([]);
    
    try {
      // 1. Prueba de ping básico (health check)
      const pingResult = await measureLatency('Ping básico', async () => {
        try {
          const response = await fetch(`${supabase.supabaseUrl}/rest/v1/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabase.supabaseKey || ''
            }
          });
          return { success: response.ok };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
        }
      });
      
      // 2. Prueba de autenticación anónima
      const authResult = await measureLatency('Autenticación', async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          return { success: !error, error: error?.message };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
        }
      });
      
      // 3. Prueba de consulta a la base de datos
      const queryResult = await measureLatency('Consulta DB', async () => {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('count', { count: 'exact', head: true });
          return { success: !error, error: error?.message };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
        }
      });
      
      // 4. Prueba de operaciones en tiempo real
      const realtimeResult = await measureLatency('Tiempo real', async () => {
        try {
          return new Promise((resolve) => {
            const channel = supabase.channel('latency-test');
            
            // Configurar un timeout por si la conexión tarda demasiado
            const timeout = setTimeout(() => {
              channel.unsubscribe();
              resolve({ success: false, error: 'Timeout al conectar con Realtime' });
            }, 5000);
            
            channel
              .on('system', { event: 'presence_state' }, () => {
                clearTimeout(timeout);
                channel.unsubscribe();
                resolve({ success: true });
              })
              .subscribe((status) => {
                if (status !== 'SUBSCRIBED') return;
                // La suscripción fue exitosa, pero esperamos el evento presence_state
              });
          });
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
        }
      });
      
      // Actualizar resultados
      const allResults = [pingResult, authResult, queryResult, realtimeResult];
      setResults(allResults);
      
      // Calcular latencia promedio (solo de operaciones exitosas)
      const successfulResults = allResults.filter(r => r.success);
      if (successfulResults.length > 0) {
        const avgLatency = successfulResults.reduce((sum, r) => sum + r.latency, 0) / successfulResults.length;
        setAverageLatency(avgLatency);
        
        // Determinar calidad de conexión
        if (avgLatency < 100) {
          setConnectionQuality('excellent');
        } else if (avgLatency < 300) {
          setConnectionQuality('good');
        } else if (avgLatency < 1000) {
          setConnectionQuality('fair');
        } else {
          setConnectionQuality('poor');
        }
      } else {
        setAverageLatency(null);
        setConnectionQuality(null);
      }
      
    } catch (error) {
      console.error('Error al verificar latencia:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // Verificar la latencia al montar el componente
  useEffect(() => {
    checkLatency();
  }, []);

  // Función para obtener el icono según la operación
  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'Ping básico':
        return <Zap className="h-4 w-4" />;
      case 'Autenticación':
        return <Shield className="h-4 w-4" />;
      case 'Consulta DB':
        return <Database className="h-4 w-4" />;
      case 'Tiempo real':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Función para obtener el color según la latencia
  const getLatencyColor = (latency: number) => {
    if (latency < 100) return 'text-green-500';
    if (latency < 300) return 'text-blue-500';
    if (latency < 1000) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Función para obtener el texto de calidad de conexión
  const getQualityText = () => {
    switch (connectionQuality) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Buena';
      case 'fair':
        return 'Regular';
      case 'poor':
        return 'Pobre';
      default:
        return 'Desconocida';
    }
  };

  // Función para obtener el color de calidad de conexión
  const getQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-medium mb-4">Verificación de Latencia de Supabase</h2>
      
      {averageLatency !== null && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Latencia promedio:</p>
          <div className="flex items-center mt-1">
            <span className={`text-xl font-bold ${getLatencyColor(averageLatency)}`}>
              {averageLatency.toFixed(0)} ms
            </span>
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getQualityColor()}`}>
              {getQualityText()}
            </span>
          </div>
        </div>
      )}
      
      <div className="space-y-4 mb-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latencia
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 text-gray-500">
                        {getOperationIcon(result.operation)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {result.operation}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${getLatencyColor(result.latency)}`}>
                      {result.latency} ms
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className={`text-sm ${result.success ? 'text-green-500' : 'text-red-500'}`}>
                        {result.success ? 'Éxito' : 'Error'}
                      </span>
                    </div>
                    {!result.success && result.error && (
                      <div className="text-xs text-red-500 mt-1">
                        {result.error}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {isChecking && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="h-5 w-5 text-blue-500 animate-spin mr-2" />
                      <span className="text-sm text-blue-500">Verificando latencia...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!isChecking && results.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay resultados disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={checkLatency}
          disabled={isChecking}
          className="px-4 py-2 bg-blue-dark text-white rounded-md hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Verificar latencia
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SupabaseLatencyChecker;
