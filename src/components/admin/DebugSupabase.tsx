import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const DebugSupabase: React.FC = () => {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [policies, setPolicies] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Verificar sesión
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSessionInfo(sessionData);
        
        // Verificar estructura de la tabla
        const { data: tableData, error: tableError } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1);
        
        if (tableError) throw tableError;
        setTableInfo(tableData);
        
        // Intentar obtener información sobre las políticas (esto es solo informativo)
        try {
          const { data: policiesData, error: policiesError } = await supabase
            .rpc('get_policies', { table_name: 'user_profiles' });
          
          if (!policiesError) {
            setPolicies(policiesData);
          }
        } catch (e) {
          console.log('No se pudo obtener información sobre políticas RLS');
        }
      } catch (err: any) {
        setError(err.message || 'Error al conectar con Supabase');
        console.error('Error de depuración:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkSupabaseConnection();
  }, []);
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Depuración de Supabase</h2>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando conexión...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Estado de la sesión</h3>
            <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
              <pre className="text-sm text-gray-800">
                {JSON.stringify(sessionInfo, null, 2)}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Estructura de la tabla user_profiles</h3>
            <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
              <pre className="text-sm text-gray-800">
                {JSON.stringify(tableInfo, null, 2)}
              </pre>
            </div>
          </div>
          
          {policies && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Políticas RLS</h3>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <pre className="text-sm text-gray-800">
                  {JSON.stringify(policies, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pasos para solucionar problemas</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Ejecutar el script <code className="bg-gray-100 px-1 py-0.5 rounded">fix_user_profiles_policies.sql</code> en el Editor SQL de Supabase</li>
              <li>Verificar que el usuario actual tenga el rol de Administrador</li>
              <li>Comprobar que la tabla <code className="bg-gray-100 px-1 py-0.5 rounded">user_profiles</code> tenga todos los campos necesarios</li>
              <li>Reiniciar la aplicación después de aplicar los cambios</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugSupabase;
