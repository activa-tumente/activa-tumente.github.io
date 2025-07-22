import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission,
  requiredRole
}) => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();

  // Verificar si hay una sesión de estudiante local
  const hasStudentSession = () => {
    try {
      const studentSession = localStorage.getItem('student_session');
      if (studentSession) {
        const session = JSON.parse(studentSession);
        return session && session.id && session.role === 'student';
      }
      return false;
    } catch (error) {
      console.error('Error verificando sesión de estudiante:', error);
      return false;
    }
  };

  // Verificar si el usuario tiene el permiso requerido
  const hasRequiredPermission = () => {
    if (!requiredPermission) return true;
    return profile?.permissions?.includes(requiredPermission) || false;
  };

  // Verificar si el usuario tiene el rol requerido
  const hasRequiredRole = () => {
    if (!requiredRole) return true;
    
    // Si hay sesión de estudiante y se requiere rol de estudiante
    if (requiredRole === 'student' && hasStudentSession()) {
      return true;
    }
    
    return profile?.role === requiredRole;
  };

  // Mientras se verifica la autenticación, mostrar un indicador de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  // Verificar autenticación (Supabase o sesión local de estudiante)
  const isUserAuthenticated = isAuthenticated || hasStudentSession();

  // Si no está autenticado, redirigir a la página de inicio
  if (!isUserAuthenticated) {
    console.log('ProtectedRoute: No autenticado, redirigiendo a página de inicio');
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // Si no tiene los permisos necesarios, redirigir a acceso denegado
  if (!hasRequiredPermission() || !hasRequiredRole()) {
    console.log('ProtectedRoute: Sin permisos suficientes');
    return <Navigate to="/acceso-denegado" replace />;
  }

  // Si está autenticado y tiene los permisos necesarios, renderizar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;