import { createClient } from '@supabase/supabase-js';
import { telemetryService } from './telemetryService';

// Tipo para la base de datos
type Database = any;

// Obtener variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validar que las variables de entorno están definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error crítico: Variables de Supabase no definidas');
  telemetryService.trackDiagnostic(
    'database', 
    'critical', 
    'supabase_env_missing',
    { hasUrl: !!supabaseUrl, hasKey: !!supabaseAnonKey }
  );
}

// Crear el cliente Supabase con configuración simplificada
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'bulls.auth.token'
  }
  // Eliminamos la configuración global de fetch personalizada que causaba problemas
});

// Utilidad para manejar errores de Supabase
export const handleSupabaseError = (error: any): never => {
  console.error('Error de operación Supabase:', error);

  const errorType = {
    code: error.code,
    message: error.message,
    details: error.details
  };
  
  telemetryService.trackError('Supabase operation error', error, errorType);

  // Clasificar errores comunes
  switch (error.code) {
    case 'PGRST116':
      console.error('Error de permisos RLS. Verifica las políticas de seguridad.');
      break;
    case '42P01':
      console.error('Error: Tabla no encontrada. Verifica el esquema de la base de datos.');
      break;
    case '42501':
      console.error('Error: Permisos insuficientes para la operación solicitada.');
      break;
    case '23505':
      console.error('Error: Violación de restricción única.');
      break;
    case '23503':
      console.error('Error: Violación de restricción de llave foránea.');
      break;
  }

  throw error;
};

// Verificar conexión de forma simplificada
export const checkSupabaseConnection = async (): Promise<{success: boolean; details: any}> => {
  const startTime = Date.now();
  
  try {
    // Intentamos una operación simple que no dependa de la estructura específica de la BD
    const { error } = await supabase.auth.getSession();
    
    const duration = Date.now() - startTime;
    const success = !error;
    
    telemetryService.trackConnection(
      success ? 'success' : 'failure',
      duration,
      'auth/getSession'
    );
    
    return {
      success,
      details: {
        auth: {
          error: error ? { message: error.message, code: error.code } : null
        },
        environment: {
          supabaseUrl,
          hasAnonKey: !!supabaseAnonKey
        },
        responseTime: duration,
        timestamp: new Date().toISOString()
      }
    };
  } catch (err) {
    const duration = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
    
    telemetryService.trackConnection('failure', duration, 'auth/getSession');
    telemetryService.trackError('Connection check failed', err as Error, {
      component: 'supabaseClient', 
      method: 'checkSupabaseConnection'
    });
    
    return {
      success: false,
      details: {
        error: errorMessage,
        environment: {
          supabaseUrl,
          hasAnonKey: !!supabaseAnonKey
        },
        responseTime: duration,
        timestamp: new Date().toISOString()
      }
    };
  }
};