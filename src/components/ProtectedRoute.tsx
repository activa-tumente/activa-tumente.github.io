import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando y no hay usuario, redirigir al login
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Si se requiere un permiso específico y el usuario no lo tiene, redirigir
    if (
      !loading && 
      user && 
      requiredPermission && 
      !hasPermission(user, requiredPermission)
    ) {
      router.push('/unauthorized');
    }
  }, [user, loading, router, requiredPermission]);

  // Mostrar nada mientras se verifica la autenticación
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  // Si se requiere un permiso y el usuario no lo tiene, mostrar mensaje
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso denegado</h1>
        <p className="text-gray-600">No tienes permiso para acceder a esta página.</p>
      </div>
    );
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;
