import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthContext';
import { Menu, X, Home, BarChart2, User, Bell, Settings } from 'lucide-react';
import UserProfileBadge from '../components/auth/UserProfileBadge';

const Navbar = () => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Actualizar el estado cuando el perfil se carga
  useEffect(() => {
    if (profile && !profileLoaded) {
      setProfileLoaded(true);
    }
  }, [profile, profileLoaded]);

  // Determinar si una ruta está activa
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Clase para elementos de navegación
  const navItemClass = (path: string) => `
    px-3 py-2 rounded-md text-sm font-medium transition-colors
    ${isActive(path) 
      ? 'bg-blue-700 text-white' 
      : 'text-gray-300 hover:bg-blue-600 hover:text-white'}
  `;

  // Elementos de navegación basados en el rol del usuario
  const getNavItems = () => {
    // Elementos base que todos los usuarios pueden ver
    const items = [
      { path: '/', label: 'Inicio', icon: <Home className="h-5 w-5 mr-2" /> }
    ];

    // Elementos específicos por rol
    if (profile?.role === 'Administrador' || profile?.role === 'Psicologo') {
      items.push({ 
        path: '/admin/dashboards', 
        label: 'Dashboards', 
        icon: <BarChart2className="h-5 w-5 mr-2" />
      });
    }

    // Añadir más elementos según el rol si es necesario

    return items;
  };

  return (
    <nav className="bg-blue-800 shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-bold text-xl text-white flex items-center">
              <span>BULLS</span>
            </Link>
          </div>

          {/* Navegación para escritorio */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {getNavItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={navItemClass(item.path)}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Área de usuario y notificaciones */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-pulse h-8 w-8 bg-gray-300 rounded-full"></div>
            ) : (
              user && (
                <>
                  <button className="text-gray-300 hover:text-white p-1">
                    <Bell className="h-6 w-6" />
                  </button>
                  <UserProfileBadge
                    userName={profile?.firstName && profile?.lastName 
                      ? `${profile.firstName} ${profile.lastName}` 
                      : user.email}
                    userStatus="online"
                    fallbackBgColor="bg-blue-600"
                  />
                </>
              )
            )}
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${navItemClass(item.path)} block`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="flex items-center">
                  {item.icon}
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          
          {/* Área de usuario para móvil */}
          {user && (
            <div className="pt-4 pb-3 border-t border-blue-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <UserProfileBadge
                    userName={profile?.firstName && profile?.lastName 
                      ? `${profile.firstName} ${profile.lastName}` 
                      : user.email}
                    userStatus="online"
                    fallbackBgColor="bg-blue-600"
                    size="sm"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {profile?.firstName && profile?.lastName 
                      ? `${profile.firstName} ${profile.lastName}` 
                      : user.email}
                  </div>
                  <div className="text-sm font-medium text-blue-300">
                    {profile?.role || 'Usuario'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;