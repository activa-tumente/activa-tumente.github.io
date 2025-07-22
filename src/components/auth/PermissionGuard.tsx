import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../../lib/auth/PermissionsContext';
import { Permission } from '../../types/user';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Componente que protege contenido basado en permisos de usuario
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  requireAll = false,
  fallback,
  redirectTo = '/'
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();
  
  // Verificar permisos
  const hasAccess = (): boolean => {
    if (requiredPermission) {
      return hasPermission(requiredPermission);
    }
    
    if (requiredPermissions.length > 0) {
      return requireAll 
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);
    }
    
    // Si no se especifican permisos, permitir acceso
    return true;
  };
  
  // Si el usuario tiene los permisos necesarios, mostrar el contenido
  if (hasAccess()) {
    return <>{children}</>;
  }
  
  // Si se proporciona un fallback, mostrarlo
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Si no hay fallback, redirigir
  return <Navigate to={redirectTo} replace />;
};

export default PermissionGuard;
