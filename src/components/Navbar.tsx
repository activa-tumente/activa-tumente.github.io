import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../lib/auth';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard">
                <span className="text-blue-800 font-bold text-xl cursor-pointer">BULLS</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard">
                <span className={`${
                  router.pathname === '/dashboard'
                    ? 'border-blue-800 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                  Dashboard
                </span>
              </Link>
              
              {hasPermission(user, 'students:view') && (
                <Link href="/estudiantes">
                  <span className={`${
                    router.pathname.startsWith('/estudiantes')
                      ? 'border-blue-800 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                    Estudiantes
                  </span>
                </Link>
              )}
              
              {hasPermission(user, 'questionnaires:view') && (
                <Link href="/cuestionarios">
                  <span className={`${
                    router.pathname.startsWith('/cuestionarios')
                      ? 'border-blue-800 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                    Cuestionarios
                  </span>
                </Link>
              )}
              
              {hasPermission(user, 'reports:view') && (
                <Link href="/reportes">
                  <span className={`${
                    router.pathname.startsWith('/reportes')
                      ? 'border-blue-800 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                    Reportes
                  </span>
                </Link>
              )}
              
              {hasPermission(user, 'admin:view') && (
                <Link href="/admin">
                  <span className={`${
                    router.pathname.startsWith('/admin')
                      ? 'border-blue-800 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                    Administración
                  </span>
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                  id="user-menu-button"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <span className="sr-only">Abrir menú de usuario</span>
                  <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                </button>
              </div>
              
              {isProfileOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-gray-500">{user.email}</div>
                    <div className="text-xs mt-1 bg-blue-100 text-blue-800 rounded px-2 py-1 inline-block">
                      {user.role}
                    </div>
                  </div>
                  <Link href="/perfil">
                    <a
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Mi Perfil
                    </a>
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-2"
                    onClick={handleSignOut}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-800"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/dashboard">
            <a
              className={`${
                router.pathname === '/dashboard'
                  ? 'bg-blue-50 border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </a>
          </Link>
          
          {hasPermission(user, 'students:view') && (
            <Link href="/estudiantes">
              <a
                className={`${
                  router.pathname.startsWith('/estudiantes')
                    ? 'bg-blue-50 border-blue-800 text-blue-800'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Estudiantes
              </a>
            </Link>
          )}
          
          {hasPermission(user, 'questionnaires:view') && (
            <Link href="/cuestionarios">
              <a
                className={`${
                  router.pathname.startsWith('/cuestionarios')
                    ? 'bg-blue-50 border-blue-800 text-blue-800'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Cuestionarios
              </a>
            </Link>
          )}
          
          {hasPermission(user, 'reports:view') && (
            <Link href="/reportes">
              <a
                className={`${
                  router.pathname.startsWith('/reportes')
                    ? 'bg-blue-50 border-blue-800 text-blue-800'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Reportes
              </a>
            </Link>
          )}
          
          {hasPermission(user, 'admin:view') && (
            <Link href="/admin">
              <a
                className={`${
                  router.pathname.startsWith('/admin')
                    ? 'bg-blue-50 border-blue-800 text-blue-800'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Administración
              </a>
            </Link>
          )}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center text-white">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm font-medium text-gray-500">{user.email}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link href="/perfil">
              <a
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Mi Perfil
              </a>
            </Link>
            <button
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              onClick={handleSignOut}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
