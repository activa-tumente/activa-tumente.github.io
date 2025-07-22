import { supabase } from '../supabase';

// Definir la interfaz para el usuario
export interface UserProfile {
  id: string;
  email?: string;
  user_metadata?: {
    username?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    permissions?: string[];
  };
  app_metadata?: any;
  created_at: string;
  updated_at?: string;
}

// Definir la interfaz para las credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Definir la interfaz para la respuesta de login
export interface LoginResponse {
  success: boolean;
  message?: string;
  session?: any;
  user?: UserProfile;
}

/**
 * Autentica a un usuario con email y contraseña
 * @param credentials Credenciales de login (email y password)
 * @returns Respuesta de login con sesión si es exitoso
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('Intentando login con:', { email: credentials.email, password: '******' });

    // No necesitamos verificar credenciales de prueba ya que usaremos los usuarios existentes

    // Autenticar con Supabase
    console.log('Intentando autenticar con Supabase con:', { email: credentials.email });
    const email = credentials.email;

    // Simplificar la autenticación sin mecanismo de reintento
    console.log('Llamando directamente a supabase.auth.signInWithPassword');

    // Verificar la URL y la clave de Supabase
    console.log('Verificando configuración de Supabase:', {
      url: supabase.supabaseUrl,
      hasKey: !!supabase.supabaseKey,
      keyPrefix: supabase.supabaseKey ? supabase.supabaseKey.substring(0, 10) + '...' : 'No disponible'
    });

    // Llamar directamente a la API de Supabase sin timeout adicional
    console.log('Llamando a supabase.auth.signInWithPassword con:', { email, password: '********' });
    const authResult = await supabase.auth.signInWithPassword({
      email: email,
      password: credentials.password
    });

    console.log('Respuesta recibida de supabase.auth.signInWithPassword');

    // Destructurar el resultado final
    const { data, error } = authResult;

    if (error) {
      console.error('Error de autenticación con Supabase:', error);
      return {
        success: false,
        message: error.message || 'Credenciales inválidas'
      };
    }

    if (!data || !data.session || !data.user) {
      console.error('Autenticación fallida: No se recibieron datos de sesión o usuario');
      return {
        success: false,
        message: 'Error al iniciar sesión. No se recibieron datos de autenticación.'
      };
    }

    console.log('Login exitoso con Supabase', {
      sessionExists: !!data.session,
      userExists: !!data.user,
      userId: data.user?.id
    });

    return {
      success: true,
      message: 'Login exitoso',
      session: data.session,
      user: data.user as UserProfile
    };
  } catch (error: any) {
    console.error('Error en el login:', error);

    // Mejorar los mensajes de error
    let errorMessage = 'Error en el proceso de login';
    let errorDetails = '';

    // Capturar detalles adicionales del error para el registro
    if (error.code) {
      errorDetails += ` [Código: ${error.code}]`;
    }
    if (error.status) {
      errorDetails += ` [Estado HTTP: ${error.status}]`;
    }

    // Registrar detalles adicionales para depuración
    console.error(`Detalles adicionales del error:${errorDetails}`, {
      errorObject: error,
      stack: error.stack
    });

    // Mensajes de error más descriptivos basados en el tipo de error
    if (error.message && error.message.includes('Tiempo de espera agotado')) {
      errorMessage = 'El servidor está tardando en responder. Por favor, inténtalo de nuevo más tarde.';
      // Verificar si hay problemas de red
      try {
        const networkTest = await fetch('https://eckuozleqbbcecaycmjt.supabase.co/auth/v1/health', { method: 'GET' });
        if (!networkTest.ok) {
          errorMessage += ' Parece haber problemas de conectividad con el servidor de autenticación.';
        }
      } catch (netError) {
        errorMessage += ' No se pudo verificar la conectividad con el servidor.';
      }
    } else if (error.message && (error.message.includes('network') || error.message.includes('fetch'))) {
      errorMessage = 'Problema de conexión. Verifica tu conexión a internet e inténtalo de nuevo.';
    } else if (error.message && error.message.includes('Invalid login credentials')) {
      errorMessage = 'Credenciales inválidas. Por favor verifica tu correo electrónico y contraseña.';
    } else if (error.message && error.message.includes('rate limit')) {
      errorMessage = 'Has excedido el límite de intentos de inicio de sesión. Por favor, espera unos minutos antes de intentarlo de nuevo.';
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
 * Cierra la sesión del usuario actual
 * @returns Respuesta indicando si el logout fue exitoso
 */
export const logout = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message || 'Error al cerrar sesión'
      };
    }

    return {
      success: true,
      message: 'Sesión cerrada exitosamente'
    };
  } catch (error: any) {
    console.error('Error en el logout:', error);
    return {
      success: false,
      message: error.message || 'Error al cerrar sesión'
    };
  }
};

/**
 * Obtiene la sesión actual del usuario
 * @returns La sesión actual o null si no hay sesión
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return null;
    }

    return data.session;
  } catch (error) {
    console.error('Error al obtener la sesión:', error);
    return null;
  }
};

/**
 * Obtiene el usuario actual
 * @returns El usuario actual o null si no hay usuario autenticado
 */
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return data.user as UserProfile;
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return null;
  }
};

// No necesitamos funciones para crear usuarios de prueba ya que usaremos los usuarios existentes

// Exportar el servicio de autenticación
export const authApi = {
  login,
  logout,
  getCurrentSession,
  getCurrentUser
};
