import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';

const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, refreshUser } = useAuth();
  const [message, setMessage] = useState('Verificando autenticación...');
  const [error, setError] = useState<string | null>(null);

  // Obtener la URL de redirección original (si existe)
  const from = location.state?.from || '/';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Refrescar el estado del usuario
        await refreshUser();
        
        // Esperar un breve tiempo para que el estado se actualice
        setTimeout(() => {
          if (isAuthenticated) {
            setMessage('Sesión activa, redirigiendo...');
            
            // Redirigir a la página original o a la página principal
            setTimeout(() => {
              navigate(from, { replace: true });
            }, 500);
          } else {
            setError('No hay sesión activa');
            
            // Redirigir a la página de login
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 1000);
          }
        }, 500);
      } catch (err: any) {
        console.error('Error al verificar autenticación:', err);
        setError(err.message || 'Error al verificar autenticación');
        
        // Redirigir a la página de login en caso de error
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1000);
      }
    };
    
    if (!isLoading) {
      checkAuth();
    }
  }, [isLoading, isAuthenticated, navigate, from, refreshUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {error ? 'Error de Autenticación' : 'Autenticación'}
        </h2>
        
        {!error && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-800"></div>
          </div>
        )}
        
        <p className="text-center text-gray-600">
          {error ? error : message}
        </p>
        
        {error && (
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
            >
              Volver al Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthRedirect;