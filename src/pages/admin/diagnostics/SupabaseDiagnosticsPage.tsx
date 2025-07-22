import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

/**
 * Página de diagnóstico de Supabase
 * Muestra información sobre la conexión con Supabase y el estado de la base de datos
 */
const SupabaseDiagnosticsPage: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [databaseInfo, setDatabaseInfo] = useState<any>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Intentar una consulta simple para verificar la conexión
        const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
        
        if (error) {
          setConnectionStatus('error');
          setErrorMessage(error.message);
          return;
        }
        
        setConnectionStatus('connected');
        
        // Obtener información sobre las tablas
        const { data: tablesInfo } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');
          
        setDatabaseInfo({
          tables: tablesInfo || [],
        });
      } catch (err: any) {
        setConnectionStatus('error');
        setErrorMessage(err.message || 'Error desconocido al conectar con Supabase');
      }
    };
    
    checkConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Supabase</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Estado de la conexión</h2>
        
        {connectionStatus === 'checking' && (
          <div className="flex items-center text-blue-600">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Verificando conexión...</span>
          </div>
        )}
        
        {connectionStatus === 'connected' && (
          <div className="text-green-600 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Conectado correctamente a Supabase</span>
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="text-red-600">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Error de conexión</span>
            </div>
            {errorMessage && (
              <div className="mt-2 text-sm bg-red-50 p-3 rounded border border-red-200">
                {errorMessage}
              </div>
            )}
          </div>
        )}
      </div>
      
      {connectionStatus === 'connected' && databaseInfo && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Información de la base de datos</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Tablas disponibles ({databaseInfo.tables.length})</h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200 max-h-60 overflow-y-auto">
              {databaseInfo.tables.length > 0 ? (
                <ul className="space-y-1">
                  {databaseInfo.tables.map((table: any, index: number) => (
                    <li key={index} className="text-sm font-mono">{table.table_name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No se encontraron tablas</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseDiagnosticsPage;