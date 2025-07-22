import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../lib/auth/AuthContext';
import { AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [showHelp, setShowHelp] = useState(false);

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    // Solo redirigir si está autenticado y no está cargando
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLoginSuccess = (session: any, user: any) => {
    console.log('Login exitoso', { user });

    // Redirigir al usuario a la página principal después del login exitoso
    navigate('/');
  };

  // Limitamos el tiempo de carga a 2 segundos para evitar bucles infinitos
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Si después de 2 segundos sigue cargando, ocultamos el loader
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Si está cargando y no han pasado 2 segundos, mostrar un indicador de carga
  if (isLoading && showLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <>
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-blue-800 mr-2" />
              <h2 className="text-xl font-semibold">Ayuda de Inicio de Sesión</h2>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-700">
                Para iniciar sesión en el sistema, utilice su correo electrónico y contraseña:
              </p>

              <div className="bg-teal-50 p-4 rounded-md">
                <h3 className="font-medium text-teal-800 mb-2">Ejemplo</h3>
                <p className="text-teal-700">Email: <span className="font-mono bg-white px-2 py-1 rounded">keinelust2008@gmail.com</span></p>
                <p className="text-teal-700">Contraseña: <span className="font-mono bg-white px-2 py-1 rounded">********</span></p>
              </div>

              <p className="text-sm text-gray-500">
                Si tiene problemas para acceder, contacte al administrador del sistema.
              </p>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2 px-4 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <LoginForm onLoginSuccess={handleLoginSuccess} />

      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 bg-blue-700 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        ¿Necesitas ayuda?
      </button>
    </>
  );
};

export default LoginPage;