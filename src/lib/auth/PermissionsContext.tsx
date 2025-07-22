import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface PermissionsContextType {
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions debe ser usado dentro de un PermissionsProvider');
  }
  return context;
};

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const { profile } = useAuth();

  // Función para verificar si el usuario tiene un permiso específico
  const hasPermission = (permission: string): boolean => {
    if (!profile || !profile.permissions) return false;
    return profile.permissions.includes(permission);
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role: string): boolean => {
    if (!profile || !profile.role) return false;
    return profile.role === role;
  };

  // Verificar si el usuario es administrador
  const isAdmin = profile?.role === 'admin';

  // Verificar si el usuario es profesor
  const isTeacher = profile?.role === 'teacher';

  // Verificar si el usuario es estudiante
  const isStudent = profile?.role === 'student';

  const value = {
    hasPermission,
    hasRole,
    isAdmin,
    isTeacher,
    isStudent
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsContext;