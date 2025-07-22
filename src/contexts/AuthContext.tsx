import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';
import { cacheService } from '../cacheService';
import { telemetryService, TelemetryEventType } from '../telemetryService';
import { inactivityService } from '../inactivityService';
import InactivityWarning from '../../components/auth/InactivityWarning';

// Definir la interfaz para el perfil de usuario extendido
export interface UserProfile {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  permissions?: string[];
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Definir la interfaz para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  // Funciones de inactividad
  inactivityEnabled: boolean;
  toggleInactivityMonitoring: (enabled: boolean) => void;
  setInactivityTimeout: (timeout: number, warningTime?: number) => void;
  inactivityTimeoutRef: number;
  inactivityWarningRef: number;
}

// Constantes para timeouts y caché
const SESSION_FETCH_TIMEOUT = 5000; // 5 segundos para obtener la sesión
const PROFILE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos para el caché de perfil
const TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos para el caché del token

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInactivityWarning, setShowInactivityWarning] = useState<boolean>(false);
  const [inactivityEnabled, setInactivityEnabled] = useState<boolean>(false);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);

  // Referencias para el tiempo de inactividad (configurable)
  const inactivityTimeoutRef = useRef<number>(30 * 60 * 1000); // 30 minutos por defecto
  const inactivityWarningRef = useRef<number>(1 * 60 * 1000); // 1 minuto antes de expirar

  // Función para obtener el perfil del usuario (optimizada)
  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!userId) {
      console.warn('No se proporcionó ID de usuario para obtener perfil');
      return null;
    }

    const startTime = Date.now();
    const cacheKey = `user_profile_${userId}`;

    try {
      // 1. Intentar obtener del caché primero
      const cachedProfile = cacheService.get<UserProfile>(cacheKey);
      if (cachedProfile) {
        return cachedProfile;
      }

      // 2. Establecer un timeout para la petición
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout al obtener perfil de usuario'));
        }, 10000); // 10 segundos máximo
      });

      // 3. Realizar la consulta principal con id
      const profilePromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // 4. Usar Promise.race para establecer un timeout
      const result = await Promise.race([profilePromise, timeoutPromise]);
      
      if (result && !result.error && result.data) {
        const userProfile: UserProfile = {
          id: result.data.id,
          email: result.data.email,
          firstName: result.data.firstname,
          lastName: result.data.lastname,
          role: result.data.role,
          permissions: result.data.permissions || [],
          active: result.data.active,
          createdAt: result.data.fecha_creacion,
          updatedAt: result.data.fecha_actualizacion
        };

        // Guardar en caché
        cacheService.set(cacheKey, userProfile, PROFILE_CACHE_DURATION);
        
        const duration = Date.now() - startTime;
        telemetryService.trackConnection('success', duration, 'supabase:user_profile');
        
        return userProfile;
      }
      
      // 5. Si no encontramos con id, intentamos con user_id (no bloqueamos la UI)
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (!error && data) {
          const userProfile: UserProfile = {
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
          
          cacheService.set(cacheKey, userProfile, PROFILE_CACHE_DURATION);
          return userProfile;
        }
      } catch (secondError) {
        console.warn('Error al buscar perfil con user_id:', secondError);
      }
      
      // 6. No encontramos perfil
      telemetryService.trackConnection('failure', Date.now() - startTime, 'supabase:user_profile');
      return null;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('Error al obtener perfil:', error);
      telemetryService.trackError('Error fetching user profile', error, { userId });
      telemetryService.trackConnection('failure', duration, 'supabase:user_profile');
      
      // A pesar del error, devolvemos null para permitir que la aplicación funcione
      return null;
    }
  }, []);

  // Función para obtener la sesión (optimizada)
  const getSessionSafe = useCallback(async () => {
    try {
      // Usar Promise.race para establecer un timeout
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout al obtener sesión'));
        }, SESSION_FETCH_TIMEOUT);
      });

      const result = await Promise.race([sessionPromise, timeoutPromise]);
      return result;
    } catch (error) {
      console.error('Error al obtener sesión:', error);
      return { data: { session: null }, error };
    }
  }, []);

  // Función para refrescar los datos del usuario (optimizada)
  const refreshUser = useCallback(async () => {
    // Si ya está en proceso de carga, no hacemos nada
    if (isLoading && initialLoadAttempted) return;
    
    try {
      setIsLoading(true);
      
      // 1. Obtener la sesión con timeout
      const { data: sessionData, error: sessionError } = await getSessionSafe();
      
      if (sessionError) {
        console.warn('Error al obtener sesión:', sessionError);
        setSession(null);
        setUser(null);
        setProfile(null);
        return;
      }
      
      if (sessionData?.session) {
        setSession(sessionData.session);
        
        // 2. Usar la información del usuario de la sesión si está disponible
        if (sessionData.session.user) {
          setUser(sessionData.session.user);
          
          // 3. Obtener el perfil solo si no lo tenemos o si es otro usuario
          if (!profile || profile.id !== sessionData.session.user.id) {
            const userProfile = await fetchUserProfile(sessionData.session.user.id);
            setProfile(userProfile);
          }
          
          return;
        }
      } else {
        // No hay sesión activa
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
      telemetryService.trackError('Error refreshing user', error);
    } finally {
      setIsLoading(false);
    }
  }, [getSessionSafe, fetchUserProfile, profile, initialLoadAttempted, isLoading]);

  // Efecto para cargar el usuario al iniciar (optimizado)
  useEffect(() => {
    // Función para cargar sesión con mejor manejo de errores
    const loadInitialSession = async () => {
      try {
        setIsLoading(true);
        telemetryService.trackEvent({
          type: TelemetryEventType.AUTH,
          name: 'initial_session_loading',
          timestamp: Date.now()
        });
        
        // 1. Establecer un timeout absoluto para evitar bloquear la interfaz
        const timeoutId = setTimeout(() => {
          if (isLoading) {
            setIsLoading(false);
            console.warn('Timeout alcanzado para carga de sesión inicial');
            telemetryService.trackEvent({
              type: TelemetryEventType.AUTH,
              name: 'initial_session_timeout',
              timestamp: Date.now()
            });
          }
        }, SESSION_FETCH_TIMEOUT);
        
        // 2. Intentar obtener la sesión actual
        const { data: sessionData, error: sessionError } = await getSessionSafe();
        
        // Limpiar el timeout ya que la operación completó
        clearTimeout(timeoutId);
        
        if (sessionError) {
          console.warn('Error al cargar sesión inicial:', sessionError);
          telemetryService.trackError('Initial session loading error', sessionError);
          setIsLoading(false);
          setInitialLoadAttempted(true);
          return;
        }
        
        // 3. Procesar la sesión si existe
        if (sessionData?.session) {
          setSession(sessionData.session);
          
          if (sessionData.session.user) {
            setUser(sessionData.session.user);
            
            // 4. Obtener perfil solo si es necesario (asíncrono, no bloqueante)
            fetchUserProfile(sessionData.session.user.id).then(userProfile => {
              if (userProfile) {
                setProfile(userProfile);
              }
              telemetryService.trackEvent({
                type: TelemetryEventType.AUTH,
                name: 'user_profile_loaded',
                timestamp: Date.now(),
                data: { userId: sessionData.session.user.id, hasProfile: !!userProfile }
              });
            });
          }
          
          telemetryService.trackEvent({
            type: TelemetryEventType.AUTH,
            name: 'initial_session_loaded',
            timestamp: Date.now(),
            data: { userId: sessionData.session.user?.id }
          });
        } else {
          console.log('No hay sesión activa');
        }
      } catch (error) {
        console.error('Error al cargar sesión inicial:', error);
        telemetryService.trackError('Error al cargar sesión inicial', error as Error);
      } finally {
        setIsLoading(false);
        setInitialLoadAttempted(true);
      }
    };
    
    // Solo cargar la sesión inicial una vez
    if (!initialLoadAttempted) {
      loadInitialSession();
    }
    
    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        // Reducir logging para eventos frecuentes
        if (event !== 'TOKEN_REFRESHED') {
          console.log('Auth state changed:', event);
        }
        
        if (event === 'SIGNED_IN') {
          setSession(currentSession);
          
          if (currentSession?.user) {
            setUser(currentSession.user);
            
            // Obtener perfil (asíncrono, no bloqueante)
            fetchUserProfile(currentSession.user.id).then(userProfile => {
              setProfile(userProfile);
            });
            
            telemetryService.trackAuth('login', true, currentSession.user.id, 'Auto login via session');
          }
          
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          const currentUserId = user?.id;
          setSession(null);
          setUser(null);
          setProfile(null);
          
          if (currentUserId) {
            telemetryService.trackAuth('logout', true, currentUserId, 'Auto logout via session');
          }
          
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && currentSession) {
          // Solo actualizar la sesión, sin recargar todo
          setSession(currentSession);
        }
      }
    );
    
    // Limpiar la suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, getSessionSafe, user, initialLoadAttempted]);

  // Función de login optimizada
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const startTime = Date.now();
    try {
      setIsLoading(true);
      console.log('Iniciando login con:', email);
      
      // Implementar un mecanismo de reintento manual para la autenticación
      let retryCount = 0;
      const maxRetries = 1; // Máximo 1 reintento (2 intentos en total)
      let authData, authError;
      
      while (retryCount <= maxRetries) {
        try {
          console.log(`Intento de autenticación ${retryCount + 1}/${maxRetries + 1}`);
          
          // Usar Promise.race con un timeout
          const authPromise = supabase.auth.signInWithPassword({
            email,
            password
          });
          
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error('Timeout al intentar autenticar'));
            }, 10000); // 10 segundos por intento
          });
          
          const result = await Promise.race([authPromise, timeoutPromise]);
          
          if (result.error) {
            authError = result.error;
            // Si el error no es de timeout, salir del bucle
            if (!authError.message?.includes('timeout') && !authError.message?.includes('fetch')) {
              break;
            }
            retryCount++;
            if (retryCount <= maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } else {
            authData = result.data;
            break;
          }
        } catch (error) {
          authError = error;
          // Si el error es de timeout, reintentar
          if (error.message?.includes('timeout') || error.message?.includes('fetch')) {
            retryCount++;
            if (retryCount <= maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } else {
            break;
          }
        }
      }
      
      // Manejar el resultado final
      if (authError) {
        console.error('Error de autenticación:', authError);
        
        // Manejar errores específicos
        if (authError.message?.includes('Invalid login credentials')) {
          return {
            success: false,
            message: 'Credenciales inválidas. Por favor verifica tu correo electrónico y contraseña.'
          };
        } else if (authError.message?.includes('timeout') || authError.message?.includes('fetch')) {
          return {
            success: false,
            message: 'Timeout al intentar conectar con el servidor. Por favor intenta de nuevo.'
          };
        } else {
          return {
            success: false,
            message: authError.message || 'Error de autenticación'
          };
        }
      }
      
      if (!authData || !authData.session || !authData.user) {
        return {
          success: false,
          message: 'Error al iniciar sesión. No se recibieron datos válidos.'
        };
      }
      
      // Login exitoso
      console.log('Login exitoso');
      telemetryService.trackAuth('login', true, authData.user.id);
      
      // Actualizar el estado
      setSession(authData.session);
      setUser(authData.user);
      
      // Obtener perfil (no bloqueante)
      fetchUserProfile(authData.user.id).then(userProfile => {
        setProfile(userProfile);
      });
      
      return {
        success: true,
        message: 'Login exitoso'
      };
    } catch (error) {
      console.error('Error inesperado en login:', error);
      return {
        success: false,
        message: 'Error inesperado durante el login. Por favor intenta de nuevo.'
      };
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  // Función de logout optimizada
  const logout = useCallback(async () => {
    const userId = user?.id;
    
    try {
      setIsLoading(true);
      
      // Primero actualizar el estado para mejorar la experiencia de usuario
      setSession(null);
      setUser(null);
      setProfile(null);
      
      // Luego cerrar sesión en Supabase (no bloquea la UI)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error);
        telemetryService.trackError('Error al cerrar sesión', error, { userId });
      }
      
      // Limpiar caché relacionado con el usuario
      if (userId) {
        cacheService.remove(`user_profile_${userId}`);
      }
      
      // Limpiar el almacenamiento local
      try {
        localStorage.removeItem('bulls.auth.token');
        sessionStorage.removeItem('bulls.auth.token');
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
      } catch (storageError) {
        console.error('Error al limpiar tokens:', storageError);
      }
      
      telemetryService.trackAuth('logout', true, userId);
    } catch (error) {
      console.error('Error inesperado al cerrar sesión:', error);
      telemetryService.trackError('Error inesperado al cerrar sesión', error, { userId });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Función para obtener el token de acceso (optimizada)
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const cacheKey = 'access_token';
    
    try {
      // Intentar obtener del caché primero
      const cachedToken = cacheService.get<string>(cacheKey);
      if (cachedToken) {
        return cachedToken;
      }
      
      // Si ya tenemos una sesión, devolver el token
      if (session?.access_token) {
        cacheService.set(cacheKey, session.access_token, TOKEN_CACHE_DURATION);
        return session.access_token;
      }
      
      // Obtener sesión con timeout
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout al obtener token'));
        }, 5000);
      });
      
      const result = await Promise.race([sessionPromise, timeoutPromise]);
      
      if (result && result.data?.session?.access_token) {
        const token = result.data.session.access_token;
        cacheService.set(cacheKey, token, TOKEN_CACHE_DURATION);
        return token;
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener token de acceso:', error);
      return null;
    }
  }, [session]);

  // Función para iniciar el monitoreo de inactividad (optimizada)
  const startInactivityMonitoring = useCallback(() => {
    if (!inactivityEnabled || !user) return;
    
    inactivityService.initialize({
      timeout: inactivityTimeoutRef.current,
      warningTime: inactivityWarningRef.current,
      onInactive: () => {
        logout();
      },
      onWarning: () => {
        setShowInactivityWarning(true);
      }
    });
  }, [inactivityEnabled, user, logout]);

  // Función para detener el monitoreo de inactividad
  const stopInactivityMonitoring = useCallback(() => {
    inactivityService.stop();
    setShowInactivityWarning(false);
  }, []);

  // Función para continuar la sesión después de la advertencia
  const continueSession = useCallback(() => {
    setShowInactivityWarning(false);
    inactivityService.resetTimer();
  }, []);

  // Función para configurar el tiempo de inactividad
  const setInactivityTimeout = useCallback((timeout: number, warningTime: number = 60000) => {
    inactivityTimeoutRef.current = timeout;
    inactivityWarningRef.current = warningTime;
    
    if (inactivityEnabled && user) {
      inactivityService.updateConfig({
        timeout,
        warningTime,
        onInactive: () => {
          logout();
        },
        onWarning: () => {
          setShowInactivityWarning(true);
        }
      });
    }
  }, [inactivityEnabled, user, logout]);

  // Función para habilitar/deshabilitar el monitoreo de inactividad
  const toggleInactivityMonitoring = useCallback((enabled: boolean) => {
    setInactivityEnabled(enabled);
    
    if (enabled && user) {
      startInactivityMonitoring();
    } else {
      stopInactivityMonitoring();
    }
  }, [user, startInactivityMonitoring, stopInactivityMonitoring]);

  // Determinar si el usuario está autenticado
  const isAuthenticated = !!session && !!user;

  // Efecto para gestionar monitoreo de inactividad
  useEffect(() => {
    // Iniciar/detener monitoreo de inactividad según el estado de autenticación
    if (isAuthenticated && inactivityEnabled) {
      startInactivityMonitoring();
    } else {
      stopInactivityMonitoring();
    }
    
    return () => {
      stopInactivityMonitoring();
    };
  }, [isAuthenticated, inactivityEnabled, startInactivityMonitoring, stopInactivityMonitoring]);

  // Valor del contexto
  const value = {
    user,
    profile,
    session,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    getAccessToken,
    // Funciones de inactividad
    inactivityEnabled,
    toggleInactivityMonitoring,
    setInactivityTimeout,
    inactivityTimeoutRef: inactivityTimeoutRef.current,
    inactivityWarningRef: inactivityWarningRef.current
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Componente de advertencia de inactividad */}
      {showInactivityWarning && (
        <InactivityWarning
          onContinue={continueSession}
          onLogout={logout}
        />
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;