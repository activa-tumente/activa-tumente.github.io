import React, { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '../../lib/supabaseClient';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

/**
 * Componente para verificar la conexión con Supabase
 */
const ConnectionChecker: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabaseInfo, setSupabaseInfo] = useState({
    url: '',
    hasKey: false
  });

  // Verificar la conexión
  const checkConnection = async () => {
    try {
      setIsChecking(true);
      setError(null);

      // Obtener información de configuración
      const url = supabase.supabaseUrl;
      const hasKey = !!supabase.supabaseKey;
      
      setSupabaseInfo({
        url,
        hasKey
      });

      // Verificar la conexión
      const connected = await checkSupabaseConnection();
      setIsConnected(connected);

      if (!connected) {
        setError('No se pudo conectar con Supabase. Verifica la configuración y la conexión a internet.');
      }
    } catch (err: any) {
      console.error('Error al verificar conexión:', err);
      setIsConnected(false);
      setError(err.message || 'Error desconocido al verificar la conexión');
    } finally {
      setIsChecking(false);
    }
  };

  // Verificar la conexión al montar el componente
  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-medium mb-4">Diagnóstico de Conexión</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Estado de conexión:</p>
          <div className="flex items-center mt-1">
            {isChecking ? (
              <RefreshCw className="h-5 w-5 text-blue-500 animate-spin mr-2" />
            ) : isConnected === true ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : isConnected === false ? (
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            ) : (
              <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
            )}
            <span className={`text-sm ${
              isChecking 
                ? 'text-blue-500' 
                : isConnected === true 
                  ? 'text-green-500' 
                  : isConnected === false 
                    ? 'text-red-500' 
                    : 'text-gray-500'
            }`}>
              {isChecking 
                ? 'Verificando conexión...' 
                : isConnected === true 
                  ? 'Conectado a Supabase' 
                  : isConnected === false 
                    ? 'No conectado' 
                    : 'Estado desconocido'}
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">Configuración:</p>
          <div className="mt-1 text-sm text-gray-600">
            <p>URL: {supabaseInfo.url || 'No disponible'}</p>
            <p>API Key: {supabaseInfo.hasKey ? 'Configurada' : 'No configurada'}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={checkConnection}
            disabled={isChecking}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isChecking ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Verificar conexión
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionChecker;
