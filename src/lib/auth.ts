import { supabase } from './supabaseClient';
import { telemetryService } from './telemetryService';
import { UserProfile } from './auth/AuthContext';

// Interfaz para la respuesta de autenticación
export interface AuthResponse {
  success: boolean;
  message?: string;
  session?: any;
  user?: any;
}

// Constantes para tiempos de espera
const LOGIN_TIMEOUT = 15000; // 15 segundos
const CACHE_EXPIRY = 300000; // 5 minutos para cache de perfil

// Variable para almacenar en caché el último perfil recuperado
let cachedProfile: { profile: UserProfile | null; timestamp: number } | null = null;

/**
 * Inicia sesión con email y contraseña de manera optimizada
 */
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  const startTime = Date.now();
  
  try {
    // Login con control de tiempo de espera
    const loginPromise = supabase.auth.signInWithPassword({ email, password });
    
    // Crear una promesa de timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Tiempo de espera agotado para la autenticación'));
      }, LOGIN_TIMEOUT);
    });
    
    // Esperar a la primera promesa que se resuelva (login o timeout)
    const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;
    
    if (error) {
      const errorType = error.message.includes('Invalid login credentials') 
        ? 'invalid_credentials' 
        : 'auth_error';
      
      telemetryService.trackAuth('login', false, undefined, error.message);
      
      return {
        success: false,
        message: error.message.includes('Invalid login credentials')
          ? 'Credenciales inválidas. Por favor verifica tu correo electrónico y contraseña.'
          : error.message || 'Error de autenticación'
      };
    }

    if (!data || !data.session || !data.user) {
      telemetryService.trackAuth('login', false, undefined, 'missing_session_data');
      
      return {
        success: false,
        message: 'Error al iniciar sesión. No se recibieron datos de autenticación.'
      };
    }

    // Login exitoso, registrar en telemetría
    const duration = Date.now() - startTime;
    telemetryService.trackAuth('login', true, data.user.id);
    telemetryService.trackConnection('success', duration, 'auth/login');

    return {
      success: true,
      message: 'Login exitoso',
      session: data.session,
      user: data.user
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const isTimeout = error.message.includes('Tiempo de espera agotado');
    
    telemetryService.trackConnection(
      isTimeout ? 'timeout' : 'failure', 
      duration, 
      'auth/login'
    );
    
    telemetryService.trackAuth('login', false, undefined, error.message);
    
    // Mensajes de error más descriptivos
    let errorMessage = 'Error en el proceso de login';
    
    if (isTimeout) {
      errorMessage = 'El servidor está tardando en responder. Por favor, inténtalo de nuevo más tarde.';
    } else if (error.message && error.message.includes('fetch is not a function')) {
      errorMessage = 'Error de configuración del cliente. Por favor, recarga la página e intenta nuevamente.';
    } else if (error.message && error.message.includes('network')) {
      errorMessage = 'Problema de conexión. Verifica tu conexión a internet e inténtalo de nuevo.';
    } else if (error.message && error.message.includes('rate limit')) {
      errorMessage = 'Has excedido el límite de intentos. Por favor, espera unos minutos.';
    } else {
      errorMessage = error.message || 'Error en el servidor';
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Cierra la sesión del usuario actual de manera optimizada
 */
export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      telemetryService.trackAuth('logout', false, undefined, error.message);
      
      return {
        success: false,
        message: error.message || 'Error al cerrar sesión'
      };
    }

    // Limpiar caché de perfil
    cachedProfile = null;
    
    // Limpiar tokens almacenados para mayor seguridad
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('bulls.auth.token');
    } catch (storageError) {
      console.error('Error al limpiar tokens:', storageError);
    }

    telemetryService.trackAuth('logout', true);
    
    return {
      success: true,
      message: 'Sesión cerrada exitosamente'
    };
  } catch (error: any) {
    telemetryService.trackAuth('logout', false, undefined, error.message);
    
    return {
      success: false,
      message: error.message || 'Error al cerrar sesión'
    };
  }
};

/**
 * Obtiene la sesión actual del usuario de manera optimizada
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      telemetryService.trackError('Error al obtener sesión', error, { component: 'auth' });
      return null;
    }

    return data.session;
  } catch (error) {
    telemetryService.trackError('Error inesperado al obtener sesión', error as Error, { component: 'auth' });
    return null;
  }
};

/**
 * Obtiene el usuario actual de manera optimizada
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      telemetryService.trackError('Error al obtener usuario', error, { component: 'auth' });
      return null;
    }

    return data.user;
  } catch (error) {
    telemetryService.trackError('Error inesperado al obtener usuario', error as Error, { component: 'auth' });
    return null;
  }
};

/**
 * Obtiene el perfil del usuario con caché para mejorar rendimiento
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  // Verificar si tenemos un perfil en caché y si sigue siendo válido
  if (cachedProfile && cachedProfile.timestamp > Date.now() - CACHE_EXPIRY) {
    // Si el perfil en caché es para el mismo usuario, devolver el perfil en caché
    if (cachedProfile.profile && cachedProfile.profile.id === userId) {
      return cachedProfile.profile;
    }
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      telemetryService.trackError('Error al obtener perfil', error || new Error('No data'), { userId });
      return null;
    }

    const profile: UserProfile = {
      id: data.id,
      email: data.email,
      firstName: data.firstname,
      lastName: data.lastname,
      role: data.role,
      permissions: data.permissions || [],
      active: data.active,
      createdAt: data.fecha_creacion,
      updatedAt: data.fecha_actualizacion
    };

    // Guardar en caché
    cachedProfile = {
      profile,
      timestamp: Date.now()
    };

    return profile;
  } catch (error) {
    telemetryService.trackError('Error inesperado al obtener perfil', error as Error, { userId });
    return null;
  }
};

/**
 * Verifica si el usuario tiene un permiso específico
 */
export const hasPermission = (user: UserProfile | null, permission: string): boolean => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
};

/**
 * Verifica si el usuario tiene un rol específico
 */
export const hasRole = (user: UserProfile | null, role: string): boolean => {
  if (!user || !user.role) return false;
  return user.role === role;
};

// Exportar el servicio de autenticación
export const authApi = {
  signIn,
  signOut,
  getCurrentSession,
  getCurrentUser,
  getUserProfile,
  hasPermission,
  hasRole
};