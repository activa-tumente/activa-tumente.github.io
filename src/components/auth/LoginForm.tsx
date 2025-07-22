import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { AlertCircle, User, Lock } from 'lucide-react';
import './LoginForm.css';
import { telemetryService, TelemetryEventType } from '../../lib/telemetryService';

interface LoginFormProps {
  onLoginSuccess?: (session: any, user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);
  const [retryTimer, setRetryTimer] = useState<number | null>(null);

  // Marca la conexión como verificada
  useEffect(() => {
    // Verificación de variables de entorno
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      telemetryService.trackDiagnostic(
        'auth',
        'critical',
        'missing_env_vars',
        { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey }
      );
    }
  }, []);

  // Efecto para manejar límites de intentos
  useEffect(() => {
    // Si hay demasiados intentos, establecer un temporizador para permitir más intentos
    if (loginAttempts >= 5 && !retryTimer) {
      const timeout = 30; // 30 segundos de espera
      setRetryTimer(timeout);
      setError(`Demasiados intentos. Por favor espera ${timeout} segundos antes de intentar nuevamente.`);

      const interval = setInterval(() => {
        setRetryTimer((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      // Limpiar intervalo al desmontar
      return () => clearInterval(interval);
    }
  }, [loginAttempts, retryTimer]);

  const validateForm = (): { isValid: boolean; message?: string } => {
    if (!email) {
      return { isValid: false, message: 'Por favor ingrese su correo electrónico' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Por favor ingrese un correo electrónico válido' };
    }

    if (!password) {
      return { isValid: false, message: 'Por favor ingrese su contraseña' };
    }

    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    // Si hay un temporizador de espera, no permitir el intento
    if (retryTimer !== null) {
      setError(`Por favor espera ${retryTimer} segundos antes de intentar nuevamente.`);
      return;
    }

    // Validar formulario
    const validation = validateForm();
    if (!validation.isValid) {
      setError(validation.message || 'Error de validación');
      return;
    }

    setIsLoading(true);

    // Registrar inicio del intento de login
    telemetryService.trackEvent({
      type: TelemetryEventType.USER_ACTION,
      name: 'login_attempt',
      timestamp: Date.now(),
      data: { email: email.length > 0 }
    });

    // Incrementar contador de intentos
    setLoginAttempts(prev => prev + 1);

    try {
      const result = await login(email, password);

      if (result.success) {
        // Login exitoso
        telemetryService.trackEvent({
          type: TelemetryEventType.USER_ACTION,
          name: 'login_success',
          timestamp: Date.now()
        });

        // Si hay un callback de éxito, llamarlo
        if (onLoginSuccess) {
          onLoginSuccess(null, null);
        }

        // Redirigir a la página principal
        navigate('/');
      } else {
        // Login fallido
        telemetryService.trackEvent({
          type: TelemetryEventType.USER_ACTION,
          name: 'login_failure',
          timestamp: Date.now(),
          data: { message: result.message }
        });

        setError(result.message || 'Error de autenticación. Por favor verifica tus credenciales.');
      }
    } catch (err: any) {
      telemetryService.trackError('Error inesperado durante login', err, {
        component: 'LoginForm',
        action: 'login'
      });

      // Formato de error más sencillo
      setError('Error al conectar con el servidor. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
         style={{
           backgroundColor: '#1e3a8a',
           backgroundImage: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      <div className="login-container">
        <div className="flex flex-col items-center">
          {/* Círculo con ícono de usuario */}
          <div className="user-icon-circle">
            <User className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {/* Campo de email con ícono */}
          <div className="input-with-icon mb-4">
            <User className="icon h-5 w-5 text-blue-800" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || retryTimer !== null}
              aria-label="Correo electrónico"
              autoComplete="email"
            />
          </div>

          {/* Campo de contraseña con ícono */}
          <div className="input-with-icon mb-4">
            <Lock className="icon h-5 w-5 text-blue-800" />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || retryTimer !== null}
              aria-label="Contraseña"
              autoComplete="current-password"
            />
          </div>

          {/* Opciones adicionales */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                Recordarme
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-800 hover:text-blue-700">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="flex items-center text-red-500 text-sm p-2 bg-red-50 rounded mb-4">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
              <button
                type="button"
                className="ml-auto text-xs text-blue-800 hover:underline"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
              >
                {showDiagnostics ? 'Ocultar diagnóstico' : 'Mostrar diagnóstico'}
              </button>
            </div>
          )}

          {/* Información de diagnóstico */}
          {error && showDiagnostics && (
            <div className="text-xs font-mono bg-gray-100 p-2 rounded mb-4 overflow-auto max-h-48">
              <div className="mb-2 text-sm font-semibold text-blue-800">Información de diagnóstico:</div>
              <ul className="list-disc pl-4 text-xs space-y-1">
                <li>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? 'Configurada' : 'No configurada'}</li>
                <li>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'No configurada'}</li>
                <li>Navegador: {navigator.userAgent}</li>
                <li>Intentos: {loginAttempts}</li>
              </ul>

              <div className="mt-4 border-t pt-2">
                <div className="text-sm font-semibold text-blue-800 mb-1">Sugerencias:</div>
                <ul className="list-disc pl-4 text-xs space-y-1">
                  <li>Intenta recargar la página y volver a intentar</li>
                  <li>Verifica tu conexión a internet</li>
                  <li>Limpia la caché del navegador</li>
                  <li>Si el problema persiste, contacta al administrador</li>
                </ul>

                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="text-xs bg-blue-800 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Recargar página
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mostrar temporizador si está activo */}
          {retryTimer !== null && (
            <div className="text-sm text-center text-yellow-600 bg-yellow-50 p-2 rounded mb-4">
              Por favor espera {retryTimer} segundos antes de intentar nuevamente.
            </div>
          )}

          {/* Botón de login */}
          <button
            type="submit"
            disabled={isLoading || retryTimer !== null}
            className={`login-button ${isLoading || retryTimer !== null ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Iniciando sesión...' : 'INGRESAR'}
          </button>
        </form>

        {/* Línea separadora */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-center text-sm text-gray-600">
            ¿No tienes una cuenta? <a href="#" className="font-medium text-blue-800 hover:text-blue-700">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;