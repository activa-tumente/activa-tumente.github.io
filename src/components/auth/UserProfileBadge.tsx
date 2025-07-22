import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

// Definición de tipos para las props
interface UserProfileBadgeProps {
  avatarUrl?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  userId?: string;
  userStatus?: 'online' | 'offline' | 'away';
  fallbackBgColor?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// Colores para el avatar de fallback basados en el userId
const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

// Mapeo de estados a colores
const STATUS_COLORS = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
};

/**
 * Componente UserProfileBadge - Muestra un badge con la imagen de perfil del usuario
 * o sus iniciales como fallback, con un menú desplegable para acciones de usuario.
 */
const UserProfileBadge: React.FC<UserProfileBadgeProps> = ({
  avatarUrl,
  userName,
  firstName,
  lastName,
  userId,
  userStatus,
  fallbackBgColor,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  className = '',
  style,
}) => {
  // Estado para controlar la visibilidad del menú desplegable
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Referencias para detectar clics fuera del componente
  const badgeRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Hook de navegación
  const navigate = useNavigate();

  // Obtener información del usuario del contexto de autenticación
  const { user, logout } = useAuth();

  // Determinar el nombre a mostrar
  const userFirstName = user?.user_metadata?.firstName || user?.user_metadata?.first_name || '';
  const userLastName = user?.user_metadata?.lastName || user?.user_metadata?.last_name || '';
  const userFullName = userFirstName && userLastName ? `${userFirstName} ${userLastName}` : '';
  const propFullName = firstName && lastName ? `${firstName} ${lastName}` : '';
  const displayName = propFullName || userFullName || userName || user?.user_metadata?.username || user?.email || 'Usuario';

  // Obtener el rol del usuario para mostrarlo
  const userRole = user?.user_metadata?.role || '';

  // Calcular las iniciales para el fallback
  const getInitials = (): string => {
    // Prioridad 1: Usar firstName y lastName de las props
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }

    // Prioridad 2: Usar firstName y lastName del usuario actual
    if (userFirstName && userLastName) {
      return `${userFirstName.charAt(0)}${userLastName.charAt(0)}`.toUpperCase();
    }

    // Prioridad 3: Usar userName si tiene formato "Nombre Apellido"
    if (userName) {
      const parts = userName.split(' ');
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
      }
      return userName.substring(0, 2).toUpperCase();
    }

    // Prioridad 4: Usar full_name de los metadatos del usuario
    if (user?.user_metadata?.full_name) {
      const parts = user.user_metadata.full_name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
      }
      return user.user_metadata.full_name.substring(0, 2).toUpperCase();
    }

    // Prioridad 5: Usar el rol del usuario si está disponible
    if (user?.user_metadata?.role) {
      const role = user.user_metadata.role;
      if (role === 'Estudiante') return 'ES';
      if (role === 'Psicologo') return 'PS';
      if (role === 'Administrador') return 'AD';
      return role.substring(0, 2).toUpperCase();
    }

    // Prioridad 6: Usar email
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }

    // Valor por defecto
    return 'US';
  };

  // Determinar el color de fondo para el fallback
  const getBackgroundColor = (): string => {
    if (fallbackBgColor) {
      return fallbackBgColor;
    }

    if (userId) {
      // Usar el userId para seleccionar un color consistente
      const colorIndex = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % AVATAR_COLORS.length;
      return AVATAR_COLORS[colorIndex];
    }

    // Color por defecto
    return 'bg-indigo-500';
  };

  // Manejar el clic en el badge
  const handleBadgeClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Manejar el clic en "Ver Perfil"
  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      // Navegar a la página de perfil de usuario
      navigate('/admin/profile');
    }
    setIsMenuOpen(false);
  };

  // Manejar el clic en "Configuración"
  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
    setIsMenuOpen(false);
  };

  // Manejar el clic en "Vincular Identidades"
  const handleLinkIdentityClick = () => {
    setIsMenuOpen(false);
    navigate('/link-identity');
  };

  // Manejar el clic en "Cerrar Sesión"
  const handleLogoutClick = async () => {
    try {
      // Cerrar el menú
      setIsMenuOpen(false);

      // Llamar al callback si existe
      if (onLogoutClick) {
        onLogoutClick();
      }

      // Usar la función de logout del contexto de autenticación
      await logout();

      console.log('Sesión cerrada exitosamente');

      // Redirigir a la página de login
      navigate('/login');

      // Forzar una recarga completa para limpiar cualquier estado
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Cerrar el menú al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        badgeRef.current &&
        menuRef.current &&
        !badgeRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Badge principal */}
      <button
        ref={badgeRef}
        className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all hover:shadow-md"
        onClick={handleBadgeClick}
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        aria-controls="user-profile-menu"
        aria-label={`Perfil de ${displayName}`}
      >
        {avatarUrl ? (
          // Mostrar avatar si hay URL
          <img
            src={avatarUrl}
            alt={`Perfil de ${displayName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si hay error al cargar la imagen, mostrar fallback
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling!.style.display = 'flex';
            }}
          />
        ) : (
          // Fallback con iniciales
          <div
            className={`w-full h-full flex items-center justify-center text-white ${getBackgroundColor()}`}
            aria-label={`Perfil de ${displayName}`}
          >
            <span className="text-sm font-medium">{getInitials()}</span>
          </div>
        )}

        {/* Indicador de estado (si se proporciona) */}
        {userStatus && (
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${STATUS_COLORS[userStatus]}`}
            aria-label={`Estado: ${userStatus}`}
          ></span>
        )}
      </button>

      {/* Menú desplegable */}
      {isMenuOpen && (
        <div
          id="user-profile-menu"
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
          role="menu"
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">{displayName}</p>
            {user?.email && (
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            )}
            {userRole && (
              <p className="text-xs font-semibold text-blue-800 mt-1">
                Rol: {userRole}
              </p>
            )}
          </div>

          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            onClick={handleProfileClick}
            role="menuitem"
          >
            Ver Perfil
          </button>

          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            onClick={handleSettingsClick}
            role="menuitem"
          >
            Configuración
          </button>

          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            onClick={handleLinkIdentityClick}
            role="menuitem"
          >
            Vincular Identidades
          </button>

          <div className="border-t border-gray-100"></div>

          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-50"
            onClick={handleLogoutClick}
            role="menuitem"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileBadge;
