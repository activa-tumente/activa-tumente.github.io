import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import {
  Menu, X, ChevronDown, ChevronRight, HelpCircle, PanelLeft, PanelRight, Star, Bell, AlertCircle, LogOut
} from 'lucide-react';
import { useAuth } from '../lib/auth/AuthContext';
import UserProfileBadge from '../components/auth/UserProfileBadge';
import { menuItems, MenuItem, favoriteableItems } from '../layouts/menuConfig';
import clsx from 'clsx';
import { checkSupabaseConnection } from '../lib/supabaseClient';
import { telemetryService } from '../lib/telemetryService';

// --- Interfaces ---
interface AdminLayoutProps {
  children?: any;
  title?: string;
}

interface NotificationsState {
    id: string;
    message: string;
    read: boolean;
    type: string;
}

// --- Helper Function: Verifica si una ruta o sus subrutas están activas ---
const checkActive = (locationPathname: string, itemPath?: string, subItems?: MenuItem[]): boolean => {
  if (itemPath && (locationPathname === itemPath || locationPathname.startsWith(`${itemPath}/`))) {
    return true;
  }
  if (subItems) {
    return subItems.some(sub => checkActive(locationPathname, sub.path, sub.subItems));
  }
  return false;
};

// --- Componente Reutilizable para Navegación ---
interface SidebarNavigationProps {
  items: MenuItem[];
  isCollapsed: boolean;
  expandedMenus: Record<string, boolean>;
  toggleMenu: (menuId: string) => void;
  favorites: string[];
  toggleFavorite: (menuId: string) => void;
  isFavorite: (menuId: string) => boolean;
  locationPathname: string;
  isMobile?: boolean;
  onLinkClick?: () => void;
  onHelpClick: () => void;
  onLogoutClick: () => void;
}

const SidebarNavigation = ({
  items, isCollapsed, expandedMenus, toggleMenu, favorites, toggleFavorite, isFavorite,
  locationPathname, isMobile = false, onLinkClick, onHelpClick, onLogoutClick
}) => {

  const renderItem = (item: MenuItem, level = 0) => {
    if (item.isDivider) {
      return <hr key={item.id} className="my-2 border-blue-600" />;
    }

    const isActive = checkActive(locationPathname, item.path, item.subItems);
    const isExpanded = expandedMenus[item.id] ?? false;

    const commonClasses = clsx(
      'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full cursor-pointer',
      {
        'bg-blue-900 text-white': isActive && !item.subItems,
        'text-blue-100 hover:bg-blue-700 hover:text-white': !isActive,
        'pl-6': level === 1,
        'pl-10': level > 1,
        'justify-center': isCollapsed && level === 0,
      },
      isMobile && 'text-base'
    );

    const handleItemClick = () => {
        if (item.id === 'help') {
            onHelpClick();
            if (onLinkClick) onLinkClick();
        } else if (item.id === 'logout') {
            onLogoutClick();
        } else if (item.subItems) {
            toggleMenu(item.id);
        } else if (item.path) {
            if (onLinkClick) onLinkClick();
        }
    };

    const content = (
      <>
        <item.icon
          className={clsx(
            'h-6 w-6',
            level === 0 && !isCollapsed && 'mr-3',
            level > 0 && 'mr-3 h-5 w-5',
            isCollapsed && level === 0 && 'mx-auto',
            isActive ? 'text-white' : 'text-blue-300 group-hover:text-blue-100'
          )}
          aria-hidden="true"
        />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.subItems && (
              isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
            )}
          </>
        )}
      </>
    );

    // Crear el elemento principal (NavLink o button)
    const mainElement = item.path && !item.subItems ? (
      <NavLink
        to={item.path}
        onClick={handleItemClick}
        className={({ isActive: navIsActive }) =>
          clsx(commonClasses, { 'bg-blue-900 text-white': navIsActive })
        }
        aria-current={isActive ? 'page' : undefined}
        title={isCollapsed ? item.label : undefined}
      >
        {content}
      </NavLink>
    ) : (
      <button
        type="button"
        onClick={handleItemClick}
        className={clsx(commonClasses, { 'bg-blue-700 text-white': isActive && !!item.subItems })}
        aria-expanded={item.subItems ? isExpanded : undefined}
        title={isCollapsed ? item.label : undefined}
      >
        {content}
      </button>
    );

    // Determinar si se debe mostrar el botón de favoritos
    const canBeFavorited = favoriteableItems.includes(item.id) && !isCollapsed;

    // Si no se puede marcar como favorito, solo devolver el elemento principal
    if (!canBeFavorited) {
      return (
        <div key={item.id} className="relative">
          {mainElement}
        </div>
      );
    }

    // Si se puede marcar como favorito, devolver una estructura con el botón de favorito separado
    const itemElement = (
      <div key={item.id} className="relative group">
        <div className="flex items-center">
          <div className="flex-grow">
            {mainElement}
          </div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
              className="text-blue-300 hover:text-yellow-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={isFavorite(item.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
              aria-label={isFavorite(item.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
              tabIndex={0}
            >
              <Star className="h-4 w-4" fill={isFavorite(item.id) ? 'currentColor' : 'none'} color={isFavorite(item.id) ? '#FBBF24' : 'currentColor'}/>
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <div key={item.id}>
        {itemElement}
        {item.subItems && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.subItems.map(subItem => renderItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const topItems = items.filter((item: MenuItem) => !item.isBottom);
  const bottomItems = items.filter((item: MenuItem) => item.isBottom);

  return (
    <nav className="flex flex-col h-full">
      {/* Sección de Favoritos (si no está colapsado) */}
      {!isCollapsed && favorites.length > 0 && (
        <div className="mt-4 px-3">
          <h3 className="px-1 text-xs font-semibold text-blue-200 uppercase tracking-wider">
            Favoritos
          </h3>
          <div className="mt-1 space-y-1">
            {favorites.map((favId: string) => {
               const favItem = menuItems.find(item => item.id === favId);
               // Intenta encontrar en subitems si no es un item principal
               let favSubItem: MenuItem | undefined;
               if (!favItem) {
                 menuItems.forEach(parent => {
                   if(parent.subItems) {
                     const found = parent.subItems.find(sub => sub.id === favId);
                     if (found) favSubItem = found;
                   }
                 });
               }
               const itemToRender = favItem || favSubItem;

               if (itemToRender && itemToRender.path) {
                 return (
                   <Link
                     key={`fav-${itemToRender.id}`}
                     to={itemToRender.path}
                     onClick={onLinkClick}
                     className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-700"
                     title={itemToRender.label}
                   >
                     <itemToRender.icon className="mr-3 h-5 w-5 text-blue-300" />
                     <span>{itemToRender.label}</span>
                   </Link>
                 );
               }
                // Si es un item padre favorito, se podría enlazar a su primer subitem o a una ruta general
               else if(itemToRender && !itemToRender.path && itemToRender.subItems && itemToRender.subItems[0]?.path) {
                   return (
                        <Link
                            key={`fav-${itemToRender.id}`}
                            to={itemToRender.subItems[0].path} // Link al primer subitem
                            onClick={onLinkClick}
                            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-700"
                            title={itemToRender.label}
                        >
                            <itemToRender.icon className="mr-3 h-5 w-5 text-blue-300" />
                            <span>{itemToRender.label}</span>
                        </Link>
                   );
               }
               return null;
            })}
          </div>
        </div>
      )}

      {/* Menú Principal */}
      <div className="mt-5 flex-1 px-2 space-y-1">
        {topItems.map((item: MenuItem) => renderItem(item))}
      </div>

      {/* Menú Inferior */}
      <div className="px-2 space-y-1 mt-auto pb-2">
        {bottomItems.map((item: MenuItem) => renderItem(item))}
      </div>
    </nav>
  );
};


// --- Componente de Diagnóstico de Autenticación ---
interface AuthDiagnosticsProps {
  isVisible: boolean;
  onClose: () => void;
}

const AuthDiagnostics: React.FC<AuthDiagnosticsProps> = ({ isVisible, onClose }) => {
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const result = await checkSupabaseConnection();
      setConnectionStatus(result);
      telemetryService.trackDiagnostic('auth', result.success ? 'info' : 'warning', 'connection_check', result.details);
    } catch (error) {
      setConnectionStatus({ success: false, details: { error: error instanceof Error ? error.message : 'Error desconocido' } });
      telemetryService.trackError('Error al verificar conexión', error as Error, { component: 'AuthDiagnostics' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      checkConnection();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Diagnóstico de Autenticación</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Estado de conexión a Supabase</h3>
            {isLoading ? (
              <p>Verificando conexión...</p>
            ) : connectionStatus ? (
              <div>
                <div className={`p-2 rounded mb-2 ${connectionStatus.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  <p className="font-medium">
                    {connectionStatus.success ? 'Conexión establecida correctamente' : 'Problema de conexión detectado'}
                  </p>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-1">Detalles:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(connectionStatus.details, null, 2)}
                  </pre>
                </div>

                <button
                  onClick={checkConnection}
                  className="mt-4 px-3 py-1 bg-blue-800 text-white rounded hover:bg-blue-700 text-sm"
                  disabled={isLoading}
                >
                  Verificar nuevamente
                </button>
              </div>
            ) : (
              <p>No hay información disponible</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Recomendaciones</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Verifica que las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén configuradas correctamente</li>
              <li>Asegúrate de que exista un perfil en la tabla user_profiles para tu usuario</li>
              <li>Verifica que las políticas RLS permitan acceder a los datos necesarios</li>
              <li>Comprueba que la sesión no haya expirado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal AdminLayout ---
const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout, session } = useAuth();

  // Estado para el diagnóstico de autenticación
  const [showAuthDiagnostics, setShowAuthDiagnostics] = useState(false);
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [authError, setAuthError] = useState<string | null>(null);

  // Verificar el estado de autenticación al cargar
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Verificar si hay sesión activa
        if (session) {
          setAuthStatus('authenticated');
          telemetryService.trackDiagnostic('auth', 'info', 'session_valid', {
            userId: user?.id,
            hasProfile: !!profile
          });
        } else {
          // No hay sesión, redirigir al login
          setAuthStatus('unauthenticated');
          setAuthError('No hay sesión activa');
          telemetryService.trackDiagnostic('auth', 'warning', 'no_session', {});
          navigate('/auth/login');
        }
      } catch (error) {
        setAuthStatus('unauthenticated');
        setAuthError(error instanceof Error ? error.message : 'Error desconocido');
        telemetryService.trackError('Error de verificación de autenticación', error as Error, { component: 'AdminLayout' });
      }
    };

    verifyAuth();
  }, [session, user, profile, navigate]);

  const [sidebarOpen, setSidebarOpen] = useState(false); // Para móvil
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Para escritorio
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(() => {
      // Inicializar menús basados en la ruta activa al cargar
      const initialState: Record<string, boolean> = {};
      menuItems.forEach(item => {
          if(item.subItems && checkActive(location.pathname, undefined, item.subItems)) {
              initialState[item.id] = true;
          } else {
              // Por defecto, todos los menús están contraídos
              initialState[item.id] = false;
          }
      });
      return initialState;
  });
  const [pageTitle, setPageTitle] = useState('Panel de Administración');
  const [showHelp, setShowHelp] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Cargar favoritos desde localStorage al inicio
    try {
      const storedFavorites = localStorage.getItem('sidebarFavorites');
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        // Asegurarse de que lo que se cargó es un array
        if (Array.isArray(parsedFavorites)) {
          return parsedFavorites;
        }
      }
      return ['dashboards', 'students']; // Default favs si no hay nada o el formato es incorrecto
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      // En caso de error de parseo, devolver un array por defecto
      return ['dashboards', 'students'];
    }
  });
  const [notifications, setNotifications] = useState<NotificationsState[]>([
    { id: '1', message: 'Bienvenido al sistema BULL-S', read: false, type: 'info' },
    { id: '2', message: 'Nuevos datos disponibles para análisis', read: false, type: 'update' }
  ]); // Mock - Idealmente vendría de API

  // --- Effects ---

  // Actualizar título del documento y estado
  useEffect(() => {
    const defaultTitle = 'BULL-S | Panel de Administración';
    document.title = title || defaultTitle;
    setPageTitle(title || defaultTitle);
  }, [title]);

  // Cerrar sidebar móvil al cambiar de ruta
  useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, sidebarOpen]);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
      try {
          localStorage.setItem('sidebarFavorites', JSON.stringify(favorites));
      } catch (error) {
          console.error("Error saving favorites to localStorage:", error);
      }
  }, [favorites]);

  // --- Handlers ---

  const toggleMenu = useCallback((menuId: string) => {
    setExpandedMenus(prev => {
      // Comportamiento normal de toggle para todos los menús
      return {
        ...prev,
        [menuId]: !prev[menuId]
      };
    });
  }, []);

  const toggleSidebarCollapse = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
    // Si colapsamos, cerramos todos los menús para evitar solapamientos visuales
    if (!sidebarCollapsed) {
        setExpandedMenus(prev => {
            const newState = {...prev};
            Object.keys(newState).forEach(key => {
                // Cerrar todos los menús
                newState[key] = false;
            });
            return newState;
        });
    }
  }, [sidebarCollapsed]);

  const toggleFavorite = useCallback((menuId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId];

      // Guardar en localStorage
      try {
        localStorage.setItem('sidebarFavorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Error al guardar favoritos:', error);
      }

      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((menuId: string) => {
    return favorites.includes(menuId);
  }, [favorites]);

  const handleLogout = useCallback(async () => {
    try {
      telemetryService.trackDiagnostic('auth', 'info', 'logout_attempt', { userId: user?.id });
      await logout();
      telemetryService.trackDiagnostic('auth', 'info', 'logout_success', { userId: user?.id });
      navigate('/auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      telemetryService.trackError('Error al cerrar sesión', error as Error, { userId: user?.id });
      // Intentar redireccionar a login de todos modos
      navigate('/auth/login');
    }
  }, [logout, navigate, user]);

  const handleHelpClick = useCallback(() => {
    setShowHelp(true);
  }, []);

  const closeHelpModal = useCallback(() => {
    setShowHelp(false);
  }, []);

  // Manejador para mostrar el diagnóstico de autenticación
  const handleShowDiagnostics = useCallback(() => {
    setShowAuthDiagnostics(true);
  }, []);

  const handleCloseDiagnostics = useCallback(() => {
    setShowAuthDiagnostics(false);
  }, []);

  // --- Calculados ---
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // --- Render ---
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true"></div>
      )}

      {/* Sidebar Móvil */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 flex flex-col z-40 w-64 bg-blue-dark text-white transition-transform duration-300 ease-in-out transform lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Cerrar sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
        </div>
        <div className="flex items-center justify-between flex-shrink-0 px-4 h-16 border-b border-blue-dark">
           <Link to="/admin" className="flex items-center" onClick={() => setSidebarOpen(false)}>
                <span className="text-white text-xl font-bold">BULL-S</span>
           </Link>
        </div>
        <div className="flex-1 overflow-y-auto pt-5 pb-4">
           <SidebarNavigation
             items={menuItems}
             isCollapsed={false} // Móvil nunca está colapsado en este diseño
             expandedMenus={expandedMenus}
             toggleMenu={toggleMenu}
             favorites={favorites}
             toggleFavorite={toggleFavorite}
             isFavorite={isFavorite}
             locationPathname={location.pathname}
             isMobile={true}
             onLinkClick={() => setSidebarOpen(false)} // Cierra al hacer clic en link
             onHelpClick={handleHelpClick}
             onLogoutClick={handleLogout}
           />
        </div>
         {/* User Info Footer Mobile */}
         <div className="flex-shrink-0 flex border-t border-blue-700 p-4">
              {user && (
                  <div className="flex-shrink-0 w-full group block">
                      <div className="flex items-center">
                           <UserProfileBadge
                                userName={`${user.firstName} ${user.lastName}`}
                                userStatus="online" // O estado real si lo tienes
                                fallbackBgColor="bg-blue-600"
                                size="sm"
                           />
                          <div className="ml-3">
                              <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                              <p className="text-xs font-medium text-blue-200 group-hover:text-blue-100">{user.role}</p>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* Sidebar Escritorio */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className={clsx('flex flex-col bg-blue-dark text-white transition-width duration-300 ease-in-out', sidebarCollapsed ? 'w-20' : 'w-64')}>
          <div className="flex items-center justify-between flex-shrink-0 px-4 h-16 border-b border-blue-dark">
            <Link to="/admin" className="flex items-center overflow-hidden">
              {!sidebarCollapsed && <span className="text-white text-xl font-bold truncate">BULL-S</span>}
            </Link>
            <button
              onClick={toggleSidebarCollapse}
              className="text-white hover:bg-blue-900 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-white"
              title={sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
            >
              <span className="sr-only">{sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}</span>
              {sidebarCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            </button>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <SidebarNavigation
               items={menuItems}
               isCollapsed={sidebarCollapsed}
               expandedMenus={expandedMenus}
               toggleMenu={toggleMenu}
               favorites={favorites}
               toggleFavorite={toggleFavorite}
               isFavorite={isFavorite}
               locationPathname={location.pathname}
               onHelpClick={handleHelpClick}
               onLogoutClick={handleLogout}
               onLinkClick={() => {}} // Prop requerida pero no usada en este contexto
            />
          </div>
           {/* User Info Footer Desktop */}
           <div className="flex-shrink-0 flex border-t border-blue-dark p-4">
               {user && (
                   <div className={clsx("flex items-center w-full group", sidebarCollapsed && "justify-center")}>
                        <UserProfileBadge
                            userName={`${user.firstName} ${user.lastName}`}
                            userStatus="online"
                            fallbackBgColor="bg-blue-dark"
                            size="sm"
                        />
                       {!sidebarCollapsed && (
                           <div className="ml-3 truncate">
                               <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
                               <p className="text-xs font-medium text-blue-100 group-hover:text-white truncate">{user.role}</p>
                           </div>
                       )}
                   </div>
               )}
           </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          {/* Botón Menú Móvil */}
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between items-center">
             {/* Título de la Página */}
             <h1 className="text-xl md:text-2xl font-semibold text-gray-800 truncate">{pageTitle}</h1>

             {/* Iconos Derecha */}
             <div className="ml-4 flex items-center md:ml-6 space-x-4">
                {/* Botón de Diagnóstico */}
                <button
                  onClick={handleShowDiagnostics}
                  className="px-3 py-1 bg-blue-800 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                  aria-label="Diagnóstico"
                >
                  <AlertCircle className="h-4 w-4 inline-block mr-1" />
                  <span>Diagnóstico</span>
                </button>

                {/* Botón de Cerrar Sesión */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4 inline-block mr-1" />
                  <span>Cerrar Sesión</span>
                </button>

{/* Notificaciones (Placeholder - Implementar Dropdown) */}
<div className="relative">
<button
  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  // onClick={() => setShowNotificationsDropdown(true)} // Necesitarías estado y componente para dropdown
   aria-label="Ver notificaciones"
>
  <Bell className="h-6 w-6" />
  {unreadCount > 0 && (
    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true"></span>
  )}
  {unreadCount > 0 && <span className="sr-only">{unreadCount} notificaciones no leídas</span>}
</button>
{/* Aquí iría el Dropdown de Notificaciones */}
</div>

{/* Perfil de Usuario (Usando el componente existente) */}
{user && (
 <UserProfileBadge
   userName={`${user.firstName} ${user.lastName}`}
   userStatus="online" // O estado real
   onProfileClick={() => navigate('/admin/user-profile')} // Ruta actualizada al nuevo perfil
   onLogoutClick={handleLogout}
   showDropdown={true} // Asumiendo que el badge maneja su propio dropdown
 />
)}
</div>
</div>
</div>

{/* Área de Contenido */}
<main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
<div className="py-6 px-4 sm:px-6 lg:px-8">
{/* Breadcrumbs (Opcional) */}
{/* <Breadcrumbs /> */}
{children || <Outlet />}
</div>
</main>
</div>

{/* Modal de Ayuda */}
{showHelp && (
<div className="fixed inset-0 overflow-y-auto z-50">
<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
{/* Background overlay */}
<div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeHelpModal}>
<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
</div>
{/* Modal panel */}
<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
<div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
<div>
 {/* Icono y Título */}
  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
    <HelpCircle className="h-6 w-6 text-blue-600" aria-hidden="true" />
  </div>
  <div className="mt-3 text-center sm:mt-5">
    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
      Ayuda y Soporte
    </h3>
     {/* Contenido del Modal */}
     <div className="mt-4 text-left text-sm text-gray-600 space-y-4">
          <div>
              <h4 className="font-medium text-gray-800">Dashboards Disponibles</h4>
              <p>El sistema BULL-S ofrece diferentes tipos de dashboards para análisis:</p>
              <ul className="mt-1 list-disc pl-5">
              <li>Dashboard General: Visión general del grupo</li>
              <li>Dashboard de Bullying: Análisis de situaciones de bullying</li>
              <li>Dashboard Académico: Rendimiento académico</li>
              <li>Dashboard Social: Relaciones sociales entre estudiantes</li>
              </ul>
          </div>
          <div>
              <h4 className="font-medium text-gray-800">Exportación de Informes</h4>
              <p>Cada dashboard dispone de una opción para exportar los datos como PDF.</p>
          </div>
          <div>
              <h4 className="font-medium text-gray-800">Soporte Técnico</h4>
              <p>Para consultas técnicas o problemas, contáctenos en: <a href="mailto:soporte@bulls.com" className="text-blue-600 hover:underline">soporte@bulls.com</a></p>
          </div>
     </div>
  </div>
</div>
{/* Botón Cerrar */}
<div className="mt-5 sm:mt-6">
  <button
    type="button"
    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
    onClick={closeHelpModal}
  >
    Entendido
  </button>
</div>
</div>
</div>
</div>
)}

{/* Componente de Diagnóstico de Autenticación */}
<AuthDiagnostics isVisible={showAuthDiagnostics} onClose={handleCloseDiagnostics} />

{/* Botón flotante para diagnóstico (solo visible si hay error de autenticación) */}
{authError && (
<button
onClick={handleShowDiagnostics}
className="fixed bottom-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 z-50"
title="Diagnóstico de autenticación"
>
<AlertCircle size={24} />
</button>
)}
</div>
);
};

export default AdminLayout;