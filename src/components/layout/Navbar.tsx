import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import UserProfileBadge from '../auth/UserProfileBadge';

interface NavbarProps {
  title?: string;
}

/**
 * Componente de barra de navegación que incluye el UserProfileBadge
 */
const Navbar: React.FC<NavbarProps> = ({ title = 'BULLS App' }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Manejadores de eventos para el UserProfileBadge
  const handleProfileClick = () => {
    console.log('Ver perfil');
    // Implementar navegación al perfil
  };

  const handleSettingsClick = () => {
    console.log('Configuración');
    // Implementar navegación a configuración
  };

  const handleLogoutClick = async () => {
    try {
      console.log('Cerrando sesión...');
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              {title}
            </Link>

            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Inicio
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/admin"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Admin
                  </Link>

                  <Link
                    to="/student"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Estudiante
                  </Link>

                  <Link
                    to="/link-identity"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Vincular Identidades
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <UserProfileBadge
                userName={user?.user_metadata?.username || user?.email}
                userId={user?.id}
                userStatus="online"
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                onLogoutClick={handleLogoutClick}
              />
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
